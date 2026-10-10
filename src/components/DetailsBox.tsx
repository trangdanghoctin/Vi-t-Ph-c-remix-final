import React, { useState, useEffect, useRef } from 'react';
import { Costume, ColorVariant } from '../types.ts';
import { retroAudio } from '../utils/audio.ts';

interface DetailsBoxProps {
  costume: Costume;
  activeVariant: ColorVariant;
  onSelectVariant: (variant: ColorVariant) => void;
  onOpenAnatomy: () => void;
  gender: 'female' | 'male';
}

export const DetailsBox: React.FC<DetailsBoxProps> = ({
  costume,
  activeVariant,
  onSelectVariant,
  onOpenAnatomy,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullText = costume.fullDescription;
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    let charIndex = 0;
    typingTimerRef.current = window.setInterval(() => {
      charIndex += 2;
      if (charIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      } else {
        setDisplayedText(fullText.slice(0, charIndex));
        if (charIndex % 10 === 0) {
          retroAudio.playTypewriter();
        }
      }
    }, 22);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [costume.id, fullText]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  return (
    <div
      className="flex flex-col p-3.5 md:p-4 text-[#3D2314] bg-[#FFFFE3] border-3 border-[#FED2B7] shadow-md font-['Be_Vietnam_Pro','Nunito',sans-serif]"
    >
      {/* RPG Dialog Box Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b-2 border-[#FED2B7]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#FED2B7] border-2 border-[#FFBFA0] flex items-center justify-center text-sm shadow-sm">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#3D2314] tracking-wide uppercase font-['VT323','Silkscreen',monospace]">
                {costume.name}
              </h3>
              {costume.chineseName && (
                <span className="text-xs text-[#8B3A3A] font-serif border border-[#FED2B7] px-1 bg-white">
                  {costume.chineseName}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#5C2E1B] flex items-center gap-1.5 font-medium">
              <span>⏳ {costume.era}</span>
              <span>•</span>
              <span className="text-[#8B3A3A] font-bold">{costume.rarity}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Skip Typewriter & Anatomy breakdown */}
        <div className="flex items-center gap-2 ml-auto">
          {isTyping && (
            <button
              onClick={handleSkipTyping}
              className="text-[10px] font-mono px-2 py-1 bg-[#FED2B7] hover:bg-[#FFA9A9] border border-[#FFBFA0] text-[#3D2314] cursor-pointer"
            >
              [Bỏ qua gõ ⏩]
            </button>
          )}

          <button
            onClick={() => {
              retroAudio.playBlip(520);
              onOpenAnatomy();
            }}
            className="text-[11px] px-2.5 py-1 bg-[#FFA9A9] hover:bg-[#ff9393] border-2 border-[#FFBFA0] text-[#3D2314] font-bold cursor-pointer shadow-xs active:translate-y-0.5"
          >
            🔍 Cấu tạo may mặc
          </button>
        </div>
      </div>

      {/* Main Grid: Description + Characteristics on Left, Stats & Colorways on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column (7 cols): Dialogue text + Characteristics */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* RPG Dialogue Speech Box */}
          <div className="bg-white p-3 border-2 border-[#FED2B7] relative min-h-[90px] shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8B3A3A] mb-1 block">
              💬 LỜI BÌNH SỬ QUAN:
            </span>
            <p className="text-xs text-[#3D2314] leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-3.5 bg-[#8B3A3A] ml-1 animate-pulse" />}
            </p>
          </div>

          {/* Characteristics (Đặc điểm) */}
          <div className="bg-white/90 p-2.5 border border-[#FED2B7]">
            <h4 className="text-xs font-bold text-[#8B3A3A] mb-1.5 flex items-center gap-1.5 font-['Be_Vietnam_Pro',sans-serif]">
              <span>❖ ĐẶC ĐIỂM NHẬN DIỆN:</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {costume.characteristics.map((c, i) => (
                <li
                  key={i}
                  className="text-[11px] text-[#3D2314] flex items-start gap-1.5 leading-snug font-medium"
                >
                  <span className="text-[#8B3A3A] mt-0.5">◆</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Poetic Quote */}
          <div className="text-[11px] italic text-[#5C2E1B] border-l-3 border-[#8B3A3A] pl-2.5 py-0.5 bg-white/70">
            "{costume.quote}"
          </div>
        </div>

        {/* Right Column (5 cols): RPG Stats & Color Variants */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* RPG STATS PANEL */}
          <div className="bg-white p-3 border-2 border-[#FED2B7] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider font-['Be_Vietnam_Pro',sans-serif]">
                📊 THUỘC TÍNH (STATS RPG)
              </span>
              <span className="text-[10px] text-[#5C2E1B] font-mono">Chỉ số y phục</span>
            </div>

            <div className="space-y-2">
              {costume.stats.map((s, i) => {
                const percentage = Math.min(100, Math.round((s.value / s.max) * 100));
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#3D2314] font-semibold">{s.label}</span>
                      <span className="font-mono font-bold text-[#8B3A3A]">
                        +{s.value} <span className="text-[#5C2E1B] text-[9px]">/{s.max}</span>
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#FFFFE3] border border-[#FED2B7] p-0.5 flex">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: s.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLOR VARIANTS SELECTOR */}
          <div className="bg-white p-3 border-2 border-[#FED2B7] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider font-['Be_Vietnam_Pro',sans-serif]">
                🎨 HỆ MÀU TRUYỀN THỐNG
              </span>
              <span className="text-[10px] text-[#5C2E1B]">
                {costume.colors.join(' • ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {costume.colorVariants.map((v) => {
                const isCurrent = v.id === activeVariant.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      retroAudio.playBlip(480);
                      onSelectVariant(v);
                    }}
                    className={`flex flex-col items-center p-1.5 border-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-[#FFBFA0] bg-[#FED2B7] shadow-xs -translate-y-0.5'
                        : 'border-[#FED2B7] bg-white hover:border-[#FFA9A9]'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className="w-4 h-4 border border-black/40"
                        style={{ backgroundColor: v.primaryColor }}
                      />
                      <span
                        className="w-2.5 h-4 border border-black/40"
                        style={{ backgroundColor: v.secondaryColor }}
                      />
                    </div>
                    <span className="text-[10px] text-center font-bold text-[#3D2314] leading-tight line-clamp-1">
                      {v.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Note */}
            <div className="mt-2 text-[10px] text-[#5C2E1B] bg-white/80 p-1.5 border border-[#FED2B7]">
              <strong className="text-[#8B3A3A]">{activeVariant.name}: </strong>
              {activeVariant.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
