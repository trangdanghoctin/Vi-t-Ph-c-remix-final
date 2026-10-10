import React, { useState, useEffect, useRef } from 'react';
import { Costume, ColorVariant, ScoreEvaluation, Scene } from '../types.ts';
import { retroAudio } from '../utils/audio.ts';

interface RpgDialogueBoxProps {
  costume: Costume;
  activeVariant: ColorVariant;
  onSelectVariant: (variant: ColorVariant) => void;
  evaluation: ScoreEvaluation;
  currentScene: Scene;
  onOpenAnatomy: () => void;
  gender: 'female' | 'male';
  theme?: 'light' | 'dark';
}

export const RpgDialogueBox: React.FC<RpgDialogueBoxProps> = ({
  costume,
  activeVariant,
  onSelectVariant,
  evaluation,
  currentScene,
  onOpenAnatomy,
  gender,
  theme = 'dark',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const typingTimerRef = useRef<number | null>(null);

  // Combined narrative: History & Scene commentary
  const fullNarrative = `${evaluation.feedback} ${costume.fullDescription}`;

  useEffect(() => {
    setDisplayedText('');
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    let charIdx = 0;
    typingTimerRef.current = window.setInterval(() => {
      charIdx += 2;
      if (charIdx >= fullNarrative.length) {
        setDisplayedText(fullNarrative);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      } else {
        setDisplayedText(fullNarrative.slice(0, charIdx));
        if (charIdx % 10 === 0) {
          retroAudio.playTypewriter();
        }
      }
    }, 20);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [costume.id, evaluation.feedback, currentScene.id]);

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayedText(fullNarrative);
  };

  // Score styling
  const isPerfect = evaluation.score === 100;
  const isDanger = evaluation.score < 50;
  const isWarning = evaluation.ruleBreak && !isDanger;

  return (
    <div className="w-full transition-all duration-300">
      {/* Toggle button when collapsed */}
      {isCollapsed ? (
        <div className="flex justify-end p-2">
          <button
            onClick={() => {
              retroAudio.playBlip(440);
              setIsCollapsed(false);
            }}
            className={`pixel-btn px-3 py-1.5 text-xs border-2 shadow-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-[#FFFFE3] text-[#5A2D2D] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                : 'bg-[#78350f] text-[#fef08a] border-[#fef08a]'
            }`}
          >
            <span>📜 HIỂN THỊ THÔNG SỐ & LỜI THOẠI</span>
            <span
              className={`font-mono px-1.5 py-0.2 border ${
                theme === 'light'
                  ? 'text-[#5A2D2D] bg-[#FED2B7] border-[#FFBFA0]'
                  : 'text-white bg-black/40 border-white/30'
              }`}
            >
              {evaluation.score}/100
            </span>
          </button>
        </div>
      ) : (
        /* RPG DIALOGUE BOX DOCKED AT BOTTOM */
        <div
          className={`border-3 rounded-none p-3 md:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] transition-all ${
            theme === 'light'
              ? isPerfect
                ? 'bg-[#FFFFE3]/98 border-[#FED2B7] text-[#5A2D2D] shadow-[0_0_20px_rgba(254,210,183,0.8)]'
                : isDanger
                ? 'bg-[#FFFFE3]/98 border-[#ef4444] text-[#5A2D2D] animate-pixel-red-blink'
                : 'bg-[#FFFFE3]/98 border-[#FED2B7] text-[#5A2D2D]'
              : isPerfect
              ? 'pixel-glass-dark border-[#f59e0b] text-white box-glow-gold'
              : isDanger
              ? 'pixel-glass-dark border-[#ef4444] text-white animate-pixel-red-blink'
              : 'pixel-glass-dark border-[#1F3C73] text-white'
          }`}
          style={{ imageRendering: 'auto' }}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-3.5">
            {/* 1. CỘT TRÁI: AVATAR & TÊN TRANG PHỤC & BIẾN THỂ MÀU SẮC */}
            <div
              className={`md:w-64 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-3.5 ${
                theme === 'light' ? 'border-[#FED2B7]' : 'border-[#1F3C73]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{gender === 'male' ? '🐉' : '🪷'}</span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider ${
                        theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#CBD5E1]'
                      }`}
                    >
                      {costume.era}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 border ${
                      theme === 'light'
                        ? 'bg-[#FFA9A9] text-[#5A2D2D] border-[#FFBFA0]'
                        : 'bg-[#FFF3CB] text-[#050B31] border-white'
                    }`}
                  >
                    {costume.rarity}
                  </span>
                </div>

                {/* TÊN TRANG PHỤC PHÁT SÁNG HOÀNG KIM / NỔI BẬT */}
                <h3
                  className={`text-lg md:text-xl font-bold font-['VT323','Silkscreen',monospace] tracking-wider leading-tight ${
                    theme === 'light'
                      ? 'text-[#3D2314] font-black drop-shadow-[1px_1px_0_#FED2B7]'
                      : 'text-[#fef08a] glow-gold'
                  }`}
                >
                  {costume.name}
                </h3>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fcd34d]'
                  }`}
                >
                  [{activeVariant.name}]
                </div>
              </div>

              {/* Hệ màu sắc thu gọn */}
              <div className="mt-2.5">
                <div
                  className={`text-[9px] font-mono font-bold mb-1 ${
                    theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]'
                  }`}
                >
                  MÀU Y PHỤC:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {costume.colorVariants.map((v) => {
                    const isSelected = v.id === activeVariant.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          retroAudio.playBlip(500);
                          onSelectVariant(v);
                        }}
                        className={`px-1.5 py-0.5 text-[9px] font-['Be_Vietnam_Pro',sans-serif] tracking-[0.5px] border cursor-pointer transition-all flex items-center gap-1 ${
                          isSelected
                            ? theme === 'light'
                              ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-bold shadow-sm'
                              : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB] font-bold shadow-sm'
                            : theme === 'light'
                            ? 'bg-white/80 text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                            : 'bg-[#050B31]/80 text-[#CBD5E1] border-[#1F3C73] hover:border-[#FFF3CB]'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-none inline-block border border-black"
                          style={{ backgroundColor: v.primaryColor }}
                        />
                        <span>{v.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. CỘT GIỮA: NỘI DUNG LỜI THOẠI & LỊCH SỬ (FONT SIÊU GỌN BE VIETNAM PRO) */}
            <div
              className="flex-1 flex flex-col justify-between cursor-pointer"
              onClick={handleSkipTyping}
              title="Nhấp để hiển thị nhanh toàn bộ văn bản"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-bold font-['Be_Vietnam_Pro',sans-serif] tracking-[0.5px] ${
                      theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                    }`}
                  >
                    <span>📜 LỜI THOẠI ĐIỂN TÍCH & BỐI CẢNH:</span>
                  </div>
                  <span
                    className={`text-[9px] font-['Be_Vietnam_Pro',sans-serif] tracking-[0.5px] italic ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]/80'
                    }`}
                  >
                    (Nhấp chuột để hiện toàn bộ)
                  </span>
                </div>

                {/* VĂN BẢN BE VIETNAM PRO DỄ ĐỌC, KHÔNG GAI MẮT, LINE-HEIGHT 1.5, LETTER-SPACING 0.5PX */}
                <p
                  className={`text-xs md:text-sm leading-[1.5] tracking-[0.5px] font-normal font-['Be_Vietnam_Pro','Nunito',sans-serif] min-h-[50px] md:min-h-[58px] ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFFFFF]'
                  }`}
                >
                  {displayedText}
                </p>
              </div>

              {/* Tags & Điểm hòa hợp bối cảnh */}
              <div
                className={`flex flex-wrap items-center gap-2 mt-2 pt-2 border-t text-[10px] ${
                  theme === 'light' ? 'border-[#FED2B7]' : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-1">
                  {costume.tags.map((t) => (
                    <span
                      key={t}
                      className={`px-1.5 py-0.5 font-['Be_Vietnam_Pro',sans-serif] tracking-[0.5px] border ${
                        theme === 'light'
                          ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
                          : 'bg-[#050B31] border-[#1F3C73] text-[#CBD5E1]'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      retroAudio.playBlip(540);
                      onOpenAnatomy();
                    }}
                    className={`text-[10px] hover:underline font-['Be_Vietnam_Pro',sans-serif] tracking-[0.5px] cursor-pointer flex items-center gap-1 ${
                      theme === 'light' ? 'text-[#3D2314] font-bold' : 'text-[#fef08a]'
                    }`}
                  >
                    <span>🔍</span>
                    <span>Chi tiết cắt may</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. CỘT PHẢI: BẢNG ĐIỂM & ĐÁNH GIÁ SÁNG RỰC */}
            <div
              className={`md:w-56 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-3.5 ${
                theme === 'light' ? 'border-[#FED2B7]' : 'border-[#1F3C73]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#CBD5E1]'
                    }`}
                  >
                    THẨM ĐỊNH PHỐI ĐỒ:
                  </span>
                  <button
                    onClick={() => {
                      retroAudio.playBlip(320);
                      setIsCollapsed(true);
                    }}
                    className={`text-[10px] cursor-pointer ${
                      theme === 'light' ? 'text-[#8B3A3A] hover:text-[#5A2D2D]' : 'text-[#cbd5e1] hover:text-white'
                    }`}
                    title="Thu gọn hộp thoại"
                  >
                    ▼ Thu gọn
                  </button>
                </div>

                {/* ĐIỂM SỐ PHÁT SÁNG GLOW */}
                <div className="flex items-baseline gap-2">
                  <div
                    className={`text-2xl md:text-3xl font-black font-mono tracking-tight ${
                      isPerfect
                        ? theme === 'light'
                          ? 'text-[#5A2D2D]'
                          : 'text-[#fef08a] glow-gold'
                        : isDanger
                        ? 'text-[#ef4444]'
                        : isWarning
                        ? 'text-[#f43f5e]'
                        : theme === 'light'
                        ? 'text-[#8B3A3A]'
                        : 'text-[#10b981] glow-jade'
                    }`}
                  >
                    {evaluation.score}
                  </div>
                  <span
                    className={`text-xs font-mono ${
                      theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#CBD5E1]'
                    }`}
                  >
                    / 100 Điểm
                  </span>
                </div>

                {/* Thanh đo RPG */}
                <div
                  className={`w-full h-2 border mt-1.5 overflow-hidden ${
                    theme === 'light'
                      ? 'bg-white/70 border-[#FED2B7]'
                      : 'bg-black/80 border-white/20'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      isPerfect
                        ? theme === 'light'
                          ? 'bg-[#FFA9A9]'
                          : 'bg-[#f59e0b]'
                        : isDanger
                        ? 'bg-[#ef4444]'
                        : isWarning
                        ? 'bg-[#f43f5e]'
                        : theme === 'light'
                        ? 'bg-[#FFA9A9]'
                        : 'bg-[#10b981]'
                    }`}
                    style={{ width: `${evaluation.score}%` }}
                  />
                </div>
              </div>

              {/* Danh hiệu & Bối cảnh */}
              <div className="mt-2 text-[10px]">
                <div
                  className={`font-['Be_Vietnam_Pro','Nunito',sans-serif] font-bold text-xs leading-[1.4] tracking-[0.5px] ${
                    isPerfect
                      ? theme === 'light'
                        ? 'text-[#3D2314]'
                        : 'text-[#fef08a]'
                      : isDanger
                      ? 'text-[#ef4444]'
                      : theme === 'light'
                      ? 'text-[#3D2314]'
                      : 'text-[#86efac]'
                  }`}
                >
                  {evaluation.title}
                </div>
                <div
                  className={`font-['Be_Vietnam_Pro',sans-serif] text-[9.5px] tracking-[0.5px] mt-0.5 ${
                    theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                  }`}
                >
                  Tại {currentScene.name.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
