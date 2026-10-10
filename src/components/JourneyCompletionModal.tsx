/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { PassportData, TRAVEL_NODES } from '../data/timeTravelData.ts';
import { retroAudio } from '../utils/audio.ts';

interface JourneyCompletionModalProps {
  passport: PassportData;
  onOpenPassport: () => void;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const JourneyCompletionModal: React.FC<JourneyCompletionModalProps> = ({
  passport,
  onOpenPassport,
  onClose,
  theme = 'light',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Phát khúc khải hoàn khi bảng chúc mừng xuất hiện
    retroAudio.playJourneyCompleteFanfare();
  }, []);

  // Vẽ và tải về Chứng Nhận Thẻ Đại Sứ Việt Phục Di Sản
  const handleDownloadCertificate = () => {
    retroAudio.playStampSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Nền hoàng gia gấm lụa
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000);
    bgGrad.addColorStop(0, '#1E100B');
    bgGrad.addColorStop(0.5, '#351C12');
    bgGrad.addColorStop(1, '#1A0C08');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Khung viền thếp vàng hoàng gia đôi
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 740, 940);
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 716, 916);

    // Họa tiết 4 góc cổ phong
    const cornerSize = 40;
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(x, y, cornerSize, 6);
      ctx.fillRect(x, y, 6, cornerSize);
    };
    drawCorner(50, 50);
    drawCorner(710, 50);
    drawCorner(50, 910);
    drawCorner(710, 910);

    // Tiêu đề
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('✦ ĐẠI VIỆT CỔ PHONG • HỘ CHIẾU DI SẢN ✦', 400, 100);

    ctx.fillStyle = '#FFF3CB';
    ctx.font = 'bold 36px serif';
    ctx.fillText('CHỨNG NHẬN VINH DANH', 400, 150);

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 44px serif';
    ctx.fillText('ĐẠI SỨ VIỆT PHỤC DI SẢN', 400, 210);

    // Dòng giới thiệu
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '18px sans-serif';
    ctx.fillText('Trân trọng ghi nhận và trao tặng danh xưng cao quý cho:', 400, 270);

    // Tên Lữ Khách
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(passport.holderName || 'Lữ Khách Phương Nam', 400, 320);

    // Mã số Passport & Ngày hoàn thành
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`MÃ HỘ CHIẾU: ${passport.passportId}  •  NGÀY HOÀN THÀNH: ${passport.completedDate || new Date().toLocaleDateString('vi-VN')}`, 400, 360);

    // Đường kẻ phân cách
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 390);
    ctx.lineTo(650, 390);
    ctx.stroke();

    // Văn bia ghi nhận
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'italic 16px serif';
    ctx.fillText('“Đã hoàn thành xuất sắc 5 chặng du hành qua các thời kỳ lịch sử,', 400, 430);
    ctx.fillText('sưu tầm trọn vẹn 5 Con Dấu Di Sản và lan tỏa nét đẹp Việt Phục ngàn năm.”', 400, 460);

    // VẼ 5 CON DẤU THỰC TẾ LÊN CHỨNG NHẬN
    const stampRadius = 45;
    const startX = 140;
    const gapX = 130;
    const stampY = 570;

    TRAVEL_NODES.forEach((node, idx) => {
      const cx = startX + idx * gapX;
      // Vòng tròn con dấu
      ctx.beginPath();
      ctx.arc(cx, stampY, stampRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#7F1D1D';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FDE047';
      ctx.stroke();

      // Viền đứt nét
      ctx.beginPath();
      ctx.arc(cx, stampY, stampRadius - 6, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#FEF08A';
      ctx.stroke();
      ctx.setLineDash([]);

      // Icon biểu tượng
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.stamp.symbol, cx, stampY + 8);

      // Tên ngắn con dấu
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#FEF08A';
      ctx.fillText(node.name, cx, stampY + stampRadius + 22);
    });

    // Huy hiệu Hoa sen Trung tâm dưới
    ctx.fillStyle = '#D4AF37';
    ctx.font = '40px sans-serif';
    ctx.fillText('🪷', 400, 750);

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 16px serif';
    ctx.fillText('BÁCH PHỤC DI SẢN • NGÀN NĂM VĂN HIẾN', 400, 795);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '13px monospace';
    ctx.fillText('Bản quyền số hóa: Việt Phục Pixel Art (AI Studio Build)', 400, 840);

    // Chuyển canvas thành file tải về
    const link = document.createElement('a');
    link.download = `Dai-Su-Viet-Phuc-${passport.passportId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-70 pointer-events-auto flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm select-none animate-fadeIn">
      {/* Hiệu ứng hạt bụi phấn tiên & lấp lánh pixel rơi */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#FEF08A', '#FDE047', '#F59E0B', '#F43F5E', '#A855F7'][
                Math.floor(Math.random() * 5)
              ],
              opacity: Math.random() * 0.8 + 0.2,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full max-w-xl border-4 p-5 sm:p-7 shadow-[0_0_80px_rgba(245,158,11,0.7)] text-center transition-all ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#D4AF37] text-[#3D2314]'
            : 'bg-[#0E2045] border-[#FDE047] text-[#FFFFFF]'
        }`}
      >
        {/* Nút đóng [X] */}
        <button
          onClick={() => {
            retroAudio.playBlip(360);
            onClose();
          }}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs border border-amber-300 active:scale-95 cursor-pointer shadow-sm"
          title="Đóng thông báo"
        >
          ✕
        </button>

        {/* Biểu tượng Vương miện / Long Ấn phát sáng */}
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-4 border-yellow-200 flex items-center justify-center shadow-[0_0_35px_rgba(234,179,8,0.8)] animate-pulse">
            <span className="text-4xl">👑</span>
          </div>
        </div>

        {/* Tiêu đề trang trọng */}
        <div className="space-y-1 mb-4">
          <span className="text-[11px] sm:text-xs font-bold font-mono tracking-widest uppercase text-amber-600 dark:text-yellow-300">
            ✦ HOÀN TẤT 100% ĐỊA ĐỒ DU HÀNH ✦
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-['VT323','Silkscreen',monospace] tracking-wide uppercase text-red-600 dark:text-yellow-300 drop-shadow-[1px_1px_0_#000]">
            CHÚC MỪNG BẠN ĐÃ KHÁM PHÁ THÀNH CÔNG ĐỊA ĐỒ VIỆT PHỤC!
          </h2>
        </div>

        {/* DANH XƯNG TRAO TẶNG */}
        <div
          className={`p-4 border-2 my-4 relative ${
            theme === 'light'
              ? 'bg-[#FED2B7]/40 border-[#D4AF37]'
              : 'bg-[#050B31]/90 border-[#D4AF37]'
          }`}
        >
          <p className="text-xs uppercase font-mono tracking-wider opacity-80">
            Trao tặng danh xưng danh dự:
          </p>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-yellow-300 my-1 font-serif tracking-wider">
            ĐẠI SỨ VIỆT PHỤC DI SẢN
          </div>
          <p className="text-xs font-medium leading-relaxed max-w-md mx-auto opacity-90">
            Ghi nhận lữ khách <strong>{passport.holderName || 'Bạn'}</strong> đã sưu tầm trọn bộ 5/5
            con dấu di sản qua các thời kỳ lịch sử: từ Dân Gian Bắc Bộ, Thăng Long ngàn năm, Cố Đô
            Huế, Phố Cổ Hội An đến Tiên Cảnh Bồng Lai!
          </p>
        </div>

        {/* Hàng 5 con dấu đã hoàn thành */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 my-2 overflow-x-auto">
          {TRAVEL_NODES.map((node) => (
            <div
              key={node.id}
              className="flex flex-col items-center gap-1 p-1.5 border border-amber-400 bg-amber-500/10 rounded-xs"
            >
              <span className="text-xl sm:text-2xl">{node.stamp.symbol}</span>
              <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-yellow-200">
                {node.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG (CTAs) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              retroAudio.playBlip(520);
              onOpenPassport();
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white border-2 border-yellow-200 shadow-md active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>🛂</span>
            <span>XEM TOÀN BỘ HỘ CHIẾU</span>
          </button>

          <button
            onClick={handleDownloadCertificate}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white border-2 border-amber-300 shadow-md active:translate-y-0.5 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>TẢI VỀ / CHIA SẺ HỘ CHIẾU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
