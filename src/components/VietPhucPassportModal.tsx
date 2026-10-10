/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PassportData,
  TRAVEL_NODES,
  updatePassportHolder,
  TimeTravelNode,
} from '../data/timeTravelData.ts';
import { Costume, ColorVariant, Accessory } from '../types.ts';
import { PixelCharacter } from './PixelCharacter.tsx';
import { retroAudio } from '../utils/audio.ts';

interface VietPhucPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: PassportData;
  onUpdatePassport: (updated: PassportData) => void;
  onOpenMapTravel?: () => void;
  // Current user equipped preview
  costume: Costume;
  activeVariant: ColorVariant;
  gender: 'female' | 'male';
  equippedAccessories: Accessory[];
  theme?: 'light' | 'dark';
}

export const VietPhucPassportModal: React.FC<VietPhucPassportModalProps> = ({
  isOpen,
  onClose,
  passport,
  onUpdatePassport,
  onOpenMapTravel,
  costume,
  activeVariant,
  gender,
  equippedAccessories,
  theme = 'light',
}) => {
  const [activeTab, setActiveTab] = useState<'stamps' | 'identity'>('stamps');
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<TimeTravelNode | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(passport.title || 'Lữ Khách Phương Nam');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const unlockedCount = Object.keys(passport.unlockedStamps).length;
  const totalCount = TRAVEL_NODES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const handleSaveTitle = () => {
    retroAudio.playBlip(540);
    const updated = updatePassportHolder(passport.holderName, editedTitle.trim() || 'Lữ Khách');
    onUpdatePassport(updated);
    setIsEditingTitle(false);
    setToastMsg('Đã cập nhật danh xưng thành công!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Tải ảnh thẻ hộ chiếu cá nhân bằng Canvas
  const handleExportPassportCard = () => {
    retroAudio.playStampSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 950;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nền hộ chiếu cổ phong son đỏ sẫm & vân vàng
    const grad = ctx.createLinearGradient(0, 0, 700, 950);
    grad.addColorStop(0, '#311008');
    grad.addColorStop(0.5, '#4B1A0E');
    grad.addColorStop(1, '#240B05');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 700, 950);

    // Viền khung
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(25, 25, 650, 900);
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 630, 880);

    // Quốc huy Hoa Sen Pixel
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('✦ CỘNG HÒA VĂN HIẾN • VIỆT PHỤC DI SẢN ✦', 350, 80);

    ctx.fillStyle = '#FFF3CB';
    ctx.font = 'bold 30px serif';
    ctx.fillText('HỘ CHIẾU DU HÀNH CỔ PHONG', 350, 125);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`SỐ HIỆU: ${passport.passportId}  •  TIẾN ĐỘ: ${unlockedCount}/5 (${progressPercent}%)`, 350, 160);

    // Thông tin lữ khách
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(passport.holderName || 'Lữ Khách Phương Nam', 350, 215);

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 18px serif';
    ctx.fillText(`DANH XƯNG: ${passport.title || 'Lữ Khách'}`, 350, 250);

    // Đường kẻ hoa văn
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 280);
    ctx.lineTo(580, 280);
    ctx.stroke();

    // Lưới con dấu trên ảnh
    const startY = 350;
    const itemHeight = 100;
    TRAVEL_NODES.forEach((node, idx) => {
      const isUnlocked = !!passport.unlockedStamps[node.id];
      const y = startY + idx * itemHeight;

      // Khung con dấu
      ctx.fillStyle = isUnlocked ? 'rgba(127, 29, 29, 0.4)' : 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(80, y - 35, 540, 75);
      ctx.strokeStyle = isUnlocked ? '#FDE047' : '#6B7280';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, y - 35, 540, 75);

      // Icon
      ctx.textAlign = 'left';
      ctx.font = '32px sans-serif';
      ctx.fillText(isUnlocked ? node.stamp.symbol : '🔒', 105, y + 15);

      // Tên địa điểm
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = isUnlocked ? '#FEF08A' : '#9CA3AF';
      ctx.fillText(node.name, 160, y);

      // Tình trạng & ngày
      ctx.font = '12px monospace';
      ctx.fillStyle = isUnlocked ? '#86EFAC' : '#6B7280';
      const statusText = isUnlocked
        ? `✓ ĐÃ MỞ KHÓA: ${passport.unlockedStamps[node.id].formattedDate}`
        : 'Chưa mở khóa (Hãy ghé thăm trên bản đồ)';
      ctx.fillText(statusText, 160, y + 24);
    });

    // Chân thẻ
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.font = '13px monospace';
    ctx.fillText('ĐỊA ĐỒ VIỆT PHỤC • DẤU ẤN DI SẢN VƯỢT THỜI GIAN', 350, 890);

    const link = document.createElement('a');
    link.download = `Viet-Phuc-Passport-${passport.passportId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-60 pointer-events-auto flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col border-4 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden transition-all ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
            : 'bg-[#0E2045] border-[#1F3C73] text-[#FFFFFF]'
        }`}
      >
        {/* ================= 1. HEADER CUỐN HỘ CHIẾU CỔ PHONG ================= */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            theme === 'light'
              ? 'bg-[#FED2B7]/80 border-[#FED2B7] text-[#3D2314]'
              : 'bg-[#050B31] border-[#1F3C73] text-[#FFF3CB]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse" role="img" aria-label="passport">
              🛂
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['VT323','Silkscreen',monospace] tracking-wider uppercase text-amber-700 dark:text-yellow-300">
                  VIỆT PHỤC PASSPORT
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-600/20 border border-amber-600/40 rounded-xs font-bold text-amber-800 dark:text-yellow-200">
                  {passport.passportId}
                </span>
              </div>
              <p className="text-[10.5px] font-medium opacity-85">
                Hộ Chiếu Di Sản Du Hành Cổ Phong • Lưu giữ con dấu qua các thời kỳ
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playBlip(360);
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs border border-amber-300 active:scale-95 cursor-pointer shadow-xs transition-all"
            title="Đóng hộ chiếu"
          >
            ✕
          </button>
        </div>

        {/* ================= 2. THANH TIẾN ĐỘ HÀNH TRÌNH (PROGRESS BAR) ================= */}
        <div
          className={`px-4 py-2 border-b flex flex-col gap-1.5 ${
            theme === 'light' ? 'bg-[#FFFEE0]' : 'bg-[#050B31]/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-yellow-300">
              <span>🌟 TIẾN ĐỘ THU THẬP:</span>
              <span className="text-sm font-black text-red-600 dark:text-yellow-200">
                {unlockedCount} / {totalCount} Con Dấu ({progressPercent}%)
              </span>
            </span>

            {passport.hasCompletedJourney ? (
              <span className="text-[10.5px] px-2 py-0.5 bg-yellow-400 text-black font-extrabold uppercase rounded-xs animate-pulse">
                👑 ĐẠI SỨ DI SẢN HOÀN THÀNH
              </span>
            ) : (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                Còn {totalCount - unlockedCount} địa điểm chưa khám phá
              </span>
            )}
          </div>

          {/* Bar track */}
          <div className="w-full h-3 bg-black/15 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-black/20 dark:border-white/20">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-700 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
        </div>

        {/* ================= 3. TABS CHUYỂN TRANG CUỐN HỘ CHIẾU ================= */}
        <div
          className={`flex items-center gap-1 px-4 py-1.5 border-b text-xs ${
            theme === 'light' ? 'bg-[#FED2B7]/20 border-[#FED2B7]' : 'bg-[#0E2045]/70 border-[#1F3C73]'
          }`}
        >
          <button
            onClick={() => {
              retroAudio.playBlip(480);
              setActiveTab('stamps');
            }}
            className={`px-3 py-1 font-bold text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stamps'
                ? theme === 'light'
                  ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-xs'
                  : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB] font-black shadow-xs'
                : 'opacity-70 hover:opacity-100 border-transparent'
            }`}
          >
            <span>💮</span>
            <span>BỘ SƯU TẬP CON DẤU ({unlockedCount}/{totalCount})</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playBlip(480);
              setActiveTab('identity');
            }}
            className={`px-3 py-1 font-bold text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'identity'
                ? theme === 'light'
                  ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-xs'
                  : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB] font-black shadow-xs'
                : 'opacity-70 hover:opacity-100 border-transparent'
            }`}
          >
            <span>🪪</span>
            <span>THẺ ĐỊNH DANH LỮ KHÁCH</span>
          </button>

          {onOpenMapTravel && (
            <button
              onClick={() => {
                retroAudio.playBlip(540);
                onClose();
                onOpenMapTravel();
              }}
              className="ml-auto px-2.5 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white border border-amber-300 rounded-xs shadow-xs active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-1"
            >
              <span>🧭</span>
              <span>Đến Bản Đồ Du Hành</span>
            </button>
          )}
        </div>

        {/* ================= 4. NỘI DUNG CUỐN HỘ CHIẾU ================= */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar">
          {/* TAB 1: BỘ SƯU TẬP CON DẤU (STAMP COLLECTION GRID) */}
          {activeTab === 'stamps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-700 dark:text-yellow-300">
                  📜 5 Ô Con Dấu Di Sản Đại Việt:
                </span>
                <span className="text-[11px] opacity-75 font-mono">
                  Nhấn vào con dấu đã mở để xem chi tiết
                </span>
              </div>

              {/* LƯỚI 5 Ô CON DẤU VUÔNG ĐẠI DIỆN CHO 5 ĐỊA ĐIỂM */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {TRAVEL_NODES.map((node) => {
                  const stampRecord = passport.unlockedStamps[node.id];
                  const isUnlocked = !!stampRecord;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        if (isUnlocked) {
                          retroAudio.playBlip(520);
                          setSelectedNodeDetails(node);
                        } else {
                          retroAudio.playBlip(280);
                        }
                      }}
                      className={`relative aspect-square p-2 border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                        isUnlocked
                          ? theme === 'light'
                            ? 'bg-[#FED2B7]/35 border-amber-600 hover:scale-103 shadow-md'
                            : 'bg-[#1F3C73]/40 border-yellow-400 hover:scale-103 shadow-md'
                          : 'bg-black/10 dark:bg-white/5 border-dashed border-gray-400/60 opacity-60 hover:opacity-80'
                      }`}
                    >
                      {/* Số thứ tự chặng */}
                      <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-gray-500 dark:text-gray-400">
                        #{node.order}
                      </span>

                      {/* Biểu tượng con dấu */}
                      <div className="my-auto flex flex-col items-center justify-center">
                        {isUnlocked ? (
                          <div className="relative">
                            <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                              {node.stamp.symbol}
                            </span>
                            <div className="absolute -bottom-1 -right-2 text-[8px] font-mono bg-red-600 text-white px-1 py-0.2 rounded-full border border-yellow-200">
                              ✓
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                            <span className="text-2xl sm:text-3xl">🔒</span>
                            <span className="text-[9px] font-mono uppercase mt-1">Chưa mở</span>
                          </div>
                        )}
                      </div>

                      {/* Tên & Ngày giờ */}
                      <div className="w-full">
                        <h4
                          className={`text-[10px] sm:text-[11px] font-bold font-['Be_Vietnam_Pro',sans-serif] truncate ${
                            isUnlocked
                              ? 'text-amber-800 dark:text-yellow-200 font-extrabold'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {node.name}
                        </h4>

                        {isUnlocked ? (
                          <p className="text-[8px] font-mono text-green-700 dark:text-green-300 truncate">
                            {stampRecord.formattedDate.split(' ')[0]}
                          </p>
                        ) : (
                          <p className="text-[8px] font-mono text-gray-400 italic truncate">
                            {node.region}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* KHUNG XEM CHI TIẾT CON DẤU ĐƯỢC CHỌN */}
              {selectedNodeDetails && (
                <div
                  className={`p-3.5 border-2 mt-4 space-y-2 animate-fadeIn ${
                    theme === 'light'
                      ? 'bg-[#FFFEE0] border-amber-500 text-[#3D2314]'
                      : 'bg-[#050B31] border-yellow-400 text-[#FFF3CB]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-1.5 border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedNodeDetails.stamp.symbol}</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-yellow-300">
                          {selectedNodeDetails.stamp.title}
                        </h4>
                        <span className="text-[10px] font-mono opacity-80">
                          {selectedNodeDetails.era} • {selectedNodeDetails.landmark}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedNodeDetails(null)}
                      className="text-xs px-2 py-0.5 border cursor-pointer hover:bg-black/10"
                    >
                      Đóng
                    </button>
                  </div>

                  <p className="text-xs font-medium leading-relaxed">
                    {selectedNodeDetails.knowledge.summary}
                  </p>

                  <div className="text-[11px] font-mono text-green-700 dark:text-green-300 flex items-center justify-between">
                    <span>
                      ✓ Ngày cấp con dấu:{' '}
                      {passport.unlockedStamps[selectedNodeDetails.id]?.formattedDate}
                    </span>
                    <span className="italic">{selectedNodeDetails.stamp.sealText}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRANG ĐỊNH DANH LỮ KHÁCH (IDENTITY PAGE) */}
          {activeTab === 'identity' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* CỘT TRÁI: AVATAR PIXEL ART NHÂN VẬT ĐANG MẶC ĐỒ */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-3 border-2 border-amber-500/50 bg-black/10 dark:bg-black/40">
                <div className="relative w-36 h-48 sm:w-44 sm:h-56 overflow-hidden flex items-center justify-center border border-amber-300/40 bg-radial from-amber-200/20 to-black/40">
                  <div className="scale-85 origin-center">
                    <PixelCharacter
                      costume={costume}
                      activeVariant={activeVariant}
                      gender={gender}
                      pose="idle"
                      zoom={0.9}
                      equippedAccessories={equippedAccessories}
                    />
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-yellow-300">
                    {costume.name}
                  </span>
                  <p className="text-[9.5px] font-mono opacity-80">
                    {gender === 'female' ? '👩 Nhân vật Nữ' : '👨 Nhân vật Nam'} • {costume.era}
                  </p>
                </div>
              </div>

              {/* CỘT PHẢI: THÔNG TIN HỘ CHIẾU & DANH XƯNG */}
              <div className="md:col-span-7 space-y-3">
                <div className="p-3 border space-y-2 bg-black/5 dark:bg-white/5">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 dark:text-gray-400">
                      Tên Lữ Khách / Chủ Hộ Chiếu:
                    </label>
                    <div className="text-base sm:text-lg font-bold font-serif text-amber-900 dark:text-yellow-200">
                      {passport.holderName || 'Khách Du Ngoạn'}
                    </div>
                  </div>

                  {/* Chỉnh sửa Danh xưng */}
                  <div>
                    <label className="text-[10px] font-mono uppercase text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>Danh Xưng Di Sản:</span>
                      {!isEditingTitle && (
                        <button
                          onClick={() => setIsEditingTitle(true)}
                          className="text-amber-600 dark:text-yellow-400 hover:underline cursor-pointer"
                        >
                          ✎ Đổi danh xưng
                        </button>
                      )}
                    </label>

                    {isEditingTitle ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          maxLength={30}
                          placeholder="Ví dụ: Nữ Quý Tộc, Lữ Khách Phương Nam..."
                          className="flex-1 px-2 py-1 text-xs border border-amber-400 bg-white dark:bg-black/50 text-black dark:text-white"
                        />
                        <button
                          onClick={handleSaveTitle}
                          className="px-2.5 py-1 text-xs font-bold bg-green-600 hover:bg-green-500 text-white border border-green-300 cursor-pointer"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setIsEditingTitle(false)}
                          className="px-2 py-1 text-xs border cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-amber-700 dark:text-yellow-300">
                        {passport.title || 'Lữ Khách Phương Nam'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono">
                    <div>
                      <span className="opacity-70 block text-[9.5px]">MÃ SỐ HỘ CHIẾU:</span>
                      <strong className="text-amber-800 dark:text-yellow-200">
                        {passport.passportId}
                      </strong>
                    </div>

                    <div>
                      <span className="opacity-70 block text-[9.5px]">NGÀY PHÁT HÀNH:</span>
                      <strong>{passport.issuedDate}</strong>
                    </div>
                  </div>
                </div>

                {toastMsg && (
                  <div className="p-2 text-xs text-green-700 dark:text-green-300 bg-green-500/10 border border-green-500/30 text-center animate-fadeIn">
                    ✓ {toastMsg}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= 5. FOOTER VỚI NÚT XUẤT ẢNH / TẢI VỀ ================= */}
        <div
          className={`px-4 py-2.5 border-t flex flex-wrap items-center justify-between gap-2 ${
            theme === 'light'
              ? 'bg-[#FED2B7]/30 border-[#FED2B7]'
              : 'bg-[#050B31] border-[#1F3C73]'
          }`}
        >
          <span className="text-[10.5px] font-mono opacity-80">
            Hộ Chiếu lưu trữ vĩnh viễn trên trình duyệt
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPassportCard}
              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white border border-yellow-300 shadow-sm active:translate-y-0.5 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>📥</span>
              <span>TẢI VỀ THẺ HỘ CHIẾU (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
