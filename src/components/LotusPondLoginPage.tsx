import React, { useState } from 'react';
import { LotusPondCanvas } from './LotusPondCanvas.tsx';
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Volume2,
  VolumeX,
  Music,
  Eye as ViewEye,
  EyeOff as ViewEyeOff,
  Sparkles,
} from 'lucide-react';
import { retroAudio } from '../utils/audio.ts';

interface LotusPondLoginPageProps {
  onLoginSuccess: (user: {
    id?: number;
    username: string;
    email?: string;
    displayName?: string;
    role: 'guest' | 'king' | 'noble';
  }) => void;
  initialRemember?: boolean;
}

export const LotusPondLoginPage: React.FC<LotusPondLoginPageProps> = ({
  onLoginSuccess,
  initialRemember = true,
}) => {
  // UI visibility states
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);

  // Auth tabs & input states
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(initialRemember);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  // Register fields
  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<'noble' | 'king' | 'guest'>('noble');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // Toggle ambient audio
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    retroAudio.enabled = next;
    if (next) retroAudio.playBlip(520);
    else if (bgmPlaying) {
      retroAudio.toggleBgm(false);
      setBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      retroAudio.enabled = true;
    }
    const next = retroAudio.toggleBgm();
    setBgmPlaying(next);
  };

  // Quick enter as guest
  const handleQuickEnter = () => {
    retroAudio.playBlip(540);
    onLoginSuccess({
      username: 'Khách Du Ngoạn',
      displayName: 'Khách Du Ngoạn',
      role: 'guest',
      email: 'khach@bachphuc.vn',
    });
  };

  // Quick select template account
  const handleQuickTemplate = (role: 'guest' | 'king' | 'noble') => {
    retroAudio.playEquip();
    if (role === 'guest') {
      onLoginSuccess({
        username: 'Khách Thường',
        displayName: 'Khách Thường',
        role: 'guest',
        email: 'khachthuong@bachphuc.vn',
      });
    } else if (role === 'king') {
      onLoginSuccess({
        username: 'QuanVien',
        displayName: 'Quân Vương',
        role: 'king',
        email: 'quanvuong@bachphuc.vn',
      });
    } else {
      onLoginSuccess({
        username: 'NuQuyToc',
        displayName: 'Nữ Quý Tộc',
        role: 'noble',
        email: 'nuquytoc@bachphuc.vn',
      });
    }
  };

  // SQLite Login handler
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      retroAudio.playBlip(240);
      setInfoMessage({ text: 'Vui lòng nhập tài khoản và mật khẩu!', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    retroAudio.playBlip(440);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Fallback cho tài khoản mẫu nếu chưa có trong DB
        const lowerUser = username.trim().toLowerCase();
        if (lowerUser.includes('quan') || lowerUser.includes('king')) {
          handleQuickTemplate('king');
          return;
        } else if (lowerUser.includes('nu') || lowerUser.includes('noble')) {
          handleQuickTemplate('noble');
          return;
        } else if (lowerUser.includes('khach') || lowerUser.includes('guest')) {
          handleQuickTemplate('guest');
          return;
        }

        setInfoMessage({ text: data.error || 'Tài khoản hoặc mật khẩu không chính xác.', type: 'error' });
        retroAudio.playBlip(240);
        setIsSubmitting(false);
        return;
      }

      retroAudio.playEquip();
      setInfoMessage({ text: 'Đăng nhập thành công! Đang vào đầm sen...', type: 'success' });
      const lower = data.user.username.toLowerCase();
      const detectedRole = lower.includes('quan') || lower.includes('king')
        ? 'king'
        : lower.includes('nu') || lower.includes('noble')
        ? 'noble'
        : 'noble';

      setTimeout(() => {
        onLoginSuccess({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: detectedRole,
          displayName: data.user.username,
        });
      }, 300);
    } catch {
      // Fallback khi offline
      retroAudio.playEquip();
      onLoginSuccess({
        username: username.trim(),
        displayName: username.trim(),
        role: 'noble',
        email: `${username.trim()}@bachphuc.vn`,
      });
    }
  };

  // SQLite Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim() || !regPassword) {
      retroAudio.playBlip(240);
      setInfoMessage({ text: 'Vui lòng điền đầy đủ các thông tin đăng ký!', type: 'error' });
      return;
    }
    if (regPassword.length < 6) {
      retroAudio.playBlip(240);
      setInfoMessage({ text: 'Mật khẩu phải có ít nhất 6 ký tự!', type: 'error' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      retroAudio.playBlip(240);
      setInfoMessage({ text: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    retroAudio.playBlip(440);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setInfoMessage({ text: data.error || 'Đăng ký không thành công.', type: 'error' });
        retroAudio.playBlip(240);
        setIsSubmitting(false);
        return;
      }

      retroAudio.playEquip();
      setInfoMessage({ text: 'Đăng ký tài khoản thành công! Đang chuyển vào đầm sen...', type: 'success' });
      setTimeout(() => {
        onLoginSuccess({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: regRole,
          displayName:
            regRole === 'king'
              ? `Quân Vương ${data.user.username}`
              : regRole === 'noble'
              ? `Nữ Quý Tộc ${data.user.username}`
              : data.user.username,
        });
      }, 350);
    } catch {
      // Offline fallback
      retroAudio.playEquip();
      onLoginSuccess({
        username: regUsername.trim(),
        displayName:
          regRole === 'king'
            ? `Quân Vương ${regUsername.trim()}`
            : regRole === 'noble'
            ? `Nữ Quý Tộc ${regUsername.trim()}`
            : regUsername.trim(),
        role: regRole,
        email: regEmail.trim(),
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none font-['Be_Vietnam_Pro','Nunito',sans-serif]">
      {/* 1. RETRO PIXEL ART LOTUS POND CANVAS (Màn sương mù, gợn nước, hoa sen rơi, bụi phấn tiên & đom đóm) */}
      <LotusPondCanvas className="z-0" intensity={1} />

      {/* 2. THANH TIỆN ÍCH TRÊN CÙNG (Ẩn/Hiện form & Âm thanh phong cảnh) */}
      <header className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        {/* Toggle Form Visibility button */}
        <button
          onClick={() => {
            retroAudio.playBlip(360);
            setIsFormVisible((prev) => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-sm cursor-pointer bg-white/75 hover:bg-white text-[#3D2314] border-white/60 active:scale-95 transition-all"
          title={isFormVisible ? 'Ẩn khung để thưởng lãm trọn vẹn đầm sen' : 'Hiện lại khung đăng nhập'}
        >
          {isFormVisible ? (
            <>
              <ViewEyeOff className="w-3.5 h-3.5 text-[#8B263E]" />
              <span className="hidden sm:inline">Ẩn Khung</span>
            </>
          ) : (
            <>
              <ViewEye className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">Hiện Khung</span>
            </>
          )}
        </button>

        {/* Ambient audio toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-full border shadow-sm backdrop-blur-md transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white/80 text-[#78350F] border-white/80 hover:bg-white'
                : 'bg-black/35 text-white/60 border-white/20'
            }`}
            title={soundEnabled ? 'Tắt âm thanh SFX' : 'Bật âm thanh SFX'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleToggleBgm}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm backdrop-blur-md text-xs font-semibold transition-all cursor-pointer ${
              bgmPlaying
                ? 'bg-amber-100/90 text-[#78350F] border-amber-300 animate-pulse'
                : 'bg-white/75 text-[#5C2E1B] border-white/70 hover:bg-white'
            }`}
            title={bgmPlaying ? 'Tắt nhạc cổ phong' : 'Bật nhạc nền cổ phong'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{bgmPlaying ? 'Nhạc: Bật' : 'Nhạc Cổ'}</span>
          </button>
        </div>
      </header>

      {/* 3. KHUNG ĐĂNG NHẬP (LOGIN FORM UI - GIỮ NGUYÊN 100% LAYOUT CỦA ẢNH THAM KHẢO) */}
      <main className="relative z-20 w-full h-full flex items-center justify-center p-3 sm:p-4">
        {isFormVisible && (
          <div
            className="w-full max-w-[430px] rounded-[28px] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 shadow-[0_20px_50px_rgba(70,20,30,0.18)] animate-in fade-in zoom-in-95 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 238, 230, 0.78) 0%, rgba(254, 222, 214, 0.75) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.65)',
              boxShadow: '0 20px 50px rgba(70, 20, 30, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.85)',
            }}
          >
            {/* NÚT CHUYỂN NHANH "VÀO THỬ ->" Ở GÓC TRÊN BÊN PHẢI FORM */}
            <button
              type="button"
              onClick={handleQuickEnter}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-white/75 hover:bg-white text-[11px] font-bold text-[#3D2314] px-3 py-1 rounded-full border border-white/80 shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer group"
              title="Vào trải nghiệm ngay không cần tài khoản"
            >
              <span>Vào Thử</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* LOGO HOA SEN TRÒN TRUNG TÂM CÓ HUY HIỆU LÁ XANH Ở GÓC DƯỚI */}
            <div className="relative w-14 h-14 rounded-full bg-[#FFF9F5]/90 border border-[#E8D0C0] mx-auto flex items-center justify-center shadow-xs mb-1">
              {/* Icon Hoa sen cách điệu */}
              <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#B76E79]" fill="none" stroke="currentColor" strokeWidth="1.8">
                {/* Cánh sen trung tâm */}
                <path d="M20 8 C16 16, 16 26, 20 30 C24 26, 24 16, 20 8 Z" fill="#FEE2E2" />
                {/* Cánh sen trái */}
                <path d="M16 13 C9 18, 9 27, 18 29" strokeLinecap="round" />
                {/* Cánh sen phải */}
                <path d="M24 13 C31 18, 31 27, 22 29" strokeLinecap="round" />
                {/* Cánh xòe dưới */}
                <path d="M12 22 C6 25, 10 32, 20 32 C30 32, 34 25, 28 22" strokeLinecap="round" />
              </svg>
              {/* Huy hiệu hoa lá xanh ở góc dưới bên phải vòng tròn */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#4A7C59] border-2 border-white flex items-center justify-center shadow-xs">
                <span className="text-[9px] leading-none text-white font-bold select-none">✨</span>
              </div>
            </div>

            {/* TIÊU ĐỀ NÂU SẪM CHỮ ĐẬM LỚN & DÒNG PHỤ */}
            <h1 className="text-2xl sm:text-[25px] font-black text-[#3D2314] tracking-wider text-center mt-2 font-['Be_Vietnam_Pro','Nunito',sans-serif]">
              {authTab === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ MỚI'}
            </h1>
            <p className="text-xs text-[#5C2E1B] font-semibold text-center mt-0.5 mb-3">
              Đầm Sen Buổi Sớm • Bách Phục Cổ Truyền
            </p>

            {/* THANH ĐIỀU HƯỚNG TAB: ĐĂNG NHẬP & ĐĂNG KÝ (NỔI BẬT & RÕ RÀNG) */}
            <div className="grid grid-cols-2 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-white/90 shadow-xs mb-3.5 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(440);
                  setAuthTab('login');
                  setInfoMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-[#FFFDF7] text-[#3D2314] shadow-sm border border-[#FFBFA0] font-black'
                    : 'text-[#78350F] hover:bg-white/50 opacity-80'
                }`}
              >
                <span>🔑</span>
                <span>ĐĂNG NHẬP</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(520);
                  setAuthTab('register');
                  setInfoMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-gradient-to-r from-[#FFA9A9] to-[#FED2B7] text-[#3D2314] shadow-sm border border-[#FFBFA0] font-black'
                    : 'text-[#78350F] hover:bg-white/50 opacity-80'
                }`}
              >
                <span>✨</span>
                <span>ĐĂNG KÝ</span>
              </button>
            </div>

            {/* THÔNG BÁO KẾT QUẢ ĐĂNG NHẬP / ĐĂNG KÝ */}
            {infoMessage && (
              <div
                className={`mb-3 px-3 py-1.5 text-xs font-semibold rounded-xl border animate-in fade-in ${
                  infoMessage.type === 'error'
                    ? 'text-[#8B1E2D] bg-rose-50/90 border-rose-200'
                    : 'text-[#1E5C38] bg-emerald-50/90 border-emerald-200'
                }`}
              >
                {infoMessage.text}
              </div>
            )}

            {/* ================= TAB 1: FORM ĐĂNG NHẬP (CHUẨN ẢNH THAM KHẢO) ================= */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                {/* Ô NHẬP LIỆU: TÊN TÀI KHOẢN / EMAIL */}
                <div className="mb-3">
                  <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                    TÊN TÀI KHOẢN / EMAIL
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ví dụ: QuanVien, NuQuyToc, Huyentrang..."
                      required
                      className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] focus:ring-1 focus:ring-[#FFBFA0] rounded-xl px-4 py-2.5 pr-10 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                    />
                    <User className="absolute right-3.5 w-4 h-4 text-[#9A7B70] pointer-events-none" />
                  </div>
                </div>

                {/* Ô NHẬP LIỆU: MẬT KHẨU */}
                <div className="mb-2.5">
                  <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                    MẬT KHẨU
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu bất kỳ..."
                      required
                      className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] focus:ring-1 focus:ring-[#FFBFA0] rounded-xl px-4 py-2.5 pr-10 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#9A7B70] hover:text-[#3D2314] cursor-pointer transition-colors"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* DÒNG CHECK "Ghi nhớ đăng nhập" VÀ "Quên mật khẩu?" MÀU ĐỎ SẪM */}
                <div className="flex items-center justify-between text-xs mb-4 px-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#7A1F2D] text-[11.5px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#7A1F2D] cursor-pointer"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      retroAudio.playBlip(320);
                      setInfoMessage({
                        text: 'Mẹo: Nhấn nút "Vào Thử →" ở góc trên hoặc chọn tài khoản mẫu bên dưới để trải nghiệm ngay!',
                        type: 'error',
                      });
                    }}
                    className="font-bold text-[#7A1F2D] hover:underline cursor-pointer text-[11.5px]"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* NÚT LỚN "ĐĂNG NHẬP VÀO ĐẦM SEN" MÀU TRẮNG KEM NHẠT KÈM BIỂU TƯỢNG LẤP LÁNH */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFFDF7] hover:bg-white text-[#3D2314] font-black text-xs sm:text-[13px] py-3 px-4 rounded-xl border border-[#E8D8C8] shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer mb-3.5 disabled:opacity-75"
                >
                  <Sparkles className="w-4 h-4 text-[#C1272D]" />
                  <span>{isSubmitting ? 'ĐANG KẾT NỐI...' : 'ĐĂNG NHẬP VÀO ĐẦM SEN'}</span>
                </button>

                {/* PHẦN TÀI KHOẢN MẪU NHANH (Khách Thường, Quân Vương, Nữ Quý Tộc) */}
                <div className="mb-3">
                  <div className="text-[11px] text-[#5C2E1B] font-medium text-center mb-1.5">
                    Tài khoản mẫu nhanh:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickTemplate('guest')}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold text-[#3D2314] bg-white/70 hover:bg-white border border-[#E8D0C0] rounded-lg shadow-2xs transition-all text-center cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      title="Trải nghiệm nhanh với tư cách Khách Thường"
                    >
                      <span className="text-xs">🌸</span>
                      <span>Khách Thường</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTemplate('king')}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold text-[#3D2314] bg-white/70 hover:bg-white border border-[#E8D0C0] rounded-lg shadow-2xs transition-all text-center cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      title="Trải nghiệm nhanh với tư cách Quân Vương"
                    >
                      <span className="text-xs">👑</span>
                      <span>Quân Vương</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTemplate('noble')}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold text-[#3D2314] bg-white/70 hover:bg-white border border-[#E8D0C0] rounded-lg shadow-2xs transition-all text-center cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                      title="Trải nghiệm nhanh với tư cách Nữ Quý Tộc"
                    >
                      <span className="text-xs">🪷</span>
                      <span>Nữ Quý Tộc</span>
                    </button>
                  </div>
                </div>

                {/* PHẦN ĐĂNG KÝ NẾU CHƯA CÓ TÀI KHOẢN */}
                <div className="text-center text-[11px] text-[#5C2E1B] mb-2">
                  <span>Chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={() => {
                      retroAudio.playBlip(440);
                      setAuthTab('register');
                      setInfoMessage(null);
                    }}
                    className="font-bold text-[#7A1F2D] hover:underline cursor-pointer"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 2: FORM ĐĂNG KÝ (NẾU CHƯA CÓ TÀI KHOẢN) ================= */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                {/* TÊN TÀI KHOẢN */}
                <div className="mb-2.5">
                  <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                    TÊN TÀI KHOẢN
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Tên tài khoản mới..."
                      required
                      className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] rounded-xl px-4 py-2 pr-10 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                    />
                    <User className="absolute right-3.5 w-4 h-4 text-[#9A7B70] pointer-events-none" />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="mb-2.5">
                  <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                    ĐỊA CHỈ EMAIL
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@vidu.vn"
                      required
                      className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] rounded-xl px-4 py-2 pr-10 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                    />
                    <Mail className="absolute right-3.5 w-4 h-4 text-[#9A7B70] pointer-events-none" />
                  </div>
                </div>

                {/* MẬT KHẨU & XÁC NHẬN MẬT KHẨU */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                      MẬT KHẨU
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="≥ 6 ký tự"
                        required
                        className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] rounded-xl px-3 py-2 pr-8 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                      />
                      <Lock className="absolute right-2.5 w-3.5 h-3.5 text-[#9A7B70] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                      XÁC NHẬN
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Nhập lại..."
                        required
                        className="w-full bg-white/75 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-[#FFBFA0] rounded-xl px-3 py-2 pr-8 text-xs text-[#3D2314] placeholder:text-[#9A7B70]/80 shadow-inner outline-none transition-all"
                      />
                      <Lock className="absolute right-2.5 w-3.5 h-3.5 text-[#9A7B70] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* THÂN PHẬN BAN ĐẦU */}
                <div className="mb-2.5">
                  <label className="block text-[10.5px] font-bold text-[#3D2314] uppercase tracking-wider mb-1">
                    THÂN PHẬN BAN ĐẦU
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(440);
                        setRegRole('noble');
                      }}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                        regRole === 'noble'
                          ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-xs'
                          : 'bg-white/70 text-[#5C2E1B] border-white/80 hover:bg-white'
                      }`}
                    >
                      <span>🪷</span>
                      <span>Quý Tộc</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(480);
                        setRegRole('king');
                      }}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                        regRole === 'king'
                          ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-black shadow-xs'
                          : 'bg-white/70 text-[#5C2E1B] border-white/80 hover:bg-white'
                      }`}
                    >
                      <span>👑</span>
                      <span>Quân Vương</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(400);
                        setRegRole('guest');
                      }}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                        regRole === 'guest'
                          ? 'bg-[#FFFFE3] text-[#3D2314] border-[#FED2B7] font-black shadow-xs'
                          : 'bg-white/70 text-[#5C2E1B] border-white/80 hover:bg-white'
                      }`}
                    >
                      <span>🌸</span>
                      <span>Khách</span>
                    </button>
                  </div>
                </div>

                {/* SHOW PASSWORD TOGGLE */}
                <div className="flex items-center justify-between text-[11px] mb-3 px-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[#3D2314]">
                    <input
                      type="checkbox"
                      checked={showRegPassword}
                      onChange={(e) => setShowRegPassword(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#7A1F2D] cursor-pointer"
                    />
                    <span>Hiện mật khẩu</span>
                  </label>
                  <span className="text-[10px] text-[#5C2E1B]">Lưu bảo mật SQLite</span>
                </div>

                {/* NÚT TẠO TÀI KHOẢN */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FFFDF7] to-[#FED2B7] hover:from-white hover:to-[#FFD6B0] text-[#3D2314] font-black text-xs sm:text-[13px] py-3 px-4 rounded-xl border border-[#FFBFA0] shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer mb-2.5 disabled:opacity-75"
                >
                  <Sparkles className="w-4 h-4 text-[#C1272D]" />
                  <span>{isSubmitting ? 'ĐANG TẠO TÀI KHOẢN...' : '✨ ĐĂNG KÝ VÀO ĐẦM SEN'}</span>
                </button>

                {/* QUAY LẠI ĐĂNG NHẬP */}
                <div className="text-center text-[11px] text-[#5C2E1B] mb-1">
                  <span>Đã có tài khoản? </span>
                  <button
                    type="button"
                    onClick={() => {
                      retroAudio.playBlip(440);
                      setAuthTab('login');
                      setInfoMessage(null);
                    }}
                    className="font-bold text-[#7A1F2D] hover:underline cursor-pointer"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              </form>
            )}

            {/* BẢN QUYỀN CHỮ NHỎ DƯỚI ĐÁY CỦA FORM */}
            <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-[#4A7C59] font-semibold text-center mt-3 pt-2.5 border-t border-[#3D2314]/10">
              <span className="text-xs">🛡️</span>
              <span>Bảo chứng Bách Phục Cổ Truyền • Đại Việt Phong Hoa</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
