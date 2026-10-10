/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimeTravelNode, unlockPassportStamp, PassportData } from '../data/timeTravelData.ts';
import { retroAudio } from '../utils/audio.ts';

interface BadgeUnlockModalProps {
  node: TimeTravelNode;
  onClose: () => void;
  onStampCollected: (result: {
    isNew: boolean;
    totalUnlocked: number;
    isComplete: boolean;
    passport: PassportData;
  }) => void;
  onTryOutfit?: (costumeId: string) => void;
  theme?: 'light' | 'dark';
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  node,
  onClose,
  onStampCollected,
  onTryOutfit,
  theme = 'light',
}) => {
  const [isStamped, setIsStamped] = useState(false);
  const [stampAnimation, setStampAnimation] = useState(false);

  const handleCollectStamp = () => {
    if (isStamped) return;
    setStampAnimation(true);
    retroAudio.playStampSuccess();

    setTimeout(() => {
      setIsStamped(true);
      const result = unlockPassportStamp(node);
      onStampCollected(result);
    }, 450);
  };

  const getStampColorClasses = (type: string) => {
    switch (type) {
      case 'dan-gian':
        return 'from-amber-700 via-amber-600 to-yellow-600 border-amber-400 text-amber-100 shadow-[0_0_20px_rgba(217,119,6,0.6)]';
      case 'hoang-gia':
        return 'from-red-800 via-red-600 to-amber-600 border-yellow-300 text-yellow-100 shadow-[0_0_20px_rgba(220,38,38,0.6)]';
      case 'cung-dinh':
        return 'from-yellow-900 via-amber-700 to-yellow-600 border-amber-300 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.6)]';
      case 'pho-hoi':
        return 'from-orange-800 via-orange-600 to-amber-600 border-orange-300 text-orange-100 shadow-[0_0_20px_rgba(234,88,12,0.6)]';
      case 'tien-gioi':
      default:
        return 'from-purple-900 via-pink-700 to-indigo-700 border-pink-300 text-pink-100 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
    }
  };

  return (
    <div className="fixed inset-0 z-60 pointer-events-auto flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className={`relative w-full max-w-lg border-2 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-all ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
            : 'bg-[#0E2045] border-[#1F3C73] text-[#FFFFFF]'
        }`}
      >
        {/* Thanh tiêu đề Cổ Phong */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between ${
            theme === 'light'
              ? 'bg-[#FED2B7]/60 border-[#FED2B7] text-[#3D2314]'
              : 'bg-[#050B31] border-[#1F3C73] text-[#FFF3CB]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">✨</span>
            <div>
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-amber-600 dark:text-amber-400">
                DU HÀNH VIỆT PHỤC • CHẶNG {node.order}/5
              </h3>
              <h4 className="text-sm sm:text-base font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif]">
                {node.name}
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playBlip(360);
              onClose();
            }}
            className="w-6 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs border border-amber-300 active:scale-95 cursor-pointer shadow-xs"
            title="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Banner Địa Điểm & Niên Đại */}
          <div
            className={`p-3 border flex flex-col gap-1 rounded-none ${
              theme === 'light'
                ? 'bg-[#FFFEE0] border-[#FED2B7]'
                : 'bg-[#050B31]/70 border-[#1F3C73]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 dark:text-amber-300 font-semibold">
              <span>🏛️ {node.landmark}</span>
              <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-xs">
                {node.era}
              </span>
            </div>
            <p className="text-xs italic opacity-90">{node.subtitle}</p>
          </div>

          {/* VÙNG CON DẤU DI SẢN (STAMP SPOTLIGHT) */}
          <div className="flex flex-col items-center justify-center py-2 relative">
            <div
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center p-2 text-center transition-transform duration-300 bg-gradient-to-br ${getStampColorClasses(
                node.stamp.stampType
              )} ${
                stampAnimation
                  ? 'scale-115 rotate-[-6deg] animate-pulse ring-4 ring-yellow-400'
                  : 'hover:scale-105'
              }`}
            >
              {/* Vòng viền răng cưa hoa văn cổ */}
              <div className="absolute inset-1 border border-dashed border-white/60 rounded-full pointer-events-none" />

              <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-pulse">
                {node.stamp.symbol}
              </span>
              <span className="text-[9px] font-black tracking-widest uppercase font-mono mt-1 px-1 bg-black/30 rounded-xs text-yellow-200">
                {node.stamp.sealText}
              </span>
              <span className="text-[7.5px] font-bold tracking-tighter uppercase opacity-85 mt-0.5">
                {node.region}
              </span>

              {isStamped && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 border border-white rounded-full shadow-md animate-bounce">
                  ✓ ĐÃ ĐÓNG DẤU
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                CON DẤU DI SẢN: {node.stamp.title}
              </span>
              <p className="text-[11px] opacity-80 mt-0.5 max-w-sm">{node.stamp.description}</p>
            </div>
          </div>

          {/* KIẾN THỨC LỊCH SỬ & NÉT ĐẸP CỔ PHỤC */}
          <div
            className={`p-3.5 border space-y-2 text-xs leading-relaxed ${
              theme === 'light'
                ? 'bg-[#FED2B7]/20 border-[#FED2B7]'
                : 'bg-[#1F3C73]/30 border-[#1F3C73]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
              <span>📜</span>
              <span>KIẾN THỨC DI SẢN & NÉT ĐẸP VIỆT PHỤC</span>
            </div>

            <p className="text-justify font-medium">{node.knowledge.historyLore}</p>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-1.5">
              <span className="font-semibold text-[11px] text-amber-800 dark:text-amber-200">
                ✨ Y phục gợi ý: <strong>{node.knowledge.costumeHighlight}</strong>
              </span>

              {onTryOutfit && (
                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playEquip();
                    onTryOutfit(node.knowledge.recommendedCostumeId);
                  }}
                  className="px-2 py-0.5 text-[10.5px] font-bold bg-amber-600 hover:bg-amber-500 text-white border border-amber-300 active:scale-95 cursor-pointer shadow-xs transition-all"
                >
                  👘 Mặc Thử Ngay
                </button>
              )}
            </div>

            <div className="italic text-[10.5px] text-center pt-1 opacity-80 text-amber-900 dark:text-amber-100">
              {node.knowledge.quote}
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div
          className={`px-4 py-3 border-t flex items-center justify-between gap-2 ${
            theme === 'light'
              ? 'bg-[#FED2B7]/30 border-[#FED2B7]'
              : 'bg-[#050B31] border-[#1F3C73]'
          }`}
        >
          <button
            onClick={() => {
              retroAudio.playBlip(360);
              onClose();
            }}
            className={`px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-600 text-stone-200'
            }`}
          >
            Đóng Lại
          </button>

          <button
            onClick={handleCollectStamp}
            disabled={isStamped}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 flex items-center gap-2 cursor-pointer shadow-md transition-all active:translate-y-0.5 ${
              isStamped
                ? 'bg-green-700 border-green-400 text-white cursor-default opacity-90'
                : 'bg-gradient-to-r from-red-600 via-amber-600 to-red-700 hover:from-red-500 hover:to-amber-500 text-white border-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
            }`}
          >
            <span>{isStamped ? '✓ ĐÃ LƯU VÀO PASSPORT' : '💮 ĐÓNG DẤU VÀO HỘ CHIẾU'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
