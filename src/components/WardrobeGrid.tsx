import React from 'react';
import { Costume } from '../types.ts';
import { retroAudio } from '../utils/audio.ts';

interface WardrobeGridProps {
  costumes: Costume[];
  selectedCostume: Costume;
  onSelectCostume: (costume: Costume) => void;
  gender: 'female' | 'male';
}

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  costumes,
  selectedCostume,
  onSelectCostume,
  gender,
}) => {
  // Lọc trang phục theo giới tính
  const displayCostumes = costumes.filter(
    (c) => c.gender === gender || c.gender === 'unisex'
  );

  return (
    <div
      className="flex flex-col p-3.5 border-3 border-[#FED2B7] bg-[#FFFFE3] shadow-md transition-all font-['Be_Vietnam_Pro','Nunito',sans-serif] text-[#3D2314]"
    >
      {/* Wardrobe Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-[#FED2B7]">
        <div className="flex items-center gap-2">
          <span className="text-base">{gender === 'male' ? '🐉' : '🪷'}</span>
          <span
            className="text-sm font-bold tracking-wider uppercase font-['VT323','Silkscreen',monospace] text-[#3D2314]"
          >
            TỦ ĐỒ {gender === 'male' ? 'NAM QUAN VIÊN' : 'NỮ QUÝ TỘC'}
          </span>
        </div>
        <span className="text-[10px] bg-[#FED2B7] text-[#3D2314] border border-[#FFBFA0] font-mono px-1.5 py-0.5 font-bold">
          {displayCostumes.length} BỘ Y PHỤC
        </span>
      </div>

      <div className="text-[11px] text-[#5C2E1B] mb-3 leading-relaxed">
        Chọn bộ y phục hoàng triều để khoác lên mô hình và thẩm định phong vị:
      </div>

      {/* Grid of Costumes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {displayCostumes.map((c, index) => {
          const isSelected = c.id === selectedCostume.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                retroAudio.playEquip();
                onSelectCostume(c);
              }}
              onMouseEnter={() => retroAudio.playBlip(320)}
              className={`group relative flex flex-col p-2.5 text-left cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] shadow-inner font-bold -translate-y-0.5'
                  : 'bg-white text-[#3D2314] border-[#FED2B7] hover:border-[#FFA9A9] hover:bg-[#FED2B7]/25'
              }`}
            >
              {/* Slot Index Badge & Base Score */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 font-bold border ${
                    isSelected
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0]'
                      : 'bg-[#FFFFE3] text-[#5C2E1B] border-[#FED2B7]'
                  }`}
                >
                  [{index + 1}]
                </span>

                <span
                  className="text-[10px] font-mono font-bold text-[#8B3A3A]"
                >
                  {c.tags?.[0] || 'Hoàng Triều'}
                </span>
              </div>

              {/* Title & Dynasty */}
              <div className="flex-1 my-1">
                <h4
                  className="text-xs font-bold tracking-wide truncate text-[#3D2314]"
                >
                  {c.name}
                </h4>
                <div
                  className="text-[10px] line-clamp-1 text-[#5C2E1B]"
                >
                  {c.dynastyTag}
                </div>

                {/* Costume Tags */}
                {c.tags && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {c.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[9px] font-mono px-1 py-0.2 border ${
                          isSelected
                            ? 'bg-white/80 text-[#3D2314] border-[#FFBFA0]'
                            : 'bg-[#FFFFE3] text-[#5C2E1B] border-[#FED2B7]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors preview */}
              <div
                className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-[#FED2B7]"
              >
                <div className="flex items-center gap-1">
                  {c.colorVariants.map((v) => (
                    <span
                      key={v.id}
                      className="w-2.5 h-2.5 border border-black/40"
                      style={{ backgroundColor: v.primaryColor }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-[#5C2E1B] ml-auto">
                  {c.rarity.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
