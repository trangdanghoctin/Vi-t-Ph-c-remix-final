import React, { useState, useEffect, useRef } from 'react';
import { ScoreEvaluation } from '../types.ts';
import { retroAudio } from '../utils/audio.ts';

interface ScoreFeedbackPanelProps {
  evaluation: ScoreEvaluation;
  gender: 'female' | 'male';
}

export const ScoreFeedbackPanel: React.FC<ScoreFeedbackPanelProps> = ({ evaluation }) => {
  const [displayedFeedback, setDisplayedFeedback] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedFeedback('');
    setIsTyping(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    const fullText = evaluation.feedback;
    let charIdx = 0;

    typingTimerRef.current = window.setInterval(() => {
      charIdx += 2;
      if (charIdx >= fullText.length) {
        setDisplayedFeedback(fullText);
        setIsTyping(false);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      } else {
        setDisplayedFeedback(fullText.slice(0, charIdx));
        if (charIdx % 8 === 0) {
          retroAudio.playTypewriter();
        }
      }
    }, 20);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [evaluation.feedback, evaluation.score]);

  // Styling based on score status
  let containerStyle = 'bg-[#FFFFE3] border-3 border-[#FED2B7] shadow-md';
  let badgeColor = 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-bold';
  let scoreColor = 'text-[#8B3A3A] font-bold';
  let barColor = '#FFA9A9';

  if (evaluation.status === 'perfect') {
    // 100 điểm phát sáng vàng kim
    containerStyle = 'bg-[#FFFFE3] border-3 border-[#FED2B7] shadow-[0_0_20px_rgba(254,210,183,0.8)]';
    badgeColor = 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black';
    scoreColor = 'text-[#8B3A3A] font-black';
    barColor = '#FFA9A9';
  } else if (evaluation.status === 'danger') {
    // < 50 điểm chớp đỏ
    containerStyle = 'bg-[#FFFFE3] border-3 border-[#ef4444] animate-pixel-red-blink';
    badgeColor = 'bg-[#b91c1c] text-white border-white font-bold';
    scoreColor = 'text-[#ef4444] font-black';
    barColor = '#ef4444';
  } else if (evaluation.status === 'warning') {
    containerStyle = 'bg-[#FFFFE3] border-3 border-[#f43f5e] shadow-md';
    badgeColor = 'bg-[#e11d48] text-white border-white font-bold';
    scoreColor = 'text-[#be123c] font-bold';
    barColor = '#f43f5e';
  } else {
    // Good (Xanh ngọc bích sáng)
    containerStyle = 'bg-[#FFFFE3] border-3 border-[#10b981] shadow-md';
    badgeColor = 'bg-[#047857] text-white border-white font-bold';
    scoreColor = 'text-[#047857] font-bold';
    barColor = '#10b981';
  }

  return (
    <div className={`p-3.5 transition-all duration-200 text-[#3D2314] font-['Be_Vietnam_Pro','Nunito',sans-serif] ${containerStyle}`}>
      {/* Top Bar: Title & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-[#FED2B7]">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 border ${badgeColor}`}>
            {evaluation.title}
          </span>
          {evaluation.ruleBreak && (
            <span className="text-[10px] font-bold text-[#b91c1c] animate-pulse">
              [LỆCH CHUẨN LỊCH SỬ]
            </span>
          )}
        </div>

        {/* Score Display (Ví dụ: 80/100 Điểm) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5C2E1B] font-mono font-bold">ĐIỂM PHỐI ĐỒ:</span>
          <span className={`text-base md:text-xl font-bold font-mono tracking-wider ${scoreColor}`}>
            {evaluation.score}
            <span className="text-xs text-[#5C2E1B]">/100 ĐIỂM</span>
          </span>
        </div>
      </div>

      {/* 8-bit Stepped Progress Bar */}
      <div className="w-full h-3.5 bg-white border-2 border-[#FED2B7] p-0.5 mb-2.5 flex shadow-inner">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${evaluation.score}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Typewriter Message & Feedback */}
      <div className="bg-white p-2.5 border-2 border-[#FED2B7] min-h-[56px] flex items-start gap-2 shadow-xs">
        <span className="text-base shrink-0 mt-0.5">
          {evaluation.status === 'perfect'
            ? '🏆'
            : evaluation.status === 'danger' || evaluation.status === 'warning'
            ? '⚠️'
            : '💡'}
        </span>
        <div className="text-xs text-[#3D2314] leading-relaxed flex-1">
          <span className="font-medium">{displayedFeedback}</span>
          {isTyping && <span className="inline-block w-1.5 h-3 bg-[#8B3A3A] ml-1 animate-pulse" />}
        </div>
      </div>
    </div>
  );
};
