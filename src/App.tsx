/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { COSTUMES_DATA, FEMALE_COSTUMES, MALE_COSTUMES } from './data/costumes.ts';
import { ACCESSORIES_DATA } from './data/accessories.ts';
import { SCENES_DATA } from './data/scenes.ts';
import { Costume, ColorVariant, Accessory, Scene } from './types.ts';
import { PixelCharacter } from './components/PixelCharacter.tsx';
import { InteractiveWardrobeObject } from './components/InteractiveWardrobeObject.tsx';
import { ImmersiveSceneBackground } from './components/ImmersiveSceneBackground.tsx';
import { RpgDialogueBox } from './components/RpgDialogueBox.tsx';
import { AnatomyModal } from './components/AnatomyModal.tsx';
import { VillageFestivalModal } from './components/VillageFestivalModal.tsx';
import { VietPhucMapModal } from './components/VietPhucMapModal.tsx';
import { VietPhucPassportModal } from './components/VietPhucPassportModal.tsx';
import { JourneyCompletionModal } from './components/JourneyCompletionModal.tsx';
import { FloatingPassportWidget } from './components/FloatingPassportWidget.tsx';
import { getPassportData, PassportData, TimeTravelNode } from './data/timeTravelData.ts';
import { LotusPondLoginPage } from './components/LotusPondLoginPage.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { calculateAdvancedScore } from './utils/scoring.ts';
import { retroAudio } from './utils/audio.ts';

export default function App() {
  // 0. Trạng thái Đăng Nhập & Tài khoản SQLite (Requirement 2 & 3: Bắt đầu hoàn toàn mới)
  const [currentUser, setCurrentUser] = useState<{
    id?: number;
    username: string;
    displayName?: string;
    role: 'guest' | 'king' | 'noble';
    email?: string;
    bio?: string;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('bachphuc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showLoginPage, setShowLoginPage] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('bachphuc_user');
    } catch {
      return true;
    }
  });
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // 1. Giới tính (Mặc định Nữ quý tộc)
  const [gender, setGender] = useState<'female' | 'male'>('female');

  // 2. Bối cảnh không gian (Mặc định Cảnh 1: Chốn Bồng Lai)
  const [currentScene, setCurrentScene] = useState<Scene>(SCENES_DATA[0]);
  const [isSceneDropdownOpen, setIsSceneDropdownOpen] = useState<boolean>(false);
  const sceneDropdownRef = useRef<HTMLDivElement>(null);

  // 3. Trang phục & Biến thể màu sắc
  const [selectedCostume, setSelectedCostume] = useState<Costume>(FEMALE_COSTUMES[0]);
  const [activeVariant, setActiveVariant] = useState<ColorVariant>(
    FEMALE_COSTUMES[0].colorVariants[0]
  );

  // 4. Phụ kiện trang bị (Tối đa 1 món trong mỗi nhóm Head, Jewelry, Feet)
  const [equippedAccessories, setEquippedAccessories] = useState<Accessory[]>([]);

  // 5. Trạng thái Đóng / Mở của Tủ đồ trong cảnh (Interactive Object)
  const [isWardrobeOpen, setIsWardrobeOpen] = useState<boolean>(false);

  // 6. Điều khiển Model & Ẩn/Hiện Công cụ Zoom & Tư thế (Yêu cầu 1)
  const [showControls, setShowControls] = useState<boolean>(true);
  const [pose, setPose] = useState<'idle' | 'salute' | 'fan'>('idle');
  const [zoom, setZoom] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false);
  // 6.2. Chế độ Giao diện: Sáng (Light) / Tối (Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 7. Modals
  const [isAnatomyOpen, setIsAnatomyOpen] = useState<boolean>(false);
  const [isFestivalOpen, setIsFestivalOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);

  // 8. Dữ liệu Hộ Chiếu Di Sản & Điểm Du Hành Đang Kích Hoạt (Gamification)
  const [passport, setPassport] = useState<PassportData>(() =>
    getPassportData(currentUser?.displayName || 'Khách Du Ngoạn', currentUser?.role || 'noble')
  );
  const [activeTravelNodeId, setActiveTravelNodeId] = useState<string>('bac-bo');

  // Khi người dùng chọn địa điểm trong Hành trình Du Hành Việt Phục
  // Tự động thay đổi bối cảnh không gian & background toàn trang (Dynamic Background Loader)
  const handleSelectTravelLocation = useCallback((node: TimeTravelNode) => {
    setActiveTravelNodeId(node.id);
    const matchedScene = SCENES_DATA.find((s) => s.id === node.sceneId);
    if (matchedScene) {
      setCurrentScene({
        ...matchedScene,
        imageUrl: node.bgUrl || matchedScene.imageUrl,
      });
    }
    retroAudio.playBlip(560);
  }, []);

  // Mặc thử y phục đặc trưng theo gợi ý của vùng đất lịch sử
  const handleTryOutfitFromTravel = useCallback(
    (costumeId: string) => {
      const allCostumes = [...FEMALE_COSTUMES, ...MALE_COSTUMES];
      const target = allCostumes.find((c) => c.id === costumeId);
      if (target) {
        if (target.gender !== gender && target.gender !== 'unisex') {
          setGender(target.gender as 'female' | 'male');
        }
        setSelectedCostume(target);
        setActiveVariant(target.colorVariants[0]);
        retroAudio.playEquip();
      }
    },
    [gender]
  );

  // Cập nhật Passport và kích hoạt Bảng Chúc Mừng nếu hoàn thành 100%
  const handleUpdatePassport = useCallback((updated: PassportData) => {
    setPassport(updated);
    if (updated.hasCompletedJourney) {
      setIsCompletionModalOpen(true);
    }
  }, []);

  // Khi đăng nhập thành công từ trang Đầm Sen Buổi Sớm (xác thực SQLite)
  const handleLoginSuccess = useCallback(
    (user: {
      id?: number;
      username: string;
      email?: string;
      displayName?: string;
      role?: 'guest' | 'king' | 'noble';
    }) => {
      const fullUser = {
        id: user.id || 1,
        username: user.username,
        email: user.email || `${user.username}@bachphuc.vn`,
        displayName:
          user.displayName ||
          (user.role === 'king'
            ? 'Quân Vương'
            : user.role === 'noble'
            ? 'Nữ Quý Tộc'
            : user.username),
        role: user.role || 'noble',
      };
      setCurrentUser(fullUser);
      try {
        localStorage.setItem('bachphuc_user', JSON.stringify(fullUser));
      } catch {}
      setShowLoginPage(false);
      retroAudio.playEquip();

      if (fullUser.role === 'king') {
        setGender('male');
        setSelectedCostume(MALE_COSTUMES[0]);
        setActiveVariant(MALE_COSTUMES[0].colorVariants[0]);
      } else if (fullUser.role === 'noble') {
        setGender('female');
        setSelectedCostume(FEMALE_COSTUMES[0]);
        setActiveVariant(FEMALE_COSTUMES[0].colorVariants[0]);
      }
    },
    []
  );

  // Đăng xuất và dọn dẹp phiên
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('bachphuc_user');
    } catch {}
    setCurrentUser(null);
    setIsProfileOpen(false);
    setShowLoginPage(true);
    retroAudio.playBlip(320);
  }, []);

  // Khi chuyển Giới tính
  const handleGenderToggle = (newGender: 'female' | 'male') => {
    if (newGender === gender) return;
    setGender(newGender);
    retroAudio.playBlip(440);

    const targetList = newGender === 'female' ? FEMALE_COSTUMES : MALE_COSTUMES;
    setSelectedCostume(targetList[0]);
    setActiveVariant(targetList[0].colorVariants[0]);
    setEquippedAccessories([]);
  };

  // Khi chuyển Bối cảnh cảnh quan (Bồng Lai / Sơn Thần / Cửu Long / Cung Đình / Đầm Sen / Phố Cổ)
  const handleSceneChange = (scene: Scene) => {
    if (scene.id === currentScene.id) return;
    setCurrentScene(scene);
    retroAudio.playBlip(540);
  };

  // Tính điểm đánh giá phối đồ dựa trên y phục, phụ kiện VÀ BỐI CẢNH HIỆN TẠI (Yêu cầu 4)
  const scoreEvaluation = useMemo(() => {
    return calculateAdvancedScore(selectedCostume, equippedAccessories, currentScene.id);
  }, [selectedCostume, equippedAccessories, currentScene.id]);

  // Âm thanh khi điểm số thay đổi
  useEffect(() => {
    if (scoreEvaluation.status === 'perfect') {
      retroAudio.playEquip();
    } else if (scoreEvaluation.status === 'danger') {
      retroAudio.playBlip(200);
    }
  }, [scoreEvaluation.status, scoreEvaluation.score]);

  // Chuyển trang phục
  const handleSelectCostume = useCallback((costume: Costume) => {
    setSelectedCostume(costume);
    setActiveVariant(costume.colorVariants[0]);
  }, []);

  // Mặc / Tháo phụ kiện: Logic Chọn Độc Quyền Theo Nhóm (Yêu cầu 2: Single-choice per category)
  const handleToggleAccessory = (accessory: Accessory) => {
    setEquippedAccessories((prev) => {
      const isAlreadyEquipped = prev.some((a) => a.id === accessory.id);
      if (isAlreadyEquipped) {
        // Gỡ bỏ món này nếu đã đeo
        return prev.filter((a) => a.id !== accessory.id);
      }
      // Tự động gỡ bất kỳ món nào cùng nhóm (head, jewelry, feet) để đeo món mới (cơ chế Radio Button)
      const withoutSameCategory = prev.filter((a) => a.category !== accessory.category);
      return [...withoutSameCategory, accessory];
    });
  };

  // Phím tắt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const currentList = gender === 'female' ? FEMALE_COSTUMES : MALE_COSTUMES;
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (currentList[idx]) {
          retroAudio.playEquip();
          handleSelectCostume(currentList[idx]);
        }
      } else if (e.key.toLowerCase() === 't') {
        setIsWardrobeOpen((prev) => !prev);
        retroAudio.playBlip(500);
      } else if (e.key.toLowerCase() === 'h') {
        setShowControls((prev) => !prev);
        retroAudio.playBlip(420);
      } else if (e.key.toLowerCase() === 'm') {
        toggleSound();
      } else if (e.key.toLowerCase() === 'b') {
        toggleBgm();
      } else if (e.key.toLowerCase() === 'l') {
        // Phím tắt đổi chế độ Sáng / Tối
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        retroAudio.playBlip(520);
      } else if (e.key.toLowerCase() === 'd') {
        // Phím tắt mở Địa Đồ Việt Phục
        setIsMapOpen((prev) => !prev);
        retroAudio.playBlip(540);
      } else if (e.key.toLowerCase() === 'p') {
        // Phím tắt mở Hộ Chiếu Di Sản (Passport)
        setIsPassportOpen((prev) => !prev);
        retroAudio.playBlip(540);
      } else if (e.key === 'Escape') {
        setIsWardrobeOpen(false);
        setIsSceneDropdownOpen(false);
        setIsAnatomyOpen(false);
        setIsFestivalOpen(false);
        setIsMapOpen(false);
        setIsPassportOpen(false);
        setIsCompletionModalOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (sceneDropdownRef.current && !sceneDropdownRef.current.contains(e.target as Node)) {
        setIsSceneDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [gender, handleSelectCostume]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    retroAudio.enabled = next;
    if (next) retroAudio.playBlip(520);
    else if (bgmPlaying) {
      retroAudio.toggleBgm(false);
      setBgmPlaying(false);
    }
  };

  const toggleBgm = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      retroAudio.enabled = true;
    }
    const next = retroAudio.toggleBgm();
    setBgmPlaying(next);
  };

  if (showLoginPage) {
    return (
      <LotusPondLoginPage
        onLoginSuccess={handleLoginSuccess}
        initialRemember={true}
      />
    );
  }

  return (
    <div
      data-theme={theme}
      className={`min-h-screen theme-transition flex flex-col relative overflow-hidden select-none ${
        theme === 'light'
          ? 'bg-gradient-to-b from-[#FED2B7] via-[#FFEAD9] to-[#FFFFE3] text-[#3D2314]'
          : 'bg-[#050B31] text-[#FFFFFF]'
      }`}
    >
      {/* Scanlines CRT (tùy chọn) */}
      {scanlinesEnabled && <div className="scanlines fixed inset-0 z-40 pointer-events-none" />}

      {/* ================= HEADER NAVIGATION (ABSOLUTE CENTER LOGO & GLASSMORPHISM) ================= */}
      <header
        className={`relative w-full z-40 px-3 py-2.5 md:px-6 backdrop-blur-md transition-colors duration-300 border-b ${
          theme === 'light'
            ? 'bg-[#FFFFE3]/95 border-[#FED2B7] shadow-sm text-[#3D2314]'
            : 'bg-[#0E2045]/80 border-[#1F3C73] shadow-md text-[#FFFFFF]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          
          {/* CỘT TRÁI: USER PROFILE TRIGGER & CHỌN MÔ HÌNH (NAM/NỮ) THEO YÊU CẦU 2 */}
          <div className="flex items-center gap-2 z-10">
            {/* NÚT PROFILE USER ("🪷 Khách Du Ngoạn [Quý Tộc]") NẰM CỐ ĐỊNH Ở GÓC TRÊN BÊN TRÁI */}
            <button
              onClick={() => {
                retroAudio.playBlip(500);
                setIsProfileOpen(true);
              }}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] border-2 cursor-pointer transition-all flex items-center gap-1.5 shadow-md group ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] text-[#3D2314] border-[#D4AF37] hover:bg-[#FED2B7]/60 hover:shadow-[0_0_12px_rgba(212,175,55,0.6)] active:scale-95'
                  : 'bg-[#1A0F0D] text-[#FFF3CB] border-[#D4AF37] hover:bg-[#2A1510] hover:shadow-[0_0_12px_rgba(212,175,55,0.7)] active:scale-95'
              }`}
              title="Nhấn để mở Hồ Sơ Bách Phục & Lookbook Cá Nhân"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">🪷</span>
              <span className="truncate max-w-[120px] sm:max-w-none">
                {currentUser?.displayName || (currentUser?.role === 'king' ? 'Quân Vương' : currentUser?.role === 'noble' ? 'Nữ Quý Tộc' : 'Khách Du Ngoạn')}
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 bg-[#D4AF37]/25 border border-[#D4AF37]/60 rounded-xs text-[#B45309] dark:text-[#FDE047]">
                [{currentUser?.role === 'king' ? 'Quân Vương' : currentUser?.role === 'noble' ? 'Quý Tộc' : 'Khách'}]
              </span>
            </button>

            {/* Nút Model Nam / Nữ */}
            <div
              className={`flex border shadow-sm transition-colors ${
                theme === 'light'
                  ? 'bg-[#FFFFE3] border-[#FED2B7]'
                  : 'bg-[#050B31]/90 border-[#1F3C73]'
              }`}
            >
              <button
                onClick={() => handleGenderToggle('female')}
                className={`px-2.5 py-1 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer transition-all ${
                  gender === 'female'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] shadow-inner font-black'
                      : 'bg-[#831843] text-white shadow-inner font-black'
                    : theme === 'light'
                    ? 'text-[#3D2314] hover:bg-[#FED2B7]/40'
                    : 'text-[#fed7aa] hover:bg-white/10'
                }`}
              >
                👩 NỮ
              </button>
              <button
                onClick={() => handleGenderToggle('male')}
                className={`px-2.5 py-1 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer transition-all ${
                  gender === 'male'
                    ? theme === 'light'
                      ? 'bg-[#FED2B7] text-[#3D2314] shadow-inner font-black'
                      : 'bg-[#1e3a5f] text-white shadow-inner font-black'
                    : theme === 'light'
                    ? 'text-[#3D2314] hover:bg-[#FED2B7]/40'
                    : 'text-[#fed7aa] hover:bg-white/10'
                }`}
              >
                👨 NAM
              </button>
            </div>
          </div>

          {/* CĂN GIỮA TUYỆT ĐỐI (ABSOLUTE CENTER): TIÊU ĐỀ THƯƠNG HIỆU VIỆT PHỤC REMIX */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-24 sm:px-32">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <span
                className={`text-xs sm:text-sm md:text-base animate-pulse ${
                  theme === 'light' ? 'text-[#b45309]' : 'text-[#fef08a]'
                }`}
              >
                ✦
              </span>
              <h1
                className={`text-sm sm:text-xl md:text-2xl lg:text-3xl font-black tracking-widest uppercase font-['VT323','Silkscreen',monospace] transition-all truncate select-none ${
                  theme === 'light'
                    ? 'text-[#4A2810] drop-shadow-[0_2px_4px_rgba(212,175,55,0.45)]'
                    : 'text-[#fef08a] drop-shadow-[0_0_12px_rgba(254,240,138,0.75)]'
                }`}
              >
                VIỆT PHỤC REMIX
              </h1>
              <span
                className={`text-xs sm:text-sm md:text-base animate-pulse ${
                  theme === 'light' ? 'text-[#b45309]' : 'text-[#fef08a]'
                }`}
              >
                ✦
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: CÁC CÔNG CỤ ĐỐI XỨNG & TINH GỌN (THEME, TOOLS, FESTIVAL, MAP, AUDIO) */}
          <div className="flex items-center gap-1 sm:gap-1.5 z-10 ml-auto">
            {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK TOGGLE) */}
            <button
              onClick={() => {
                retroAudio.playBlip(520);
                setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
              }}
              className={`px-2.5 py-1 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] border cursor-pointer transition-all flex items-center gap-1 active:scale-95 ${
                theme === 'light'
                  ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] hover:bg-[#ff9393] shadow-xs'
                  : 'bg-[#1F3C73] text-[#FFF3CB] border-[#FFF3CB]/80 hover:bg-[#254a8e] shadow-xs'
              }`}
              title={
                theme === 'light'
                  ? 'Chuyển sang Chế độ Tối (Dark Mode) - Phím L'
                  : 'Chuyển sang Chế độ Sáng (Light Mode) - Phím L'
              }
            >
              <span>{theme === 'light' ? '☀️ SÁNG' : '🌙 TỐI'}</span>
            </button>

            {/* Nút Ẩn/Hiện Công Cụ Zoom & Tư Thế */}
            <button
              onClick={() => {
                retroAudio.playBlip(420);
                setShowControls((prev) => !prev);
              }}
              className={`px-2 py-1 text-xs font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] font-semibold border cursor-pointer transition-all active:scale-95 ${
                showControls
                  ? theme === 'light'
                    ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0]'
                    : 'bg-[#b45309] text-white border-[#fef08a]'
                  : theme === 'light'
                  ? 'bg-[#FFFFE3] text-[#3D2314] border-[#FED2B7] hover:border-[#FFA9A9]'
                  : 'bg-black/60 text-[#fed7aa] border-[#78350f] hover:border-[#f59e0b]'
              }`}
              title={showControls ? 'Ẩn thanh công cụ zoom & tư thế để ngắm trọn vẹn cảnh vật' : 'Hiện thanh công cụ zoom & tư thế'}
            >
              {showControls ? '👁️ ẨN TOOL' : '👁️ HIỆN TOOL'}
            </button>

            {/* Tham gia Lễ Hội Làng */}
            <button
              onClick={() => {
                retroAudio.playBlip(560);
                setIsFestivalOpen(true);
              }}
              className={`px-2.5 py-1 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] border cursor-pointer shadow-xs active:translate-y-0.5 flex items-center gap-1 transition-all ${
                theme === 'light'
                  ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] hover:bg-[#ff9393]'
                  : 'bg-[#b91c1c] hover:bg-[#dc2626] border-[#fef08a] text-white'
              }`}
              title="Trò chơi dân gian: Ném còn & Gánh lụa qua cầu"
            >
              <span>🏮</span>
              <span className="hidden md:inline">LỄ HỘI LÀNG</span>
            </button>

            {/* Địa Đồ Việt Phục (Bản Đồ Du Hành Thời Gian & Tiệm Cổ Phục) */}
            <button
              onClick={() => {
                retroAudio.playBlip(540);
                setIsMapOpen(true);
              }}
              className={`px-2.5 py-1 text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] border cursor-pointer shadow-xs active:translate-y-0.5 flex items-center gap-1 transition-all ${
                theme === 'light'
                  ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] hover:bg-[#ffa9a9]'
                  : 'bg-[#1F3C73] hover:bg-[#254a8e] border-[#FFF3CB] text-[#FFF3CB]'
              }`}
              title="Địa Đồ Việt Phục: Du hành lịch sử 5 chặng & Khám phá tiệm cổ phục (Phím D)"
            >
              <span>🗺️</span>
              <span className="hidden md:inline">ĐỊA ĐỒ</span>
            </button>

            {/* Cụm Điều Khiển Âm Nhạc & Âm Thanh Retro */}
            <div
              className={`flex items-center border shadow-xs ${
                theme === 'light' ? 'bg-[#FFFFE3] border-[#FED2B7]' : 'bg-[#050B31]/90 border-[#1F3C73]'
              }`}
            >
              {/* BGM Nhã Nhạc */}
              <button
                onClick={toggleBgm}
                className={`px-2 py-1 text-xs font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer transition-all border-r ${
                  bgmPlaying
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold'
                      : 'bg-[#fef08a] text-[#1e1305] border-white font-bold'
                    : theme === 'light'
                    ? 'text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                    : 'text-[#fed7aa] border-[#1F3C73] hover:bg-white/10'
                }`}
                title="Nhã nhạc cung đình ngũ cung (Phím B)"
              >
                {bgmPlaying ? '🎵' : '🔇'}
              </button>

              {/* SFX Hiệu Ứng Âm Thanh */}
              <button
                onClick={toggleSound}
                className={`px-2 py-1 text-xs font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] cursor-pointer transition-all ${
                  soundEnabled
                    ? theme === 'light'
                      ? 'bg-[#FED2B7] text-[#3D2314]'
                      : 'bg-[#b45309] text-white'
                    : theme === 'light'
                    ? 'text-[#8c7365] hover:bg-[#FED2B7]/30'
                    : 'text-[#94a3b8] hover:bg-white/10'
                }`}
                title="Bật/Tắt hiệu ứng âm thanh 8-bit (Phím M)"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ================= KHU VỰC SẢNH KHÔNG GIAN MỞ (IMMERSIVE HERO STAGE: 85-90VH) ================= */}
      <main className="relative flex-1 w-full flex flex-col justify-between overflow-hidden">
        
        {/* LỚP 1: NỀN KHÔNG GIAN TỰ NHIÊN HÒA CHUNG (IMMERSIVE BACKGROUND VỚI ẢNH/SVG CỦA 3 CẢNH) */}
        <ImmersiveSceneBackground scene={currentScene} gender={gender} />

        {/* LỚP 2: KHÔNG GIAN TRUNG TÂM (CHARACTER + VẬT THỂ TỦ ĐỒ) */}
        <div className="relative flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 flex items-center justify-between z-20 py-2">
          
          {/* GÓC TRÁI TRÊN: CUSTOM PIXEL DROPDOWN CHỌN BỐI CẢNH (YÊU CẦU 1) */}
          <div ref={sceneDropdownRef} className="absolute top-3 left-3 md:left-6 z-30">
            {/* Nút bấm hiển thị tên background hiện tại kèm mũi tên */}
            <button
              onClick={() => {
                retroAudio.playBlip(isSceneDropdownOpen ? 380 : 520);
                setIsSceneDropdownOpen((prev) => !prev);
              }}
              className={`backdrop-blur-md border-2 px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-all active:scale-95 group shadow-md ${
                theme === 'light'
                  ? 'bg-[#FFFFE3]/95 border-[#FED2B7] hover:border-[#FFA9A9] text-[#3D2314]'
                  : 'bg-black/85 border-[#f59e0b] hover:border-[#fef08a] text-white'
              }`}
              title="Nhấn để mở danh sách đổi bối cảnh"
            >
              <span className="text-sm md:text-base">{currentScene.icon}</span>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[9px] font-['Be_Vietnam_Pro',sans-serif] font-bold tracking-wider ${
                    theme === 'light' ? 'text-[#3D2314]' : 'text-[#fed7aa]'
                  }`}
                >
                  BỐI CẢNH
                </span>
                <span
                  className={`text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] uppercase transition-colors ${
                    theme === 'light'
                      ? 'text-[#3D2314] group-hover:text-[#5C2E1B]'
                      : 'text-[#fef08a] group-hover:text-white'
                  }`}
                >
                  {currentScene.name}
                </span>
              </div>
              <span
                className={`text-xs font-mono ml-1 transition-transform duration-200 ${
                  theme === 'light' ? 'text-[#3D2314]' : 'text-[#fef08a]'
                }`}
              >
                {isSceneDropdownOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Menu thả xuống cuộn danh sách tất cả các Background hiện có */}
            {isSceneDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-1.5 w-64 md:w-80 max-h-80 overflow-y-auto backdrop-blur-lg border-2 shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex flex-col p-1.5 gap-1 animate-in fade-in zoom-in-95 duration-150 z-50 wardrobe-scroll ${
                  theme === 'light'
                    ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
                    : 'bg-black/95 border-[#f59e0b] text-[#fed7aa]'
                }`}
              >
                <div
                  className={`px-2 py-1 border-b flex items-center justify-between text-xs font-bold font-['VT323','Silkscreen',monospace] tracking-wider uppercase ${
                    theme === 'light'
                      ? 'border-[#FED2B7] text-[#3D2314]'
                      : 'border-[#f59e0b]/30 text-[#fed7aa]'
                  }`}
                >
                  <span>DANH SÁCH BỐI CẢNH (6 CẢNH)</span>
                  <span
                    className={`text-[10px] ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#fef08a]'
                    }`}
                  >
                    RETRO SCENERY
                  </span>
                </div>
                {SCENES_DATA.map((sc) => {
                  const isSelected = sc.id === currentScene.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        handleSceneChange(sc);
                        setIsSceneDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? theme === 'light'
                            ? 'bg-[#FED2B7] border-[#FFBFA0] text-[#3D2314] shadow-inner font-bold'
                            : 'bg-[#b45309]/70 border-[#fef08a] text-white shadow-inner'
                          : theme === 'light'
                          ? 'bg-white border-[#FED2B7]/60 text-[#3D2314] hover:bg-[#FED2B7]/30'
                          : 'bg-black/40 border-white/10 text-[#fed7aa] hover:bg-white/10 hover:border-[#f59e0b]/50'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{sc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] truncate ${
                              isSelected
                                ? theme === 'light'
                                  ? 'text-[#3D2314]'
                                  : 'text-[#fef08a]'
                                : theme === 'light'
                                ? 'text-[#3D2314]'
                                : 'text-white'
                            }`}
                          >
                            {sc.name}
                          </span>
                          {isSelected && (
                            <span
                              className={`text-xs font-mono ml-1 font-bold ${
                                theme === 'light' ? 'text-[#3D2314]' : 'text-[#fef08a]'
                              }`}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] font-['Be_Vietnam_Pro',sans-serif] leading-[1.4] tracking-[0.5px] truncate mt-0.5 ${
                            theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#cbd5e1]'
                          }`}
                        >
                          {sc.timeOfDay} • {sc.subtitle.split('•')[0]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* TRUNG TÂM: NHÂN VẬT PIXEL MODEL TRÊN BỤC ĐỨNG */}
          <div className="mx-auto flex flex-col items-center justify-center mt-2 md:mt-0">
            
            {/* Nhân vật Pixel */}
            <div className="relative">
              <PixelCharacter
                costume={selectedCostume}
                activeVariant={activeVariant}
                gender={gender}
                pose={pose}
                zoom={zoom}
                equippedAccessories={equippedAccessories}
              />
            </div>

            {/* THANH ĐIỀU KHIỂN NỔI: TƯ THẾ & KÍNH LÚP (CÓ THỂ ẨN/HIỆN MƯỢT MÀ THEO YÊU CẦU 1) */}
            <div
              className={`mt-3 flex items-center gap-2 backdrop-blur-md px-3 py-1.5 border shadow-lg text-xs font-['Be_Vietnam_Pro','Nunito',sans-serif] tracking-[0.5px] transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-[#FFFFE3]/95 border-[#FED2B7] text-[#3D2314]'
                  : 'bg-black/60 border-[#f59e0b]/40 text-white'
              } ${
                showControls
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <span
                className={`font-semibold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#fed7aa]'}`}
              >
                TƯ THẾ:
              </span>
              <button
                onClick={() => {
                  retroAudio.playBlip(360);
                  setPose('idle');
                }}
                className={`px-2 py-0.5 cursor-pointer border transition-all ${
                  pose === 'idle'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold'
                      : 'bg-[#b91c1c] text-white border-[#fef08a]'
                    : theme === 'light'
                    ? 'text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                    : 'text-[#fed7aa] border-white/20 hover:bg-white/10'
                }`}
              >
                Đứng
              </button>
              <button
                onClick={() => {
                  retroAudio.playBlip(400);
                  setPose('salute');
                }}
                className={`px-2 py-0.5 cursor-pointer border transition-all ${
                  pose === 'salute'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold'
                      : 'bg-[#b91c1c] text-white border-[#fef08a]'
                    : theme === 'light'
                    ? 'text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                    : 'text-[#fed7aa] border-white/20 hover:bg-white/10'
                }`}
              >
                Hành lễ
              </button>
              <button
                onClick={() => {
                  retroAudio.playBlip(440);
                  setPose('fan');
                }}
                className={`px-2 py-0.5 cursor-pointer border transition-all ${
                  pose === 'fan'
                    ? theme === 'light'
                      ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold'
                      : 'bg-[#b91c1c] text-white border-[#fef08a]'
                    : theme === 'light'
                    ? 'text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                    : 'text-[#fed7aa] border-white/20 hover:bg-white/10'
                }`}
              >
                Quạt
              </button>

              <span className={`mx-1 ${theme === 'light' ? 'text-[#FED2B7]' : 'text-white/30'}`}>
                |
              </span>

              <span
                className={`font-semibold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#fed7aa]'}`}
              >
                ZOOM:
              </span>
              {[1, 1.25, 1.5].map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    retroAudio.playBlip(480);
                    setZoom(z);
                  }}
                  className={`px-1.5 py-0.5 cursor-pointer border transition-all ${
                    zoom === z
                      ? theme === 'light'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold'
                        : 'bg-[#b45309] text-white border-[#fef08a]'
                      : theme === 'light'
                      ? 'text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/40'
                      : 'text-[#fed7aa] border-white/20 hover:bg-white/10'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>

          </div>

          {/* GÓC PHẢI: VẬT THỂ TỦ ĐỒ TƯƠNG TÁC THEO CẢNH (MÂY TIÊN / TRỐNG THIÊNG / CUỐN THƯ HOÀNG GIA) */}
          <div className="absolute top-10 md:top-14 right-4 md:right-8 z-30">
            <InteractiveWardrobeObject
              sceneId={currentScene.id}
              isOpen={isWardrobeOpen}
              onToggle={() => setIsWardrobeOpen((prev) => !prev)}
              costumes={COSTUMES_DATA}
              selectedCostume={selectedCostume}
              onSelectCostume={handleSelectCostume}
              equippedAccessories={equippedAccessories}
              allAccessories={ACCESSORIES_DATA}
              onToggleAccessory={handleToggleAccessory}
              gender={gender}
              onGenderChange={handleGenderToggle}
              theme={theme}
            />
          </div>

        </div>

        {/* LỚP 3: HỘP THOẠI RPG & THÔNG SỐ (DOCK SÁT DƯỚI ĐÁY MÀN HÌNH THEO YÊU CẦU 1) */}
        <div className="relative w-full max-w-7xl mx-auto px-2 md:px-6 pb-2 md:pb-3 z-30">
          <RpgDialogueBox
            costume={selectedCostume}
            activeVariant={activeVariant}
            onSelectVariant={(variant) => setActiveVariant(variant)}
            evaluation={scoreEvaluation}
            currentScene={currentScene}
            onOpenAnatomy={() => setIsAnatomyOpen(true)}
            gender={gender}
            theme={theme}
          />
        </div>

      </main>

      {/* ================= MODALS ================= */}
      {isProfileOpen && (
        <UserProfileModal
          isOpen={isProfileOpen}
          theme={theme}
          onClose={() => setIsProfileOpen(false)}
          currentUser={
            currentUser || {
              username: 'khach_du_ngoan',
              displayName: 'Khách Du Ngoạn',
              role: 'noble',
            }
          }
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            try {
              localStorage.setItem('bachphuc_user', JSON.stringify(updated));
            } catch {}
          }}
          onLogout={handleLogout}
          currentCostume={selectedCostume}
          activeVariant={activeVariant}
          currentGender={gender}
          currentScene={currentScene}
          currentAccessories={equippedAccessories}
          onApplyOutfit={(outfit) => {
            // Simultaneously update all 5 slots: Gender, Costume, Variant, Scene, Accessories
            setGender(outfit.gender);
            setSelectedCostume(outfit.costume);
            setActiveVariant(outfit.costume.colorVariants[0]);
            setCurrentScene(outfit.scene);
            setEquippedAccessories(outfit.accessories);
            retroAudio.playEquip();
          }}
          onSceneChange={handleSceneChange}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            retroAudio.enabled = next;
          }}
          bgmPlaying={bgmPlaying}
          onToggleBgm={toggleBgm}
        />
      )}

      {isAnatomyOpen && (
        <AnatomyModal costume={selectedCostume} theme={theme} onClose={() => setIsAnatomyOpen(false)} />
      )}

      {isFestivalOpen && <VillageFestivalModal onClose={() => setIsFestivalOpen(false)} />}

      {isMapOpen && (
        <VietPhucMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          theme={theme}
          passport={passport}
          onUpdatePassport={handleUpdatePassport}
          onSelectTravelLocation={handleSelectTravelLocation}
          onOpenPassport={() => {
            setIsMapOpen(false);
            setIsPassportOpen(true);
          }}
          onTryOutfit={handleTryOutfitFromTravel}
          activeTravelNodeId={activeTravelNodeId}
        />
      )}

      {/* ================= HỘ CHIẾU DI SẢN (VIỆT PHỤC PASSPORT MODAL) ================= */}
      {isPassportOpen && (
        <VietPhucPassportModal
          isOpen={isPassportOpen}
          onClose={() => setIsPassportOpen(false)}
          passport={passport}
          onUpdatePassport={handleUpdatePassport}
          onOpenMapTravel={() => {
            setIsPassportOpen(false);
            setIsMapOpen(true);
          }}
          costume={selectedCostume}
          activeVariant={activeVariant}
          gender={gender}
          equippedAccessories={equippedAccessories}
          theme={theme}
        />
      )}

      {/* ================= BẢNG CHÚC MỪNG HOÀN THÀNH 100% HÀNH TRÌNH ================= */}
      {isCompletionModalOpen && (
        <JourneyCompletionModal
          passport={passport}
          onOpenPassport={() => {
            setIsCompletionModalOpen(false);
            setIsPassportOpen(true);
          }}
          onClose={() => setIsCompletionModalOpen(false)}
          theme={theme}
        />
      )}

      {/* ================= WIDGET HỘ CHIẾU LUÔN NỔI Ở GÓC MÀN HÌNH ================= */}
      <FloatingPassportWidget
        passport={passport}
        onClick={() => setIsPassportOpen(true)}
        theme={theme}
      />
    </div>
  );
}
