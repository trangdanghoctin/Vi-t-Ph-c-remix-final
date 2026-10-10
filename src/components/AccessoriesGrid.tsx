import React from 'react';
import { Accessory } from '../types.ts';
import { ACCESSORIES_DATA } from '../data/accessories.ts';
import { retroAudio } from '../utils/audio.ts';

interface AccessoriesGridProps {
  equippedAccessories: Accessory[];
  onToggleAccessory: (accessory: Accessory) => void;
  gender: 'female' | 'male';
}

export const AccessoriesGrid: React.FC<AccessoriesGridProps> = ({
  equippedAccessories,
  onToggleAccessory,
  gender,
}) => {
  const equippedIds = equippedAccessories.map((a) => a.id);

  // Lọc phụ kiện theo giới tính
  const displayAccessories = ACCESSORIES_DATA.filter(
    (a) => a.gender === gender || a.gender === 'unisex'
  );

  return (
    <div
      className="flex flex-col p-3.5 border-3 border-[#FED2B7] bg-[#FFFFE3] shadow-md transition-all font-['Be_Vietnam_Pro','Nunito',sans-serif] text-[#3D2314]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-[#FED2B7]">
        <div className="flex items-center gap-2">
          <span className="text-base">💎</span>
          <span
            className="text-sm font-bold tracking-wider uppercase font-['VT323','Silkscreen',monospace] text-[#3D2314]"
          >
            PHỤ KIỆN {gender === 'male' ? 'NAM GIỚI' : 'NỮ QUÝ TỘC'}
          </span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
            equippedAccessories.length === 2
              ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0]'
              : 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0]'
          }`}
        >
          {equippedAccessories.length}/2 ĐÃ ĐEO
        </span>
      </div>

      <div className="text-[11px] text-[#5C2E1B] mb-2.5">
        Chọn tối đa <strong className="text-[#8B3A3A]">2 món phụ kiện</strong> để phối cùng y phục:
      </div>

      {/* Grid of Accessories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayAccessories.map((acc) => {
          const isEquipped = equippedIds.includes(acc.id);

          return (
            <button
              key={acc.id}
              onClick={() => {
                retroAudio.playBlip(isEquipped ? 320 : 520);
                onToggleAccessory(acc);
              }}
              onMouseEnter={() => retroAudio.playBlip(280)}
              className={`group flex items-start gap-2.5 p-2 text-left cursor-pointer transition-all border-2 ${
                isEquipped
                  ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] shadow-inner font-bold -translate-y-0.5'
                  : 'bg-white text-[#3D2314] border-[#FED2B7] hover:border-[#FFA9A9] hover:bg-[#FED2B7]/25'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 flex items-center justify-center text-lg border-2 shrink-0 ${
                  isEquipped
                    ? 'bg-[#FFFFE3] border-[#FFBFA0]'
                    : 'bg-[#FED2B7]/30 border-[#FED2B7] group-hover:border-[#FFA9A9]'
                }`}
              >
                {acc.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5
                    className="text-xs font-bold truncate text-[#3D2314]"
                  >
                    {acc.name}
                  </h5>
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 border ${
                      isEquipped
                        ? 'bg-[#10b981] text-white border-[#10b981]'
                        : 'bg-[#FFFFE3] text-[#5C2E1B] border-[#FED2B7]'
                    }`}
                  >
                    {isEquipped ? 'ĐEO' : '+20'}
                  </span>
                </div>
                <p
                  className="text-[10px] line-clamp-1 mt-0.5 text-[#5C2E1B]"
                >
                  {acc.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
