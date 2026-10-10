/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { PassportData, TRAVEL_NODES } from '../data/timeTravelData.ts';
import { retroAudio } from '../utils/audio.ts';

interface FloatingPassportWidgetProps {
  passport: PassportData;
  onClick: () => void;
  theme?: 'light' | 'dark';
}

export const FloatingPassportWidget: React.FC<FloatingPassportWidgetProps> = ({
  passport,
  onClick,
  theme = 'light',
}) => {
  const unlockedCount = Object.keys(passport.unlockedStamps || {}).length;
  const totalCount = TRAVEL_NODES.length;
  const isComplete = unlockedCount >= totalCount;

  // Vị trí kéo thả tự do (mặc định Bottom-Left)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  });

  // Thiết lập vị trí mặc định tại góc dưới bên trái (Bottom-Left)
  useEffect(() => {
    const setInitialPos = () => {
      const widgetHeight = 60;
      const defaultX = 20;
      const defaultY = Math.max(20, window.innerHeight - widgetHeight - 30);
      setPosition((prev) => prev ?? { x: defaultX, y: defaultY });
    };

    setInitialPos();
    window.addEventListener('resize', setInitialPos);
    return () => window.removeEventListener('resize', setInitialPos);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Chỉ kích hoạt nút chuột chính hoặc touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const currentX = position?.x ?? 20;
    const currentY = position?.y ?? (window.innerHeight - 90);

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
      hasMoved: false,
    };

    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragInfoRef.current.startX;
    const dy = e.clientY - dragInfoRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragInfoRef.current.hasMoved = true;
    }

    const rect = widgetRef.current?.getBoundingClientRect();
    const w = rect?.width || 170;
    const h = rect?.height || 54;

    const minX = 8;
    const maxX = Math.max(minX, window.innerWidth - w - 8);
    const minY = 8;
    const maxY = Math.max(minY, window.innerHeight - h - 8);

    const newX = Math.min(maxX, Math.max(minX, dragInfoRef.current.initialX + dx));
    const newY = Math.min(maxY, Math.max(minY, dragInfoRef.current.initialY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Nếu không kéo hoặc khoảng cách dịch chuyển rất nhỏ => Thực hiện click mở passport
    if (!dragInfoRef.current.hasMoved) {
      retroAudio.playBlip(540);
      onClick();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        left: position ? `${position.x}px` : '20px',
        top: position ? `${position.y}px` : 'auto',
        bottom: position ? 'auto' : '24px',
        touchAction: 'none',
      }}
      className={`fixed z-40 select-none pointer-events-auto cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? 'scale-105 shadow-2xl opacity-95' : 'hover:scale-105'
      }`}
      title="Hộ Chiếu Di Sản: Nhấn để mở • Bấm giữ và kéo thả tự do bất kỳ vị trí nào"
    >
      <div
        className={`group relative flex items-center gap-2 px-3 py-2 border-2 shadow-[0_8px_25px_rgba(0,0,0,0.65)] transition-all ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#D4AF37] text-[#3D2314] hover:bg-[#FED2B7]'
            : 'bg-[#0E2045] border-[#FDE047] text-[#FFFFFF] hover:bg-[#1F3C73]'
        } ${isDragging ? 'ring-2 ring-amber-400' : ''}`}
      >
        {/* Glow aura */}
        <div className="absolute inset-0 bg-yellow-400/20 rounded-none filter blur-xs group-hover:bg-yellow-400/35 transition-all pointer-events-none" />

        {/* Biểu tượng Hộ Chiếu Pixel Book */}
        <div className="relative text-2xl sm:text-3xl flex items-center justify-center animate-bounce-slow pointer-events-none">
          <span>🛂</span>
          {isComplete && (
            <span className="absolute -top-1 -right-1 text-xs animate-spin">
              ✨
            </span>
          )}
        </div>

        {/* Thông tin nhanh */}
        <div className="flex flex-col text-left pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-xs font-black font-['VT323','Silkscreen',monospace] tracking-wider uppercase text-amber-700 dark:text-yellow-300">
              HỘ CHIẾU DI SẢN
            </span>
            {isComplete && (
              <span className="text-[8.5px] px-1 bg-yellow-400 text-black font-bold uppercase rounded-xs">
                MAX
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="font-bold text-red-600 dark:text-yellow-200">
              {unlockedCount}/{totalCount} Con Dấu
            </span>
            <span className="text-[9px] opacity-75">
              ({Math.round((unlockedCount / totalCount) * 100)}%)
            </span>
          </div>
        </div>

        {/* Dấu chấm đỏ thông báo nếu chưa hoàn thành */}
        {!isComplete && (
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-ping ml-0.5 shrink-0 pointer-events-none" />
        )}

        {/* Tay cầm drag icon nhỏ */}
        <div className="ml-1 text-[10px] text-gray-400 group-hover:text-amber-500 flex flex-col items-center justify-center pointer-events-none select-none">
          <span>⋮</span>
        </div>
      </div>
    </div>
  );
};
