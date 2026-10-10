import { Costume, ColorVariant, Accessory, Scene } from '../types.ts';

export interface OutfitSnapshotParams {
  costume: Costume;
  activeVariant?: ColorVariant;
  gender: 'female' | 'male';
  scene: Scene;
  headwear?: Accessory | null;
  jewelry?: Accessory | null;
  footwear?: Accessory | null;
  outfitName: string;
}

/**
 * Generate a high-fidelity 2D Canvas snapshot of the complete outfit set:
 * Garment + Headwear + Accessory/Jewelry + Footwear + Background Scene.
 * Returns a base64 PNG image URL.
 */
export function generateLookbookCanvasSnapshot(params: OutfitSnapshotParams): string {
  const {
    costume,
    activeVariant,
    gender,
    scene,
    headwear,
    jewelry,
    footwear,
    outfitName,
  } = params;

  const canvas = document.createElement('canvas');
  const width = 420;
  const height = 420;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const primary =
    activeVariant?.primaryColor ||
    costume.colorVariants?.[0]?.primaryColor ||
    costume.colors?.[0] ||
    '#B91C1C';
  const secondary =
    activeVariant?.secondaryColor ||
    costume.colorVariants?.[0]?.secondaryColor ||
    '#78350F';
  const accent =
    activeVariant?.accentColor ||
    costume.colorVariants?.[0]?.accentColor ||
    '#F59E0B';
  const pattern =
    activeVariant?.patternColor ||
    costume.colorVariants?.[0]?.patternColor ||
    '#FEF08A';

  // ==================================================================
  // 1. SCENIC BACKGROUND LAYER
  // ==================================================================
  const sceneId = scene.id;
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);

  if (sceneId === 'bong-lai') {
    // Bồng Lai: Pastel dawn & mist
    bgGrad.addColorStop(0, '#FFE4E1');
    bgGrad.addColorStop(0.5, '#FED7AA');
    bgGrad.addColorStop(1, '#FFFBEB');
  } else if (sceneId === 'son-than') {
    // Sơn Thần: Deep emerald mountains & pine
    bgGrad.addColorStop(0, '#064E3B');
    bgGrad.addColorStop(0.55, '#047857');
    bgGrad.addColorStop(1, '#FEF3C7');
  } else if (sceneId === 'cuu-long') {
    // Cửu Long: Sunset river glow
    bgGrad.addColorStop(0, '#78350F');
    bgGrad.addColorStop(0.5, '#D97706');
    bgGrad.addColorStop(1, '#FEF08A');
  } else if (sceneId === 'cung-dinh') {
    // Cung Đình: Imperial crimson & gold
    bgGrad.addColorStop(0, '#450A0A');
    bgGrad.addColorStop(0.5, '#991B1B');
    bgGrad.addColorStop(1, '#FEF08A');
  } else if (sceneId === 'dam-sen') {
    // Đầm Sen: Misty morning lotus pond
    bgGrad.addColorStop(0, '#FFE4E1');
    bgGrad.addColorStop(0.5, '#FCE7F3');
    bgGrad.addColorStop(1, '#FFF8DC');
  } else if (sceneId === 'hoi-an') {
    // Hội An: Night lantern glow
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.6, '#1E1B4B');
    bgGrad.addColorStop(1, '#4338CA');
  } else {
    // Default / Custom
    bgGrad.addColorStop(0, '#1E293B');
    bgGrad.addColorStop(0.6, '#334155');
    bgGrad.addColorStop(1, '#64748B');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Background motifs
  if (sceneId === 'bong-lai') {
    // Floating soft clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(90, 110, 35, 0, Math.PI * 2);
    ctx.arc(130, 105, 45, 0, Math.PI * 2);
    ctx.arc(170, 110, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(280, 140, 38, 0, Math.PI * 2);
    ctx.arc(325, 135, 45, 0, Math.PI * 2);
    ctx.fill();
  } else if (sceneId === 'dam-sen') {
    // Misty giant lotus leaf & water reflection
    ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.beginPath();
    ctx.ellipse(80, 290, 65, 22, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(340, 300, 60, 20, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Lotus bud
    ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
    ctx.beginPath();
    ctx.arc(340, 275, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (sceneId === 'cung-dinh') {
    // Imperial palace roof eaves silhouette
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(30, 140);
    ctx.lineTo(210, 80);
    ctx.lineTo(390, 140);
    ctx.lineTo(350, 155);
    ctx.lineTo(210, 105);
    ctx.lineTo(70, 155);
    ctx.closePath();
    ctx.fill();
  } else if (sceneId === 'hoi-an') {
    // Glowing lanterns
    const lanterns = [
      { x: 80, y: 100, color: '#EF4444' },
      { x: 130, y: 80, color: '#F59E0B' },
      { x: 300, y: 90, color: '#EC4899' },
      { x: 350, y: 115, color: '#10B981' },
    ];
    lanterns.forEach((l) => {
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  // ==================================================================
  // 2. PEDESTAL & GROUND
  // ==================================================================
  const pedY = 325;
  // Wooden / Stone Platform
  ctx.fillStyle = 'rgba(30, 20, 15, 0.85)';
  ctx.beginPath();
  ctx.ellipse(width / 2, pedY, 110, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(60, 40, 25, 0.9)';
  ctx.beginPath();
  ctx.ellipse(width / 2, pedY - 3, 98, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // ==================================================================
  // 3. CHARACTER RENDERING (PIXEL SILHOUETTE & ROBE LAYERS)
  // ==================================================================
  const cx = width / 2;
  const cy = 200; // character center

  // Skin tones
  const skin = '#FED0AB';
  const skinShadow = '#E0A980';
  const hair = '#18121E';

  // --- LEGS & FOOTWEAR (NHÓM 3) ---
  const footY = pedY - 14;
  // White/Black inner trousers
  ctx.fillStyle = gender === 'female' ? '#1E293B' : '#FFFFFF';
  ctx.fillRect(cx - 14, cy + 65, 10, 36);
  ctx.fillRect(cx + 4, cy + 65, 10, 36);

  // FOOTWEAR
  const footId = footwear?.id?.toLowerCase() || '';
  const footName = footwear?.name?.toLowerCase() || '';

  if (footId.includes('hai') || footName.includes('hài')) {
    // Hài Mũi Vút (Embroidered royal slippers with upturned tip)
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx - 20, footY, 17, 8);
    ctx.fillRect(cx + 3, footY, 17, 8);
    // Upturned tips
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(cx - 22, footY - 3, 4, 8);
    ctx.fillRect(cx + 18, footY - 3, 4, 8);
  } else if (footId.includes('guoc') || footName.includes('guốc')) {
    // Guốc Mộc (Wooden clogs)
    ctx.fillStyle = '#78350F';
    ctx.fillRect(cx - 18, footY + 2, 15, 6);
    ctx.fillRect(cx + 3, footY + 2, 15, 6);
    // Straps
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 14, footY - 1, 7, 3);
    ctx.fillRect(cx + 7, footY - 1, 7, 3);
  } else if (footId.includes('ung') || footName.includes('ủng')) {
    // Ủng Da (Mandarin boots)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 18, footY - 8, 15, 16);
    ctx.fillRect(cx + 3, footY - 8, 15, 16);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(cx - 18, footY + 5, 15, 3);
    ctx.fillRect(cx + 3, footY + 5, 15, 3);
  } else {
    // Default slippers
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 17, footY + 1, 14, 7);
    ctx.fillRect(cx + 3, footY + 1, 14, 7);
  }

  // --- MAIN ROBE BODY ---
  // Skirt / Bottom hem
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy + 20);
  ctx.lineTo(cx + 28, cy + 20);
  ctx.lineTo(cx + 38, cy + 85);
  ctx.lineTo(cx - 38, cy + 85);
  ctx.closePath();
  ctx.fill();

  // Bottom hem border
  ctx.fillStyle = secondary;
  ctx.fillRect(cx - 38, cy + 80, 76, 5);
  ctx.fillStyle = accent;
  ctx.fillRect(cx - 38, cy + 78, 76, 2);

  // Upper torso & chest
  ctx.fillStyle = primary;
  ctx.fillRect(cx - 24, cy - 10, 48, 40);

  // Left & Right Sleeves
  ctx.fillStyle = secondary;
  // Left sleeve
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 10);
  ctx.lineTo(cx - 46, cy + 25);
  ctx.lineTo(cx - 32, cy + 45);
  ctx.lineTo(cx - 18, cy + 25);
  ctx.closePath();
  ctx.fill();
  // Right sleeve
  ctx.beginPath();
  ctx.moveTo(cx + 24, cy - 10);
  ctx.lineTo(cx + 46, cy + 25);
  ctx.lineTo(cx + 32, cy + 45);
  ctx.lineTo(cx + 18, cy + 25);
  ctx.closePath();
  ctx.fill();

  // Collar & Central Placket
  ctx.fillStyle = accent;
  ctx.fillRect(cx - 4, cy - 10, 8, 38);
  ctx.fillStyle = pattern;
  ctx.fillRect(cx - 2, cy - 8, 4, 34);

  // Belt / Waist sash
  ctx.fillStyle = pattern;
  ctx.fillRect(cx - 24, cy + 20, 48, 8);
  ctx.fillStyle = '#B45309';
  ctx.fillRect(cx - 5, cy + 19, 10, 10);

  // Hands (skin)
  ctx.fillStyle = skin;
  ctx.fillRect(cx - 38, cy + 38, 9, 8);
  ctx.fillRect(cx + 29, cy + 38, 9, 8);

  // --- HEAD & FACE ---
  const headY = cy - 40;
  // Neck
  ctx.fillStyle = skinShadow;
  ctx.fillRect(cx - 6, headY + 18, 12, 10);

  // Head base
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(cx, headY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Features
  ctx.fillStyle = '#18121E';
  ctx.fillRect(cx - 8, headY - 2, 4, 3);
  ctx.fillRect(cx + 4, headY - 2, 4, 3);
  // Blush
  ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.fillRect(cx - 11, headY + 4, 4, 3);
  ctx.fillRect(cx + 7, headY + 4, 4, 3);
  // Lips
  ctx.fillStyle = '#E11D48';
  ctx.fillRect(cx - 2, headY + 7, 4, 2);

  // Hair Base (dark)
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(cx, headY - 6, 17, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - 17, headY - 8, 4, 15);
  ctx.fillRect(cx + 13, headY - 8, 4, 15);

  // Hair bun / Topknot
  if (gender === 'female') {
    ctx.beginPath();
    ctx.arc(cx, headY - 22, 11, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(cx - 6, headY - 24, 12, 8);
  }

  // --- JEWELRY / ACCESSORY (NHÓM 2) ---
  const jewId = jewelry?.id?.toLowerCase() || '';
  const jewName = jewelry?.name?.toLowerCase() || '';

  if (jewId.includes('kieng') || jewName.includes('kiềng')) {
    // Kiềng Bạc (Silver torc on neck)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, headY + 22, 12, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (jewId.includes('tram') || jewName.includes('trâm')) {
    // Trâm Cài (Hairpin on hair)
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 15, headY - 22);
    ctx.lineTo(cx + 18, headY - 28);
    ctx.stroke();
    // Emerald jewel
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(cx + 18, headY - 28, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (jewId.includes('the-bai') || jewId.includes('ngoc-boi') || jewName.includes('thẻ bài') || jewName.includes('ngọc bội')) {
    // Thẻ Bài Ngà / Ngọc Bội (Hanging from sash)
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(cx + 14, cy + 26, 6, 18);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 14, cy + 26, 6, 18);
    // Red tassel
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx + 15, cy + 44, 4, 10);
  }

  if (jewId.includes('quat') || jewName.includes('quạt')) {
    // Quạt Lụa Tròn (Handheld fan on right hand)
    ctx.fillStyle = '#FEF9C3';
    ctx.beginPath();
    ctx.arc(cx + 42, cy + 32, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Painted flower inside fan
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.arc(cx + 42, cy + 32, 5, 0, Math.PI * 2);
    ctx.fill();
    // Handle
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + 42, cy + 48);
    ctx.lineTo(cx + 35, cy + 42);
    ctx.stroke();
  }

  if (jewId.includes('quai-thao') || jewName.includes('quai thao')) {
    // Quai Thao Kép (Dual hanging silk ribbons)
    ctx.fillStyle = '#F43F5E';
    ctx.fillRect(cx - 12, headY + 15, 3, 40);
    ctx.fillRect(cx + 9, headY + 15, 3, 40);
  }

  // --- HEADWEAR (NHÓM 1) ---
  const headId = headwear?.id?.toLowerCase() || '';
  const headName = headwear?.name?.toLowerCase() || '';

  if (headId.includes('man') || headName.includes('mấn')) {
    // Mấn Khăn Vành / Hoàng Cung (Embroidered gold/red coronet)
    ctx.fillStyle = '#B45309';
    ctx.fillRect(cx - 20, headY - 26, 40, 14);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(cx - 18, headY - 24, 36, 10);
    // Flower brooch
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(cx, headY - 19, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (headId.includes('khan-xep') || headId.includes('khan-dong') || headName.includes('khăn')) {
    // Khăn Xếp / Khăn Đóng Nam (Neatly folded black wraps)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 19, headY - 25, 38, 14);
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(cx - 19, headY - 25 + i * 3.5, 38, 1.5);
    }
    // Chữ Nhất / Nhân
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(cx - 3, headY - 23, 6, 2);
  } else if (headId.includes('non-ba-tam') || headName.includes('ba tầm')) {
    // Nón Ba Tầm (Wide flat disc hat)
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.ellipse(cx, headY - 20, 48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Inner rim
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.ellipse(cx, headY - 21, 26, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (headId.includes('non-la') || headName.includes('nón lá')) {
    // Nón Lá (Conical straw hat)
    ctx.fillStyle = '#FEF9C3';
    ctx.beginPath();
    ctx.moveTo(cx, headY - 34);
    ctx.lineTo(cx + 42, headY - 12);
    ctx.lineTo(cx - 42, headY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (headId.includes('phuong') || headName.includes('phượng')) {
    // Mũ Phượng (Imperial winged crown)
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(cx - 22, headY - 28, 44, 16);
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(cx, headY - 22, 5, 0, Math.PI * 2);
    ctx.fill();
    // Wing crowns
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.moveTo(cx - 22, headY - 28);
    ctx.lineTo(cx - 34, headY - 38);
    ctx.lineTo(cx - 18, headY - 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 22, headY - 28);
    ctx.lineTo(cx + 34, headY - 38);
    ctx.lineTo(cx + 18, headY - 20);
    ctx.closePath();
    ctx.fill();
  }

  // ==================================================================
  // 4. DECORATIVE RETRO BORDER & WATERMARK
  // ==================================================================
  // Outer gold border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Inner thin border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Corner brackets
  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('✦', 16, 28);
  ctx.fillText('✦', width - 28, 28);
  ctx.fillText('✦', 16, height - 18);
  ctx.fillText('✦', width - 28, height - 18);

  // Top Title Plaque
  ctx.fillStyle = 'rgba(26, 15, 13, 0.85)';
  ctx.fillRect(width / 2 - 120, 14, 240, 26);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.strokeRect(width / 2 - 120, 14, 240, 26);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 12px "VT323", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ ĐẠI VIỆT BÁCH PHỤC LOOKBOOK ✦', width / 2, 31);

  // Bottom Status Dock
  const dockY = height - 58;
  ctx.fillStyle = 'rgba(18, 9, 7, 0.9)';
  ctx.fillRect(16, dockY, width - 32, 42);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, dockY, width - 32, 42);

  // Outfit Name & Info
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 13px sans-serif';
  const displayTitle = outfitName.length > 24 ? outfitName.slice(0, 22) + '...' : outfitName;
  ctx.fillText(displayTitle, 26, dockY + 18);

  // Gender Pill
  ctx.fillStyle = gender === 'female' ? '#B91C1C' : '#1E3A5F';
  ctx.fillRect(width - 85, dockY + 8, 55, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(gender === 'female' ? '👩 NỮ' : '👨 NAM', width - 57, dockY + 20);

  // Item Slots Summary line
  ctx.textAlign = 'left';
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '10px monospace';
  const slotsText = `Áo: ${costume.name.split('(')[0].trim()} • Cảnh: ${scene.name}`;
  ctx.fillText(slotsText, 26, dockY + 34);

  return canvas.toDataURL('image/png');
}
