import React, { useState, useRef, useEffect } from 'react';
import { retroAudio } from '../utils/audio.ts';
import pixelMapImg from '../assets/images/pixel_vietnam_map_1791564766755.jpg';
import {
  TRAVEL_NODES,
  TimeTravelNode,
  PassportData,
  unlockPassportStamp,
} from '../data/timeTravelData.ts';
import { BadgeUnlockModal } from './BadgeUnlockModal.tsx';

export interface StoreLocation {
  id: string;
  name: string;
  city: 'hanoi' | 'hue' | 'hoian' | 'hcm';
  cityName: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  rating: number;
  reviewCount: number;
  services: string[];
  address: string;
  distanceKm: number;
  description: string;
  phone: string;
  openHours: string;
  mapCoordinates: { xPercent: number; yPercent: number };
  featuredOutfit: string;
  badge: string;
}

export const VIET_PHUC_STORES: StoreLocation[] = [
  {
    id: 'y-van-hien',
    name: 'Y Vân Hiên (Ý Vấn Hiên)',
    city: 'hanoi',
    cityName: 'Hà Nội',
    region: 'Bắc',
    rating: 4.9,
    reviewCount: 214,
    services: ['May đo lễ phục', 'Bán sẵn', 'Phụ kiện cổ truyền'],
    address: 'Số 8 Tràng Thi, Hoàn Kiếm, Hà Nội',
    distanceKm: 2.5,
    description: 'Thương hiệu tiên phong phục dựng cổ phục triều Lê - Nguyễn, từ hoàng bào, áo Nhật Bình đến Áo Tấc chuẩn khảo cứu lịch sử.',
    phone: '098 765 4321',
    openHours: '08:30 - 20:30',
    mapCoordinates: { xPercent: 44, yPercent: 22 },
    featuredOutfit: 'Áo Tấc & Nhật Bình Triều Nguyễn',
    badge: 'Khai Phá Cổ Phong',
  },
  {
    id: 'dai-viet-phong-hoa',
    name: 'Đại Việt Phong Hoa',
    city: 'hanoi',
    cityName: 'Hà Nội',
    region: 'Bắc',
    rating: 4.8,
    reviewCount: 142,
    services: ['Cho thuê chụp ảnh', 'Bán sẵn', 'Trang phục biểu diễn'],
    address: '28 Phố Hàng Buồm, Hoàn Kiếm, Hà Nội',
    distanceKm: 3.1,
    description: 'Không gian trải nghiệm Việt phục tại phố cổ Hà Nội, phong phú các mẫu áo Tứ thân, Ngũ thân tay chẽn và trang sức bạc cổ điển.',
    phone: '091 888 9922',
    openHours: '09:00 - 21:00',
    mapCoordinates: { xPercent: 52, yPercent: 26 },
    featuredOutfit: 'Áo Tứ Thân & Giao Lĩnh',
    badge: 'Phố Cổ Cổ Điển',
  },
  {
    id: 'dong-phong-hue',
    name: 'Đông Phong Cố Đô (Đông Phong Huế)',
    city: 'hue',
    cityName: 'Thừa Thiên Huế',
    region: 'Trung',
    rating: 5.0,
    reviewCount: 189,
    services: ['May đo truyền thống', 'Cho thuê Hoàng Cung', 'Nón lá & Guốc mộc'],
    address: '12 Lê Lợi, TP. Huế (Gần Đại Nội Kinh Thành)',
    distanceKm: 0.8,
    description: 'Đậm đà hương vị hoàng gia xứ Huế, chất liệu gấm dệt hoa, lụa tơ tằm tự nhiên và phụ kiện khảm trai tinh xảo bậc nhất cố đô.',
    phone: '093 555 7788',
    openHours: '08:00 - 21:30',
    mapCoordinates: { xPercent: 58, yPercent: 45 },
    featuredOutfit: 'Áo Nhật Bình Cung Đình Huế',
    badge: 'Di Sản Hoàng Cung',
  },
  {
    id: 'co-trang-hoi-an',
    name: 'Cổ Trang Phố Hội (Hội An Vintage)',
    city: 'hoian',
    cityName: 'Quảng Nam',
    region: 'Trung',
    rating: 4.8,
    reviewCount: 118,
    services: ['Cho thuê dạo phố', 'Gói chụp ảnh cổ trấn', 'Lồng đèn & Quạt lụa'],
    address: '64 Trần Phú, Phố cổ Hội An, Quảng Nam',
    distanceKm: 1.2,
    description: 'Điểm dừng chân nức tiếng bên bờ sông Hoài, cho thuê và chụp ảnh Việt phục dạo phố lồng đèn, Chùa Cầu và mái ngói rêu phong.',
    phone: '090 999 3344',
    openHours: '08:30 - 22:00',
    mapCoordinates: { xPercent: 64, yPercent: 52 },
    featuredOutfit: 'Áo Ngũ Thân & Quạt Thư Pháp',
    badge: 'Lễ Hội Hoa Đăng',
  },
  {
    id: 'hoa-nien',
    name: 'Hoa Niên - Bách Phục Niên Phong',
    city: 'hcm',
    cityName: 'TP. Hồ Chí Minh',
    region: 'Nam',
    rating: 4.9,
    reviewCount: 156,
    services: ['May đo cao cấp', 'Cho thuê chụp ảnh', 'Nghiên cứu phỏng dựng'],
    address: '45/2 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    distanceKm: 1.8,
    description: 'Nhóm nghiên cứu và may đo phục dựng cổ phục quy mô lớn tại miền Nam, phom dáng chuẩn mực, từng đường kim mũi chỉ đều sắc sảo.',
    phone: '090 123 4567',
    openHours: '09:00 - 20:00',
    mapCoordinates: { xPercent: 47, yPercent: 78 },
    featuredOutfit: 'Mãng Phục & Nhật Bình',
    badge: 'Kỳ Công Phục Dựng',
  },
  {
    id: 'van-thien-y',
    name: 'Vạn Thiên Y Cổ Phục',
    city: 'hcm',
    cityName: 'TP. Hồ Chí Minh',
    region: 'Nam',
    rating: 4.9,
    reviewCount: 98,
    services: ['Bán sẵn', 'Cho thuê sự kiện', 'Trang sức ngọc bội'],
    address: '120 Cách Mạng Tháng Tám, Quận 3, TP.HCM',
    distanceKm: 3.5,
    description: 'Kết hợp giữa lụa Vạn Phúc truyền thống và phong cách tân thời, đa dạng màu sắc trang nhã cho giới trẻ yêu thích văn hóa.',
    phone: '097 333 2211',
    openHours: '09:30 - 21:00',
    mapCoordinates: { xPercent: 54, yPercent: 82 },
    featuredOutfit: 'Áo Dài Ngũ Thân Tay Chẽn',
    badge: 'Thanh Nhã Tân Thời',
  },
];

interface VietPhucMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  passport?: PassportData;
  onUpdatePassport?: (updated: PassportData) => void;
  onSelectTravelLocation?: (node: TimeTravelNode) => void;
  onOpenPassport?: () => void;
  onTryOutfit?: (costumeId: string) => void;
  activeTravelNodeId?: string;
}

export const VietPhucMapModal: React.FC<VietPhucMapModalProps> = ({
  isOpen,
  onClose,
  theme = 'light',
  passport,
  onUpdatePassport,
  onSelectTravelLocation,
  onOpenPassport,
  onTryOutfit,
  activeTravelNodeId,
}) => {
  // Chế độ xem: 'travel' = Du Hành Lịch Sử 5 Chặng | 'stores' = Tiệm Cổ Phục Uy Tín
  const [mapMode, setMapMode] = useState<'travel' | 'stores'>('travel');
  const [selectedTravelNode, setSelectedTravelNode] = useState<TimeTravelNode>(() => {
    if (activeTravelNodeId) {
      const found = TRAVEL_NODES.find((n) => n.id === activeTravelNodeId);
      if (found) return found;
    }
    return TRAVEL_NODES[0];
  });
  const [inspectingTravelNode, setInspectingTravelNode] = useState<TimeTravelNode | null>(null);

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(VIET_PHUC_STORES[0]);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chế độ xem Lộ trình Demo Map giả lập & Liên hệ đặt lịch
  const [showRouteDemo, setShowRouteDemo] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingPhone, setBookingPhone] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [bookingService, setBookingService] = useState<string>('Cho thuê chụp ảnh');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  // Kéo thả Pop-up (Draggable Modal)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; modalX: number; modalY: number }>({
    startX: 0,
    startY: 0,
    modalX: 0,
    modalY: 0,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const initialX = Math.max(12, (window.innerWidth - 760) / 2);
    const initialY = Math.max(20, (window.innerHeight - 560) / 2);
    setPosition({ x: initialX, y: initialY });
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    const currentX = position?.x ?? 0;
    const currentY = position?.y ?? 0;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      modalX: currentX,
      modalY: currentY,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const newX = Math.max(8, Math.min(window.innerWidth - 300, dragStartRef.current.modalX + dx));
    const newY = Math.max(8, Math.min(window.innerHeight - 150, dragStartRef.current.modalY + dy));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const filteredStores = VIET_PHUC_STORES.filter((store) => {
    if (selectedCity === 'all') return true;
    return store.city === selectedCity;
  });

  const showToast = (msg: string) => {
    retroAudio.playBlip(540);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center bg-black/50 backdrop-blur-xs select-none">
      <div
        ref={modalRef}
        id="dia-do-viet-phuc-container"
        className={`fixed w-[95vw] max-w-[760px] max-h-[88vh] flex flex-col border-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md rounded-none transition-colors ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
            : 'bg-[#050B31] border-[#1F3C73] text-[#FFFFFF]'
        }`}
        style={{
          left: position ? `${position.x}px` : '50%',
          top: position ? `${position.y}px` : '50%',
          transform: position ? 'none' : 'translate(-50%, -50%)',
        }}
      >
        {/* ================= 1. HEADER BAR GỌN GÀNG (DRAGGABLE) ================= */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`flex items-center justify-between px-3.5 py-2.5 border-b select-none cursor-grab active:cursor-grabbing transition-colors ${
            isDragging ? 'ring-1 ring-amber-400' : ''
          } ${theme === 'light' ? 'bg-[#FED2B7]/35 border-[#FED2B7]' : 'bg-[#0E2045]/70 border-[#1F3C73]'}`}
        >
          {/* Logo Đèn lồng Pixel + Tiêu đề + Chú thích */}
          <div className="flex items-center gap-2 pointer-events-none min-w-0">
            <span className="text-xl animate-pulse" role="img" aria-label="lantern">
              {mapMode === 'travel' ? '🧭' : '🏮'}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h3
                  className={`text-base sm:text-lg font-bold font-['VT323','Silkscreen',monospace] tracking-wider uppercase truncate ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#FFF3CB]'
                  }`}
                >
                  {mapMode === 'travel' ? 'ĐỊA ĐỒ DU HÀNH VIỆT PHỤC' : 'ĐỊA ĐỒ VIỆT PHỤC'}
                </h3>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-[#FFA9A9]/50 dark:bg-[#1F3C73] border border-[#FFBFA0] dark:border-[#FFF3CB]/50 text-[#3D2314] dark:text-[#FFF3CB]">
                  {mapMode === 'travel' ? 'PIXEL TIME TRAVEL' : 'PIXEL 3D MAP'}
                </span>
              </div>
              <p
                className={`text-[10px] font-medium font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.2px] truncate ${
                  theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]'
                }`}
              >
                {mapMode === 'travel'
                  ? 'Hành trình 5 giai đoạn lịch sử • Bắt con dấu Hộ Chiếu Di Sản'
                  : 'Gợi ý điểm đến bán & cho thuê trang phục cổ truyền uy tín'}
              </p>
            </div>
          </div>

          {/* Nút đóng [X] nổi bật */}
          <button
            onClick={() => {
              retroAudio.playBlip(360);
              onClose();
            }}
            className="w-6 h-6 flex items-center justify-center bg-[#b91c1c] text-white font-bold text-xs border border-[#fef08a] hover:bg-[#dc2626] active:scale-95 cursor-pointer shrink-0 shadow-sm transition-all"
            title="Đóng bản đồ"
          >
            ✕
          </button>
        </div>

        {/* ================= 2. THANH CHUYỂN CHẾ ĐỘ & BỘ LỌC ================= */}
        <div
          className={`flex flex-col border-b text-xs ${
            theme === 'light' ? 'bg-[#FED2B7]/20 border-[#FED2B7]' : 'bg-[#050B31]/95 border-[#1F3C73]'
          }`}
        >
          {/* Hàng nút chọn chế độ chính (Du Hành vs Tiệm Cổ Phục) */}
          <div className="flex items-center justify-between gap-1.5 px-3 py-1.5 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(520);
                  setMapMode('travel');
                }}
                className={`px-2.5 py-1 text-[11px] font-bold font-mono transition-all border cursor-pointer flex items-center gap-1 active:translate-y-0.5 ${
                  mapMode === 'travel'
                    ? theme === 'light'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-sm font-black'
                      : 'bg-amber-600 text-white border-yellow-300 shadow-sm font-black'
                    : theme === 'light'
                    ? 'bg-white/80 border-[#FED2B7] text-[#5C2E1B] hover:bg-[#FED2B7]/40'
                    : 'bg-[#0E2045]/70 border-[#1F3C73] text-[#CBD5E1] hover:text-white'
                }`}
              >
                <span>🧭</span>
                <span>1. DU HÀNH VIỆT PHỤC (5 Chặng)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(520);
                  setMapMode('stores');
                }}
                className={`px-2.5 py-1 text-[11px] font-bold font-mono transition-all border cursor-pointer flex items-center gap-1 active:translate-y-0.5 ${
                  mapMode === 'stores'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] shadow-sm font-black'
                      : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB] shadow-sm font-black'
                    : theme === 'light'
                    ? 'bg-white/80 border-[#FED2B7] text-[#5C2E1B] hover:bg-[#FED2B7]/40'
                    : 'bg-[#0E2045]/70 border-[#1F3C73] text-[#CBD5E1] hover:text-white'
                }`}
              >
                <span>🏪</span>
                <span>2. TIỆM CỔ PHỤC (6 Tiệm)</span>
              </button>
            </div>

            {onOpenPassport && (
              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(540);
                  onOpenPassport();
                }}
                className="px-2.5 py-1 text-[11px] font-bold bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white border border-yellow-300 shadow-sm active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 transition-all"
                title="Mở cuốn Hộ Chiếu Di Sản"
              >
                <span>🛂</span>
                <span>HỘ CHIẾU ({Object.keys(passport?.unlockedStamps || {}).length}/5)</span>
              </button>
            )}
          </div>

          {/* Dải phụ thông tin cho từng chế độ */}
          <div className="flex items-center justify-between px-3 py-1 text-[10px]">
            {mapMode === 'travel' ? (
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-amber-700 dark:text-yellow-300 font-bold flex items-center gap-1">
                  <span className="animate-pulse">✨</span>
                  <span>Nhấn mũi tên vàng nhún nhảy hoặc điểm mốc để du hành bối cảnh & nhận con dấu</span>
                </span>
                <span className="font-mono opacity-80 hidden sm:inline">
                  Đã mở: {Object.keys(passport?.unlockedStamps || {}).length}/5
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {[
                    { id: 'all', label: 'Tất Cả (6)' },
                    { id: 'hanoi', label: '🏛️ Hà Nội (2)' },
                    { id: 'hue', label: '🪷 Huế (1)' },
                    { id: 'hoian', label: '🏮 Hội An (1)' },
                    { id: 'hcm', label: '🏙️ TP.HCM (2)' },
                  ].map((tab) => {
                    const active = selectedCity === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          retroAudio.playBlip(480);
                          setSelectedCity(tab.id);
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold font-['Be_Vietnam_Pro',sans-serif] transition-all cursor-pointer border whitespace-nowrap ${
                          active
                            ? theme === 'light'
                              ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black'
                              : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB] font-black'
                            : theme === 'light'
                            ? 'bg-white/80 border-[#FED2B7] text-[#5C2E1B] hover:bg-[#FED2B7]/30'
                            : 'bg-[#0E2045]/70 border-[#1F3C73] text-[#CBD5E1] hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <span className="hidden sm:inline-block text-[9.5px] font-mono shrink-0 opacity-80">
                  Nhấn vào ghim để định vị
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ================= 3. BỐ CỤC 2 CỘT TỐI ƯU & GỌN GÀNG ================= */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[360px] max-h-[66vh]">
          
          {/* CỘT TRÁI (MD: 6 CỘT): BẢN ĐỒ PIXEL ART CHUẨN ĐẠI VIỆT THEO ẢNH */}
          <div
            className={`md:col-span-6 relative flex flex-col items-center justify-center p-2.5 border-b md:border-b-0 md:border-r overflow-hidden select-none ${
              theme === 'light' ? 'bg-[#FFFEE0] border-[#FED2B7]' : 'bg-[#050B31] border-[#1F3C73]'
            }`}
          >
            {/* KHUNG BẢN ĐỒ PIXEL ART 3D VIỆT NAM */}
            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[380px] flex items-center justify-center rounded-xs overflow-hidden border border-black/10 shadow-inner bg-[#1A3358]">
              {/* Ảnh Bản Đồ Pixel Art 3D Sắc Nét */}
              <img
                src={pixelMapImg}
                alt="Pixel Art Vietnam Map"
                className="w-full h-full object-cover object-center pixelated"
                loading="eager"
              />

              {/* ================= TRƯỜNG HỢP 1: HIỂN THỊ ĐIỂM DU HÀNH LỊCH SỬ (TRAVEL MODE) ================= */}
              {mapMode === 'travel' && (
                <>
                  {TRAVEL_NODES.map((node) => {
                    // Xác định điểm tiếp theo cần khám phá hoặc đang chọn
                    const nextUncollectedNode = TRAVEL_NODES.find(
                      (n) => !passport?.unlockedStamps?.[n.id]
                    );
                    const currentTargetNodeId =
                      selectedTravelNode?.id ||
                      (nextUncollectedNode ? nextUncollectedNode.id : TRAVEL_NODES[0].id);

                    const isTarget = node.id === currentTargetNodeId;
                    const isUnlocked = !!passport?.unlockedStamps?.[node.id];
                    const isHovered = hoveredPin === node.id;

                    return (
                      <div
                        key={node.id}
                        className="absolute z-20"
                        style={{
                          left: `${node.mapCoords.xPercent}%`,
                          top: `${node.mapCoords.yPercent}%`,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        {/* ================= MŨI TÊN CHỈ XUỐNG PIXEL MÀU VÀNG PHÁT SÁNG NHÚN NHẢY NHỊP NHÀNG ================= */}
                        {isTarget && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 animate-pixel-bounce">
                            <div className="px-1.5 py-0.2 text-[8px] font-mono font-black bg-yellow-400 text-black border border-yellow-200 rounded-xs shadow-md uppercase tracking-tighter whitespace-nowrap animate-pulse">
                              ▼ {isUnlocked ? 'GHÉ LẠI' : 'KHÁM PHÁ'}
                            </div>
                            <svg
                              className="w-5 h-5 text-yellow-300 filter drop-shadow-[0_0_8px_rgba(250,204,21,1)]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M11 2h2v12h3l-4 6-4-6h3V2z" />
                            </svg>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTravelNode(node);
                            retroAudio.playBlip(540);
                            onSelectTravelLocation?.(node);
                            setInspectingTravelNode(node);
                          }}
                          onMouseEnter={() => {
                            setHoveredPin(node.id);
                            retroAudio.playBlip(320);
                          }}
                          onMouseLeave={() => setHoveredPin(null)}
                          className={`relative group cursor-pointer focus:outline-none flex flex-col items-center transition-all ${
                            isTarget ? 'scale-115 z-30' : 'hover:scale-105'
                          }`}
                          title={`${node.title} - Nhấn để du hành & mở con dấu`}
                        >
                          {/* Hào quang nhấp nháy */}
                          {isTarget && (
                            <div className="absolute -bottom-1 w-4 h-2 rounded-full bg-yellow-400/90 animate-ping" />
                          )}

                          {/* Ghim Node Pixel Art Chặng Lịch Sử */}
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-md transition-all ${
                              isTarget
                                ? 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 border-white text-white ring-2 ring-yellow-400 font-bold -translate-y-1'
                                : isUnlocked
                                ? 'bg-emerald-700 border-emerald-300 text-white'
                                : isHovered
                                ? 'bg-amber-600 border-white text-white -translate-y-0.5'
                                : 'bg-black/80 border-amber-300/80 text-amber-200 hover:bg-black/90'
                            }`}
                          >
                            <span className="text-xs">{node.stamp.symbol}</span>
                            <span className="text-[9px] font-mono font-bold leading-none hidden sm:inline-block max-w-[65px] truncate">
                              #{node.order} {node.name.split(' ')[0]}
                            </span>
                            {isUnlocked && <span className="text-[8px] text-green-200">✓</span>}
                          </div>

                          {/* Mũi kim cắm xuống tọa độ */}
                          <div
                            className={`w-0 h-0 border-x-[3px] border-x-transparent border-t-[4px] -mt-[0.5px] transition-colors ${
                              isTarget
                                ? 'border-t-yellow-400'
                                : isUnlocked
                                ? 'border-t-emerald-500'
                                : 'border-t-black/80'
                            }`}
                          />

                          {/* Tooltip khi rê chuột */}
                          {isHovered && !isTarget && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-[8.5px] font-bold whitespace-nowrap shadow-lg border pointer-events-none transition-all z-40 bg-[#0E2045]/95 text-[#FFF3CB] border-amber-300/80 rounded-xs">
                              <span>{node.name}</span>
                              <span className="text-yellow-300 ml-1">
                                {isUnlocked ? '✓ Đã mở' : 'Chưa mở'}
                              </span>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}

                  {/* Chú giải góc bản đồ Chặng Lịch Sử */}
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-[8.5px] font-mono bg-black/80 text-amber-200 border border-amber-300/40 backdrop-blur-xs flex items-center gap-1.5">
                    <span>👒 Bắc Bộ</span>
                    <span>•</span>
                    <span>🐲 Thăng Long</span>
                    <span>•</span>
                    <span>👑 Cố Đô</span>
                    <span>•</span>
                    <span>🏮 Phố Hội</span>
                    <span>•</span>
                    <span>☁️ Bồng Lai</span>
                  </div>
                </>
              )}

              {/* ================= TRƯỜNG HỢP 2: HIỂN THỊ CÁC CỬA HÀNG CỔ PHỤC (STORES MODE) ================= */}
              {mapMode === 'stores' && (
                <>
                  {filteredStores.map((store) => {
                    const isSelected = selectedStore.id === store.id;
                    const isHovered = hoveredPin === store.id;

                    return (
                      <div
                        key={store.id}
                        className="absolute z-20"
                        style={{
                          left: `${store.mapCoordinates.xPercent}%`,
                          top: `${store.mapCoordinates.yPercent}%`,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            retroAudio.playBlip(520);
                            setSelectedStore(store);
                          }}
                          onMouseEnter={() => {
                            setHoveredPin(store.id);
                            retroAudio.playBlip(320);
                          }}
                          onMouseLeave={() => setHoveredPin(null)}
                          className={`relative group cursor-pointer focus:outline-none flex flex-col items-center transition-all ${
                            isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                          }`}
                          title={`${store.name} (${store.cityName})`}
                        >
                          {isSelected && (
                            <div className="absolute -bottom-1 w-3.5 h-1.5 rounded-full bg-amber-400/80 animate-ping" />
                          )}

                          <div
                            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border shadow-md transition-all ${
                              isSelected
                                ? 'bg-amber-400 border-white text-black ring-1 ring-amber-500 font-bold -translate-y-1'
                                : isHovered
                                ? 'bg-rose-500 border-white text-white -translate-y-0.5 shadow-lg'
                                : 'bg-black/75 backdrop-blur-xs border-amber-300/80 text-amber-200 hover:bg-black/90'
                            }`}
                          >
                            <span className="text-[10px] leading-none select-none">
                              {store.city === 'hue' || store.city === 'hoian' ? '🏮' : '🪷'}
                            </span>
                            <span className="text-[8.5px] font-mono font-bold leading-none hidden sm:inline-block max-w-[55px] truncate">
                              {store.cityName}
                            </span>
                          </div>

                          <div
                            className={`w-0 h-0 border-x-[3px] border-x-transparent border-t-[4px] -mt-[0.5px] transition-colors ${
                              isSelected
                                ? 'border-t-amber-400'
                                : isHovered
                                ? 'border-t-rose-500'
                                : 'border-t-black/75'
                            }`}
                          />

                          {isHovered && !isSelected && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 text-[8.5px] font-bold whitespace-nowrap shadow-lg border pointer-events-none transition-all z-40 bg-[#0E2045]/95 text-[#FFF3CB] border-amber-300/80 rounded-xs">
                              <span>{store.name.split('(')[0].trim()}</span>
                              <span className="text-amber-300 ml-1">⭐{store.rating}</span>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}

                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 text-[8.5px] font-mono bg-black/75 text-amber-200 border border-amber-300/40 backdrop-blur-xs flex items-center gap-2">
                    <span>🪷 Tiệm Cổ Phục</span>
                    <span>•</span>
                    <span>🏮 Phố Cổ / Cố Đô</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (MD: 6 CỘT): CHI TIẾT DU HÀNH HOẶC CHI TIẾT CỬA HÀNG */}
          <div
            className={`md:col-span-6 flex flex-col p-2.5 sm:p-3 gap-2 overflow-hidden ${
              theme === 'light' ? 'bg-[#FFFFE3]' : 'bg-[#0E2045]/30'
            }`}
          >
            {/* ================= PHẦN A: NỘI DUNG CHẾ ĐỘ DU HÀNH LỊCH SỬ (TRAVEL MODE) ================= */}
            {mapMode === 'travel' && (
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {/* Header chặng được chọn */}
                <div
                  className={`p-2.5 border shadow-sm flex flex-col gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-[#FED2B7]/60 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#0E2045] border-[#1F3C73] text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{selectedTravelNode.stamp.symbol}</span>
                        <h4 className="text-xs sm:text-[13px] font-bold font-['Be_Vietnam_Pro',sans-serif] leading-tight">
                          {selectedTravelNode.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono">
                        <span className="text-amber-700 dark:text-yellow-300 font-bold">
                          {selectedTravelNode.era}
                        </span>
                      </div>
                    </div>

                    {passport?.unlockedStamps?.[selectedTravelNode.id] ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-600 text-white font-bold rounded-xs shrink-0">
                        ✓ ĐÃ ĐÓNG DẤU
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-yellow-500 text-black font-extrabold rounded-xs shrink-0 animate-pulse">
                        ⚡ CẦN KHÁM PHÁ
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] leading-relaxed opacity-90 line-clamp-2">
                    {selectedTravelNode.knowledge.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10 text-[9.5px]">
                    <span className="font-semibold text-amber-800 dark:text-yellow-200">
                      👘 {selectedTravelNode.knowledge.costumeHighlight}
                    </span>
                  </div>

                  {/* 2 nút hành động chặng */}
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(540);
                        onSelectTravelLocation?.(selectedTravelNode);
                        setInspectingTravelNode(selectedTravelNode);
                      }}
                      className="py-1.5 px-2 text-[10.5px] font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-yellow-300 shadow-2xs cursor-pointer active:scale-95 flex items-center justify-center gap-1 transition-all"
                    >
                      <span>💮</span>
                      <span>Khám Phá & Đóng Dấu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playEquip();
                        onTryOutfit?.(selectedTravelNode.knowledge.recommendedCostumeId);
                        showToast('Đã mặc thử y phục vùng này!');
                      }}
                      className={`py-1.5 px-2 text-[10.5px] font-bold border cursor-pointer active:scale-95 flex items-center justify-center gap-1 transition-all ${
                        theme === 'light'
                          ? 'bg-[#FED2B7] hover:bg-[#ffc89b] text-[#3D2314] border-[#FFBFA0]'
                          : 'bg-[#1F3C73] hover:bg-[#2a5298] text-[#FFF3CB] border-[#FFF3CB]'
                      }`}
                    >
                      <span>👘</span>
                      <span>Mặc Thử Y Phục</span>
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH 5 CHẶNG LỊCH SỬ CUỘN DỌC */}
                <div className="flex-1 flex flex-col min-h-0 pt-0.5">
                  <div
                    className={`text-[10px] font-bold font-mono uppercase pb-1 flex items-center justify-between ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                    }`}
                  >
                    <span>LỘ TRÌNH 5 GIAI ĐOẠN LỊCH SỬ</span>
                    <span className="text-[9px] opacity-75">
                      ĐÃ MỞ {Object.keys(passport?.unlockedStamps || {}).length}/5
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto vietphuc-map-scroll flex flex-col gap-1 pr-1">
                    {TRAVEL_NODES.map((node) => {
                      const isCur = node.id === selectedTravelNode.id;
                      const isUnlocked = !!passport?.unlockedStamps?.[node.id];

                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => {
                            setSelectedTravelNode(node);
                            retroAudio.playBlip(440);
                            onSelectTravelLocation?.(node);
                          }}
                          className={`w-full p-2 text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isCur
                              ? theme === 'light'
                                ? 'bg-[#FFA9A9]/70 border-[#FFBFA0] font-bold shadow-2xs'
                                : 'bg-[#1F3C73] border-yellow-300 text-white font-bold shadow-2xs'
                              : theme === 'light'
                              ? 'bg-white/80 hover:bg-[#FED2B7]/30 border-[#FED2B7] text-[#3D2314]'
                              : 'bg-[#050B31]/80 hover:bg-[#0E2045] border-[#1F3C73] text-[#CBD5E1]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-base">{node.stamp.symbol}</span>
                              <span className="text-[11px] truncate font-bold">
                                {node.title}
                              </span>
                            </div>
                            <div className="text-[9.5px] opacity-80 truncate font-mono">
                              {node.landmark}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {isUnlocked ? (
                              <span className="text-[9px] font-mono text-green-600 dark:text-green-300 font-bold block">
                                ✓ ĐÃ ĐÓNG DẤU
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-amber-600 dark:text-yellow-400 font-bold block">
                                🔒 CHƯA MỞ
                              </span>
                            )}
                            <span className="text-[8px] font-mono opacity-70">
                              {node.region}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= PHẦN B: NỘI DUNG CHẾ ĐỘ TIỆM CỔ PHỤC (STORES MODE) ================= */}
            {mapMode === 'stores' && (
              <>
                {/* THẺ THÔNG TIN CỬA HÀNG ĐANG CHỌN (STORE CARD INFO) */}
                <div
                  className={`p-2.5 border shadow-sm flex flex-col gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-[#FED2B7]/60 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#0E2045] border-[#1F3C73] text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {selectedStore.city === 'hue' || selectedStore.city === 'hoian' ? '🏮' : '🪷'}
                        </span>
                        <h4 className="text-xs sm:text-[13px] font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] leading-tight truncate">
                          {selectedStore.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-[#b45309] dark:text-[#fef08a] flex items-center gap-0.5">
                          ⭐ {selectedStore.rating}
                        </span>
                        <span
                          className={`text-[9.5px] font-mono ${
                            theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]'
                          }`}
                        >
                          ({selectedStore.reviewCount} đánh giá)
                        </span>
                        <span
                          className={`text-[8.5px] font-mono px-1 py-0.2 border ${
                            theme === 'light'
                              ? 'bg-[#FFA9A9]/70 border-[#FFBFA0] text-[#3D2314]'
                              : 'bg-[#1F3C73] border-[#FFF3CB]/50 text-[#FFF3CB]'
                          }`}
                        >
                          {selectedStore.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dịch vụ */}
                  <div className="flex flex-wrap gap-1">
                    {selectedStore.services.map((svc) => (
                      <span
                        key={svc}
                        className={`text-[9px] px-1.5 py-0.2 border font-medium ${
                          theme === 'light'
                            ? 'bg-white/80 border-[#FFBFA0] text-[#3D2314]'
                            : 'bg-black/40 border-[#1F3C73] text-[#CBD5E1]'
                        }`}
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>

                  {/* Địa chỉ & Khoảng cách */}
                  <div
                    className={`text-[10px] font-medium leading-relaxed pt-1 border-t ${
                      theme === 'light'
                        ? 'border-[#FFBFA0]/60 text-[#3D2314]'
                        : 'border-[#1F3C73] text-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-start gap-1 truncate">
                      <span className="shrink-0">📍</span>
                      <span className="truncate">{selectedStore.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] mt-0.5 opacity-85">
                      <span>🚗 Khoảng cách: <strong>~{selectedStore.distanceKm} km</strong></span>
                      <span>🕒 {selectedStore.openHours}</span>
                    </div>
                  </div>

                  {/* SỐ ĐIỆN THOẠI & HOTLINE */}
                  <div
                    className={`flex items-center justify-between px-2 py-1 border text-[10px] font-mono transition-colors ${
                      theme === 'light'
                        ? 'bg-white/90 border-[#FFBFA0] text-[#3D2314]'
                        : 'bg-[#050B31]/90 border-[#1F3C73] text-[#FFF3CB]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold truncate">
                      <span className="text-xs">📞</span>
                      <span>Hotline:</span>
                      <a
                        href={`tel:${selectedStore.phone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#b45309] dark:text-[#fef08a] hover:underline font-bold tracking-wider"
                        title="Bấm để gọi ngay"
                      >
                        {selectedStore.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedStore.phone);
                        showToast(`Đã sao chép SĐT: ${selectedStore.phone}`);
                      }}
                      className={`text-[9px] px-1.5 py-0.5 border cursor-pointer active:scale-95 transition-all shrink-0 ${
                        theme === 'light'
                          ? 'bg-[#FED2B7]/50 hover:bg-[#FED2B7] border-[#FFBFA0] text-[#3D2314]'
                          : 'bg-[#1F3C73]/70 hover:bg-[#1F3C73] border-[#FFF3CB]/50 text-[#FFF3CB]'
                      }`}
                      title="Sao chép số điện thoại"
                    >
                      Sao chép
                    </button>
                  </div>

                  <p
                    className={`text-[9.5px] leading-relaxed italic line-clamp-2 ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                    }`}
                  >
                    "{selectedStore.description}"
                  </p>

                  {/* Nút hành động */}
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(560);
                        setShowRouteDemo(true);
                        setShowContactModal(false);
                      }}
                      className={`py-1.5 px-2 text-[10.5px] font-bold font-['Be_Vietnam_Pro',sans-serif] border cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        theme === 'light'
                          ? 'bg-[#FED2B7] hover:bg-[#ffc89b] text-[#3D2314] border-[#FFBFA0] shadow-2xs'
                          : 'bg-[#1F3C73] hover:bg-[#2a5298] text-[#FFF3CB] border-[#FFF3CB] shadow-2xs'
                      }`}
                      title="Mở bản đồ dẫn đường demo giả lập"
                    >
                      <span>🧭</span>
                      <span>Xem Đường Đi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(620);
                        setShowContactModal(true);
                        setShowRouteDemo(false);
                      }}
                      className={`py-1.5 px-2 text-[10.5px] font-bold font-['Be_Vietnam_Pro',sans-serif] border cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        theme === 'light'
                          ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0] font-black shadow-2xs'
                          : 'bg-[#b45309] hover:bg-[#d97706] text-white border-[#fef08a] font-black shadow-2xs'
                      }`}
                      title="Xem số điện thoại & liên hệ đặt lịch"
                    >
                      <span>📞</span>
                      <span>Liên Hệ</span>
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH TIỆM KHÁC */}
                <div className="flex-1 flex flex-col min-h-0 pt-0.5">
                  <div
                    className={`text-[10px] font-bold font-mono uppercase pb-1 flex items-center justify-between ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                    }`}
                  >
                    <span>DANH SÁCH TIỆM ({filteredStores.length})</span>
                    <span className="text-[9px] opacity-75">CHỌN ĐỂ ĐỊNH VỊ</span>
                  </div>

                  <div className="flex-1 overflow-y-auto vietphuc-map-scroll flex flex-col gap-1 pr-1">
                    {filteredStores.map((st) => {
                      const isCur = st.id === selectedStore.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            retroAudio.playBlip(440);
                            setSelectedStore(st);
                          }}
                          className={`w-full p-1.5 text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                            isCur
                              ? theme === 'light'
                                ? 'bg-[#FFA9A9]/60 border-[#FFBFA0] font-bold shadow-2xs'
                                : 'bg-[#1F3C73] border-[#FFF3CB] text-white font-bold shadow-2xs'
                              : theme === 'light'
                              ? 'bg-white/75 hover:bg-[#FED2B7]/30 border-[#FED2B7] text-[#3D2314]'
                              : 'bg-[#050B31]/80 hover:bg-[#0E2045] border-[#1F3C73] text-[#CBD5E1]'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-xs">{st.city === 'hue' || st.city === 'hoian' ? '🏮' : '🪷'}</span>
                              <span className="text-[11px] truncate font-semibold">{st.name}</span>
                            </div>
                            <div className="text-[9px] opacity-80 truncate">
                              {st.cityName} • {st.services[0]}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-[11px] font-bold text-[#b45309] dark:text-[#fef08a]">
                              ⭐ {st.rating}
                            </div>
                            <div className="text-[8.5px] font-mono opacity-75">
                              {st.distanceKm} km
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* ================= 4. FOOTER THANH MẢNH ================= */}
        <div
          className={`px-3 py-1.5 border-t flex items-center justify-between text-[9.5px] font-mono ${
            theme === 'light' ? 'bg-[#FED2B7]/25 border-[#FED2B7] text-[#5C2E1B]' : 'bg-[#0E2045]/70 border-[#1F3C73] text-[#CBD5E1]'
          }`}
        >
          {toastMessage ? (
            <span className="text-[#b91c1c] dark:text-[#fef08a] font-bold animate-pulse truncate">
              🔔 {toastMessage}
            </span>
          ) : (
            <span className="truncate">Kéo tiêu đề để di chuyển • Phím D hoặc Esc để đóng</span>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold">VIỆT PHỤC MAP</span>
            <button
              onClick={() => {
                retroAudio.playBlip(320);
                onClose();
              }}
              className="hover:underline cursor-pointer font-bold ml-1 text-[#b91c1c] dark:text-[#FFF3CB]"
            >
              Đóng [X]
            </button>
          </div>
        </div>

        {/* ================= 5. OVERLAY: BẢN ĐỒ DẪN ĐƯỜNG GIẢ LẬP (DEMO ROUTE MAP) ================= */}
        {showRouteDemo && (
          <div
            className={`absolute inset-0 z-40 flex flex-col backdrop-blur-md transition-all animate-fadeIn ${
              theme === 'light'
                ? 'bg-[#FFFFE3] text-[#3D2314]'
                : 'bg-[#050B31] text-[#FFFFFF]'
            }`}
          >
            {/* Header Lộ Trình Demo */}
            <div
              className={`flex items-center justify-between px-3.5 py-2 border-b select-none ${
                theme === 'light'
                  ? 'bg-[#FED2B7]/60 border-[#FFBFA0]'
                  : 'bg-[#0E2045] border-[#1F3C73]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg animate-bounce">🧭</span>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold font-['Be_Vietnam_Pro',sans-serif] truncate">
                    BẢN ĐỒ DẪN ĐƯỜNG DEMO • {selectedStore.name}
                  </h4>
                  <p className="text-[9.5px] opacity-80 font-mono truncate">
                    Lộ trình giả lập GPS từ vị trí hiện tại đến cửa hàng
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(360);
                  setShowRouteDemo(false);
                }}
                className="px-2 py-0.5 text-xs font-bold border cursor-pointer hover:bg-black/10 active:scale-95 transition-all shrink-0 bg-red-600 text-white border-yellow-300"
                title="Quay lại bản đồ chính"
              >
                ✕ Đóng Lộ Trình
              </button>
            </div>

            {/* Nội dung Demo Map: Khung Bản Đồ Giả Lập Vector + Bảng Chỉ Đường */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
              
              {/* Cột 1 (MD: 7 CỘT): KHUNG BẢN ĐỒ GIẢ LẬP ĐƯỜNG PHỐ VECTOR SVG */}
              <div
                className={`md:col-span-7 relative flex flex-col p-2.5 border-b md:border-b-0 md:border-r overflow-hidden ${
                  theme === 'light' ? 'bg-[#FFFEE0] border-[#FFBFA0]' : 'bg-[#040822] border-[#1F3C73]'
                }`}
              >
                {/* Thanh trạng thái GPS giả lập */}
                <div
                  className={`flex items-center justify-between px-2 py-1 mb-1.5 text-[9px] font-mono border ${
                    theme === 'light'
                      ? 'bg-white/80 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#0E2045]/90 border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold">GPS: ĐÃ KHÓA TỌA ĐỘ (±3m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Tốc độ TB: 32 km/h</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">Giao thông: Thoáng 🟢</span>
                  </div>
                </div>

                {/* Khung Bản Đồ Vector Vẽ Đường Phố Giả Lập */}
                <div className="relative flex-1 rounded-xs overflow-hidden border border-black/20 shadow-inner bg-[#1A2E4C] flex items-center justify-center">
                  {/* SVG Bản Đồ Đường Phố và Sông Nước */}
                  <svg
                    viewBox="0 0 500 320"
                    className="w-full h-full object-cover select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Grid sọc nền đường phố */}
                      <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#253E65" strokeWidth="1" strokeOpacity="0.4" />
                      </pattern>
                      {/* Gradient tuyến đường */}
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>

                    {/* Nền bản đồ */}
                    <rect width="500" height="320" fill="#13233c" />
                    <rect width="500" height="320" fill="url(#street-grid)" />

                    {/* Sông / Hồ đặc trưng vùng miền */}
                    {selectedStore.city === 'hanoi' && (
                      <path
                        d="M 180,90 Q 240,60 270,110 T 260,170 T 200,160 Z"
                        fill="#0c4a6e"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    )}
                    {selectedStore.city === 'hue' && (
                      <path
                        d="M 0,180 Q 150,130 280,180 T 500,140 L 500,200 Q 320,240 180,190 T 0,240 Z"
                        fill="#0c4a6e"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    )}
                    {selectedStore.city === 'hoian' && (
                      <path
                        d="M 0,220 Q 200,180 350,220 T 500,210 L 500,260 Q 350,270 200,240 T 0,270 Z"
                        fill="#0c4a6e"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    )}
                    {selectedStore.city === 'hcm' && (
                      <path
                        d="M 320,0 Q 380,100 330,190 T 420,320 L 470,320 Q 400,210 430,90 T 370,0 Z"
                        fill="#0c4a6e"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    )}

                    {/* Tên Thủy vực */}
                    <text x="210" y="140" fill="#7dd3fc" fontSize="9" fontFamily="monospace" opacity="0.8">
                      {selectedStore.city === 'hanoi'
                        ? 'Hồ Hoàn Kiếm'
                        : selectedStore.city === 'hue'
                        ? 'Sông Hương (Hương Giang)'
                        : selectedStore.city === 'hoian'
                        ? 'Sông Hoài'
                        : 'Sông Sài Gòn'}
                    </text>

                    {/* Mạng lưới đại lộ & phố chính */}
                    <line x1="40" y1="50" x2="460" y2="50" stroke="#334d75" strokeWidth="6" />
                    <line x1="40" y1="130" x2="460" y2="130" stroke="#334d75" strokeWidth="8" />
                    <line x1="40" y1="230" x2="460" y2="230" stroke="#334d75" strokeWidth="6" />
                    <line x1="90" y1="20" x2="90" y2="300" stroke="#334d75" strokeWidth="6" />
                    <line x1="220" y1="20" x2="220" y2="300" stroke="#334d75" strokeWidth="8" />
                    <line x1="390" y1="20" x2="390" y2="300" stroke="#334d75" strokeWidth="7" />

                    {/* Tên các tuyến đường chính */}
                    <text x="95" y="45" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                      {selectedStore.city === 'hanoi' ? 'Phố Tràng Tiền' : selectedStore.city === 'hue' ? 'Đường 23 Tháng 8' : selectedStore.city === 'hoian' ? 'Phố Trần Phú' : 'Đại lộ Lê Duẩn'}
                    </text>
                    <text x="225" y="125" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                      {selectedStore.city === 'hanoi' ? 'Đường Tràng Thi' : selectedStore.city === 'hue' ? 'Đường Lê Lợi' : selectedStore.city === 'hoian' ? 'Đường Bạch Đằng' : 'Đường Đồng Khởi'}
                    </text>
                    <text x="95" y="225" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                      {selectedStore.city === 'hanoi' ? 'Phố Hàng Buồm' : selectedStore.city === 'hue' ? 'Cầu Tràng Tiền' : selectedStore.city === 'hoian' ? 'Chùa Cầu' : 'Đại lộ Nguyễn Huệ'}
                    </text>

                    {/* TUYẾN ĐƯỜNG DẪN ĐƯỜNG ĐANG ĐI (ANIMATED ROUTE PATH) */}
                    <path
                      d="M 90,260 L 90,130 L 220,130 L 220,70 L 370,70 L 370,110"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="8 5"
                      className="animate-pulse"
                    />

                    {/* Xe máy di chuyển giả lập */}
                    <circle cx="160" cy="130" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                    <text x="156" y="133" fontSize="8">🛵</text>

                    {/* Điểm Xuất Phát (Vị trí người dùng) */}
                    <g transform="translate(90, 260)">
                      <circle r="12" fill="#0284c7" opacity="0.3" className="animate-ping" />
                      <circle r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                      <rect x="-45" y="12" width="90" height="15" rx="3" fill="#0369a1" opacity="0.9" />
                      <text x="0" y="23" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        Vị trí của bạn
                      </text>
                    </g>

                    {/* Điểm Đến (Tiệm Việt phục) */}
                    <g transform="translate(370, 110)">
                      <circle r="14" fill="#ef4444" opacity="0.4" className="animate-ping" />
                      <circle r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                      <rect x="-65" y="-30" width="130" height="18" rx="3" fill="#991b1b" stroke="#fef08a" strokeWidth="1" />
                      <text x="0" y="-18" textAnchor="middle" fill="#fef08a" fontSize="8.5" fontWeight="bold">
                        🪷 {selectedStore.name.split('(')[0].trim()}
                      </text>
                    </g>

                    {/* La Bàn (Compass) góc phải trên */}
                    <g transform="translate(460, 35)">
                      <circle r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" opacity="0.8" />
                      <text x="0" y="-4" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">B</text>
                      <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="7">N</text>
                      <line x1="0" y1="-10" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="-10" y1="0" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                    </g>
                  </svg>

                  {/* Badge thống kê lộ trình nổi bật */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/85 backdrop-blur-xs border border-amber-300 text-amber-200 text-[9px] font-mono shadow-md flex items-center gap-2">
                    <span>🚗 Quãng đường: <strong>{selectedStore.distanceKm} km</strong></span>
                    <span>•</span>
                    <span>⏱️ Dự kiến: <strong>{Math.round(selectedStore.distanceKm * 3.5 + 4)} phút</strong></span>
                  </div>
                </div>
              </div>

              {/* Cột 2 (MD: 5 CỘT): CHI TIẾT TỪNG CHẶNG RẼ & HÀNH ĐỘNG */}
              <div
                className={`md:col-span-5 flex flex-col p-2.5 sm:p-3 gap-2 overflow-y-auto vietphuc-map-scroll ${
                  theme === 'light' ? 'bg-[#FFFFE3]' : 'bg-[#0E2045]/40'
                }`}
              >
                {/* Thông tin tiệm đích */}
                <div
                  className={`p-2 border text-[10px] flex flex-col gap-1 ${
                    theme === 'light'
                      ? 'bg-[#FED2B7]/50 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#0E2045] border-[#1F3C73] text-[#CBD5E1]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1 text-[11px] text-[#b45309] dark:text-[#fef08a]">
                    <span>📍 Đích Đến:</span>
                    <span className="truncate">{selectedStore.name}</span>
                  </div>
                  <div className="opacity-90">{selectedStore.address}</div>
                  <div className="flex items-center justify-between font-mono pt-1 border-t border-black/10 dark:border-white/10 text-[9px]">
                    <span>Hotline: <strong>{selectedStore.phone}</strong></span>
                    <span>Giờ mở: <strong>{selectedStore.openHours}</strong></span>
                  </div>
                </div>

                {/* Danh sách các chặng rẽ dẫn đường (Turn-by-turn guidance) */}
                <div className="flex-1 flex flex-col gap-1 min-h-0">
                  <div
                    className={`text-[9.5px] font-bold font-mono uppercase pb-0.5 ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fed7aa]'
                    }`}
                  >
                    CÁC CHẶNG DI CHUYỂN GIẢ LẬP:
                  </div>

                  <div className="flex flex-col gap-1.5 text-[9.5px] font-['Be_Vietnam_Pro',sans-serif]">
                    <div
                      className={`p-1.5 border rounded-xs flex items-start gap-1.5 ${
                        theme === 'light' ? 'bg-white/80 border-[#FFBFA0]' : 'bg-[#050B31]/80 border-[#1F3C73]'
                      }`}
                    >
                      <span className="text-xs shrink-0">🚩</span>
                      <div>
                        <strong>1. Khởi hành:</strong> Xuất phát từ vị trí hiện tại, đi thẳng 300m theo trục đường chính.
                      </div>
                    </div>

                    <div
                      className={`p-1.5 border rounded-xs flex items-start gap-1.5 ${
                        theme === 'light' ? 'bg-white/80 border-[#FFBFA0]' : 'bg-[#050B31]/80 border-[#1F3C73]'
                      }`}
                    >
                      <span className="text-xs shrink-0">↪️</span>
                      <div>
                        <strong>2. Rẽ phải:</strong> Tiến vào tuyến phố trung tâm {selectedStore.cityName}, đi tiếp {(selectedStore.distanceKm > 1 ? (selectedStore.distanceKm - 0.7).toFixed(1) : '0.5')} km.
                      </div>
                    </div>

                    <div
                      className={`p-1.5 border rounded-xs flex items-start gap-1.5 ${
                        theme === 'light' ? 'bg-white/80 border-[#FFBFA0]' : 'bg-[#050B31]/80 border-[#1F3C73]'
                      }`}
                    >
                      <span className="text-xs shrink-0">⬆️</span>
                      <div>
                        <strong>3. Đi thẳng:</strong> Qua ngã tư đèn xanh di tích lịch sử / phố cổ.
                      </div>
                    </div>

                    <div
                      className={`p-1.5 border rounded-xs flex items-start gap-1.5 font-bold ${
                        theme === 'light'
                          ? 'bg-[#FFA9A9]/50 border-[#FFBFA0] text-[#3D2314]'
                          : 'bg-[#1F3C73]/70 border-[#FFF3CB] text-[#FFF3CB]'
                      }`}
                    >
                      <span className="text-xs shrink-0">🎯</span>
                      <div>
                        <strong>4. Đến nơi:</strong> Số {selectedStore.address.split(',')[0]} (Cửa hàng nằm bên tay phải, có chỗ gửi xe miễn phí).
                      </div>
                    </div>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="flex flex-col gap-1 pt-1 border-t border-black/10 dark:border-white/10">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(480);
                        const query = encodeURIComponent(`${selectedStore.name} ${selectedStore.address}`);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                        showToast('Đang mở Google Maps thực tế...');
                      }}
                      className={`py-1.5 px-2 text-[10px] font-bold border cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1 ${
                        theme === 'light'
                          ? 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-400'
                          : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border-emerald-400'
                      }`}
                      title="Mở Google Maps thật trên tab mới"
                    >
                      <span>🌐</span>
                      <span>Google Maps Thật</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedStore.address);
                        showToast(`Đã sao chép địa chỉ: ${selectedStore.address}`);
                      }}
                      className={`py-1.5 px-2 text-[10px] font-bold border cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1 ${
                        theme === 'light'
                          ? 'bg-[#FED2B7]/60 hover:bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0]'
                          : 'bg-[#1F3C73] hover:bg-[#2a5298] text-[#FFF3CB] border-[#FFF3CB]'
                      }`}
                      title="Sao chép địa chỉ tiệm"
                    >
                      <span>📋</span>
                      <span>Sao Chép Địa Chỉ</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      retroAudio.playBlip(400);
                      setShowRouteDemo(false);
                      setShowContactModal(true);
                    }}
                    className={`w-full py-1.5 px-2 text-[10.5px] font-bold border cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                      theme === 'light'
                        ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                        : 'bg-[#b45309] hover:bg-[#d97706] text-white border-[#fef08a]'
                    }`}
                  >
                    <span>📞</span>
                    <span>Liên Hệ / Đặt Lịch ({selectedStore.phone})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. OVERLAY: LIÊN HỆ & SỐ ĐIỆN THOẠI / ĐẶT LỊCH HẸN ================= */}
        {showContactModal && (
          <div
            className={`absolute inset-0 z-40 flex flex-col backdrop-blur-md transition-all animate-fadeIn ${
              theme === 'light'
                ? 'bg-[#FFFFE3] text-[#3D2314]'
                : 'bg-[#050B31] text-[#FFFFFF]'
            }`}
          >
            {/* Header Liên Hệ */}
            <div
              className={`flex items-center justify-between px-3.5 py-2 border-b select-none ${
                theme === 'light'
                  ? 'bg-[#FED2B7]/60 border-[#FFBFA0]'
                  : 'bg-[#0E2045] border-[#1F3C73]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg animate-pulse">📞</span>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold font-['Be_Vietnam_Pro',sans-serif] truncate">
                    LIÊN HỆ & ĐẶT LỊCH • {selectedStore.name}
                  </h4>
                  <p className="text-[9.5px] opacity-80 font-mono truncate">
                    Hotline tư vấn may đo, thuê trang phục & đặt lịch trải nghiệm
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playBlip(360);
                  setShowContactModal(false);
                }}
                className="px-2 py-0.5 text-xs font-bold border cursor-pointer hover:bg-black/10 active:scale-95 transition-all shrink-0 bg-red-600 text-white border-yellow-300"
                title="Quay lại bản đồ chính"
              >
                ✕ Đóng Liên Hệ
              </button>
            </div>

            {/* Nội dung Liên Hệ & Đặt Lịch */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto vietphuc-map-scroll p-3 sm:p-4 gap-3">
              
              {/* Cột 1 (MD: 6 CỘT): SỐ ĐIỆN THOẠI NỔI BẬT & THÔNG TIN TIỆM */}
              <div className="md:col-span-6 flex flex-col gap-2.5">
                {/* THẺ SỐ ĐIỆN THOẠI TO RÕ RÀNG */}
                <div
                  className={`p-3 border-2 shadow-sm flex flex-col items-center text-center gap-2 ${
                    theme === 'light'
                      ? 'bg-[#FED2B7]/70 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#0E2045] border-[#1F3C73] text-[#FFF3CB]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">
                    SỐ ĐIỆN THOẠI / HOTLINE CHÍNH THỨC
                  </span>

                  <div className="flex items-center gap-2 text-xl sm:text-2xl font-black font-mono tracking-widest text-[#b45309] dark:text-[#fef08a] py-1">
                    <span className="animate-bounce">📞</span>
                    <span>{selectedStore.phone}</span>
                  </div>

                  <p className="text-[10px] opacity-85">
                    Hỗ trợ tư vấn may đo lễ phục, báo giá thuê áo & đặt lịch thử đồ
                  </p>

                  {/* 2 nút tương tác nhanh với SĐT */}
                  <div className="grid grid-cols-2 gap-2 w-full pt-1">
                    <a
                      href={`tel:${selectedStore.phone.replace(/\s+/g, '')}`}
                      onClick={() => retroAudio.playBlip(540)}
                      className={`py-1.5 px-3 text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 ${
                        theme === 'light'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-400'
                      }`}
                    >
                      <span>📞</span>
                      <span>Gọi Ngay</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedStore.phone);
                        showToast(`Đã sao chép SĐT: ${selectedStore.phone}`);
                      }}
                      className={`py-1.5 px-3 text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 ${
                        theme === 'light'
                          ? 'bg-white hover:bg-[#FFFEE0] text-[#3D2314] border-[#FFBFA0]'
                          : 'bg-[#1F3C73] hover:bg-[#2a5298] text-[#FFF3CB] border-[#FFF3CB]'
                      }`}
                    >
                      <span>📋</span>
                      <span>Sao Chép Số</span>
                    </button>
                  </div>
                </div>

                {/* THÔNG TIN CHI TIẾT TIỆM */}
                <div
                  className={`p-2.5 border text-[10px] flex flex-col gap-1.5 ${
                    theme === 'light'
                      ? 'bg-white/90 border-[#FFBFA0] text-[#3D2314]'
                      : 'bg-[#050B31]/90 border-[#1F3C73] text-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-1 border-black/10 dark:border-white/10">
                    <span className="font-bold">Đánh giá uy tín:</span>
                    <span className="font-bold text-[#b45309] dark:text-[#fef08a]">
                      ⭐ {selectedStore.rating} ({selectedStore.reviewCount} lượt đánh giá)
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="shrink-0 font-bold">📍 Địa chỉ:</span>
                    <span>{selectedStore.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>🕒 Giờ mở cửa:</span>
                    <span className="font-mono font-bold">{selectedStore.openHours}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>👗 Cổ phục đặc trưng:</span>
                    <span className="font-bold text-[#b45309] dark:text-[#fef08a]">{selectedStore.featuredOutfit}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedStore.services.map((svc) => (
                      <span
                        key={svc}
                        className={`text-[8.5px] px-1.5 py-0.2 border ${
                          theme === 'light'
                            ? 'bg-[#FED2B7]/40 border-[#FFBFA0]'
                            : 'bg-[#1F3C73]/40 border-[#1F3C73]'
                        }`}
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột 2 (MD: 6 CỘT): FORM ĐẶT LỊCH HẸN TRẢI NGHIỆM */}
              <div
                className={`md:col-span-6 p-3 border flex flex-col gap-2 ${
                  theme === 'light'
                    ? 'bg-white/95 border-[#FFBFA0] text-[#3D2314]'
                    : 'bg-[#0E2045]/60 border-[#1F3C73] text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-1.5 border-black/10 dark:border-white/10">
                  <h5 className="text-xs font-bold font-['Be_Vietnam_Pro',sans-serif] flex items-center gap-1.5">
                    <span>📅</span>
                    <span>ĐẶT LỊCH HẸN TRỰC TUYẾN</span>
                  </h5>
                  <span className="text-[9px] font-mono text-[#b45309] dark:text-[#fef08a]">
                    Xác nhận tức thì
                  </span>
                </div>

                {bookingSuccessCode ? (
                  /* Giao diện khi đặt lịch thành công */
                  <div
                    className={`p-3 border flex flex-col items-center text-center gap-2 my-auto ${
                      theme === 'light'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    }`}
                  >
                    <span className="text-2xl animate-bounce">🎉</span>
                    <h6 className="text-xs font-bold uppercase">Đặt Lịch Hẹn Thành Công!</h6>
                    <div className="text-[11px] font-mono font-bold bg-white/80 dark:bg-black/50 px-2 py-1 border border-emerald-400">
                      MÃ LỊCH HẸN: <span className="text-rose-600 dark:text-rose-400">{bookingSuccessCode}</span>
                    </div>
                    <p className="text-[9.5px] leading-relaxed">
                      Tiệm <strong>{selectedStore.name}</strong> đã ghi nhận lịch hẹn của bạn ({bookingName || 'Quý khách'} • {bookingDate}). Nhân viên tiệm sẽ gọi hotline <strong>{selectedStore.phone}</strong> xác nhận lại trước 30 phút!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        retroAudio.playBlip(320);
                        setBookingSuccessCode(null);
                        setBookingName('');
                        setBookingPhone('');
                      }}
                      className="mt-1 px-3 py-1 text-[10px] font-bold bg-emerald-700 text-white cursor-pointer active:scale-95 transition-all"
                    >
                      Đặt Lịch Hẹn Khác
                    </button>
                  </div>
                ) : (
                  /* Form nhập thông tin đặt lịch */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const code = `VP-${Math.floor(1000 + Math.random() * 9000)}`;
                      setBookingSuccessCode(code);
                      retroAudio.playBlip(720);
                      showToast(`Đặt lịch hẹn thành công! Mã: ${code}`);
                    }}
                    className="flex flex-col gap-2 text-[10px]"
                  >
                    <div>
                      <label className="block font-medium mb-0.5">Họ và tên của bạn:</label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Phương Linh"
                        className={`w-full px-2 py-1 text-xs border outline-none font-['Be_Vietnam_Pro',sans-serif] ${
                          theme === 'light'
                            ? 'bg-[#FFFEE0] border-[#FFBFA0] text-[#3D2314] focus:border-amber-600'
                            : 'bg-[#050B31] border-[#1F3C73] text-[#FFFFFF] focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-medium mb-0.5">Số điện thoại:</label>
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="09xx xxx xxx"
                          className={`w-full px-2 py-1 text-xs border outline-none font-mono ${
                            theme === 'light'
                              ? 'bg-[#FFFEE0] border-[#FFBFA0] text-[#3D2314] focus:border-amber-600'
                              : 'bg-[#050B31] border-[#1F3C73] text-[#FFFFFF] focus:border-amber-400'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-medium mb-0.5">Ngày hẹn thử đồ:</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className={`w-full px-2 py-1 text-xs border outline-none font-mono ${
                            theme === 'light'
                              ? 'bg-[#FFFEE0] border-[#FFBFA0] text-[#3D2314]'
                              : 'bg-[#050B31] border-[#1F3C73] text-[#FFFFFF]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium mb-0.5">Dịch vụ quan tâm:</label>
                      <select
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className={`w-full px-2 py-1 text-xs border outline-none ${
                          theme === 'light'
                            ? 'bg-[#FFFEE0] border-[#FFBFA0] text-[#3D2314]'
                            : 'bg-[#050B31] border-[#1F3C73] text-[#FFFFFF]'
                        }`}
                      >
                        <option value="Cho thuê chụp ảnh">Cho thuê chụp ảnh / Dạo phố cổ</option>
                        <option value="May đo lễ phục">May đo lễ phục theo số đo riêng</option>
                        <option value="Thử đồ & tư vấn">Thử đồ & tư vấn trang phục sự kiện</option>
                        <option value="Mua sẵn">Mua sẵn trang phục & phụ kiện</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className={`mt-1 py-1.5 px-3 text-xs font-bold border cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                        theme === 'light'
                          ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0] font-black shadow-sm'
                          : 'bg-[#b45309] hover:bg-[#d97706] text-white border-[#fef08a] font-black shadow-sm'
                      }`}
                    >
                      <span>✓</span>
                      <span>Xác Nhận Đặt Lịch Hẹn Ngay</span>
                    </button>

                    <div className="flex items-center justify-between text-[8.5px] opacity-75 font-mono pt-0.5">
                      <span>• Tiệm cam kết giữ lịch & bảo mật SĐT</span>
                      <button
                        type="button"
                        onClick={() => {
                          retroAudio.playBlip(320);
                          setShowContactModal(false);
                          setShowRouteDemo(true);
                        }}
                        className="underline hover:text-amber-500 cursor-pointer"
                      >
                        Xem bản đồ dẫn đường →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. POP-UP MỞ KHÓA KIẾN THỨC & CẤP CON DẤU PIXEL ================= */}
        {inspectingTravelNode && (
          <BadgeUnlockModal
            node={inspectingTravelNode}
            theme={theme}
            onClose={() => setInspectingTravelNode(null)}
            onStampCollected={(res) => {
              onUpdatePassport?.(res.passport);
              showToast(`Đã đóng dấu ${inspectingTravelNode.stamp.title} vào Hộ Chiếu!`);
            }}
            onTryOutfit={(costumeId) => {
              onTryOutfit?.(costumeId);
              showToast('Đã mặc thử y phục vùng này!');
            }}
          />
        )}
      </div>
    </div>
  );
};
