import React, { useState, useEffect, useRef } from 'react';
import { retroAudio } from '../utils/audio.ts';

interface VillageFestivalModalProps {
  onClose: () => void;
}

export const VillageFestivalModal: React.FC<VillageFestivalModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'nem-con' | 'ganh-lua'>('nem-con');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[#faf6ed] text-[#1e1305] border-4 border-[#3b2803] pixel-carved-gold shadow-[0_0_35px_rgba(245,158,11,0.5)] flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#831843] via-[#991b1b] to-[#b45309] text-white border-b-3 border-[#3b2803]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏮</span>
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#fef08a] tracking-wider uppercase font-['VT323','Silkscreen',monospace] drop-shadow-[1px_1px_#000]">
                LỄ HỘI LÀNG TRUYỀN THỐNG • HỘI XUÂN ĐẠI VIỆT
              </h3>
              <p className="text-[10px] text-[#fde047]">
                Khu trò chơi dân gian kinh điển: Trẩy Hội Ném Còn & Gánh Lụa Qua Cầu
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playBlip(300);
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center bg-[#78350f] hover:bg-[#991b1b] border-2 border-[#fef08a] text-white font-bold cursor-pointer text-sm shadow-[1px_1px_0_#000]"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-2.5 bg-[#fef3c7] border-b-2 border-[#d97706]">
          <button
            onClick={() => {
              retroAudio.playBlip(420);
              setActiveTab('nem-con');
            }}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              activeTab === 'nem-con'
                ? 'bg-[#b91c1c] text-white border-[#fef08a] shadow-[2px_2px_0_#000] -translate-y-0.5'
                : 'bg-[#faf5ef] text-[#78350f] border-[#d97706] hover:bg-[#fffbeb]'
            }`}
          >
            🎯 GAME 1: TRẨY HỘI NÉM CÒN
          </button>
          <button
            onClick={() => {
              retroAudio.playBlip(460);
              setActiveTab('ganh-lua');
            }}
            className={`px-3 py-1.5 text-xs font-bold border-2 cursor-pointer transition-all ${
              activeTab === 'ganh-lua'
                ? 'bg-[#047857] text-white border-[#fef08a] shadow-[2px_2px_0_#000] -translate-y-0.5'
                : 'bg-[#faf5ef] text-[#78350f] border-[#d97706] hover:bg-[#fffbeb]'
            }`}
          >
            ⚖ GAME 2: GÁNH LỤA QUA CẦU
          </button>
        </div>

        {/* Canvas Game Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-[#f8fafc] flex flex-col items-center justify-center">
          {activeTab === 'nem-con' ? <NemConGame /> : <GanhLuaGame />}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: TRẨY HỘI NÉM CÒN (CANVAS + PHYSICS REQUESTANIMATIONFRAME)
   ========================================================================= */
const NemConGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'aiming' | 'flying' | 'scored' | 'missed'>('aiming');
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  const stateRef = useRef({
    // Vị trí người ném (Góc trái)
    throwerX: 75,
    throwerY: 260,
    // Vị trí cột còn (Cây tre cao góc phải)
    poleX: 520,
    targetY: 90,
    targetRadius: 22,
    paperBroken: false,
    // Quả còn & vật lý
    ballX: 75,
    ballY: 250,
    vx: 0,
    vy: 0,
    isFlying: false,
    trail: [] as { x: number; y: number }[],
    // Lực & góc ném
    power: 50,
    powerDirection: 1,
    angle: 52, // độ
    isHolding: false,
    // Pháo hoa pixel
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
  });

  const resetBall = () => {
    const s = stateRef.current;
    s.ballX = s.throwerX;
    s.ballY = s.throwerY - 10;
    s.vx = 0;
    s.vy = 0;
    s.isFlying = false;
    s.trail = [];
    s.paperBroken = false;
    s.particles = [];
    setGameState('aiming');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const s = stateRef.current;

      // 1. CẬP NHẬT THANH LỰC KHI ĐANG NHẤN GIỮ
      if (s.isHolding && !s.isFlying) {
        s.power += s.powerDirection * 1.6;
        if (s.power >= 100) {
          s.power = 100;
          s.powerDirection = -1;
        } else if (s.power <= 15) {
          s.power = 15;
          s.powerDirection = 1;
        }
      }

      // 2. CẬP NHẬT VẬT LÝ QUẢ CÒN (PARABOL + TRỌNG LỰC + CẢN GIÓ)
      if (s.isFlying) {
        // Lưu vệt tua rua quả còn
        s.trail.push({ x: s.ballX, y: s.ballY });
        if (s.trail.length > 18) s.trail.shift();

        // Luồng vật lý
        s.ballX += s.vx;
        s.ballY += s.vy;
        s.vy += 0.22; // Trọng lực g
        s.vx *= 0.998; // Lực cản không khí nhẹ

        // KIỂM TRA XUYÊN VÒNG CÒN TRÊN ĐỈNH CÂY TRE
        const dx = s.ballX - s.poleX;
        const dy = s.ballY - s.targetY;
        const dist = Math.hypot(dx, dy);

        if (dist <= s.targetRadius && !s.paperBroken) {
          s.paperBroken = true;
          setGameState('scored');
          setScoreCount((prev) => prev + 1);
          retroAudio.playEquip();

          // Tạo pháo hoa pixel chúc mừng
          const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fde047'];
          for (let i = 0; i < 40; i++) {
            const pAngle = Math.random() * Math.PI * 2;
            const pSpeed = 1.5 + Math.random() * 4.5;
            s.particles.push({
              x: s.poleX,
              y: s.targetY,
              vx: Math.cos(pAngle) * pSpeed,
              vy: Math.sin(pAngle) * pSpeed,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: 45,
            });
          }
        }

        // Chạm đất
        if (s.ballY >= 295) {
          s.ballY = 295;
          s.isFlying = false;
          if (!s.paperBroken) {
            setGameState('missed');
            retroAudio.playBlip(220);
          }
        }
      }

      // Cập nhật hạt pháo hoa
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life--;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // ================= 3. RENDER MÀN HÌNH CANVAS =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bầu trời hội xuân
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 320);
      skyGrad.addColorStop(0, '#fef3c7');
      skyGrad.addColorStop(0.6, '#fee2e2');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mặt đất bãi hội làng
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, 300, canvas.width, 40);
      ctx.fillStyle = '#4d7c0f';
      ctx.fillRect(0, 310, canvas.width, 30);

      // Cột tre cao (Cột còn)
      ctx.fillStyle = '#a16207';
      ctx.fillRect(s.poleX - 3, s.targetY, 6, 300 - s.targetY);
      // Mắt tre
      for (let y = s.targetY + 25; y < 300; y += 30) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(s.poleX - 5, y, 10, 3);
      }

      // Vòng còn tròn trên đỉnh cây tre
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.poleX, s.targetY, s.targetRadius, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Giấy lụa đỏ dán giữa tâm vòng (sẽ bị xuyên thủng khi trúng)
      if (!s.paperBroken) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fill();
        // Chữ "Phúc / Hỷ" tâm vòng
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('HỶ', s.poleX, s.targetY);
      }
      ctx.restore();

      // Vẽ nhân vật nữ áo tứ thân ném còn (Góc trái)
      const nx = s.throwerX - 25;
      const ny = s.throwerY - 45;
      // Váy đen
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(nx + 6, ny + 32, 16, 25);
      // Áo tứ thân nâu
      ctx.fillStyle = '#78350f';
      ctx.fillRect(nx + 4, ny + 15, 20, 24);
      // Yếm đào đỏ
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(nx + 10, ny + 17, 8, 12);
      // Đai lụa xanh
      ctx.fillStyle = '#10b981';
      ctx.fillRect(nx + 5, ny + 27, 18, 3);
      // Khuôn mặt & Khăn mỏ quạ
      ctx.fillStyle = '#fed0ab';
      ctx.fillRect(nx + 8, ny + 4, 12, 10);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(nx + 7, ny, 14, 5); // Khăn mỏ quạ
      ctx.fillRect(nx + 6, ny + 5, 3, 5);

      // Đường ngắm quỹ đạo (Khi đang nhắm)
      if (!s.isFlying) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.6)';
        ctx.lineWidth = 2;
        const rad = (s.angle * Math.PI) / 180;
        const aimLen = 50 + s.power * 0.8;
        const aimX = s.throwerX + Math.cos(rad) * aimLen;
        const aimY = s.throwerY - Math.sin(rad) * aimLen;
        ctx.beginPath();
        ctx.moveTo(s.throwerX, s.throwerY - 10);
        ctx.lineTo(aimX, aimY);
        ctx.stroke();
        ctx.restore();
      }

      // Vệt tua rua ngũ sắc của quả còn
      if (s.trail.length > 1) {
        const ribbonColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ffffff'];
        for (let i = 0; i < s.trail.length - 1; i++) {
          ctx.beginPath();
          ctx.strokeStyle = ribbonColors[i % ribbonColors.length];
          ctx.lineWidth = 3;
          ctx.moveTo(s.trail[i].x, s.trail[i].y);
          ctx.lineTo(s.trail[i + 1].x, s.trail[i + 1].y);
          ctx.stroke();
        }
      }

      // Quả Còn ngũ sắc
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();
      ctx.restore();

      // Vẽ các hạt pháo hoa pixel
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });

      // Bảng thông báo kết quả
      if (s.paperBroken) {
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 24px "VT323", "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🎆 TRÚNG RỒI! TUYỆT KỸ NÉM CÒN! 🎆', canvas.width / 2, 50);
      } else if (gameState === 'missed') {
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 15px "Be Vietnam Pro", "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Chưa trúng rồi! Hãy nạp lực mạnh hơn và chỉnh góc nhé!', canvas.width / 2, 50);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Bắt đầu nạp lực ném
  const handleStartHold = () => {
    if (stateRef.current.isFlying) return;
    stateRef.current.isHolding = true;
    retroAudio.playBlip(380);
  };

  // Thả tay -> Phóng quả còn theo vật lý
  const handleRelease = () => {
    const s = stateRef.current;
    if (!s.isHolding || s.isFlying) return;
    s.isHolding = false;
    s.isFlying = true;
    setAttempts((prev) => prev + 1);

    const rad = (s.angle * Math.PI) / 180;
    const speed = 6 + (s.power / 100) * 11;
    s.vx = Math.cos(rad) * speed;
    s.vy = -Math.sin(rad) * speed;
    setGameState('flying');
    retroAudio.playBlip(600);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Top Bar Score */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 bg-[#fef3c7] border-2 border-[#d97706] mb-2 font-mono text-xs">
        <span className="font-bold text-[#b45309]">
          🎯 ĐIỂM HỘI XUÂN: <span className="text-[#b91c1c] text-sm">{scoreCount}</span> (Lượt ném: {attempts})
        </span>
        <span className="text-[#78350f]">Góc ném: {stateRef.current.angle}°</span>
      </div>

      {/* Canvas */}
      <div className="relative border-4 border-[#3b2803] pixel-carved-gold shadow-md overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={340}
          className="w-full max-w-[640px] h-auto block select-none cursor-crosshair"
          onMouseDown={handleStartHold}
          onMouseUp={handleRelease}
          onTouchStart={handleStartHold}
          onTouchEnd={handleRelease}
        />
      </div>

      {/* Game Controls Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full mt-3 p-3 bg-[#fef3c7] border-2 border-[#d97706] text-xs">
        {/* Chỉnh Góc Ném */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#78350f]">CHỈNH GÓC:</span>
          <input
            type="range"
            min="30"
            max="75"
            value={stateRef.current.angle}
            onChange={(e) => {
              stateRef.current.angle = parseInt(e.target.value);
            }}
            className="w-28 cursor-pointer accent-[#b91c1c]"
          />
          <span className="font-mono text-[#b91c1c] font-bold">{stateRef.current.angle}°</span>
        </div>

        {/* Nút Giữ Nạp Lực / Ném */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={handleStartHold}
            onMouseUp={handleRelease}
            onTouchStart={handleStartHold}
            onTouchEnd={handleRelease}
            disabled={gameState === 'flying'}
            className="px-4 py-2 bg-[#b91c1c] hover:bg-[#dc2626] disabled:opacity-50 text-white font-bold border-2 border-[#fef08a] cursor-pointer shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            {stateRef.current.isHolding ? '🔥 THẢ ĐỂ NÉM!' : '🎯 NHẤN GIỮ NẠP LỰC'}
          </button>

          {(gameState === 'missed' || gameState === 'scored') && (
            <button
              onClick={resetBall}
              className="px-3 py-2 bg-[#047857] hover:bg-[#059669] text-white font-bold border-2 border-[#fef08a] cursor-pointer shadow-[2px_2px_0_#000]"
            >
              🔄 Ném Tiếp
            </button>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[#78350f] mt-1.5 text-center">
        💡 <strong>Mẹo ném:</strong> Nhấn giữ chuột để thanh lực dao động, thả tay khi lực vừa đủ để quả còn bay xuyên qua tâm vòng tre!
      </p>
    </div>
  );
};

/* =========================================================================
   GAME 2: GÁNH LỤA QUA CẦU (MINIGAME THĂNG BẰNG REQUESTANIMATIONFRAME)
   ========================================================================= */
const GanhLuaGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const stateRef = useRef({
    // Vị trí người gánh lụa
    charX: 80,
    bridgeStartX: 80,
    bridgeEndX: 560,
    progress: 0, // 0 -> 100%
    walkFrame: 0,
    // Cơ chế Thăng bằng (-100 đến +100, 0 là hoàn hảo)
    balance: 0,
    tiltVelocity: 0,
    windPush: 0,
    // Trạng thái rơi
    isFalling: false,
    fallY: 0,
  });

  const resetGame = () => {
    const s = stateRef.current;
    s.charX = 80;
    s.progress = 0;
    s.balance = 0;
    s.tiltVelocity = 0;
    s.windPush = 0;
    s.isFalling = false;
    s.fallY = 0;
    setGameStatus('playing');
  };

  // Điều khiển bấm phím mũi tên hoặc nút bấm
  const pushLeft = () => {
    if (stateRef.current.isFalling) return;
    stateRef.current.tiltVelocity -= 2.2;
    retroAudio.playBlip(320);
  };

  const pushRight = () => {
    if (stateRef.current.isFalling) return;
    stateRef.current.tiltVelocity += 2.2;
    retroAudio.playBlip(380);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') pushLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') pushRight();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const s = stateRef.current;

      // 1. CẬP NHẬT LUỒNG THĂNG BẰNG
      if (!s.isFalling && gameStatus === 'playing') {
        // [ĐIỂM CHỈNH 1]: Giảm độ chao đảo của gió (0.45 -> 0.05) và giới hạn max gió (-1.5 -> -0.8)
        s.windPush += (Math.random() - 0.5) * 0.05; 
        s.windPush = Math.max(-0.8, Math.min(0.8, s.windPush));

        // [ĐIỂM CHỈNH 2]: Giảm lực kéo trọng tâm (0.015 -> 0.005) và ảnh hưởng của gió (0.12 -> 0.05)
        s.tiltVelocity += s.balance * 0.005 + s.windPush * 0.05; 
        
        // [ĐIỂM CHỈNH 3]: Giảm hệ số quán tính (0.94 -> 0.85) để đòn gánh bớt trơn trượt, dễ hãm lại hơn
        s.tiltVelocity *= 0.7; 
        s.balance += s.tiltVelocity;

        // [ĐIỂM CHỈNH 4]: Giảm tốc độ đi bộ lại một chút (0.85 -> 0.6) để có thời gian phản xạ
        s.charX += 0.6; 
        s.walkFrame++;
        s.progress = Math.min(100, Math.round(((s.charX - s.bridgeStartX) / (s.bridgeEndX - s.bridgeStartX)) * 100));

        // Kiểm tra rơi đồ (Game Over khi lệch quá mức)
        if (Math.abs(s.balance) >= 90) { // Giảm giới hạn rơi xuống 90 cho hợp lý với độ nghiêng
          s.isFalling = true;
          setGameStatus('lost');
          retroAudio.playBlip(180);
        }

        // Kiểm tra đi hết cầu (Chiến thắng)
        if (s.charX >= s.bridgeEndX) {
          setGameStatus('won');
          retroAudio.playEquip();
        }
      } else if (s.isFalling) {
        // Rơi xuống đầm sen
        s.fallY += 3.5;
      }
      // ================= 2. RENDER CANVAS =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bầu trời chiều đầm sen
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 340);
      bgGrad.addColorStop(0, '#fef08a');
      bgGrad.addColorStop(0.5, '#fed7aa');
      bgGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dòng sông / Đầm sen bên dưới
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 260, canvas.width, 80);
      // Hoa sen & lá sen pixel trôi
      ctx.fillStyle = '#15803d';
      ctx.fillRect(120, 275, 20, 6);
      ctx.fillRect(280, 285, 25, 7);
      ctx.fillRect(440, 270, 22, 6);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(130, 272, 8, 5);
      ctx.fillRect(290, 281, 8, 6);

      // Cầu tre vắt vẻo (Cầu khỉ)
      ctx.fillStyle = '#a16207';
      ctx.fillRect(60, 240, 520, 10);
      // Cột chống cầu tre cắm xuống nước
      ctx.fillStyle = '#78350f';
      for (let bx = 90; bx <= 550; bx += 70) {
        ctx.fillRect(bx, 240, 8, 60);
      }
      // Tay vịn tre
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(60, 205, 520, 5);
      for (let bx = 110; bx <= 550; bx += 80) {
        ctx.fillRect(bx, 205, 4, 35);
      }

      // Vẽ nhân vật gánh lụa
      const px = s.charX;
      const py = 205 + (s.isFalling ? s.fallY : Math.sin(s.walkFrame * 0.2) * 2);

      ctx.save();
      // Thân người gánh
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 6, py + 12, 12, 23); // Quần
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px - 8, py, 16, 18); // Áo nâu
      ctx.fillStyle = '#fed0ab';
      ctx.fillRect(px - 5, py - 12, 10, 12); // Mặt
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(px - 7, py - 16, 14, 6); // Khăn

      // ĐÒN GÁNH TRE TRÊN VAI (Nghiêng theo góc thăng bằng)
      ctx.translate(px, py + 3);
      const tiltRad = (s.balance * Math.PI) / 280;
      ctx.rotate(tiltRad);

      // Đòn tre
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-35, -2, 70, 4);

      // Dây quang gánh & 2 hòm xiêm y lụa
      // Đầu gánh trái
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-32, 0);
      ctx.lineTo(-32, 18);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e'; // Hòm lụa đỏ đào
      ctx.fillRect(-40, 18, 16, 12);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-38, 20, 12, 3);

      // Đầu gánh phải
      ctx.beginPath();
      ctx.moveTo(32, 0);
      ctx.lineTo(32, 18);
      ctx.stroke();
      ctx.fillStyle = '#0284c7'; // Hòm lụa xanh biếc
      ctx.fillRect(24, 18, 16, 12);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(26, 20, 12, 3);

      ctx.restore();

      // Tiến trình qua cầu
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Tiến trình: ${s.progress}%`, 610, 25);

      // Thông báo kết thúc
      if (gameStatus === 'won') {
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 24px "VT323", "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 QUA CẦU THÀNH CÔNG! XIÊM Y NGUYÊN VẸN! 🏆', canvas.width / 2, 60);
      } else if (gameStatus === 'lost') {
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 22px "VT323", "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('💥 RƠI ĐỒ RỒI! HÃY GIỮ CÂN BẰNG TỐT HƠN!', canvas.width / 2, 60);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameStatus]);

  // Vị trí con trỏ thăng bằng trên thanh (0 là giữa, -100 là trái, +100 là phải)
  const balanceVal = stateRef.current.balance;
  const balancePercent = Math.min(100, Math.max(0, ((balanceVal + 100) / 200) * 100));

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Top Bar Progress */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 bg-[#fef3c7] border-2 border-[#d97706] mb-2 font-mono text-xs">
        <span className="font-bold text-[#b45309]">
          ⚖ TIẾN ĐỘ QUA CẦU KHỈ: <span className="text-[#047857] text-sm">{stateRef.current.progress}%</span>
        </span>
        <span className="text-[#78350f]">Dùng phím mũi tên [←] và [→] để giữ đòn gánh</span>
      </div>

      {/* Canvas */}
      <div className="relative border-4 border-[#3b2803] pixel-carved-gold shadow-md overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={340}
          className="w-full max-w-[640px] h-auto block select-none"
        />
      </div>

      {/* THANH THĂNG BẰNG (BALANCE BAR) */}
      <div className="w-full mt-3 p-3 bg-[#fef3c7] border-2 border-[#d97706] flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold text-[#78350f]">
          <span>🔴 NGHIÊNG TRÁI</span>
          <span className="text-[#047857]">🟢 VÙNG AN TOÀN TRUNG TÂM</span>
          <span>🔴 NGHIÊNG PHẢI</span>
        </div>

        {/* Thước đo cân bằng */}
        <div className="relative w-full h-7 bg-[#1e293b] border-2 border-black flex items-center overflow-hidden">
          {/* Vùng đỏ trái */}
          <div className="w-[25%] h-full bg-[#ef4444]/60" />
          {/* Vùng vàng trái */}
          <div className="w-[15%] h-full bg-[#f59e0b]/70" />
          {/* Vùng xanh an toàn giữa */}
          <div className="w-[20%] h-full bg-[#10b981]" />
          {/* Vùng vàng phải */}
          <div className="w-[15%] h-full bg-[#f59e0b]/70" />
          {/* Vùng đỏ phải */}
          <div className="w-[25%] h-full bg-[#ef4444]/60" />

          {/* Kim chỉ thị trọng tâm */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-[#ffffff] border-2 border-black shadow-[0_0_8px_#ffffff] transition-all duration-75"
            style={{ left: `calc(${balancePercent}% - 6px)` }}
          />
        </div>

        {/* Nút bấm thăng bằng cho cả PC & Mobile */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <button
            onClick={pushLeft}
            disabled={gameStatus !== 'playing'}
            className="flex-1 py-2 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-bold text-xs border-2 border-[#fef08a] cursor-pointer shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            ◀ NGHIÊNG SANG TRÁI (Phím ←)
          </button>

          {gameStatus !== 'playing' && (
            <button
              onClick={resetGame}
              className="px-5 py-2 bg-[#b91c1c] hover:bg-[#dc2626] text-white font-bold text-xs border-2 border-[#fef08a] cursor-pointer shadow-[2px_2px_0_#000]"
            >
              🔄 CHƠI LẠI
            </button>
          )}

          <button
            onClick={pushRight}
            disabled={gameStatus !== 'playing'}
            className="flex-1 py-2 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white font-bold text-xs border-2 border-[#fef08a] cursor-pointer shadow-[2px_2px_0_#000] active:translate-y-0.5"
          >
            NGHIÊNG SANG PHẢI (Phím →) ▶
          </button>
        </div>
      </div>
    </div>
  );
};
