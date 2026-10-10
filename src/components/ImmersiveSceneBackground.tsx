import React from 'react';
import { Scene } from '../types.ts';

interface ImmersiveSceneBackgroundProps {
  scene: Scene;
  gender: 'female' | 'male';
}

export const ImmersiveSceneBackground: React.FC<ImmersiveSceneBackgroundProps> = ({
  scene,
  gender,
}) => {
  const sceneId = scene.id;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. NẾU CÓ ẢNH URL ĐƯỢC ĐIỀN VÀO BIẾN bg_image_1, bg_image_2, bg_image_3... */}
      {scene.imageUrl && scene.imageUrl.trim() !== '' ? (
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${scene.imageUrl})` }}
        />
      ) : (
        /* 2. NẾU CHƯA ĐIỀN LINK: RENDER NỀN SVG & GRADIENT THEO ĐÚNG HÌNH ẢNH USER ĐÍNH KÈM */
        <div className="w-full h-full relative">
          
          {/* ================= CẢNH 1: CHỐN BỒNG LAI (MÂY HỒNG CAM PASTEL & TRĂNG VÀNG KEM) ================= */}
          {sceneId === 'bong-lai' && (
            <div className="w-full h-full relative">
              {/* Nền gradient mờ chuyển dần từ #FED2B7 (Cam đào nhạt) sang #FFFFE3 (Vàng kem nhạt) */}
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(180deg, #FED2B7 0%, #FFE9DD 45%, #FFFFE3 100%)',
                }}
              />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                <defs>
                  {/* Quầng sáng vầng trăng vàng kem dịu mắt */}
                  <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFE3" stopOpacity="0.98" />
                    <stop offset="55%" stopColor="#FFFEE0" stopOpacity="0.85" />
                    <stop offset="78%" stopColor="#FFEAD9" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#FED2B7" stopOpacity="0" />
                  </radialGradient>
                  {/* Gradient cho lớp mây bồng bềnh pastel */}
                  <linearGradient id="cloud-pastel-1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FED2B7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#FFE7DA" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="cloud-pastel-2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFE7DA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FFFFE3" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Quầng sáng mặt trăng vàng kem dịu mắt phía sau nhân vật (tâm 500, 240) */}
                <circle cx="500" cy="240" r="230" fill="url(#moon-glow)" />
                <circle cx="500" cy="240" r="160" fill="#FFFFE3" opacity="0.65" />
                <circle cx="500" cy="240" r="115" fill="#FFFFE3" opacity="0.95" />
                <circle cx="500" cy="240" r="80" fill="#FFFEE0" opacity="0.9" />

                {/* Vầng hào quang quầng tròn thứ hai nhẹ nhàng */}
                <circle cx="500" cy="240" r="185" stroke="#FED2B7" strokeWidth="2" strokeDasharray="6 8" fill="none" opacity="0.4" />

                {/* Dãy núi tiên cảnh xa xa trong sương hồng đào pastel */}
                <polygon points="0,390 180,310 400,390" fill="#FED2B7" opacity="0.5" />
                <polygon points="210,390 460,290 710,390" fill="#FFC8B8" opacity="0.4" />
                <polygon points="580,390 790,320 1000,390" fill="#FED2B7" opacity="0.5" />

                {/* Tầng tầng lớp lớp mây ngũ sắc hồng cam pastel cuộn sóng */}
                {/* Lớp mây xa */}
                <path
                  d="M 0 350 Q 150 300 320 350 Q 480 310 650 355 Q 820 305 1000 350 L 1000 600 L 0 600 Z"
                  fill="url(#cloud-pastel-1)"
                />
                {/* Lớp mây giữa */}
                <path
                  d="M 0 405 Q 180 355 370 410 Q 560 360 740 415 Q 880 370 1000 410 L 1000 600 L 0 600 Z"
                  fill="url(#cloud-pastel-2)"
                />
                {/* Lớp mây gần cuộn sóng viền vàng kem mềm mại */}
                <path
                  d="M 0 475 Q 150 430 330 480 Q 510 435 690 485 Q 850 440 1000 480 L 1000 600 L 0 600 Z"
                  fill="#FFFFE3"
                  opacity="0.95"
                />

                {/* Viền sóng mây cuộn cổ điển dát ngọc */}
                <path d="M 40 460 Q 95 440 150 460" stroke="#FED2B7" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 230 468 Q 295 445 360 468" stroke="#FED2B7" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 660 472 Q 725 450 790 472" stroke="#FED2B7" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 450 485 Q 510 465 570 485" stroke="#FED2B7" strokeWidth="2.5" fill="none" opacity="0.8" />
              </svg>

              {/* Bụi tiên kim sắc vàng kem lơ lửng */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FFFFE3] rounded-full animate-ping opacity-85" />
              <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 bg-[#FED2B7] rounded-full animate-ping opacity-75" style={{ animationDelay: '1.2s' }} />
              <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-[#FFFFE3] rounded-full animate-pulse opacity-90" style={{ animationDelay: '0.6s' }} />
              <div className="absolute top-2/5 right-1/3 w-2 h-2 bg-[#FFFEE0] rounded-full animate-pulse opacity-80" style={{ animationDelay: '1.8s' }} />
            </div>
          )}

          {/* ================= CẢNH 2: SƠN THẦN TẾ ĐÀN (RỪNG THIÊNG NẮNG VÀNG) ================= */}
          {sceneId === 'son-than' && (
            <div className="w-full h-full relative">
              {/* Nền đại ngàn rừng xanh ngọc bích sáng rực rỡ với thiên quang */}
              <div className="w-full h-full bg-gradient-to-b from-[#047857] via-[#0d9488] to-[#10b981]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Luồng thiên quang vàng rọi từ đỉnh trời */}
                <polygon points="460,0 540,0 640,360 360,360" fill="url(#sun-beam)" opacity="0.35" />
                <defs>
                  <linearGradient id="sun-beam" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Vách núi sừng sững xanh ngọc hai bên */}
                <polygon points="0,600 0,260 120,380 80,600" fill="#047857" opacity="0.85" />
                <polygon points="1000,600 1000,240 860,390 920,600" fill="#047857" opacity="0.85" />

                {/* Dãy núi xanh ngọc trùng điệp */}
                <polygon points="60,600 180,340 320,600" fill="#065f46" />
                <polygon points="680,600 820,330 950,600" fill="#065f46" />

                {/* Tế đàn Trống Thiêng khổng lồ mờ ảo ở trung tâm hậu cảnh */}
                <ellipse cx="500" cy="420" rx="220" ry="45" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="3" />
                <ellipse cx="500" cy="420" rx="160" ry="30" fill="#fed7aa" stroke="#b45309" strokeWidth="2" />
                <ellipse cx="500" cy="420" rx="60" ry="12" fill="#fef08a" opacity="0.6" />

                {/* Các dải lụa ngũ sắc uốn lượn bay bổng quanh tế đàn */}
                <path d="M 120 300 Q 280 160 500 320 Q 720 480 880 260" stroke="#f59e0b" strokeWidth="5" fill="none" opacity="0.85" />
                <path d="M 80 400 Q 320 220 500 420 Q 680 180 920 380" stroke="#ef4444" strokeWidth="4" fill="none" opacity="0.8" />
                <path d="M 180 500 Q 380 340 500 440 Q 640 560 840 460" stroke="#06b6d4" strokeWidth="4" fill="none" opacity="0.75" />
              </svg>

              {/* Tia chớp sấm thiêng chớp nhẹ */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-32 opacity-25">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-yellow-300 stroke-2 fill-none">
                  <polyline points="50,0 45,40 60,42 42,100" />
                </svg>
              </div>
            </div>
          )}

          {/* ================= CẢNH 3: CỬU LONG CUỐN THƯ (UY NGHIÊM RỒNG PHƯỢNG) ================= */}
          {sceneId === 'cuu-long' && (
            <div className="w-full h-full relative">
              {/* Nền xanh ngọc bích sáng quý phái kết hợp hoàng kim rực rỡ */}
              <div className="w-full h-full bg-gradient-to-b from-[#059669] via-[#0d9488] to-[#14b8a6]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Vầng thái dương hào quang ở giữa */}
                <circle cx="500" cy="200" r="75" fill="#fef08a" opacity="0.8" />
                <circle cx="500" cy="200" r="105" fill="#fde047" opacity="0.25" />

                {/* Họa tiết rồng chầu bên trái */}
                <path
                  d="M 220 180 Q 280 120 340 180 Q 400 240 320 320 Q 240 380 180 300 Q 140 220 220 180 Z"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="330" cy="170" r="6" fill="#fef08a" />

                {/* Họa tiết phượng múa bên phải */}
                <path
                  d="M 780 180 Q 720 120 660 180 Q 600 240 680 320 Q 760 380 820 300 Q 860 220 780 180 Z"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="670" cy="170" r="6" fill="#fef08a" />

                {/* Dải Cuốn Thư Hoàng Gia dát vàng uốn lượn rực rỡ qua tiền cảnh */}
                <path
                  d="M 0 380 Q 280 240 500 360 Q 720 480 1000 280"
                  stroke="#fef08a"
                  strokeWidth="24"
                  fill="none"
                  opacity="0.85"
                />
                <path
                  d="M 0 380 Q 280 240 500 360 Q 720 480 1000 280"
                  stroke="#d97706"
                  strokeWidth="28"
                  fill="none"
                  opacity="0.4"
                />
                {/* Viền lụa ngọc bích trên cuốn thư */}
                <path
                  d="M 0 368 Q 280 228 500 348 Q 720 468 1000 268"
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.8"
                />

                {/* Sương khói hoàng triều lan tỏa dưới đáy */}
                <rect x="0" y="480" width="1000" height="120" fill="url(#gold-mist)" opacity="0.65" />
                <defs>
                  <linearGradient id="gold-mist" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0" />
                    <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          {/* ================= CẢNH 4: SẢNH CUNG ĐÌNH HOÀNG GIA ================= */}
          {sceneId === 'cung-dinh' && (
            <div className="w-full h-full relative">
              {/* Nền hoàng triều đại nội: Đỏ nhung cung đình kết hợp vàng hoàng kim sáng lạn */}
              <div className="w-full h-full bg-gradient-to-b from-[#991b1b] via-[#c2410c] to-[#f59e0b]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Vầng nhật nguyệt đại triều chiếu sáng chánh điện */}
                <circle cx="500" cy="160" r="90" fill="#fef08a" opacity="0.6" />
                <circle cx="500" cy="160" r="130" fill="#fde047" opacity="0.15" />

                {/* Mái ngói cung điện hoàng gia xa xa */}
                <path d="M 150 240 Q 500 160 850 240 L 880 270 L 120 270 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 250 210 Q 500 140 750 210 L 770 235 L 230 235 Z" fill="#78350f" stroke="#fef08a" strokeWidth="1.5" />

                {/* Đỉnh mái chạm rồng lưỡng long chầu nhật */}
                <circle cx="500" cy="140" r="10" fill="#fef08a" />
                <path d="M 460 148 Q 480 135 500 140 Q 520 135 540 148" stroke="#f59e0b" strokeWidth="3" fill="none" />

                {/* Hai cột gỗ lim đại triều sơn son thếp vàng hai bên */}
                <rect x="60" y="160" width="46" height="440" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="2.5" />
                <rect x="74" y="180" width="18" height="400" fill="#991b1b" stroke="#fef08a" strokeWidth="1" />
                {/* Họa tiết rồng uốn lượn quanh cột trái */}
                <path d="M 60 220 Q 90 240 60 270 Q 90 300 60 340 Q 90 380 60 420 Q 90 460 60 510" stroke="#fef08a" strokeWidth="2.5" fill="none" opacity="0.75" />

                <rect x="894" y="160" width="46" height="440" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="2.5" />
                <rect x="908" y="180" width="18" height="400" fill="#991b1b" stroke="#fef08a" strokeWidth="1" />
                {/* Họa tiết rồng quanh cột phải */}
                <path d="M 940 220 Q 910 240 940 270 Q 910 300 940 340 Q 910 380 940 420 Q 910 460 940 510" stroke="#fef08a" strokeWidth="2.5" fill="none" opacity="0.75" />

                {/* Rèm nhung cung đình buông rủ hai bên đỉnh */}
                <path d="M 0 0 L 160 0 Q 120 120 0 160 Z" fill="#991b1b" opacity="0.85" />
                <path d="M 1000 0 L 840 0 Q 880 120 1000 160 Z" fill="#991b1b" opacity="0.85" />

                {/* Thềm ngọc chánh điện và thảm đỏ hoàng triều */}
                <polygon points="0,600 240,460 760,460 1000,600" fill="#1e293b" />
                <polygon points="340,600 420,460 580,460 660,600" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.5" />
                
                {/* Họa tiết gạch hoàng cung hoa chanh cổ điển */}
                <line x1="280" y1="520" x2="720" y2="520" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
                <line x1="220" y1="560" x2="780" y2="560" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
              </svg>

              {/* Lụa vàng hoàng triều lơ lửng */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#fef08a] rounded-full animate-ping opacity-75" />
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#fde047] rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }} />
            </div>
          )}

          {/* ================= CẢNH 5: ĐẦM SEN CHẠNG VẠNG (DÂN GIAN BẮC BỘ) ================= */}
          {sceneId === 'dam-sen' && (
            <div className="w-full h-full relative">
              {/* Nền đầm sen rạng rỡ: Hồng đào ngọc bích chuyển cam vàng nắng chiều */}
              <div className="w-full h-full bg-gradient-to-b from-[#fb7185] via-[#f472b6] to-[#fde047]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Vầng dương đỏ chiều tà lặn dần */}
                <circle cx="500" cy="240" r="85" fill="#f43f5e" opacity="0.85" />
                <circle cx="500" cy="240" r="110" fill="#fb7185" opacity="0.3" />

                {/* Dãy núi xa xa mờ ảo chân trời */}
                <polygon points="0,360 220,290 480,360" fill="#701a75" opacity="0.6" />
                <polygon points="400,360 680,270 940,360" fill="#581c87" opacity="0.55" />
                <polygon points="760,360 900,300 1000,360" fill="#701a75" opacity="0.6" />

                {/* Mặt nước đầm sen lấp lánh phản chiếu ráng chiều */}
                <rect x="0" y="360" width="1000" height="240" fill="#042f2e" opacity="0.9" />
                <ellipse cx="500" cy="380" rx="300" ry="16" fill="#f43f5e" opacity="0.25" />
                <ellipse cx="500" cy="420" rx="200" ry="10" fill="#fb7185" opacity="0.2" />

                {/* Cầu tre khỉ uốn lượn mộc mạc bên trái */}
                <path d="M 0 440 Q 140 380 280 440" stroke="#78350f" strokeWidth="8" fill="none" />
                <path d="M 0 425 Q 140 365 280 425" stroke="#92400e" strokeWidth="3" fill="none" />
                {/* Cọc tre cắm xuống nước */}
                <line x1="70" y1="415" x2="65" y2="520" stroke="#5c2007" strokeWidth="4" />
                <line x1="140" y1="395" x2="135" y2="540" stroke="#5c2007" strokeWidth="4" />
                <line x1="210" y1="415" x2="205" y2="520" stroke="#5c2007" strokeWidth="4" />

                {/* Các phiến lá sen ngọc bích xum xuê trên mặt nước */}
                <ellipse cx="180" cy="510" rx="60" ry="18" fill="#065f46" stroke="#047857" strokeWidth="2" />
                <ellipse cx="360" cy="480" rx="55" ry="16" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                <ellipse cx="680" cy="490" rx="75" ry="20" fill="#065f46" stroke="#047857" strokeWidth="2" />
                <ellipse cx="850" cy="520" rx="65" ry="18" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                <ellipse cx="500" cy="550" rx="90" ry="24" fill="#064e3b" stroke="#34d399" strokeWidth="2" />

                {/* Búp sen và hoa sen hồng ngát hương */}
                {/* Hoa sen nở bên trái */}
                <circle cx="160" cy="470" r="16" fill="#f43f5e" />
                <circle cx="160" cy="470" r="8" fill="#fef08a" />
                {/* Hoa sen nở bên phải */}
                <circle cx="820" cy="480" r="18" fill="#f43f5e" />
                <circle cx="820" cy="480" r="9" fill="#fef08a" />
                {/* Búp sen vươn cao */}
                <path d="M 330 460 C 325 440, 335 440, 330 460 Z" stroke="#e11d48" strokeWidth="8" fill="#fda4af" />
                <line x1="330" y1="460" x2="330" y2="500" stroke="#047857" strokeWidth="3" />
              </svg>

              {/* Đom đóm mùa hạ lập lòe đầm sen */}
              <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#a3e635] rounded-full animate-ping opacity-85" />
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#fef08a] rounded-full animate-ping opacity-80" style={{ animationDelay: '1.2s' }} />
              <div className="absolute bottom-1/2 right-1/3 w-1.5 h-1.5 bg-[#67e8f9] rounded-full animate-ping opacity-75" style={{ animationDelay: '2.1s' }} />
            </div>
          )}

          {/* ================= CẢNH 6: PHỐ CỔ HỘI AN LỄ HỘI ĐÊM ================= */}
          {sceneId === 'hoi-an' && (
            <div className="w-full h-full relative">
              {/* Nền đêm hội sông Hoài: Lam ngọc sáng lung linh ánh đèn hoa đăng rực rỡ */}
              <div className="w-full h-full bg-gradient-to-b from-[#1e3a8a] via-[#2563eb] to-[#38bdf8]" />

              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 1000 600"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Vầng trăng khuyết và ngàn sao trên bầu trời đêm */}
                <path d="M 820 80 A 30 30 0 1 0 850 130 A 24 24 0 1 1 820 80 Z" fill="#fef08a" opacity="0.9" />
                <circle cx="150" cy="60" r="1.5" fill="#fff" opacity="0.8" />
                <circle cx="340" cy="80" r="1.5" fill="#fff" opacity="0.7" />
                <circle cx="620" cy="50" r="2" fill="#fff" opacity="0.9" />
                <circle cx="720" cy="95" r="1" fill="#fff" opacity="0.6" />

                {/* Dãy nhà cổ tường vàng nghệ mái ngói âm dương rêu phong hai bên */}
                {/* Dãy nhà trái */}
                <polygon points="0,260 160,200 240,240 240,460 0,460" fill="#ca8a04" stroke="#78350f" strokeWidth="2" />
                <path d="M -10 260 L 160 190 L 250 235" stroke="#451a03" strokeWidth="6" fill="none" />
                <rect x="30" y="280" width="36" height="48" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
                <rect x="36" y="286" width="24" height="36" fill="#fef08a" opacity="0.75" />

                {/* Dãy nhà phải */}
                <polygon points="1000,260 840,195 760,240 760,460 1000,460" fill="#ca8a04" stroke="#78350f" strokeWidth="2" />
                <path d="M 1010 260 L 840 185 L 750 235" stroke="#451a03" strokeWidth="6" fill="none" />
                <rect x="880" y="280" width="36" height="48" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
                <rect x="886" y="286" width="24" height="36" fill="#fef08a" opacity="0.75" />

                {/* Dây giăng đèn lồng phố cổ vắt ngang trời */}
                <path d="M 0 180 Q 250 240 500 210 Q 750 240 1000 180" stroke="#78350f" strokeWidth="1.5" fill="none" />
                
                {/* Các lồng đèn ngũ sắc treo trên dây */}
                {/* Đèn đỏ */}
                <ellipse cx="140" cy="215" rx="10" ry="13" fill="#dc2626" stroke="#fef08a" strokeWidth="1" />
                <ellipse cx="280" cy="235" rx="9" ry="12" fill="#eab308" stroke="#fef08a" strokeWidth="1" />
                <ellipse cx="420" cy="225" rx="10" ry="13" fill="#0284c7" stroke="#fef08a" strokeWidth="1" />
                <ellipse cx="580" cy="225" rx="10" ry="13" fill="#ea580c" stroke="#fef08a" strokeWidth="1" />
                <ellipse cx="720" cy="235" rx="9" ry="12" fill="#16a34a" stroke="#fef08a" strokeWidth="1" />
                <ellipse cx="860" cy="215" rx="10" ry="13" fill="#dc2626" stroke="#fef08a" strokeWidth="1" />

                {/* Sông Hoài phẳng lặng ở trung tâm */}
                <polygon points="180,440 820,440 1000,600 0,600" fill="#09182a" />
                <ellipse cx="500" cy="460" rx="260" ry="12" fill="#1e3a5f" opacity="0.6" />

                {/* Hoa đăng bập bềnh trôi trên mặt nước sông Hoài */}
                <polygon points="340,490 355,475 370,490 355,496" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
                <circle cx="355" cy="483" r="2.5" fill="#fff" className="animate-pulse" />

                <polygon points="510,520 528,502 546,520 528,528" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
                <circle cx="528" cy="512" r="3.5" fill="#fff" className="animate-pulse" />

                <polygon points="680,480 692,468 704,480 692,485" fill="#ec4899" stroke="#fef08a" strokeWidth="1" />
                <circle cx="692" cy="475" r="2.5" fill="#fff" className="animate-pulse" />
              </svg>

              {/* Ánh sáng lung linh của đêm hội hoa đăng */}
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#fef08a] rounded-full animate-ping opacity-75" />
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#f97316] rounded-full animate-ping opacity-70" style={{ animationDelay: '1.5s' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
