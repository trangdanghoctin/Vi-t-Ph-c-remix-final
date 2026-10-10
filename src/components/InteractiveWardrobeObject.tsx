import React, { useState, useEffect, useRef } from 'react';
import { Costume, Accessory, SceneId, AccessoryCategory } from '../types.ts';
import {
  inventoryData,
  getGarmentsByGender,
  getAccessoriesByCategoryAndGender,
  InventoryItem,
} from '../data/inventoryData.ts';
import { retroAudio } from '../utils/audio.ts';

interface InteractiveWardrobeObjectProps {
  sceneId: SceneId;
  isOpen: boolean;
  onToggle: () => void;
  costumes: Costume[];
  selectedCostume: Costume;
  onSelectCostume: (costume: Costume) => void;
  equippedAccessories: Accessory[];
  allAccessories: Accessory[];
  onToggleAccessory: (accessory: Accessory) => void;
  gender: 'female' | 'male';
  onGenderChange?: (gender: 'female' | 'male') => void;
  theme?: 'light' | 'dark';
}

// Danh sách các tag lọc thuộc tính
const FILTER_TAGS = ['Tất cả', 'Vương Giả', 'Sử Thi', 'Cổ Phong', 'Chuẩn M', 'Audition R'];

/**
 * Thumbnail Renderer với Fallback Guard cho toàn bộ Y phục & Phụ kiện
 * Đảm bảo 100% không bị null/undefined hoặc bể hình.
 */
const ItemPixelThumbnail: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const color = item.primaryColor || '#b91c1c';
  const secColor = item.secondaryColor || '#78350f';

  // Nếu có ảnh riêng và chưa bị lỗi, hiển thị ảnh
  const itemWithImage = item as InventoryItem & { imageUrl?: string };
  if (itemWithImage.imageUrl && !imgError) {
    return (
      <img
        src={itemWithImage.imageUrl}
        alt={item.name}
        className="w-full h-full object-contain pixelated"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback Guard: Render Pixel Art SVG thu nhỏ đặc trưng theo từng món đồ
  const id = item.id;

  return (
    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-sm select-none" style={{ shapeRendering: 'crispEdges' }}>
      {/* Nền đệm pixel art nhẹ */}
      <rect width="32" height="32" fill="rgba(0,0,0,0.15)" />

      {/* --- Y PHỤC (GARMENTS) --- */}
      {item.category === 'garment' && (
        <g id="thumb-garment">
          {id.includes('nhat-binh') ? (
            /* Áo Nhật Bình */
            <>
              <rect x="8" y="8" width="16" height="18" fill="#f59e0b" />
              <rect x="5" y="10" width="4" height="14" fill="#d97706" />
              <rect x="23" y="10" width="4" height="14" fill="#d97706" />
              <rect x="12" y="6" width="8" height="8" fill="#b91c1c" />
              <rect x="14" y="8" width="4" height="4" fill="#ffd700" />
              <rect x="14" y="14" width="1" height="12" fill="#c1272d" />
              <rect x="15" y="14" width="1" height="12" fill="#ffd700" />
              <rect x="16" y="14" width="1" height="12" fill="#0284c7" />
              <rect x="17" y="14" width="1" height="12" fill="#15803d" />
            </>
          ) : id.includes('tu-than') ? (
            /* Áo Tứ Thân */
            <>
              <rect x="8" y="14" width="16" height="13" fill="#1e293b" />
              <rect x="10" y="7" width="12" height="12" fill={color} />
              <polygon points="13,6 19,6 18,13 14,13" fill="#e11d48" />
              <rect x="8" y="16" width="16" height="2" fill="#10b981" />
              <line x1="14" y1="18" x2="14" y2="25" stroke="#10b981" strokeWidth="1.5" />
            </>
          ) : id.includes('ma-doan') ? (
            /* Áo Mã Đoán */
            <>
              <rect x="7" y="8" width="18" height="18" fill={color} />
              <rect x="4" y="10" width="4" height="15" fill={secColor} />
              <rect x="24" y="10" width="4" height="15" fill={secColor} />
              <rect x="12" y="11" width="8" height="8" fill="#b91c1c" stroke="#f59e0b" strokeWidth="0.8" />
              <circle cx="16" cy="15" r="1.5" fill="#ffffff" />
            </>
          ) : (
            /* Áo Tấc, Giao Lĩnh, Ngũ Thân, Áo Dài, Mãng Phục */
            <>
              <rect x="8" y="8" width="16" height="18" fill={color} />
              <rect x="5" y="10" width="4" height="14" fill={secColor} />
              <rect x="23" y="10" width="4" height="14" fill={secColor} />
              <rect x="12" y="5" width="8" height="4" fill={color} />
              <line x1="16" y1="5" x2="16" y2="26" stroke={secColor} strokeWidth="1" />
              <circle cx="18" cy="8" r="1" fill="#fef08a" />
              <circle cx="18" cy="12" r="1" fill="#fef08a" />
              <circle cx="18" cy="16" r="1" fill="#fef08a" />
            </>
          )}
        </g>
      )}

      {/* --- NHÓM 1: NÓN / MŨ / KHĂN ĐỘI --- */}
      {item.category === 'head' && (
        <g id="thumb-head">
          {id.includes('man') ? (
            /* Mấn Khăn Xếp Hoàng Cung */
            <>
              <rect x="7" y="10" width="18" height="8" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
              <rect x="9" y="8" width="14" height="4" fill="#fbbf24" />
              <circle cx="16" cy="14" r="2.5" fill="#b91c1c" />
              <circle cx="16" cy="14" r="1" fill="#ffffff" />
            </>
          ) : id.includes('non-ba-tam') ? (
            /* Nón Ba Tầm Quai Thao */
            <>
              <ellipse cx="16" cy="14" rx="12" ry="4" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
              <ellipse cx="16" cy="13" rx="7" ry="2" fill="#fde047" />
              <line x1="11" y1="16" x2="10" y2="26" stroke="#1e293b" strokeWidth="1" />
              <line x1="21" y1="16" x2="22" y2="26" stroke="#1e293b" strokeWidth="1" />
              <circle cx="10" cy="26" r="1.5" fill="#f43f5e" />
              <circle cx="22" cy="26" r="1.5" fill="#f43f5e" />
            </>
          ) : id.includes('non-la') ? (
            /* Nón Lá */
            <>
              <polygon points="16,6 5,20 27,20" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
              <line x1="16" y1="6" x2="16" y2="20" stroke="#f59e0b" strokeWidth="0.8" />
              <line x1="11" y1="20" x2="16" y2="26" stroke="#ec4899" strokeWidth="1" />
              <line x1="21" y1="20" x2="16" y2="26" stroke="#ec4899" strokeWidth="1" />
            </>
          ) : id.includes('phuong') ? (
            /* Mũ Phượng */
            <>
              <rect x="8" y="12" width="16" height="8" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="16" cy="11" r="3" fill="#e11d48" />
              <line x1="6" y1="14" x2="3" y2="21" stroke="#fef08a" strokeWidth="1" />
              <line x1="26" y1="14" x2="29" y2="21" stroke="#fef08a" strokeWidth="1" />
            </>
          ) : id.includes('o-sa') ? (
            /* Mũ Ô Sa */
            <>
              <rect x="10" y="11" width="12" height="9" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
              <rect x="2" y="13" width="9" height="3" fill="#0f172a" />
              <rect x="21" y="13" width="9" height="3" fill="#0f172a" />
              <circle cx="16" cy="14" r="1.5" fill="#f59e0b" />
            </>
          ) : (
            /* Khăn Đóng / Khôi Giáp / Nón Ngựa */
            <>
              <rect x="9" y="11" width="14" height="9" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
              <line x1="10" y1="14" x2="22" y2="14" stroke="#64748b" strokeWidth="1" />
              <line x1="10" y1="17" x2="22" y2="17" stroke="#64748b" strokeWidth="1" />
              <circle cx="16" cy="12" r="1.5" fill="#f59e0b" />
            </>
          )}
        </g>
      )}

      {/* --- NHÓM 2: TRANG SỨC / CẦM TAY --- */}
      {item.category === 'jewelry' && (
        <g id="thumb-jewelry">
          {id.includes('tram-cai') ? (
            /* Trâm Cài Tóc Đính Ngọc */
            <>
              <line x1="7" y1="24" x2="23" y2="8" stroke="#f59e0b" strokeWidth="2.5" />
              <rect x="20" y="6" width="6" height="6" fill="#10b981" stroke="#fbbf24" strokeWidth="0.8" />
              <circle cx="23" cy="9" r="1.2" fill="#ffffff" />
              <line x1="24" y1="13" x2="24" y2="19" stroke="#fbbf24" strokeWidth="1" />
              <circle cx="24" cy="19" r="1.5" fill="#e11d48" />
            </>
          ) : id.includes('kieng-bac') ? (
            /* Kiềng Bạc Chạm Trổ */
            <>
              <circle cx="16" cy="16" r="9" stroke="#f8fafc" strokeWidth="3" fill="none" />
              <circle cx="16" cy="16" r="7" stroke="#94a3b8" strokeWidth="1" fill="none" />
              <circle cx="16" cy="25" r="2.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
              <circle cx="16" cy="25" r="1" fill="#38bdf8" />
            </>
          ) : id.includes('quat-lua') ? (
            /* Quạt Lụa Tròn Cung Đình */
            <>
              <line x1="11" y1="26" x2="19" y2="15" stroke="#78350f" strokeWidth="2" />
              <circle cx="19" cy="13" r="8" fill="#fffbeb" stroke="#b91c1c" strokeWidth="1.2" />
              <circle cx="19" cy="13" r="2.5" fill="#ec4899" />
              <circle cx="18" cy="14" r="1.2" fill="#10b981" />
              <line x1="10" y1="26" x2="7" y2="30" stroke="#dc2626" strokeWidth="1" />
              <circle cx="7" cy="30" r="1" fill="#f59e0b" />
            </>
          ) : id.includes('quat-giay') ? (
            /* Quạt Giấy Thư Pháp */
            <>
              <polygon points="9,23 23,8 29,15 13,26" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
              <line x1="10" y1="24" x2="24" y2="9" stroke="#b45309" strokeWidth="0.8" />
              <line x1="11" y1="24" x2="27" y2="12" stroke="#b45309" strokeWidth="0.8" />
              <line x1="16" y1="18" x2="22" y2="13" stroke="#18181b" strokeWidth="1.5" />
              <line x1="18" y1="21" x2="24" y2="16" stroke="#18181b" strokeWidth="1.5" />
            </>
          ) : id.includes('kiem') ? (
            /* Kiếm Cổ Phong Nạm Ngọc */
            <>
              <line x1="7" y1="7" x2="25" y2="25" stroke="#1e293b" strokeWidth="3" />
              <line x1="7" y1="7" x2="25" y2="25" stroke="#f59e0b" strokeWidth="1" />
              <rect x="5" y="5" width="4" height="4" fill="#10b981" stroke="#f59e0b" strokeWidth="0.8" />
              <line x1="7" y1="10" x2="11" y2="6" stroke="#f59e0b" strokeWidth="2.5" />
            </>
          ) : id.includes('tui-gam') ? (
            /* Túi Gấm Đại Việt */
            <>
              <rect x="10" y="11" width="12" height="13" rx="3" fill="#991b1b" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="16" cy="17" r="3" fill="#f59e0b" />
              <rect x="13" y="9" width="6" height="3" fill="#d97706" />
              <line x1="16" y1="24" x2="16" y2="29" stroke="#fef08a" strokeWidth="1.5" />
            </>
          ) : id.includes('that-lung') ? (
            /* Dải Thắt Lưng Ngũ Sắc */
            <>
              <rect x="6" y="10" width="20" height="4" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
              <circle cx="16" cy="12" r="2.5" fill="#b91c1c" />
              <rect x="12" y="14" width="1.5" height="14" fill="#ef4444" />
              <rect x="14" y="14" width="1.5" height="15" fill="#eab308" />
              <rect x="16" y="14" width="1.5" height="16" fill="#06b6d4" />
              <rect x="18" y="14" width="1.5" height="15" fill="#f8fafc" />
              <rect x="20" y="14" width="1.5" height="14" fill="#10b981" />
            </>
          ) : id.includes('ngoc-boi') || id.includes('the-bai') ? (
            /* Ngọc Bội / Thẻ Bài Ngà */
            <>
              <line x1="16" y1="6" x2="16" y2="11" stroke="#dc2626" strokeWidth="1.5" />
              <rect x="11" y="11" width="10" height="12" rx="2" fill="#10b981" stroke="#064e3b" strokeWidth="1" />
              <circle cx="16" cy="17" r="2.5" fill="#34d399" />
              <circle cx="16" cy="24" r="1.5" fill="#f59e0b" />
              <line x1="16" y1="25" x2="16" y2="29" stroke="#fbbf24" strokeWidth="1.5" />
            </>
          ) : id.includes('chuoi-hat') ? (
            /* Chuỗi Hạt Trầm Hương */
            <>
              <ellipse cx="16" cy="16" rx="8" ry="8" stroke="#451a03" strokeWidth="3" strokeDasharray="2,2" fill="none" />
              <circle cx="16" cy="24" r="2" fill="#78350f" stroke="#d97706" strokeWidth="0.8" />
              <line x1="16" y1="26" x2="16" y2="29" stroke="#b91c1c" strokeWidth="1.5" />
            </>
          ) : (
            /* Quai Thao Kép & Món khác */
            <>
              <line x1="11" y1="7" x2="11" y2="25" stroke="#1e293b" strokeWidth="2" />
              <line x1="21" y1="7" x2="21" y2="25" stroke="#1e293b" strokeWidth="2" />
              <rect x="9" y="24" width="4" height="4" fill="#f43f5e" />
              <rect x="19" y="24" width="4" height="4" fill="#f43f5e" />
            </>
          )}
        </g>
      )}

      {/* --- NHÓM 3: GIÀY / HÀI / GUỐC --- */}
      {item.category === 'feet' && (
        <g id="thumb-feet">
          {id.includes('hai-mui-vut') ? (
            /* Hài Mũi Vút */
            <>
              <path d="M 8 20 Q 14 20 20 18 Q 24 14 26 13 L 26 16 Q 22 18 18 22 L 8 22 Z" fill="#b91c1c" stroke="#f59e0b" strokeWidth="0.8" />
              <circle cx="24" cy="14" r="1.2" fill="#ffffff" />
            </>
          ) : id.includes('guoc-moc') ? (
            /* Guốc Mộc */
            <>
              <rect x="7" y="19" width="18" height="4" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
              <rect x="9" y="23" width="3" height="2" fill="#451a03" />
              <rect x="21" y="23" width="3" height="2" fill="#451a03" />
              <path d="M 11 19 Q 16 14 21 19" stroke="#f43f5e" strokeWidth="2" fill="none" />
            </>
          ) : id.includes('ung-da') ? (
            /* Ủng Da */
            <>
              <rect x="10" y="10" width="8" height="12" fill="#090d16" />
              <polygon points="10,22 22,22 22,20 18,17 10,17" fill="#090d16" stroke="#475569" strokeWidth="0.8" />
              <line x1="10" y1="10" x2="18" y2="10" stroke="#f59e0b" strokeWidth="1" />
            </>
          ) : id.includes('sneaker') ? (
            /* Sneaker Neon Audition */
            <>
              <polygon points="8,22 24,22 24,19 19,15 12,15 8,18" fill="#06b6d4" stroke="#f43f5e" strokeWidth="1" />
              <rect x="8" y="22" width="16" height="3" fill="#ffffff" />
              <line x1="14" y1="16" x2="20" y2="18" stroke="#f43f5e" strokeWidth="1.2" />
            </>
          ) : (
            /* Hài Cung Đình, Giày Lụa, Guốc Cao Gót */
            <>
              <rect x="8" y="18" width="16" height="5" rx="2" fill={color} stroke="#fef08a" strokeWidth="0.8" />
              <circle cx="21" cy="18" r="1.5" fill="#fef08a" />
              <line x1="10" y1="17" x2="18" y2="17" stroke="#fbcfe8" strokeWidth="1.5" />
            </>
          )}
        </g>
      )}

      {/* Biểu tượng Icon dự phòng ở góc nếu có */}
      {item.icon && (
        <text x="2" y="10" fontSize="8" className="select-none pointer-events-none opacity-80">
          {item.icon}
        </text>
      )}
    </svg>
  );
};

export const InteractiveWardrobeObject: React.FC<InteractiveWardrobeObjectProps> = ({
  sceneId,
  isOpen,
  onToggle,
  costumes,
  selectedCostume,
  onSelectCostume,
  equippedAccessories,
  allAccessories,
  onToggleAccessory,
  gender,
  onGenderChange,
  theme = 'dark',
}) => {
  // 1. Accordion state cho từng phân nhóm độc lập
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    garments: true,
    head: true,
    jewelry: true,
    feet: true,
  });

  const toggleSection = (sectionKey: string) => {
    retroAudio.playBlip(440);
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // 2. Bộ lọc thuộc tính nằm ngang (Filter tag)
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');

  // 3. Drag-and-drop state cho Modal #kho-viet-phuc-container
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo vị trí mặc định an toàn khi mở modal
  useEffect(() => {
    if (isOpen && !position) {
      const defaultWidth = 360;
      const initialX = Math.max(16, window.innerWidth - defaultWidth - 24);
      const initialY = Math.min(100, Math.max(20, Math.floor(window.innerHeight * 0.1)));
      setPosition({ x: initialX, y: initialY });
    }
  }, [isOpen, position]);

  // Đảm bảo modal không tràn ra ngoài màn hình khi resize trình duyệt
  useEffect(() => {
    const handleResize = () => {
      if (!position || !containerRef.current) return;
      const el = containerRef.current;
      const w = el.offsetWidth || 360;
      const h = el.offsetHeight || 520;
      const clampedX = Math.max(8, Math.min(window.innerWidth - w - 8, position.x));
      const clampedY = Math.max(8, Math.min(window.innerHeight - h - 8, position.y));
      if (clampedX !== position.x || clampedY !== position.y) {
        setPosition({ x: clampedX, y: clampedY });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Pointer event listeners (Kéo thả mượt mà trên cả Desktop & Touch Screen)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) {
      return;
    }

    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position ? position.x : rect.left,
      initY: position ? position.y : rect.top,
    };
    setIsDragging(true);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    const el = containerRef.current;
    const width = el ? el.offsetWidth : 360;
    const height = el ? el.offsetHeight : 540;

    const newX = Math.max(8, Math.min(window.innerWidth - width - 8, dragRef.current.initX + dx));
    const newY = Math.max(8, Math.min(window.innerHeight - height - 8, dragRef.current.initY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // safe
      }
    }
  };

  // 4. Dữ liệu y phục & phụ kiện từ inventoryData
  const baseGarments = getGarmentsByGender(gender);
  const baseHeadAccessories = getAccessoriesByCategoryAndGender('head', gender);
  const baseJewelryAccessories = getAccessoriesByCategoryAndGender('jewelry', gender);
  const baseFeetAccessories = getAccessoriesByCategoryAndGender('feet', gender);

  // Bộ lọc tag áp dụng cho danh sách
  const filterByTag = (items: InventoryItem[]) => {
    if (selectedTag === 'Tất cả') return items;
    return items.filter(
      (item) => item.tag === selectedTag || item.tags?.includes(selectedTag)
    );
  };

  const filteredGarments = filterByTag(baseGarments);
  const filteredHeadAccessories = filterByTag(baseHeadAccessories);
  const filteredJewelryAccessories = filterByTag(baseJewelryAccessories);
  const filteredFeetAccessories = filterByTag(baseFeetAccessories);

  // Đếm tổng số lượng theo giới tính cho Tab
  const femaleCount = inventoryData.filter(
    (i) => i.category === 'garment' && (i.gender === 'female' || i.gender === 'unisex')
  ).length;
  const maleCount = inventoryData.filter(
    (i) => i.category === 'garment' && (i.gender === 'male' || i.gender === 'unisex')
  ).length;

  // Kiểm tra vật phẩm đang được chọn
  const isGarmentSelected = (item: InventoryItem) => {
    return (
      selectedCostume.id === item.id ||
      selectedCostume.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim().toLowerCase())
    );
  };

  const isAccessoryEquipped = (item: InventoryItem) => {
    return equippedAccessories.some(
      (a) =>
        a.id === item.id ||
        a.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim().toLowerCase())
    );
  };

  // Hàm chọn Y Phục
  const handleSelectGarmentItem = (item: InventoryItem) => {
    retroAudio.playEquip();
    const matched = costumes.find(
      (c) =>
        c.id === item.id ||
        c.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim().toLowerCase())
    );

    if (matched) {
      onSelectCostume(matched);
    } else {
      const generatedCostume: Costume = {
        id: item.id as any,
        name: item.name,
        gender: item.gender === 'unisex' ? gender : item.gender,
        era: 'Đại Việt Cổ Truyền',
        dynastyTag: item.tag,
        rarity:
          item.tag === 'Vương Giả'
            ? 'Vương Giả (Royal)'
            : item.tag === 'Sử Thi'
            ? 'Sử Thi (Epic)'
            : item.tag === 'Cổ Phong'
            ? 'Cổ Phong (Ancient)'
            : 'Chuẩn Mực (Standard)',
        tags: item.tags || [item.tag],
        baseScore: 50,
        characteristics: ['Phom dáng chuẩn mực', 'Họa tiết truyền thống'],
        fullDescription: item.description || item.name,
        historyLore: 'Di sản trang phục truyền thống Việt Nam.',
        colors: [item.primaryColor || '#b91c1c'],
        colorVariants: [
          {
            id: `${item.id}-default`,
            name: 'Chính sắc',
            primaryColor: item.primaryColor || '#b91c1c',
            secondaryColor: item.secondaryColor || '#7f1d1d',
            accentColor: '#f59e0b',
            patternColor: '#fef08a',
            description: item.name,
          },
        ],
        stats: [
          { label: 'Thẩm mỹ', value: 18, max: 20, color: '#f59e0b' },
          { label: 'Cổ phong', value: 19, max: 20, color: '#10b981' },
        ],
        anatomy: {
          collar: 'Cổ phục trang nghiêm',
          sleeves: 'Tay áo tinh xảo',
          panels: 'Vạt áo chuẩn mực',
          accessories: 'Phụ kiện cổ phong đồng bộ',
        },
        quote: `${item.name} - Tinh hoa bách phục cổ truyền.`,
      };
      onSelectCostume(generatedCostume);
    }
  };

  // Hàm chọn / gỡ Phụ Kiện (chọn độc quyền theo nhóm)
  const handleToggleAccessoryItem = (item: InventoryItem) => {
    retroAudio.playEquip();
    const matched = allAccessories.find(
      (a) =>
        a.id === item.id ||
        a.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim().toLowerCase())
    );

    if (matched) {
      onToggleAccessory(matched);
    } else {
      const generatedAccessory: Accessory = {
        id: item.id,
        name: item.name,
        category: item.category as AccessoryCategory,
        gender: item.gender,
        slot: item.category === 'head' ? 'head' : item.category === 'feet' ? 'feet' : 'hand',
        tags: item.tags || [item.tag],
        scoreBonus: 20,
        compatibleCostumeIds: [],
        incompatibleCostumeIds: [],
        description: item.description || item.name,
        icon: item.icon || '✨',
      };
      onToggleAccessory(generatedAccessory);
    }
  };

  /**
   * REQUIREMENT 3: Gán hàm cập nhật nhân vật (updateCharacterAppearance())
   * cho sự kiện onClick của toàn bộ các thẻ phụ kiện nhóm 2 và các nhóm khác.
   */
  const updateCharacterAppearance = (item: InventoryItem) => {
    if (item.category === 'garment') {
      handleSelectGarmentItem(item);
    } else {
      handleToggleAccessoryItem(item);
    }
  };

  return (
    <div className="relative z-30 flex flex-col items-end">
      {/* ================= VẬT THỂ TƯƠNG TÁC (SCENE OBJECT THEO CẢNH) ================= */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            retroAudio.playBlip(isOpen ? 380 : 580);
            onToggle();
          }}
          className="group relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
          title={isOpen ? 'Đóng lại' : 'Chạm để mở kho Việt Phục'}
        >
          {/* Nhãn gợi ý phát sáng */}
          <div
            className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 text-[10px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] border shadow-md transition-all ${
              isOpen
                ? 'bg-[#b91c1c] text-white border-[#fef08a]'
                : 'bg-[#fef3c7] text-[#78350f] border-[#d97706] animate-bounce'
            }`}
          >
            {isOpen ? '✕ THU GỌN' : '✨ CHẠM ĐỂ MỞ'}
          </div>

          {/* CẢNH 1: KHỐI MÂY TIÊN (BỒNG LAI) */}
          {sceneId === 'bong-lai' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(244,63,94,0.6)]">
                <circle cx="27" cy="27" r={isOpen ? 25 : 21} fill="rgba(251, 113, 133, 0.25)" className="animate-pulse" />
                <circle cx="27" cy="27" r="18" fill="rgba(244, 63, 94, 0.45)" />
                <circle cx="27" cy="12" r="12" fill="#fda4af" stroke="#fff" strokeWidth="1.5" />
                <circle cx="27" cy="25" r="9" fill="#f43f5e" />
                <circle cx="24" cy="22" r="3" fill="#fff" />
                <path
                  d="M 12 36 C 8 36, 6 30, 12 28 C 10 22, 18 18, 22 22 C 26 16, 36 16, 38 22 C 44 20, 48 26, 44 32 C 48 36, 42 42, 36 40 C 32 44, 20 44, 16 40 C 12 42, 10 38, 12 36 Z"
                  fill="rgba(254, 205, 211, 0.85)"
                  stroke="#fb7185"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          )}

          {/* CẢNH 2: TRỐNG ĐỎ (SƠN THẦN) */}
          {sceneId === 'son-than' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(185,28,28,0.7)]">
                <polygon points="12,48 18,36 36,36 42,48" fill="#451a03" />
                <rect x="10" y="20" width="34" height="20" rx="3" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.5" />
                <ellipse cx="27" cy="18" rx="17" ry="5" fill="#fed7aa" stroke="#78350f" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* CẢNH 3: CUỐN THƯ (CỬU LONG) */}
          {sceneId === 'cuu-long' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(245,158,11,0.7)]">
                {isOpen ? (
                  <g id="scroll-opened">
                    <rect x="4" y="10" width="6" height="34" rx="2" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="44" y="10" width="6" height="34" rx="2" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="8" y="14" width="38" height="26" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>
                ) : (
                  <g id="scroll-closed">
                    <rect x="10" y="22" width="34" height="12" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="10" cy="28" r="5" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                    <circle cx="44" cy="28" r="5" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
                  </g>
                )}
              </svg>
            </div>
          )}

          {/* CẢNH 4: TỦ GỖ LIM (CUNG ĐÌNH) */}
          {sceneId === 'cung-dinh' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(217,119,6,0.7)]">
                <path d="M 6 12 Q 27 6 48 12 L 46 16 L 8 16 Z" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.2" />
                <rect x="8" y="16" width="38" height="32" rx="1" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* CẢNH 5: ĐÀI SEN (ĐẦM SEN) */}
          {sceneId === 'dam-sen' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(244,63,94,0.7)]">
                <ellipse cx="27" cy="46" rx="22" ry="6" fill="#047857" stroke="#065f46" strokeWidth="1.2" />
                <path d="M 6 36 C 8 20, 20 28, 27 34 C 34 28, 46 20, 48 36 C 42 46, 12 46, 6 36 Z" fill="#f43f5e" opacity="0.85" />
              </svg>
            </div>
          )}

          {/* CẢNH 6: RƯƠNG CỔ (HỘI AN) */}
          {sceneId === 'hoi-an' && (
            <div className="w-24 h-28 md:w-28 md:h-32 relative flex items-center justify-center">
              <svg viewBox="0 0 54 54" className="w-full h-full drop-shadow-[0_8px_20px_rgba(249,115,22,0.7)]">
                <rect x="8" y="28" width="38" height="20" rx="2" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* Tên vật thể */}
          <div className="text-[10px] text-[#fef08a] bg-black/80 px-2 py-0.5 border border-[#f59e0b] font-mono mt-1 text-center whitespace-nowrap">
            {sceneId === 'bong-lai' && 'MÂY TIÊN BỒNG LAI'}
            {sceneId === 'son-than' && 'TRỐNG THIÊNG SƠN THẦN'}
            {sceneId === 'cuu-long' && 'CỬU LONG THÁNH CHỈ'}
            {sceneId === 'cung-dinh' && 'TỦ GỖ LIM KHẢM TRAI'}
            {sceneId === 'dam-sen' && 'ĐÀI SEN BÁCH DIỆP'}
            {sceneId === 'hoi-an' && 'RƯƠNG CỔ & ĐÈN LỒNG'}
          </div>
        </button>
      </div>

      {/* =========================================================================
          CỬA SỔ TỦ ĐỒ "KHO VIỆT PHỤC" NỔI TRÊN MÀN HÌNH (#kho-viet-phuc-container)
          - Draggable Header với Vương miện + Tiêu đề + Chú thích Draggable + Nút [X] màu đỏ
          - Tabs Giới tính: 2 tab song song lớn 👩 NỮ PHỤC (x) và 👨 NAM PHỤC (x)
          - Thanh Bộ Lọc Thuộc Tính nằm ngang với thanh trượt ngang
          - Accordion phân nhóm độc lập: 👕 1. Y PHỤC, 👑 2. NÓN, 🎒 3. TRANG SỨC, 👠 4. GIÀY
          - Thẻ vật phẩm Grid 2 cột: Thumbnail + Tên + Badge phân loại
          - Đồng bộ thanh cuộn mềm mại (.wardrobe-scroll)
         ========================================================================= */}
      {isOpen && (
        <div
          ref={containerRef}
          id="kho-viet-phuc-container"
          data-scene={sceneId}
          data-theme={theme}
          className={`fixed w-[340px] sm:w-[390px] p-3 border-2 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-2.5 backdrop-blur-lg select-none wardrobe-scroll ${
            theme === 'light'
              ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
              : 'bg-[#050B31]/95 border-[#1F3C73] text-[#FFFFFF]'
          }`}
          style={{
            left: position ? `${position.x}px` : 'auto',
            top: position ? `${position.y}px` : 'auto',
            right: position ? 'auto' : '20px',
            maxHeight: '560px',
            overflowY: 'auto',
          }}
        >
          {/* ================= 1. KHUNG CỬA SỔ CHÍNH: HEADER BAR DRAGGABLE ================= */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`modal-header flex items-center justify-between pb-2 border-b select-none cursor-grab active:cursor-grabbing transition-colors ${
              isDragging ? 'dragging ring-1 ring-amber-400' : ''
            } ${theme === 'light' ? 'border-[#FED2B7]' : 'border-[#1F3C73]'}`}
          >
            {/* Header: Biểu tượng vương miện + Tiêu đề + Dòng chú thích Draggable */}
            <div className="flex items-center gap-2 min-w-0 pointer-events-none">
              <span className="text-xl select-none shrink-0" role="img" aria-label="crown">
                👑
              </span>
              <div className="flex flex-col">
                <h4
                  className={`text-base font-bold font-['VT323','Silkscreen',monospace] uppercase tracking-wider truncate ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  KHO VIỆT PHỤC
                </h4>
                <span
                  className={`text-[9.5px] font-['Be_Vietnam_Pro',sans-serif] tracking-[0.3px] font-medium ${
                    theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                  }`}
                >
                  • DRAGGABLE (Kéo - thả linh hoạt trên màn hình)
                </span>
              </div>
            </div>

            {/* Góc trên bên phải: Nút đóng [X] màu đỏ */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="w-6 h-6 flex items-center justify-center bg-[#b91c1c] text-white font-bold text-xs border border-[#fef08a] hover:bg-[#dc2626] active:scale-95 cursor-pointer shrink-0 shadow-sm transition-all"
              title="Đóng kho đồ"
            >
              ✕
            </button>
          </div>

          {/* ================= 2. THANH ĐIỀU HƯỚNG & BỘ LỌC (TABS & FILTERS) ================= */}
          <div className="flex flex-col gap-2 pt-0.5">
            {/* Tabs Giới tính: 2 tab song song lớn 👩 NỮ PHỤC (x) và 👨 NAM PHỤC (x) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (gender !== 'female') {
                    onGenderChange?.('female');
                    retroAudio.playBlip(440);
                  }
                }}
                className={`py-2 px-2 text-xs sm:text-sm font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer border-2 transition-all flex items-center justify-center gap-1 ${
                  gender === 'female'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-inner'
                      : 'bg-[#831843] text-white border-[#FFF3CB] font-black shadow-inner'
                    : theme === 'light'
                    ? 'bg-white/80 text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                    : 'bg-[#0E2045]/70 text-[#CBD5E1] border-[#1F3C73] hover:border-[#FFF3CB]'
                }`}
              >
                <span>👩 NỮ PHỤC</span>
                <span className="text-[11px] font-mono opacity-85">({femaleCount})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (gender !== 'male') {
                    onGenderChange?.('male');
                    retroAudio.playBlip(440);
                  }
                }}
                className={`py-2 px-2 text-xs sm:text-sm font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer border-2 transition-all flex items-center justify-center gap-1 ${
                  gender === 'male'
                    ? theme === 'light'
                      ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-black shadow-inner'
                      : 'bg-[#1e3a5f] text-white border-[#FFF3CB] font-black shadow-inner'
                    : theme === 'light'
                    ? 'bg-white/80 text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                    : 'bg-[#0E2045]/70 text-[#CBD5E1] border-[#1F3C73] hover:border-[#FFF3CB]'
                }`}
              >
                <span>👨 NAM PHỤC</span>
                <span className="text-[11px] font-mono opacity-85">({maleCount})</span>
              </button>
            </div>

            {/* Thanh Bộ Lọc Thuộc Tính (Filter Pills Horizontal Scroll) với thanh trượt ngang bên dưới */}
            <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 px-0.5 wardrobe-scroll flex-nowrap">
              {FILTER_TAGS.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      retroAudio.playBlip(480);
                    }}
                    className={`shrink-0 px-2.5 py-1 text-[10px] font-bold font-mono tracking-[0.5px] border cursor-pointer transition-all whitespace-nowrap ${
                      isSelected
                        ? theme === 'light'
                          ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black shadow-sm'
                          : 'bg-[#b45309] text-white border-[#fef08a] font-black shadow-sm'
                        : theme === 'light'
                        ? 'bg-white/80 border-[#FED2B7] text-[#3D2314] hover:bg-[#FED2B7]/30'
                        : 'bg-[#050B31]/80 border-[#1F3C73] text-[#CBD5E1] hover:border-[#FFF3CB]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= 3. DANH SÁCH PHÂN NHÓM DẠNG ACCORDION ================= */}
          <div className="flex flex-col gap-2">

            {/* --- NHÓM 1: 👕 1. Y PHỤC --- */}
            <div
              className={`border overflow-hidden transition-all ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] border-[#FED2B7]'
                  : 'bg-[#0E2045]/60 border-[#1F3C73]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection('garments')}
                className={`w-full flex items-center justify-between p-2 cursor-pointer border-b transition-colors ${
                  theme === 'light'
                    ? 'bg-[#FFFFE3] hover:bg-[#FED2B7]/40 border-[#FED2B7]'
                    : 'bg-[#0E2045] hover:bg-[#1F3C73] border-[#1F3C73]'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  <span>👕 1. Y PHỤC</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({filteredGarments.length} bộ)
                  </span>
                  <span
                    className={`text-[9.5px] font-mono truncate max-w-[110px] ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                    }`}
                  >
                    • {selectedCostume.name.split('(')[0]}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-1 py-0.5 border ${
                    theme === 'light'
                      ? 'bg-white/80 border-[#FED2B7] text-[#3D2314]'
                      : 'bg-black/40 border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  {openSections.garments ? '▲ THU GỌN' : '▼ MỞ RỘNG'}
                </span>
              </button>

              {openSections.garments && (
                <div
                  className="grid grid-cols-2 gap-2 p-2 wardrobe-scroll animate-in fade-in duration-150"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {filteredGarments.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs italic opacity-70">
                      Không có y phục nào với tag "{selectedTag}"
                    </div>
                  ) : (
                    filteredGarments.map((item) => {
                      const isSelected = isGarmentSelected(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateCharacterAppearance(item)}
                          className={`p-1.5 flex flex-col items-center gap-1.5 border-2 cursor-pointer transition-all text-left relative group ${
                            isSelected
                              ? theme === 'light'
                                ? 'bg-[#FED2B7] border-[#FFBFA0] shadow-inner text-[#3D2314] font-bold'
                                : 'bg-[#1F3C73] border-[#FFF3CB] shadow-[0_0_12px_rgba(255,243,203,0.5)] text-white'
                              : theme === 'light'
                              ? 'bg-white border-[#FED2B7] text-[#3D2314] hover:bg-[#FED2B7]/25'
                              : 'bg-[#050B31]/80 border-[#1F3C73] text-[#CBD5E1] hover:border-[#FFF3CB]'
                          }`}
                        >
                          {/* Nền thẻ & Thumbnail */}
                          <div className={`w-full h-16 relative flex items-center justify-center p-1 border overflow-hidden ${
                            theme === 'light' ? 'bg-[#E5E7EB] border-black/15' : 'bg-black/15 border-black/20'
                          }`}>
                            <ItemPixelThumbnail item={item} />
                            {isSelected && (
                              <span className="absolute top-1 right-1 text-[8.5px] font-bold font-mono px-1 py-0.2 bg-[#10b981] text-white shadow">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Tên vật phẩm */}
                          <div className="w-full min-w-0">
                            <div
                              className="text-[11px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] truncate"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                          </div>

                          {/* Badge Phân loại (Rarity Tag) ở góc dưới thẻ */}
                          <div className="w-full flex items-center justify-between mt-auto pt-1 border-t border-black/10">
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-white shadow-inner"
                              style={{ backgroundColor: item.primaryColor || '#b91c1c' }}
                            >
                              {item.tag}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] font-mono font-bold text-[#10b981]">
                                ĐANG MẶC
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* --- NHÓM 2: 👑 2. NÓN / MŨ / KHĂN ĐỘI --- */}
            <div
              className={`border overflow-hidden transition-all ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] border-[#FED2B7]'
                  : 'bg-[#0E2045]/60 border-[#1F3C73]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection('head')}
                className={`w-full flex items-center justify-between p-2 cursor-pointer border-b transition-colors ${
                  theme === 'light'
                    ? 'bg-[#FFFFE3] hover:bg-[#FED2B7]/40 border-[#FED2B7]'
                    : 'bg-[#0E2045] hover:bg-[#1F3C73] border-[#1F3C73]'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  <span>👑 2. NÓN / MŨ / KHĂN ĐỘI</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({filteredHeadAccessories.length} món)
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-1 py-0.5 border ${
                    theme === 'light'
                      ? 'bg-white/80 border-[#FED2B7] text-[#3D2314]'
                      : 'bg-black/40 border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  {openSections.head ? '▲ THU GỌN' : '▼ MỞ RỘNG'}
                </span>
              </button>

              {openSections.head && (
                <div
                  className="grid grid-cols-2 gap-2 p-2 wardrobe-scroll animate-in fade-in duration-150"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {filteredHeadAccessories.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs italic opacity-70">
                      Không có món nào với tag "{selectedTag}"
                    </div>
                  ) : (
                    filteredHeadAccessories.map((item) => {
                      const isEquipped = isAccessoryEquipped(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateCharacterAppearance(item)}
                          className={`p-1.5 flex flex-col items-center gap-1.5 border-2 cursor-pointer transition-all text-left relative group ${
                            isEquipped
                              ? theme === 'light'
                                ? 'bg-[#FED2B7] border-[#FFBFA0] shadow-inner text-[#3D2314] font-bold'
                                : 'bg-[#047857] border-[#FFF3CB] shadow-[0_0_12px_rgba(52,211,153,0.5)] text-white'
                              : theme === 'light'
                              ? 'bg-white border-[#FED2B7] text-[#3D2314] hover:bg-[#FED2B7]/25'
                              : 'bg-[#050B31]/80 border-[#1F3C73] text-[#CBD5E1] hover:border-[#FFF3CB]'
                          }`}
                        >
                          {/* Nền thẻ & Thumbnail */}
                          <div className={`w-full h-16 relative flex items-center justify-center p-1 border overflow-hidden ${
                            theme === 'light' ? 'bg-[#E5E7EB] border-black/15' : 'bg-black/15 border-black/20'
                          }`}>
                            <ItemPixelThumbnail item={item} />
                            {isEquipped && (
                              <span className="absolute top-1 right-1 text-[8.5px] font-bold font-mono px-1 py-0.2 bg-[#10b981] text-white shadow">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Tên vật phẩm */}
                          <div className="w-full min-w-0">
                            <div
                              className="text-[11px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] truncate"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                          </div>

                          {/* Badge Phân loại ở góc dưới */}
                          <div className="w-full flex items-center justify-between mt-auto pt-1 border-t border-black/10">
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-white shadow-inner"
                              style={{ backgroundColor: item.primaryColor || '#b91c1c' }}
                            >
                              {item.tag}
                            </span>
                            {isEquipped && (
                              <span className="text-[9px] font-mono font-bold text-[#10b981]">
                                ĐANG ĐỘI
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* --- NHÓM 3: 🎒 3. TRANG SỨC / CẦM TAY (REQUIREMENT 3: SỬA LỖI TRIỆT ĐỂ) --- */}
            <div
              className={`border overflow-hidden transition-all ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] border-[#FED2B7]'
                  : 'bg-[#0E2045]/60 border-[#1F3C73]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection('jewelry')}
                className={`w-full flex items-center justify-between p-2 cursor-pointer border-b transition-colors ${
                  theme === 'light'
                    ? 'bg-[#FFFFE3] hover:bg-[#FED2B7]/40 border-[#FED2B7]'
                    : 'bg-[#0E2045] hover:bg-[#1F3C73] border-[#1F3C73]'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  <span>🎒 3. TRANG SỨC / CẦM TAY</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({filteredJewelryAccessories.length} món)
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-1 py-0.5 border ${
                    theme === 'light'
                      ? 'bg-white/80 border-[#FED2B7] text-[#3D2314]'
                      : 'bg-black/40 border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  {openSections.jewelry ? '▲ THU GỌN' : '▼ MỞ RỘNG'}
                </span>
              </button>

              {openSections.jewelry && (
                <div
                  className="grid grid-cols-2 gap-2 p-2 wardrobe-scroll animate-in fade-in duration-150"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {filteredJewelryAccessories.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs italic opacity-70">
                      Không có món nào với tag "{selectedTag}"
                    </div>
                  ) : (
                    filteredJewelryAccessories.map((item) => {
                      const isEquipped = isAccessoryEquipped(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateCharacterAppearance(item)}
                          className={`p-1.5 flex flex-col items-center gap-1.5 border-2 cursor-pointer transition-all text-left relative group ${
                            isEquipped
                              ? theme === 'light'
                                ? 'bg-[#FED2B7] border-[#FFBFA0] shadow-inner text-[#3D2314] font-bold'
                                : 'bg-[#047857] border-[#FFF3CB] shadow-[0_0_12px_rgba(52,211,153,0.5)] text-white'
                              : theme === 'light'
                              ? 'bg-white border-[#FED2B7] text-[#3D2314] hover:bg-[#FED2B7]/25'
                              : 'bg-[#050B31]/80 border-[#1F3C73] text-[#CBD5E1] hover:border-[#FFF3CB]'
                          }`}
                        >
                          {/* Nền thẻ & Thumbnail với Fallback Guard */}
                          <div className={`w-full h-16 relative flex items-center justify-center p-1 border overflow-hidden ${
                            theme === 'light' ? 'bg-[#E5E7EB] border-black/15' : 'bg-black/15 border-black/20'
                          }`}>
                            <ItemPixelThumbnail item={item} />
                            {isEquipped && (
                              <span className="absolute top-1 right-1 text-[8.5px] font-bold font-mono px-1 py-0.2 bg-[#10b981] text-white shadow">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Tên vật phẩm */}
                          <div className="w-full min-w-0">
                            <div
                              className="text-[11px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] truncate"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                          </div>

                          {/* Badge Phân loại ở góc dưới */}
                          <div className="w-full flex items-center justify-between mt-auto pt-1 border-t border-black/10">
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-white shadow-inner"
                              style={{ backgroundColor: item.primaryColor || '#b91c1c' }}
                            >
                              {item.tag}
                            </span>
                            {isEquipped && (
                              <span className="text-[9px] font-mono font-bold text-[#10b981]">
                                ĐANG ĐEO
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* --- NHÓM 4: 👠 4. GIÀY / HÀI / GUỐC --- */}
            <div
              className={`border overflow-hidden transition-all ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] border-[#FED2B7]'
                  : 'bg-[#0E2045]/60 border-[#1F3C73]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection('feet')}
                className={`w-full flex items-center justify-between p-2 cursor-pointer border-b transition-colors ${
                  theme === 'light'
                    ? 'bg-[#FFFFE3] hover:bg-[#FED2B7]/40 border-[#FED2B7]'
                    : 'bg-[#0E2045] hover:bg-[#1F3C73] border-[#1F3C73]'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  <span>👠 4. GIÀY / HÀI / GUỐC</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({filteredFeetAccessories.length} món)
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-1 py-0.5 border ${
                    theme === 'light'
                      ? 'bg-white/80 border-[#FED2B7] text-[#3D2314]'
                      : 'bg-black/40 border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  {openSections.feet ? '▲ THU GỌN' : '▼ MỞ RỘNG'}
                </span>
              </button>

              {openSections.feet && (
                <div
                  className="grid grid-cols-2 gap-2 p-2 wardrobe-scroll animate-in fade-in duration-150"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {filteredFeetAccessories.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs italic opacity-70">
                      Không có món nào với tag "{selectedTag}"
                    </div>
                  ) : (
                    filteredFeetAccessories.map((item) => {
                      const isEquipped = isAccessoryEquipped(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateCharacterAppearance(item)}
                          className={`p-1.5 flex flex-col items-center gap-1.5 border-2 cursor-pointer transition-all text-left relative group ${
                            isEquipped
                              ? theme === 'light'
                                ? 'bg-[#FED2B7] border-[#FFBFA0] shadow-inner text-[#3D2314] font-bold'
                                : 'bg-[#047857] border-[#FFF3CB] shadow-[0_0_12px_rgba(52,211,153,0.5)] text-white'
                              : theme === 'light'
                              ? 'bg-white border-[#FED2B7] text-[#3D2314] hover:bg-[#FED2B7]/25'
                              : 'bg-[#050B31]/80 border-[#1F3C73] text-[#CBD5E1] hover:border-[#FFF3CB]'
                          }`}
                        >
                          {/* Nền thẻ & Thumbnail */}
                          <div className={`w-full h-16 relative flex items-center justify-center p-1 border overflow-hidden ${
                            theme === 'light' ? 'bg-[#E5E7EB] border-black/15' : 'bg-black/15 border-black/20'
                          }`}>
                            <ItemPixelThumbnail item={item} />
                            {isEquipped && (
                              <span className="absolute top-1 right-1 text-[8.5px] font-bold font-mono px-1 py-0.2 bg-[#10b981] text-white shadow">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Tên vật phẩm */}
                          <div className="w-full min-w-0">
                            <div
                              className="text-[11px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] truncate"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                          </div>

                          {/* Badge Phân loại ở góc dưới */}
                          <div className="w-full flex items-center justify-between mt-auto pt-1 border-t border-black/10">
                            <span
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 text-white shadow-inner"
                              style={{ backgroundColor: item.primaryColor || '#b91c1c' }}
                            >
                              {item.tag}
                            </span>
                            {isEquipped && (
                              <span className="text-[9px] font-mono font-bold text-[#10b981]">
                                ĐANG ĐI
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
