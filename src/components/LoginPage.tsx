import React, { useState } from 'react';
import { LotusPondCanvas } from './LotusPondCanvas.tsx';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Music,
  Check,
  Eye as ViewEye,
  EyeOff as ViewEyeOff,
} from 'lucide-react';
import { retroAudio } from '../utils/audio.ts';

export interface UserSession {
  username: string;
  role: 'guest' | 'king' | 'noble_lady';
  roleName: string;
  gender: 'female' | 'male';
}

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bgmPlaying: boolean;
  onToggleBgm: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  soundEnabled,
  onToggleSound,
  bgmPlaying,
  onToggleBgm,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

  // Chọn tài khoản mẫu nhanh
  const handleSelectSample = (sampleType: 'guest' | 'king' | 'noble_lady') => {
    retroAudio.playBlip(480);
    setSelectedSample(sampleType);

    if (sampleType === 'guest') {
      setUsername('khachthuong@vietphuc.vn');
      setPassword('khach123');
    } else if (sampleType === 'king') {
      setUsername('quanvuong@vietphuc.vn');
      setPassword('vuongtrien123');
    } else if (sampleType === 'noble_lady') {
      setUsername('nuquytoc@vietphuc.vn');
      setPassword('quyphuc123');
    }
  };

  // Xử lý đăng nhập
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    retroAudio.playLoginSuccess();

    let session: UserSession = {
      username: username || 'Khách Thường',
      role: 'guest',
      roleName: 'Khách Thường',
      gender: 'female',
    };

    if (selectedSample === 'king' || username.toLowerCase().includes('vuong') || username.toLowerCase().includes('nam')) {
      session = {
        username: username || 'Quân Vương',
        role: 'king',
        roleName: 'Quân Vương',
        gender: 'male',
      };
    } else if (selectedSample === 'noble_lady' || username.toLowerCase().includes('nu') || username.toLowerCase().includes('quy')) {
      session = {
        username: username || 'Nữ Quý Tộc',
        role: 'noble_lady',
        roleName: 'Nữ Quý Tộc',
        gender: 'female',
      };
    }

    setWelcomeToast(`Chào mừng ${session.roleName} bước vào Chốn Bồng Lai & Đầm Sen Bách Phục!`);

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(session);
    }, 1200);
  };

  // Vào Thử -> Chuyển nhanh
  const handleQuickEnter = () => {
    retroAudio.playEquip();
    const guestSession: UserSession = {
      username: 'Khách Tham Quan',
      role: 'guest',
      roleName: 'Khách Thường',
      gender: 'female',
    };
    onLoginSuccess(guestSession);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none font-['Be_Vietnam_Pro','Nunito',sans-serif]">
      {/* ================= 1. PHÔNG NỀN ĐỘNG & HẠT PARTICLES (CANVAS) ================= */}
      <LotusPondCanvas className="z-0" intensity={1} />

      {/* ================= 2. THANH TIỆN ÍCH TRÊN CÙNG (AMBIENT BAR) ================= */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
        {/* Nút bật/tắt hiển thị Form để ngắm trọn vẹn cảnh đầm sen */}
        <button
          onClick={() => {
            retroAudio.playBlip(360);
            setIsFormVisible((prev) => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all backdrop-blur-md border shadow-md cursor-pointer bg-white/70 hover:bg-white/95 text-[#3D2314] border-white/80 active:scale-95"
          title={isFormVisible ? 'Ẩn khung đăng nhập để ngắm phong cảnh' : 'Hiện lại khung đăng nhập'}
        >
          {isFormVisible ? (
            <>
              <ViewEyeOff className="w-3.5 h-3.5 text-[#B91C1C]" />
              <span>Ẩn Khung Đăng Nhập</span>
            </>
          ) : (
            <>
              <ViewEye className="w-3.5 h-3.5 text-[#059669]" />
              <span>Hiện Khung Đăng Nhập</span>
            </>
          )}
        </button>

        {/* Cụm âm thanh: Hiệu ứng & Nhạc nền BGM */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border shadow-md backdrop-blur-md transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white/85 text-[#78350F] border-amber-300'
                : 'bg-black/40 text-white/60 border-white/20'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleBgm}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-md backdrop-blur-md text-xs font-bold transition-all cursor-pointer ${
              bgmPlaying
                ? 'bg-amber-100/90 text-[#78350F] border-amber-400 animate-pulse'
                : 'bg-white/70 text-[#5C2E1B] border-white/80 hover:bg-white/90'
            }`}
            title={bgmPlaying ? 'Tắt nhạc cổ phong' : 'Bật nhạc BGM cổ phong'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{bgmPlaying ? 'Đang phát Nhạc' : 'Nhạc Cổ Phong'}</span>
          </button>
        </div>
      </div>

      {/* ================= 3. KHUNG ĐĂNG NHẬP (LOGIN FORM UI - GLASSMORPHISM) ================= */}
      <div className="relative z-20 w-full h-full flex items-center justify-center p-4">
        {isFormVisible && (
          <div
            className="relative w-full max-w-[420px] transition-all duration-300 animate-in fade-in zoom-in-95"
            style={{
              // Bảng đăng nhập dạng kính mờ (glassmorphism) màu hồng nhạt, viền bo tròn mềm mại
              background: 'rgba(255, 241, 242, 0.78)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '2px solid rgba(255, 255, 255, 0.75)',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(244, 63, 94, 0.18), 0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="p-6 sm:p-7 flex flex-col gap-4">
              
              {/* --- HEADER: TIÊU ĐỀ & NÚT VÀO THỬ -> --- */}
              <div className="flex items-start justify-between relative">
                <div>
                  {/* Tiêu đề "ĐĂNG NHẬP" màu nâu sẫm, chữ đậm lớn */}
                  <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-[#3D2314] font-['VT323','Silkscreen',sans-serif] uppercase leading-none drop-shadow-sm">
                    ĐĂNG NHẬP
                  </h2>
                  {/* Dòng phụ "Đầm Sen Buổi Sớm • Bách Phục Cổ Truyền" */}
                  <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-[#78350F] mt-1">
                    Đầm Sen Buổi Sớm • Bách Phục Cổ Truyền
                  </p>
                </div>

                {/* Nút chuyển nhanh "Vào Thử ->" nhỏ ở góc trên bên phải form */}
                <button
                  type="button"
                  onClick={handleQuickEnter}
                  className="group flex items-center gap-1 text-[11px] font-bold text-[#991B1B] hover:text-[#B91C1C] border border-[#F87171]/50 hover:border-[#DC2626] bg-white/70 hover:bg-white px-2.5 py-1 rounded-full shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                  title="Vào trải nghiệm ngay không cần nhập tài khoản"
                >
                  <span>Vào Thử</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* --- FORM NHẬP LIỆU --- */}
              <form onSubmit={handleLogin} className="flex flex-col gap-3.5 mt-1">
                
                {/* 1. TÊN TÀI KHOẢN / EMAIL */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5C2E1B] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#B91C1C]" />
                    <span>TÊN TÀI KHOẢN / EMAIL</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên tài khoản hoặc email..."
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/80 bg-white/75 text-[#3D2314] placeholder:text-[#5C2E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#F43F5E]/40 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* 2. MẬT KHẨU */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5C2E1B] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#B91C1C]" />
                    <span>MẬT KHẨU</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 pr-9 rounded-xl border border-white/80 bg-white/75 text-[#3D2314] placeholder:text-[#5C2E1B]/50 focus:outline-none focus:ring-2 focus:ring-[#F43F5E]/40 focus:bg-white transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 text-[#5C2E1B]/60 hover:text-[#5C2E1B] transition-colors cursor-pointer"
                      title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. DÒNG CHECK "GHI NHỚ ĐĂNG NHẬP" VÀ "QUÊN MẬT KHẨU?" MÀU ĐỎ SẪM */}
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#7F1D1D] font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#B91C1C] rounded cursor-pointer"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      retroAudio.playBlip(320);
                      alert('Vui lòng chọn một trong các tài khoản mẫu bên dưới để đăng nhập nhanh!');
                    }}
                    className="text-[#991B1B] hover:text-[#7F1D1D] font-bold hover:underline cursor-pointer transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* 4. NÚT LỚN "ĐĂNG NHẬP VÀO ĐẦM SEN" MÀU TRẮNG KEM NHẠT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 border-2 transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                  style={{
                    backgroundColor: '#FFFFE3', // Màu trắng kem nhạt theo yêu cầu
                    color: '#3D2314',           // Chữ nâu sẫm
                    borderColor: '#FED2B7',      // Viền cam đào nhạt
                    boxShadow: '0 4px 15px rgba(254, 210, 183, 0.45)',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#D97706] animate-pulse" />
                  <span>{isSubmitting ? 'ĐANG KHOÁC ÁO VÀO ĐẦM SEN...' : 'ĐĂNG NHẬP VÀO ĐẦM SEN'}</span>
                </button>
              </form>

              {/* --- 5. TÀI KHOẢN MẪU NHANH --- */}
              <div className="pt-2 border-t border-rose-200/60 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78350F]/80 text-center">
                  Tài khoản mẫu nhanh:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectSample('guest')}
                    className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer text-center truncate ${
                      selectedSample === 'guest'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-inner'
                        : 'bg-white/80 hover:bg-white text-[#5C2E1B] border-rose-200 shadow-sm'
                    }`}
                  >
                    Khách Thường
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('king')}
                    className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer text-center truncate ${
                      selectedSample === 'king'
                        ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-black shadow-inner'
                        : 'bg-white/80 hover:bg-white text-[#5C2E1B] border-rose-200 shadow-sm'
                    }`}
                  >
                    Quân Vương
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('noble_lady')}
                    className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer text-center truncate ${
                      selectedSample === 'noble_lady'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-inner'
                        : 'bg-white/80 hover:bg-white text-[#5C2E1B] border-rose-200 shadow-sm'
                    }`}
                  >
                    Nữ Quý Tộc
                  </button>
                </div>
              </div>

              {/* --- 6. BẢN QUYỀN CHỮ NHỎ DƯỚI ĐÁY --- */}
              <div className="text-center pt-1 border-t border-rose-200/40">
                <p className="text-[9.5px] font-medium tracking-wide text-[#78350F]/70">
                  Bảo chứng Bách Phục Cổ Truyền • Đại Việt Phong Hoa
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ================= 4. TOAST THÔNG BÁO CHÀO MỪNG ================= */}
      {welcomeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-[#FFFFE3] text-[#3D2314] border-2 border-[#FED2B7] shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>{welcomeToast}</span>
        </div>
      )}
    </div>
  );
};
