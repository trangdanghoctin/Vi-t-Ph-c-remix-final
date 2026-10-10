import React, { useState, useRef, useEffect } from 'react';
import { Costume, Accessory, Scene, ColorVariant, AccessoryCategory } from '../types.ts';
import { COSTUMES_DATA } from '../data/costumes.ts';
import { ACCESSORIES_DATA } from '../data/accessories.ts';
import { SCENES_DATA } from '../data/scenes.ts';
import { inventoryData } from '../data/inventoryData.ts';
import { generateLookbookCanvasSnapshot } from '../utils/canvasSnapshot.ts';
import { retroAudio } from '../utils/audio.ts';

export interface LookbookItem {
  id: string;
  title: string;
  dateSaved: string;
  costumeId: string;
  gender: 'female' | 'male';
  sceneId: string;
  headwearId?: string | null;
  accessoryId?: string | null;
  footwearId?: string | null;
  equippedAccessoryIds: string[];
  thumbnailData?: string | null;
  tags: string[];
  color: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id?: number;
    username: string;
    displayName?: string;
    role: 'guest' | 'king' | 'noble';
    email?: string;
    bio?: string;
  };
  onUpdateUser: (updated: {
    id?: number;
    username: string;
    displayName: string;
    role: 'guest' | 'king' | 'noble';
    email?: string;
    bio?: string;
  }) => void;
  onLogout: () => void;
  // Current app state to allow saving complete outfit snapshot
  currentCostume: Costume;
  activeVariant?: ColorVariant;
  currentGender: 'female' | 'male';
  currentScene: Scene;
  currentAccessories: Accessory[];
  // Handler when user clicks "Mặc Ngay" to simultaneously re-equip all 5 slots
  onApplyOutfit: (outfit: {
    costume: Costume;
    gender: 'female' | 'male';
    scene: Scene;
    accessories: Accessory[];
  }) => void;
  onSceneChange: (scene: Scene) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  bgmPlaying?: boolean;
  onToggleBgm?: () => void;
  theme?: 'light' | 'dark';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  currentCostume,
  activeVariant,
  currentGender,
  currentScene,
  currentAccessories,
  onApplyOutfit,
  onSceneChange,
  soundEnabled = true,
  onToggleSound,
  bgmPlaying = false,
  onToggleBgm,
  theme = 'light',
}) => {
  // Navigation tabs in sidebar
  const [activeTab, setActiveTab] = useState<'lookbook' | 'backgrounds' | 'settings'>('lookbook');

  // Lookbook list state - Starts completely empty (Requirement 3)
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);
  const [isSavingCurrent, setIsSavingCurrent] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Custom Background state
  const [customBgInput, setCustomBgInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit fields
  const [displayName, setDisplayName] = useState(
    currentUser.displayName || currentUser.username || 'Khách Du Ngoạn'
  );
  const [userRole, setUserRole] = useState<'guest' | 'king' | 'noble'>(currentUser.role);
  const [userEmail, setUserEmail] = useState(currentUser.email || `${currentUser.username}@bachphuc.vn`);
  const [userBio, setUserBio] = useState(
    currentUser.bio || 'Say đắm tinh hoa cổ phục Đại Việt • Bách Phục Cổ Truyền'
  );

  // Dragging support
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Synchronize with SQLite when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentUser.displayName || currentUser.username);
      setUserRole(currentUser.role);

      // Fetch saved outfits from SQLite for current user
      if (currentUser.id) {
        fetch(`/api/lookbooks?userId=${currentUser.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              const mapped: LookbookItem[] = data.map((row: any) => ({
                id: String(row.id),
                title: row.outfit_name,
                dateSaved: row.created_at
                  ? new Date(row.created_at).toLocaleDateString('vi-VN')
                  : new Date().toLocaleDateString('vi-VN'),
                costumeId: row.garment_id || 'ao-nhat-binh',
                gender: (row.gender as 'female' | 'male') || 'female',
                sceneId: row.bg_id || 'bong-lai',
                headwearId: row.headwear_id || null,
                accessoryId: row.accessory_id || null,
                footwearId: row.footwear_id || null,
                equippedAccessoryIds: [row.headwear_id, row.accessory_id, row.footwear_id].filter(
                  Boolean
                ),
                tags: ['SQLite', row.gender === 'female' ? 'Nữ Phục' : 'Nam Phục'],
                color:
                  row.thumbnail_data && row.thumbnail_data.startsWith('#')
                    ? row.thumbnail_data
                    : '#B91C1C',
                thumbnailData: row.thumbnail_data || null,
              }));
              setLookbook(mapped);
            }
          })
          .catch((err) => console.error('Lỗi tải lookbook từ SQLite:', err));
      } else {
        setLookbook([]);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Pointer drag events on header
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    e.preventDefault();
    const el = modalRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: rect.left,
      initY: rect.top,
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

    const newX = Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.initX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 200, dragRef.current.initY + dy));
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

  // Add current outfit to SQLite lookbook table with full 5-slot snapshot (Requirement 1)
  const handleSaveCurrentOutfit = async () => {
    const title = customTitle.trim() || `${currentCostume.name} (${currentScene.name})`;

    const headAcc = currentAccessories.find((a) => a.category === 'head');
    const jewelryAcc = currentAccessories.find((a) => a.category === 'jewelry');
    const feetAcc = currentAccessories.find((a) => a.category === 'feet');

    // Generate high-resolution 2D Canvas snapshot of the complete equipped set
    const snapshotDataUrl = generateLookbookCanvasSnapshot({
      costume: currentCostume,
      activeVariant,
      gender: currentGender,
      scene: currentScene,
      headwear: headAcc,
      jewelry: jewelryAcc,
      footwear: feetAcc,
      outfitName: title,
    });

    try {
      const response = await fetch('/api/lookbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id || 1,
          outfit_name: title,
          gender: currentGender,
          garment_id: currentCostume.id,
          headwear_id: headAcc?.id || null,
          accessory_id: jewelryAcc?.id || null,
          footwear_id: feetAcc?.id || null,
          bg_id: currentScene.id,
          thumbnail_data: snapshotDataUrl,
        }),
      });

      const data = await response.json();
      const savedId = data.card ? String(data.card.id) : `lookbook-${Date.now()}`;

      const newItem: LookbookItem = {
        id: savedId,
        title,
        dateSaved: new Date().toLocaleDateString('vi-VN'),
        costumeId: currentCostume.id,
        gender: currentGender,
        sceneId: currentScene.id,
        headwearId: headAcc?.id || null,
        accessoryId: jewelryAcc?.id || null,
        footwearId: feetAcc?.id || null,
        equippedAccessoryIds: currentAccessories.map((a) => a.id),
        thumbnailData: snapshotDataUrl,
        tags: [
          currentGender === 'female' ? 'Nữ Phục' : 'Nam Phục',
          headAcc ? 'Có Mũ' : 'Tóc Trần',
          jewelryAcc ? 'Có Sức' : 'Thuần Mộc',
          feetAcc ? 'Có Hài' : 'Chân Mộc',
        ],
        color: currentCostume.colors[0] || '#B91C1C',
      };

      setLookbook([newItem, ...lookbook]);
      setIsSavingCurrent(false);
      setCustomTitle('');
      retroAudio.playEquip();
      setFeedbackMsg(`Đã lưu "${title}" vào cơ sở dữ liệu SQLite (Đầy đủ 5 món: Áo • Mũ • Sức • Hài • Cảnh)!`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      console.error('Lỗi lưu lookbook:', err);
      setFeedbackMsg('Lỗi lưu vào máy chủ SQLite: ' + err.message);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  // Delete lookbook item from SQLite
  const handleDeleteLookbook = async (id: string) => {
    retroAudio.playBlip(280);
    try {
      await fetch(`/api/lookbooks/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Lỗi xóa lookbook:', err);
    }
    setLookbook(lookbook.filter((item) => item.id !== id));
    setFeedbackMsg('Đã xóa bộ trang phục khỏi SQLite.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // Apply lookbook item: Simultaneously re-equip all 5 slots (Requirement 2)
  const handleApplyLookbook = (item: LookbookItem) => {
    retroAudio.playEquip();

    // 1. Resolve Costume (Y Phục) from COSTUMES_DATA or inventoryData
    let matchedCostume = COSTUMES_DATA.find((c) => c.id === item.costumeId);
    if (!matchedCostume) {
      const invCostume = inventoryData.find(
        (i) => i.id === item.costumeId && i.category === 'garment'
      );
      if (invCostume) {
        matchedCostume = {
          id: invCostume.id as any,
          name: invCostume.name,
          gender: invCostume.gender === 'unisex' ? item.gender : (invCostume.gender as any),
          era: 'Đại Việt Cổ Truyền',
          dynastyTag: invCostume.tag,
          rarity: 'Chuẩn Mực (Standard)',
          tags: invCostume.tags || [invCostume.tag],
          baseScore: 50,
          characteristics: ['Phom dáng chuẩn mực'],
          fullDescription: invCostume.description || invCostume.name,
          historyLore: 'Di sản trang phục truyền thống Việt Nam.',
          colors: [invCostume.primaryColor || '#b91c1c'],
          colorVariants: [
            {
              id: `${invCostume.id}-default`,
              name: 'Chính sắc',
              primaryColor: invCostume.primaryColor || '#b91c1c',
              secondaryColor: invCostume.secondaryColor || '#7f1d1d',
              accentColor: '#f59e0b',
              patternColor: '#fef08a',
              description: invCostume.name,
            },
          ],
          stats: [{ label: 'Thẩm mỹ', value: 18, max: 20, color: '#f59e0b' }],
          anatomy: {
            collar: 'Cổ phục trang nghiêm',
            sleeves: 'Tay áo tinh xảo',
            panels: 'Vạt áo chuẩn mực',
            accessories: 'Phụ kiện cổ phong đồng bộ',
          },
          quote: `${invCostume.name} - Tinh hoa bách phục cổ truyền.`,
        };
      } else {
        matchedCostume =
          item.gender === 'female'
            ? COSTUMES_DATA[0]
            : COSTUMES_DATA[COSTUMES_DATA.length - 1];
      }
    }

    // 2. Resolve Scene (Bối Cảnh)
    const matchedScene = SCENES_DATA.find((s) => s.id === item.sceneId) || currentScene;

    // 3. Resolve all 3 slots of Accessories (Nón/Mũ + Trang Sức/Cầm Tay + Giày/Hài)
    const targetAccIds = [
      item.headwearId,
      item.accessoryId,
      item.footwearId,
      ...(item.equippedAccessoryIds || []),
    ].filter(Boolean) as string[];

    const uniqueAccIds = Array.from(new Set(targetAccIds));
    const matchedAccessories: Accessory[] = [];

    for (const accId of uniqueAccIds) {
      const standard = ACCESSORIES_DATA.find((a) => a.id === accId);
      if (standard) {
        matchedAccessories.push(standard);
      } else {
        const inv = inventoryData.find((i) => i.id === accId);
        if (inv) {
          matchedAccessories.push({
            id: inv.id,
            name: inv.name,
            category: inv.category as AccessoryCategory,
            gender: inv.gender,
            slot: inv.category === 'head' ? 'head' : inv.category === 'feet' ? 'feet' : 'hand',
            tags: inv.tags || [inv.tag],
            scoreBonus: 20,
            compatibleCostumeIds: [],
            incompatibleCostumeIds: [],
            description: inv.description || inv.name,
            icon: inv.icon || '✨',
          });
        }
      }
    }

    // 4. Simultaneously trigger state update & canvas re-render across all elements
    onApplyOutfit({
      costume: matchedCostume,
      gender: item.gender,
      scene: matchedScene,
      accessories: matchedAccessories,
    });

    setFeedbackMsg(
      `Đã khoác lên bộ: "${item.title}" (Đầy đủ 5 món: Áo • Mũ • Sức • Hài • Cảnh)!`
    );
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Download Card image: download full snapshot PNG if available, or generate composite card
  const handleDownloadCard = (item: LookbookItem) => {
    retroAudio.playBlip(540);

    // If we have the full canvas snapshot base64 image, download it directly
    if (item.thumbnailData && item.thumbnailData.startsWith('data:image')) {
      const a = document.createElement('a');
      a.href = item.thumbnailData;
      a.download = `lookbook-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      a.click();
      setFeedbackMsg(`Đã tải ảnh snapshot: "${item.title}"!`);
      setTimeout(() => setFeedbackMsg(null), 2500);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#1A0F0D';
    ctx.fillRect(0, 0, 480, 320);

    // Gold border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 464, 304);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, 452, 292);

    // Header title
    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('BÁCH PHỤC LOOKBOOK', 30, 48);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(item.title, 30, 85);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px sans-serif';
    ctx.fillText(`• Giới tính: ${item.gender === 'female' ? 'Nữ Phục' : 'Nam Phục'}`, 30, 115);
    ctx.fillText(`• Bối cảnh: ${item.sceneId}`, 30, 140);
    ctx.fillText(`• Ngày lưu: ${item.dateSaved}`, 30, 165);
    ctx.fillText(`• Phụ kiện: ${item.equippedAccessoryIds.length} món phối hợp`, 30, 190);

    // Color swatch
    ctx.fillStyle = item.color;
    ctx.fillRect(30, 215, 60, 20);
    ctx.strokeStyle = '#D4AF37';
    ctx.strokeRect(30, 215, 60, 20);

    // Stamp
    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('ĐẠI VIỆT PHONG HOA • CHỨNG THỰC', 30, 275);

    const a = document.createElement('a');
    a.download = `Lookbook_${item.title.replace(/\s+/g, '_')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    retroAudio.playEquip();
    onUpdateUser({
      username: currentUser.username,
      displayName: displayName.trim(),
      role: userRole,
      email: userEmail.trim(),
      bio: userBio.trim(),
    });
    setFeedbackMsg('Đã cập nhật thông tin tài khoản thành công!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={`w-[94%] md:w-[86%] max-w-[940px] h-[86vh] max-h-[720px] border-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden select-none font-['Be_Vietnam_Pro','Nunito',sans-serif] ${
          theme === 'light'
            ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
            : 'bg-[#1A0F0D] border-[#D4AF37] text-[#F4EDE2]'
        }`}
        style={{
          position: position ? 'fixed' : 'relative',
          left: position ? `${position.x}px` : undefined,
          top: position ? `${position.y}px` : undefined,
          boxShadow: theme === 'light' ? '0 16px 45px rgba(90, 45, 45, 0.2)' : '0 0 35px rgba(212, 175, 55, 0.35), inset 0 0 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* ================= MODAL HEADER BAR (DRAGGABLE) ================= */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`flex items-center justify-between px-4 py-3 border-b-2 cursor-grab active:cursor-grabbing transition-colors ${
            isDragging ? 'ring-1 ring-amber-300' : ''
          } ${
            theme === 'light'
              ? 'bg-[#FED2B7] border-[#FFBFA0] text-[#3D2314]'
              : 'bg-[#2A1510] border-[#D4AF37] text-[#FDE047]'
          }`}
        >
          <div className="flex items-center gap-2.5 pointer-events-none">
            <span className="text-xl">🪷</span>
            <div>
              <h2 className={`text-base sm:text-lg font-bold font-['VT323','Silkscreen',monospace] uppercase tracking-wider ${
                theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'
              }`}>
                HỒ SƠ BÁCH PHỤC CỦA TÔI
              </h2>
              <p className={`text-[10px] font-mono ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'}`}>
                • DRAGGABLE (Kéo giữ thanh tiêu đề để di chuyển khung)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playBlip(320);
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center bg-[#B91C1C] hover:bg-[#DC2626] text-white font-bold border border-[#FED2B7] cursor-pointer active:scale-95 transition-transform"
            title="Đóng hồ sơ"
          >
            ✕
          </button>
        </div>

        {/* FEEDBACK TOAST */}
        {feedbackMsg && (
          <div className="bg-[#B91C1C] text-[#FEF08A] px-4 py-1.5 text-xs font-bold text-center border-b border-[#FDE047] animate-in fade-in duration-150">
            {feedbackMsg}
          </div>
        )}

        {/* ================= MODAL BODY: SIDEBAR + CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* --- LEFT SIDEBAR (PROFILE INFO & NAVIGATION) --- */}
          <div className={`w-full md:w-[260px] border-b-2 md:border-b-0 md:border-r-2 p-3.5 flex flex-col justify-between shrink-0 overflow-y-auto wardrobe-scroll ${
            theme === 'light'
              ? 'bg-[#FFFFE3] border-[#FED2B7]'
              : 'bg-[#120907] border-[#D4AF37]/50'
          }`}>
            <div>
              {/* User Avatar & Info */}
              <div className={`flex items-center gap-3 p-2.5 border mb-3.5 shadow-xs ${
                theme === 'light'
                  ? 'bg-white border-[#FED2B7]'
                  : 'bg-[#2A1510] border-[#D4AF37]/60'
              }`}>
                <div className={`w-12 h-12 border-2 flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                  theme === 'light'
                    ? 'bg-[#FED2B7] border-[#FFA9A9]'
                    : 'bg-[#3D2314] border-[#FDE047]'
                }`}>
                  {userRole === 'king' ? '👑' : userRole === 'noble' ? '🪭' : '🌿'}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`} title={displayName}>
                    {displayName}
                  </div>
                  <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#A7F3D0]'}`}>
                    {userRole === 'king'
                      ? 'Bậc Quân Vương'
                      : userRole === 'noble'
                      ? 'Nữ Quý Tộc'
                      : 'Khách Du Ngoạn'}
                  </div>
                  <div className={`text-[9px] font-mono mt-0.5 truncate ${theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#FED7AA]'}`}>
                    @{currentUser.username}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-1.5 mb-3.5 text-center font-mono text-[10px]">
                <div className={`p-1.5 border ${theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#25120D] border-[#D4AF37]/40'}`}>
                  <span className={`block font-bold text-sm ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>{lookbook.length}</span>
                  <span className={theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'}>Bộ Đã Lưu</span>
                </div>
                <div className={`p-1.5 border ${theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#25120D] border-[#D4AF37]/40'}`}>
                  <span className={`block font-bold text-sm ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>6</span>
                  <span className={theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'}>Cảnh Giới</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    retroAudio.playBlip(440);
                    setActiveTab('lookbook');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'lookbook'
                      ? theme === 'light'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold shadow-sm'
                        : 'bg-[#B45309] text-white border-[#FDE047] shadow-sm'
                      : theme === 'light'
                      ? 'bg-white text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                      : 'bg-[#25120D] text-[#FED7AA] border-transparent hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">💖 Lookbook Cá Nhân</span>
                  <span className={`font-mono text-[10px] px-1 py-0.2 ${theme === 'light' ? 'bg-[#FED2B7] text-[#3D2314]' : 'bg-black/40 text-white'}`}>
                    {lookbook.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    retroAudio.playBlip(480);
                    setActiveTab('backgrounds');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'backgrounds'
                      ? theme === 'light'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold shadow-sm'
                        : 'bg-[#B45309] text-white border-[#FDE047] shadow-sm'
                      : theme === 'light'
                      ? 'bg-white text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                      : 'bg-[#25120D] text-[#FED7AA] border-transparent hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">📸 Kho Bối Cảnh</span>
                  <span className={`font-mono text-[10px] px-1 py-0.2 ${theme === 'light' ? 'bg-[#FED2B7] text-[#3D2314]' : 'bg-black/40 text-white'}`}>6 Cảnh</span>
                </button>

                <button
                  onClick={() => {
                    retroAudio.playBlip(520);
                    setActiveTab('settings');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'settings'
                      ? theme === 'light'
                        ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-bold shadow-sm'
                        : 'bg-[#B45309] text-white border-[#FDE047] shadow-sm'
                      : theme === 'light'
                      ? 'bg-white text-[#3D2314] border-[#FED2B7] hover:bg-[#FED2B7]/30'
                      : 'bg-[#25120D] text-[#FED7AA] border-transparent hover:border-[#D4AF37]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">⚙️ Thiết Lập Hồ Sơ</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Logout Button */}
            <div className={`pt-3 border-t mt-3 ${theme === 'light' ? 'border-[#FED2B7]' : 'border-[#D4AF37]/40'}`}>
              <button
                onClick={() => {
                  retroAudio.playBlip(320);
                  onLogout();
                }}
                className="w-full py-2 px-3 bg-[#B91C1C] hover:bg-[#DC2626] active:scale-95 text-white font-bold text-xs border border-[#FED2B7] cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md font-['Be_Vietnam_Pro','Nunito',sans-serif]"
                title="Đăng xuất khỏi phiên hiện tại và quay về màn hình Đầm Sen"
              >
                <span>🚪</span>
                <span>ĐĂNG XUẤT TÀI KHOẢN</span>
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT AREA --- */}
          <div className={`flex-1 p-3.5 sm:p-5 overflow-y-auto wardrobe-scroll ${
            theme === 'light' ? 'bg-[#FFFFE3] text-[#3D2314]' : 'bg-[#1A0F0D] text-white'
          }`}>
            {/* ================= TAB 1: LOOKBOOK CÁ NHÂN ================= */}
            {activeTab === 'lookbook' && (
              <div className="space-y-4">
                {/* Header Action: Save Current Outfit Button */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 border ${
                  theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#2A1510] border-[#D4AF37]/60'
                }`}>
                  <div>
                    <h3 className={`text-sm font-bold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                      BỘ SƯU TẬP PHỐI ĐỒ HOÀNG TRIỀU ({lookbook.length} BỘ)
                    </h3>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'}`}>
                      Đang mặc: <strong className={theme === 'light' ? 'text-[#3D2314]' : 'text-white'}>{currentCostume.name}</strong> ({currentGender === 'female' ? 'Nữ' : 'Nam'}) tại {currentScene.name}
                    </p>
                  </div>

                  {!isSavingCurrent ? (
                    <button
                      onClick={() => setIsSavingCurrent(true)}
                      className={`px-3 py-1.5 text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                        theme === 'light'
                          ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                          : 'bg-[#B45309] hover:bg-[#D97706] text-white border-[#FDE047]'
                      }`}
                    >
                      <span>➕</span>
                      <span>LƯU BỘ ĐANG MẶC</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Đặt tên cho bộ đồ..."
                        className={`px-2 py-1 text-xs border rounded-none focus:outline-none min-w-[170px] ${
                          theme === 'light'
                            ? 'bg-white border-[#FED2B7] text-[#3D2314] focus:border-[#FFA9A9]'
                            : 'bg-black/60 border-[#D4AF37] text-white focus:border-[#FDE047]'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveCurrentOutfit}
                        className="px-2.5 py-1 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold border border-white cursor-pointer"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsSavingCurrent(false)}
                        className={`px-2 py-1 text-xs border cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white text-[#5C2E1B] border-[#FED2B7]'
                            : 'bg-black/60 text-[#FED7AA] border-white/20'
                        }`}
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>

                {/* Lookbook Cards Grid or Empty State Placeholder (Requirement 3) */}
                {lookbook.length === 0 ? (
                  <div className={`py-12 px-6 text-center border-2 border-dashed my-4 shadow-inner ${
                    theme === 'light'
                      ? 'border-[#FED2B7] bg-white/70 text-[#3D2314]'
                      : 'border-[#D4AF37]/50 bg-[#25120D]/60 text-white'
                  }`}>
                    <span className="text-4xl block mb-2.5">🧺</span>
                    <h4 className={`text-sm font-bold uppercase font-['VT323','Silkscreen',monospace] tracking-widest mb-1.5 ${
                      theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'
                    }`}>
                      CHƯA CÓ BỘ TRANG PHỤC NÀO ĐƯỢC LƯU
                    </h4>
                    <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                      theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'
                    }`}>
                      Kho Lookbook SQLite của bạn hiện đang hoàn toàn trống. Hãy phối trang phục ưng ý và nhấn nút <strong className={theme === 'light' ? 'text-[#B91C1C]' : 'text-white'}>"➕ LƯU BỘ ĐANG MẶC"</strong> ở phía trên để lưu bộ đồ đầu tiên vào cơ sở dữ liệu!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {lookbook.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 border-2 flex flex-col justify-between transition-all group shadow-sm ${
                          theme === 'light'
                            ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                            : 'bg-[#24120D] border-[#D4AF37]/70 hover:border-[#FDE047]'
                        }`}
                      >
                        {/* Top Info & Snapshot Preview */}
                        <div>
                          {/* Visual 2D Canvas Snapshot Preview Image (Requirement 1 & 3) */}
                          <div className={`relative w-full h-44 mb-2.5 overflow-hidden flex items-center justify-center transition-all shadow-inner border ${
                            theme === 'light'
                              ? 'bg-[#E5E7EB] border-[#FED2B7] group-hover:border-[#FFA9A9]'
                              : 'bg-[#0A0504] border-[#D4AF37]/50 group-hover:border-[#FDE047]'
                          }`}>
                            {item.thumbnailData && item.thumbnailData.startsWith('data:image') ? (
                              <img
                                src={item.thumbnailData}
                                alt={item.title}
                                className={`w-full h-full object-contain pixelated ${
                                  theme === 'light' ? 'bg-[#E5E7EB]' : 'bg-[#120806]'
                                }`}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex flex-col items-center justify-center gap-1"
                                style={{ backgroundColor: item.color }}
                              >
                                <span className="text-3xl">🪷</span>
                                <span className="text-[10px] text-white/90 font-mono font-bold">
                                  BÁCH PHỤC PIXEL
                                </span>
                              </div>
                            )}

                            {/* Gender Badge */}
                            <span className="absolute top-1.5 left-1.5 text-[9px] font-bold font-mono px-1.5 py-0.5 bg-[#B91C1C] text-white border border-[#FFBFA0] shadow">
                              {item.gender === 'female' ? '👩 NỮ' : '👨 NAM'}
                            </span>

                            {/* Scene ID Badge */}
                            <span className={`absolute top-1.5 right-1.5 text-[8.5px] font-mono px-1.5 py-0.5 shadow border ${
                              theme === 'light'
                                ? 'bg-white text-[#3D2314] border-[#FED2B7]'
                                : 'bg-black/80 text-[#FDE047] border-[#D4AF37]/60'
                            }`}>
                              {item.sceneId}
                            </span>
                          </div>

                          {/* Title and Date */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="min-w-0">
                              <h4 className={`text-xs font-bold truncate ${
                                theme === 'light' ? 'text-[#3D2314] group-hover:text-[#8B3A3A]' : 'text-[#FDE047] group-hover:text-white'
                              }`} title={item.title}>
                                {item.title}
                              </h4>
                              <span className={`text-[10px] font-mono ${
                                theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'
                              }`}>
                                Ngày lưu: {item.dateSaved}
                              </span>
                            </div>
                            <span
                              className="w-3.5 h-3.5 border border-white/60 shrink-0 shadow-sm mt-0.5"
                              style={{ backgroundColor: item.color }}
                              title="Tông màu chủ đạo"
                            />
                          </div>

                          {/* Badges / Tags */}
                          <div className="flex flex-wrap gap-1 my-1.5">
                            {item.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] font-mono px-1.5 py-0.2 border ${
                                  theme === 'light'
                                    ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0]'
                                    : 'bg-black/60 text-[#FED7AA] border-[#D4AF37]/40'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* 5-Slot Equipment Details Breakdown */}
                          <div className={`p-1.5 border text-[9.5px] font-mono space-y-0.5 mb-2.5 ${
                            theme === 'light'
                              ? 'bg-[#FFFFE3] border-[#FED2B7] text-[#3D2314]'
                              : 'bg-black/40 border-[#D4AF37]/30 text-[#CBD5E1]'
                          }`}>
                            <div className="truncate">
                              <span className={`font-bold ${theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#FDE047]'}`}>🥋 Y Phục:</span> {item.costumeId}
                            </div>
                            <div className="truncate">
                              <span className={`font-bold ${theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#FDE047]'}`}>👑 Nón/Mũ:</span> {item.headwearId || 'Không mang'}
                            </div>
                            <div className="truncate">
                              <span className={`font-bold ${theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#FDE047]'}`}>💎 Trang Sức:</span> {item.accessoryId || 'Không mang'}
                            </div>
                            <div className="truncate">
                              <span className={`font-bold ${theme === 'light' ? 'text-[#8B3A3A]' : 'text-[#FDE047]'}`}>👞 Giày/Hài:</span> {item.footwearId || 'Không mang'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`grid grid-cols-3 gap-1 pt-2 border-t text-[11px] ${
                          theme === 'light' ? 'border-[#FED2B7]' : 'border-[#D4AF37]/30'
                        }`}>
                          <button
                            onClick={() => handleApplyLookbook(item)}
                            className={`py-1 px-1.5 font-bold border cursor-pointer text-center truncate transition-colors active:scale-95 shadow-xs ${
                              theme === 'light'
                                ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                                : 'bg-[#B45309] hover:bg-[#D97706] text-white border-[#FDE047]'
                            }`}
                            title="Khoác đồng thời toàn bộ 5 món lên nhân vật (Áo, Mũ, Sức, Hài, Cảnh)"
                          >
                            👔 Mặc Ngay
                          </button>
                          <button
                            onClick={() => handleDownloadCard(item)}
                            className={`py-1 px-1.5 font-bold border cursor-pointer text-center truncate transition-colors active:scale-95 shadow-xs ${
                              theme === 'light'
                                ? 'bg-white hover:bg-[#FED2B7]/30 text-[#3D2314] border-[#FED2B7]'
                                : 'bg-[#1E3A5F] hover:bg-[#2563EB] text-white border-[#93C5FD]'
                            }`}
                            title="Tải ảnh snapshot Lookbook định dạng PNG"
                          >
                            📸 Tải Card
                          </button>
                          <button
                            onClick={() => handleDeleteLookbook(item.id)}
                            className={`py-1 px-1.5 font-bold border cursor-pointer text-center truncate transition-colors active:scale-95 shadow-xs ${
                              theme === 'light'
                                ? 'bg-rose-50 hover:bg-rose-100 text-[#991B1B] border-rose-300'
                                : 'bg-[#7F1D1D] hover:bg-[#B91C1C] text-[#FCA5A5] hover:text-white border-[#EF4444]'
                            }`}
                            title="Xóa bộ đồ khỏi SQLite"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 2: KHO BỐI CẢNH ================= */}
            {activeTab === 'backgrounds' && (
              <div className="space-y-4">
                <div className={`p-3 border ${theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#2A1510] border-[#D4AF37]/60'}`}>
                  <h3 className={`text-sm font-bold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                    KHO BỐI CẢNH KHÔNG GIAN CỔ TRUYỀN (6 ĐẠI DANH THẮNG)
                  </h3>
                  <p className={`text-[11px] ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'}`}>
                    Bối cảnh hiện tại: <strong className={theme === 'light' ? 'text-[#8B3A3A]' : 'text-white'}>{currentScene.name}</strong> • Nhấn "Chọn Cảnh" để đưa mô hình đến bối cảnh ngay lập tức.
                  </p>
                </div>

                {/* TÙY CHỌN TẢI BỐI CẢNH TÙY CHỈNH (CUSTOM BACKGROUND IMAGE/URL) */}
                <div className={`p-3 border-2 rounded-none shadow-sm ${
                  theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#25120D] border-[#D4AF37]/80'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🖼️</span>
                    <h4 className={`text-xs font-bold uppercase font-mono ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                      Tải Lên Bối Cảnh Tùy Chỉnh (Custom Scene)
                    </h4>
                  </div>
                  <p className={`text-[11px] mb-2.5 ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'}`}>
                    Dán đường dẫn ảnh trực tiếp hoặc tải tệp ảnh từ máy tính để làm phong nền bách phục của bạn.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      value={customBgInput}
                      onChange={(e) => setCustomBgInput(e.target.value)}
                      placeholder="Dán link ảnh (https://...)..."
                      className={`flex-1 px-3 py-1.5 text-xs rounded-none focus:outline-none border ${
                        theme === 'light'
                          ? 'bg-white border-[#FED2B7] text-[#3D2314] focus:border-[#FFA9A9]'
                          : 'bg-black/60 border-[#D4AF37] text-white focus:border-[#FDE047]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customBgInput.trim()) {
                          retroAudio.playBlip(240);
                          setFeedbackMsg('Vui lòng nhập đường dẫn URL hình ảnh!');
                          setTimeout(() => setFeedbackMsg(null), 3000);
                          return;
                        }
                        const customScene: Scene = {
                          id: 'custom-scene',
                          name: 'Bối Cảnh Tự Chọn',
                          shortName: 'Tự Chọn',
                          subtitle: 'Tùy chỉnh cá nhân',
                          timeOfDay: 'Toàn cảnh',
                          description: 'Bối cảnh không gian độc bản do người dùng tải lên.',
                          wardrobeObjectName: 'Gương Soi Cổ',
                          wardrobeClosedIcon: '🪞',
                          wardrobeOpenIcon: '✨',
                          icon: '🖼️',
                          imageUrl: customBgInput.trim(),
                        };
                        retroAudio.playEquip();
                        onSceneChange(customScene);
                        setFeedbackMsg('Đã áp dụng bối cảnh ảnh tùy chỉnh thành công!');
                        setTimeout(() => setFeedbackMsg(null), 3000);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold border cursor-pointer ${
                        theme === 'light'
                          ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                          : 'bg-[#B45309] hover:bg-[#D97706] text-white border-[#FDE047]'
                      }`}
                    >
                      Áp Dụng URL
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          if (result) {
                            const customScene: Scene = {
                              id: 'custom-scene-file',
                              name: file.name.replace(/\.[^/.]+$/, ''),
                              shortName: 'Tệp Máy',
                              subtitle: 'Tệp tải lên từ máy',
                              timeOfDay: 'Toàn cảnh',
                              description: 'Bối cảnh ảnh tải trực tiếp từ thiết bị của bạn.',
                              wardrobeObjectName: 'Gương Soi Cổ',
                              wardrobeClosedIcon: '🪞',
                              wardrobeOpenIcon: '✨',
                              icon: '📁',
                              imageUrl: result,
                            };
                            retroAudio.playEquip();
                            onSceneChange(customScene);
                            setFeedbackMsg(`Đã nạp bối cảnh tệp: "${file.name}"!`);
                            setTimeout(() => setFeedbackMsg(null), 3000);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-3 py-1.5 text-xs font-bold border cursor-pointer flex items-center justify-center gap-1 ${
                        theme === 'light'
                          ? 'bg-white hover:bg-[#FED2B7]/30 text-[#3D2314] border-[#FED2B7]'
                          : 'bg-[#1E3A5F] hover:bg-[#2563EB] text-white border-[#93C5FD]'
                      }`}
                    >
                      <span>📁</span>
                      <span>Tải Tệp Ảnh</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCENES_DATA.map((sc) => {
                    const isSelected = sc.id === currentScene.id;
                    return (
                      <div
                        key={sc.id}
                        className={`p-3 border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? theme === 'light'
                              ? 'bg-[#FED2B7] border-[#FFBFA0] shadow-inner font-bold'
                              : 'bg-[#3D1A10] border-[#FDE047] shadow-[0_0_12px_rgba(253,224,71,0.4)]'
                            : theme === 'light'
                            ? 'bg-white border-[#FED2B7] hover:border-[#FFA9A9]'
                            : 'bg-[#24120D] border-[#D4AF37]/60 hover:border-[#D4AF37]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <span className="text-2xl">{sc.icon}</span>
                          <div>
                            <h4 className={`text-xs font-bold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                              {sc.name}
                            </h4>
                            <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#A7F3D0]'}`}>
                              {sc.subtitle}
                            </span>
                            <p className={`text-[10.5px] mt-1 line-clamp-2 ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'}`}>
                              {sc.description}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between pt-2 border-t mt-2 ${
                          theme === 'light' ? 'border-[#FED2B7]' : 'border-[#D4AF37]/30'
                        }`}>
                          <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#CBD5E1]'}`}>
                            Vật thể: {sc.wardrobeObjectName}
                          </span>
                          <button
                            onClick={() => {
                              retroAudio.playBlip(540);
                              onSceneChange(sc);
                              setFeedbackMsg(`Đã đổi bối cảnh sang: ${sc.name}!`);
                              setTimeout(() => setFeedbackMsg(null), 3000);
                            }}
                            className={`px-3 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#10B981] text-white border-white'
                                : theme === 'light'
                                ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                                : 'bg-[#B45309] hover:bg-[#D97706] text-white border-[#FDE047]'
                            }`}
                          >
                            {isSelected ? '✓ ĐANG CHỌN' : 'CHỌN CẢNH'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 3: THIẾT LẬP TÀI KHOẢN ================= */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
                <div className={`p-3 border mb-2 ${theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#2A1510] border-[#D4AF37]/60'}`}>
                  <h3 className={`text-sm font-bold ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                    THIẾT LẬP THÔNG TIN TÀI KHOẢN BÁCH PHỤC
                  </h3>
                  <p className={`text-[11px] ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]/80'}`}>
                    Tùy chỉnh danh phận, tên hiển thị, cảm nghĩ cổ phong và thiết lập âm thanh.
                  </p>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FED7AA]'}`}>
                    Tên Hiển Thị (Display Name)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className={`w-full px-3 py-2 text-xs rounded-none focus:outline-none border ${
                      theme === 'light'
                        ? 'bg-white border-[#FED2B7] text-[#3D2314] focus:border-[#FFA9A9]'
                        : 'bg-black/60 border-[#D4AF37] text-white focus:border-[#FDE047]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FED7AA]'}`}>
                    Danh Phận / Cấp Bậc (Class / Role)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserRole('noble')}
                      className={`p-2 text-xs font-bold border transition-all cursor-pointer ${
                        userRole === 'noble'
                          ? theme === 'light'
                            ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black'
                            : 'bg-[#831843] text-white border-[#FDE047]'
                          : theme === 'light'
                          ? 'bg-white text-[#3D2314] border-[#FED2B7]'
                          : 'bg-[#25120D] text-[#FED7AA] border-[#D4AF37]/40'
                      }`}
                    >
                      🪭 Nữ Quý Tộc
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('king')}
                      className={`p-2 text-xs font-bold border transition-all cursor-pointer ${
                        userRole === 'king'
                          ? theme === 'light'
                            ? 'bg-[#FED2B7] text-[#3D2314] border-[#FFBFA0] font-black'
                            : 'bg-[#1E3A5F] text-white border-[#FDE047]'
                          : theme === 'light'
                          ? 'bg-white text-[#3D2314] border-[#FED2B7]'
                          : 'bg-[#25120D] text-[#FED7AA] border-[#D4AF37]/40'
                      }`}
                    >
                      👑 Quân Vương
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('guest')}
                      className={`p-2 text-xs font-bold border transition-all cursor-pointer ${
                        userRole === 'guest'
                          ? theme === 'light'
                            ? 'bg-[#FFA9A9] text-[#3D2314] border-[#FFBFA0] font-black'
                            : 'bg-[#B91C1C] text-white border-[#FDE047]'
                          : theme === 'light'
                          ? 'bg-white text-[#3D2314] border-[#FED2B7]'
                          : 'bg-[#25120D] text-[#FED7AA] border-[#D4AF37]/40'
                      }`}
                    >
                      🌿 Khách Thường
                    </button>
                  </div>
                </div>

                {/* THIẾT LẬP ÂM THANH & BGM */}
                <div className={`p-3 border space-y-2 ${
                  theme === 'light' ? 'bg-white border-[#FED2B7]' : 'bg-[#24120D] border-[#D4AF37]/50'
                }`}>
                  <label className={`block text-xs font-bold uppercase font-mono ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FDE047]'}`}>
                    🎵 Thiết Lập Âm Thanh & Âm Nhạc:
                  </label>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'}`}>Hiệu ứng âm thanh (Sound FX 8-bit):</span>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSound?.();
                        retroAudio.playBlip(500);
                      }}
                      className={`px-3 py-1 text-xs font-bold border cursor-pointer ${
                        soundEnabled
                          ? 'bg-[#10B981] text-white border-white'
                          : 'bg-[#374151] text-[#9CA3AF] border-white/20'
                      }`}
                    >
                      {soundEnabled ? '🔊 ĐANG BẬT' : '🔇 ĐANG TẮT'}
                    </button>
                  </div>
                  <div className={`flex items-center justify-between pt-1 border-t ${
                    theme === 'light' ? 'border-[#FED2B7]' : 'border-[#D4AF37]/20'
                  }`}>
                    <span className={`text-xs ${theme === 'light' ? 'text-[#5C2E1B]' : 'text-[#FED7AA]'}`}>Nhạc nền cổ phong cung đình (BGM):</span>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleBgm?.();
                      }}
                      className={`px-3 py-1 text-xs font-bold border cursor-pointer ${
                        bgmPlaying
                          ? 'bg-[#8B5CF6] text-white border-[#DDD6FE]'
                          : 'bg-[#374151] text-[#9CA3AF] border-white/20'
                      }`}
                    >
                      {bgmPlaying ? '🎶 ĐANG PHÁT' : '⏸️ ĐANG DỪNG'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FED7AA]'}`}>
                    Email Liên Hệ
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-none focus:outline-none border ${
                      theme === 'light'
                        ? 'bg-white border-[#FED2B7] text-[#3D2314] focus:border-[#FFA9A9]'
                        : 'bg-black/60 border-[#D4AF37] text-white focus:border-[#FDE047]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-[#3D2314]' : 'text-[#FED7AA]'}`}>
                    Tâm Tư Cổ Phong (Bio)
                  </label>
                  <textarea
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 text-xs rounded-none focus:outline-none border ${
                      theme === 'light'
                        ? 'bg-white border-[#FED2B7] text-[#3D2314] focus:border-[#FFA9A9]'
                        : 'bg-black/60 border-[#D4AF37] text-white focus:border-[#FDE047]'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border cursor-pointer shadow-md transition-all active:scale-95 ${
                    theme === 'light'
                      ? 'bg-[#FFA9A9] hover:bg-[#ff9393] text-[#3D2314] border-[#FFBFA0]'
                      : 'bg-[#B45309] hover:bg-[#D97706] text-white border-[#FDE047]'
                  }`}
                >
                  💾 LƯU THAY ĐỔI
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
