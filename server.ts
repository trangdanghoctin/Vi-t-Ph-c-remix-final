import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Serve public static files for user uploads / public folder
app.use(express.static(path.join(__dirname, 'public')));

// ==================================================================
// 1. SQLITE DATABASE INITIALIZATION (Strict Requirement 2 & 3)
// ==================================================================
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance & integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Create tables with exact schema requested:
// 1. users: id, username, email, password_hash, created_at
// 2. lookbooks: id, user_id, outfit_name, gender, garment_id, headwear_id, accessory_id, footwear_id, bg_id, thumbnail_data, created_at
// 3. user_backgrounds: id, user_id, bg_name, image_path, created_at
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lookbooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    outfit_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    garment_id TEXT,
    headwear_id TEXT,
    accessory_id TEXT,
    footwear_id TEXT,
    bg_id TEXT,
    thumbnail_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_backgrounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bg_name TEXT NOT NULL,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`);

console.log('✦ SQLite Database connected and verified with zero mock seeds.');

// Helper to hash passwords using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ==================================================================
// 2. AUTHENTICATION & USER API ENDPOINTS
// ==================================================================

// POST /api/auth/register: Create a brand-new user stored in SQLite
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !username.trim() || !email || !email.trim() || !password) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên tài khoản, email và mật khẩu!' });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải chứa ít nhất 6 ký tự!' });
    }

    // Check existing username or email
    const existingCheck = db
      .prepare('SELECT id, username, email FROM users WHERE username = ? OR email = ?')
      .get(cleanUsername, cleanEmail) as { id: number; username: string; email: string } | undefined;

    if (existingCheck) {
      if (existingCheck.username === cleanUsername) {
        return res.status(409).json({ error: 'Tên tài khoản này đã tồn tại! Vui lòng chọn tên khác.' });
      }
      return res.status(409).json({ error: 'Địa chỉ email này đã được sử dụng!' });
    }

    const password_hash = hashPassword(password);
    const insertStmt = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    );
    const insertResult = insertStmt.run(cleanUsername, cleanEmail, password_hash);

    const newUserId = Number(insertResult.lastInsertRowid);
    const userRow = db
      .prepare('SELECT id, username, email, created_at FROM users WHERE id = ?')
      .get(newUserId) as { id: number; username: string; email: string; created_at: string };

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công vào cơ sở dữ liệu SQLite!',
      user: userRow,
    });
  } catch (error: any) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi đăng ký tài khoản: ' + error.message });
  }
});

// POST /api/auth/login: Query users in SQLite
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên tài khoản/email và mật khẩu!' });
    }

    const cleanUsername = String(username).trim();
    const password_hash = hashPassword(password);

    const user = db
      .prepare(
        'SELECT id, username, email, created_at FROM users WHERE (username = ? OR email = ?) AND password_hash = ?'
      )
      .get(cleanUsername, cleanUsername.toLowerCase(), password_hash) as
      | { id: number; username: string; email: string; created_at: string }
      | undefined;

    if (!user) {
      return res.status(401).json({
        error: 'Tài khoản hoặc mật khẩu không chính xác! Hãy kiểm tra lại hoặc chuyển sang tab ĐĂNG KÝ nếu chưa có tài khoản.',
      });
    }

    return res.json({
      message: 'Đăng nhập thành công!',
      user,
    });
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập: ' + error.message });
  }
});

// GET /api/auth/users/count: Quick status endpoint
app.get('/api/auth/users/count', (_req, res) => {
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return res.json({ count: row.count });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================================================================
// 3. LOOKBOOK API ENDPOINTS (Stored in SQLite)
// ==================================================================

// GET /api/lookbooks?userId=123
app.get('/api/lookbooks', (req, res) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    if (!userId) {
      return res.json([]);
    }

    const rows = db
      .prepare('SELECT * FROM lookbooks WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);
    return res.json(rows);
  } catch (error: any) {
    console.error('Lỗi tải lookbooks:', error);
    return res.status(500).json({ error: 'Lỗi khi tải Lookbook: ' + error.message });
  }
});

// POST /api/lookbooks: Save outfit to SQLite
app.post('/api/lookbooks', (req, res) => {
  try {
    const {
      user_id,
      outfit_name,
      gender,
      garment_id,
      headwear_id,
      accessory_id,
      footwear_id,
      bg_id,
      thumbnail_data,
    } = req.body;

    if (!user_id || !outfit_name) {
      return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc tên bộ đồ!' });
    }

    const stmt = db.prepare(`
      INSERT INTO lookbooks (
        user_id, outfit_name, gender, garment_id, headwear_id, accessory_id, footwear_id, bg_id, thumbnail_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      Number(user_id),
      String(outfit_name).trim(),
      String(gender || 'female'),
      garment_id || null,
      headwear_id || null,
      accessory_id || null,
      footwear_id || null,
      bg_id || null,
      thumbnail_data || null
    );

    const insertedId = Number(result.lastInsertRowid);
    const savedCard = db.prepare('SELECT * FROM lookbooks WHERE id = ?').get(insertedId);

    return res.status(201).json({
      message: 'Đã lưu bộ trang phục vào Lookbook SQLite thành công!',
      card: savedCard,
    });
  } catch (error: any) {
    console.error('Lỗi lưu lookbook:', error);
    return res.status(500).json({ error: 'Lỗi khi lưu Lookbook: ' + error.message });
  }
});

// DELETE /api/lookbooks/:id
app.delete('/api/lookbooks/:id', (req, res) => {
  try {
    const lookbookId = Number(req.params.id);
    const stmt = db.prepare('DELETE FROM lookbooks WHERE id = ?');
    stmt.run(lookbookId);
    return res.json({ success: true, message: 'Đã xóa bộ trang phục khỏi SQLite' });
  } catch (error: any) {
    console.error('Lỗi xóa lookbook:', error);
    return res.status(500).json({ error: 'Lỗi khi xóa Lookbook: ' + error.message });
  }
});

// ==================================================================
// 4. USER BACKGROUNDS API ENDPOINTS (Stored in SQLite)
// ==================================================================

// GET /api/backgrounds?userId=123
app.get('/api/backgrounds', (req, res) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    if (!userId) {
      return res.json([]);
    }

    const rows = db
      .prepare('SELECT * FROM user_backgrounds WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);
    return res.json(rows);
  } catch (error: any) {
    console.error('Lỗi tải bối cảnh:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/backgrounds
app.post('/api/backgrounds', (req, res) => {
  try {
    const { user_id, bg_name, image_path } = req.body;
    if (!user_id || !bg_name || !image_path) {
      return res.status(400).json({ error: 'Thiếu thông tin bối cảnh!' });
    }

    const stmt = db.prepare(
      'INSERT INTO user_backgrounds (user_id, bg_name, image_path) VALUES (?, ?, ?)'
    );
    const result = stmt.run(Number(user_id), String(bg_name).trim(), String(image_path).trim());

    const insertedId = Number(result.lastInsertRowid);
    const saved = db.prepare('SELECT * FROM user_backgrounds WHERE id = ?').get(insertedId);

    return res.status(201).json({ message: 'Đã lưu bối cảnh tùy chỉnh vào SQLite!', background: saved });
  } catch (error: any) {
    console.error('Lỗi lưu bối cảnh:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ==================================================================
// 5. VITE INTEGRATION (DEV & PROD)
// ==================================================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✦ Server "Audition Việt Phục Remix" running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
