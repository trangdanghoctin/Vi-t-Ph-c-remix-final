import React, { useEffect } from 'react';
import { Costume } from '../types.ts';
import { retroAudio } from '../utils/audio.ts';

interface AnatomyModalProps {
  costume: Costume;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const AnatomyModal: React.FC<AnatomyModalProps> = ({
  costume,
  onClose,
  theme = 'light',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        retroAudio.playBlip(300);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl border-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4 md:p-6 relative max-h-[90vh] overflow-y-auto wardrobe-scroll font-['Be_Vietnam_Pro','Nunito',sans-serif] ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314] shadow-[0_16px_50px_rgba(90,45,45,0.2)]'
            : 'bg-[#050B31] border-2 border-[#1F3C73] text-[#FFFFFF]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${
            theme === 'light' ? 'border-[#FED2B7]' : 'border-[#1F3C73]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3
              className={`text-base md:text-lg font-bold font-['VT323','Silkscreen',monospace] uppercase tracking-wider ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
              }`}
            >
              HỒ SƠ CẤU TẠO MAY MẶC: {costume.name.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={() => {
              retroAudio.playBlip(300);
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center bg-[#b91c1c] hover:bg-[#dc2626] border border-[#FED2B7] text-white font-bold cursor-pointer active:scale-95 transition-all"
            title="Đóng (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Historical Context lore */}
        <div
          className={`p-3.5 border-2 mb-4 shadow-xs ${
            theme === 'light'
              ? 'bg-white/90 border-[#FED2B7]'
              : 'bg-[#0E2045]/80 border-[#1F3C73]'
          }`}
        >
          <h4
            className={`text-xs font-bold font-['VT323','Silkscreen',monospace] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
              theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'
            }`}
          >
            <span>⚜</span> NGUỒN GỐC & ĐIỂN CHẾ TRIỀU ĐẠI
          </h4>
          <p
            className={`text-xs leading-[1.6] ${
              theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]'
            }`}
          >
            {costume.historyLore}
          </p>
        </div>

        {/* 4 Architectural Aspects of the Costume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* 1. Cổ áo */}
          <div
            className={`p-3 border-2 transition-colors ${
              theme === 'light'
                ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                : 'bg-[#0E2045]/60 border-[#1F3C73] hover:border-[#FFF3CB]'
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-1.5 text-xs font-bold font-['Be_Vietnam_Pro',sans-serif] ${
                theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'
              }`}
            >
              <span>👔</span> CỔ ÁO (CỔ LĨNH)
            </div>
            <p
              className={`text-xs leading-relaxed ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#CBD5E1]'
              }`}
            >
              {costume.anatomy.collar}
            </p>
          </div>

          {/* 2. Ống tay */}
          <div
            className={`p-3 border-2 transition-colors ${
              theme === 'light'
                ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                : 'bg-[#0E2045]/60 border-[#1F3C73] hover:border-[#FFF3CB]'
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-1.5 text-xs font-bold font-['Be_Vietnam_Pro',sans-serif] ${
                theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'
              }`}
            >
              <span>🥋</span> TAY ÁO (TAY THỤNG / CHẼN)
            </div>
            <p
              className={`text-xs leading-relaxed ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#CBD5E1]'
              }`}
            >
              {costume.anatomy.sleeves}
            </p>
          </div>

          {/* 3. Thân áo & Khuy cài */}
          <div
            className={`p-3 border-2 transition-colors ${
              theme === 'light'
                ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                : 'bg-[#0E2045]/60 border-[#1F3C73] hover:border-[#FFF3CB]'
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-1.5 text-xs font-bold font-['Be_Vietnam_Pro',sans-serif] ${
                theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'
              }`}
            >
              <span>🪡</span> THÂN ÁO & KHUY CÀI (NGŨ THÂN)
            </div>
            <p
              className={`text-xs leading-relaxed ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#CBD5E1]'
              }`}
            >
              {costume.anatomy.panels}
            </p>
          </div>

          {/* 4. Phụ kiện đi kèm */}
          <div
            className={`p-3 border-2 transition-colors ${
              theme === 'light'
                ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                : 'bg-[#0E2045]/60 border-[#1F3C73] hover:border-[#FFF3CB]'
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-1.5 text-xs font-bold font-['Be_Vietnam_Pro',sans-serif] ${
                theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'
              }`}
            >
              <span>👑</span> PHỤ KIỆN KÈM THEO
            </div>
            <p
              className={`text-xs leading-relaxed ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#CBD5E1]'
              }`}
            >
              {costume.anatomy.accessories}
            </p>
          </div>
        </div>

        {/* Special Focus on Ngũ Thân Philosophy */}
        <div
          className={`p-3 border-2 text-[11px] mb-4 ${
            theme === 'light'
              ? 'bg-[#FED2B7]/35 border-[#FFBFA0] text-[#5C2E1B]'
              : 'bg-[#050B31] border-[#1F3C73] text-[#CBD5E1]'
          }`}
        >
          <strong className={theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#fef08a]'}>
            Ý nghĩa triết lý phương Đông trong Việt Phục:
          </strong>{' '}
          Áo ngũ thân tượng trưng cho đạo làm người: bốn thân ngoài che chở tứ thân phụ mẫu (cha mẹ
          ruột và cha mẹ vợ/chồng), thân con bên trong thể hiện bản thân người mặc được nâng đỡ. Năm
          chiếc khuy cài tượng trưng cho năm đức tính của người quân tử: Nhân - Lễ - Nghĩa - Trí - Tín.
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              retroAudio.playBlip(300);
              onClose();
            }}
            className={`px-5 py-2 font-bold text-xs uppercase cursor-pointer border-2 transition-all active:scale-95 ${
              theme === 'light'
                ? 'bg-[#FED2B7] hover:bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0]'
                : 'bg-[#0E2045] hover:bg-[#1F3C73] text-[#FFF3CB] border-[#1F3C73]'
            }`}
          >
            Đóng Hộp Thoại [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
