import React, { useState, useEffect } from 'react';
import { Costume, ColorVariant, Accessory } from '../types.ts';

interface PixelCharacterProps {
  costume: Costume;
  activeVariant: ColorVariant;
  gender: 'female' | 'male';
  pose: 'idle' | 'salute' | 'fan';
  zoom: number;
  equippedAccessories: Accessory[];
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  costume,
  activeVariant,
  gender,
  pose,
  zoom,
  equippedAccessories = [],
}) => {
  const [blink, setBlink] = useState(false);
  const [frame, setFrame] = useState(0);

  // Blinking loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Subtle 2-frame stepped idle breath
  useEffect(() => {
    const animInterval = setInterval(() => {
      setFrame((prev) => (prev === 0 ? 1 : 0));
    }, 900);
    return () => clearInterval(animInterval);
  }, []);

  const primary = activeVariant.primaryColor;
  const secondary = activeVariant.secondaryColor;
  const accent = activeVariant.accentColor;
  const pattern = activeVariant.patternColor;

  const skin = '#fed0ab';
  const skinShadow = '#e0a980';
  const hairColor = '#18121e';
  const eyesColor = '#120d18';

  // Accessories checks - Full mapping & Fallback recognition
  const equippedIds = equippedAccessories.map((a) => a.id);
  const equippedNames = equippedAccessories.map((a) => a.name.toLowerCase());

  // NHÓM 1: NÓN / MŨ / KHĂN ĐỘI
  const hasMan =
    equippedIds.some((id) => id === 'man' || id === 'man-khan-xep') ||
    equippedNames.some((n) => n.includes('mấn'));
  const hasKhanXep =
    equippedIds.some((id) => id === 'khan-xep' || id === 'khan-dong-nam') ||
    equippedNames.some((n) => n.includes('khăn đóng') || n.includes('khăn xếp'));
  const hasNonBaTam =
    equippedIds.some((id) => id === 'non-ba-tam') ||
    equippedNames.some((n) => n.includes('ba tầm'));
  const hasNonLa =
    equippedIds.some((id) => id === 'non-la-co-hut') ||
    equippedNames.some((n) => n.includes('nón lá'));
  const hasMuPhuong =
    equippedIds.some((id) => id === 'mu-phuong-hoang-cung') ||
    equippedNames.some((n) => n.includes('mũ phượng'));
  const hasNonNgua =
    equippedIds.some((id) => id === 'non-ngua-binh-dinh') ||
    equippedNames.some((n) => n.includes('nón ngựa'));
  const hasMuOSa =
    equippedIds.some((id) => id === 'mu-o-sa') ||
    equippedNames.some((n) => n.includes('ô sa'));
  const hasMuPhocDau =
    equippedIds.some((id) => id === 'mu-phoc-dau') ||
    equippedNames.some((n) => n.includes('phốc đầu'));
  const hasMuKhoiGiap =
    equippedIds.some((id) => id === 'mu-khoi-giap-co-phong') ||
    equippedNames.some((n) => n.includes('khôi giáp'));

  // NHÓM 2: TRANG SỨC / CẦM TAY (ĐẦY ĐỦ 10 MÓN & ALIASES)
  const hasTramCai =
    equippedIds.some((id) => id === 'tram-cai-toc-dinh-ngoc' || id === 'tram-cai-da') ||
    equippedNames.some((n) => n.includes('trâm cài'));
  const hasKiengBac =
    equippedIds.some((id) => id === 'kieng-bac-cham-tro' || id === 'kieng-bac') ||
    equippedNames.some((n) => n.includes('kiềng bạc'));
  const hasQuatLua =
    equippedIds.some((id) => id === 'quat-lua-tron-cung-dinh' || id === 'quat-lua-tron') ||
    equippedNames.some((n) => n.includes('quạt lụa'));
  const hasQuaiThaoKep =
    equippedIds.some((id) => id === 'quai-thao-kep-that-lua' || id === 'quai-thao-kep') ||
    equippedNames.some((n) => n.includes('quai thao'));
  const hasChuoiHat =
    equippedIds.some((id) => id === 'chuoi-hat-tram-huong') ||
    equippedNames.some((n) => n.includes('trầm hương') || n.includes('chuỗi hạt'));
  const hasQuatGiay =
    equippedIds.some((id) => id === 'quat-giay-thu-phap-audition') ||
    equippedNames.some((n) => n.includes('quạt giấy') || n.includes('thư pháp'));
  const hasKiem =
    equippedIds.some((id) => id === 'kiem-co-phong-nam-ngoc') ||
    equippedNames.some((n) => n.includes('kiếm'));
  const hasTuiGam =
    equippedIds.some((id) => id === 'tui-gam-theu-hoa-van') ||
    equippedNames.some((n) => n.includes('túi gấm'));
  const hasDaiThatLung =
    equippedIds.some((id) => id === 'dai-that-lung-lua-ngu-sac') ||
    equippedNames.some((n) => n.includes('dải thắt lưng') || n.includes('ngũ sắc'));
  const hasNgocBoi =
    equippedIds.some((id) => id === 'ngoc-boi-treo-that-lung' || id === 'the-bai-nga') ||
    equippedNames.some((n) => n.includes('ngọc bội') || n.includes('thẻ bài'));

  // NHÓM 3: GIÀY / HÀI / GUỐC (ĐẦY ĐỦ 7 MÓN & ALIASES)
  const hasHaiMuiVut =
    equippedIds.some((id) => id === 'hai-mui-vut-theu-phuong' || id === 'hai-mui-vut') ||
    equippedNames.some((n) => n.includes('mũi vút'));
  const hasGuocMoc =
    equippedIds.some((id) => id === 'guoc-moc-dan-gian' || id === 'guoc-moc') ||
    equippedNames.some((n) => n.includes('guốc mộc'));
  const hasUngDa =
    equippedIds.some((id) => id === 'ung-da-co-phong-nam') ||
    equippedNames.some((n) => n.includes('ủng da'));
  const hasHaiCungDinh =
    equippedIds.some((id) => id === 'hai-cung-dinh-dinh-cuom') ||
    equippedNames.some((n) => n.includes('đính cườm'));
  const hasGiayLua =
    equippedIds.some((id) => id === 'giay-lua-theu-that-no') ||
    equippedNames.some((n) => n.includes('thắt nơ') || n.includes('giày lụa'));
  const hasSneaker =
    equippedIds.some((id) => id === 'sneaker-neon-audition-remix') ||
    equippedNames.some((n) => n.includes('sneaker'));
  const hasGuocCaoGoc =
    equippedIds.some((id) => id === 'guoc-cao-goc-son-mai') ||
    equippedNames.some((n) => n.includes('sơn mài') || n.includes('guốc cao'));

  // Vertical bob offset based on frame
  const bobY = frame === 1 ? -1 : 0;

  // Kiểm tra xem có đang cầm vật phẩm trên tay phải không
  const hasHandheldItem = hasQuatLua || hasQuatGiay || hasKiem;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <svg
        viewBox="0 0 64 80"
        className="w-64 h-80 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
        style={{
          shapeRendering: 'crispEdges',
          imageRendering: 'pixelated',
        }}
      >
        {/* ================= PEDESTAL & SHADOW ================= */}
        <ellipse cx="32" cy="74" rx="20" ry="4" fill="rgba(0, 0, 0, 0.35)" />

        <g id="pedestal">
          {/* Đệm thảm ngọc mạ vàng 3D */}
          <rect x="14" y="70" width="36" height="3" fill="#b91c1c" />
          <rect x="13" y="71" width="38" height="1" fill="#f59e0b" />
          <rect x="10" y="73" width="44" height="2" fill="#334155" />
          <rect x="8" y="75" width="48" height="3" fill="#1e293b" />
          <rect x="6" y="78" width="52" height="2" fill="#0f172a" />
          {/* Họa tiết hoa sen mạ vàng */}
          <rect x="18" y="75" width="4" height="2" fill="#f59e0b" />
          <rect x="30" y="75" width="4" height="2" fill="#f59e0b" />
          <rect x="42" y="75" width="4" height="2" fill="#f59e0b" />
        </g>

        {/* ================= CHARACTER BODY & COSTUME ================= */}
        <g transform={`translate(0, ${bobY})`}>
          {/* ================= CHÂN & GIÀY / GUỐC (NHÓM 3) ================= */}
          {hasHaiMuiVut ? (
            /* Hài mũi vút thêu phượng hoàng */
            <g id="acc-hai-mui-vut">
              <rect x="24" y="67" width="6" height="4" fill="#b91c1c" />
              <rect x="23" y="66" width="2" height="2" fill="#f59e0b" />
              <circle cx="27" cy="68" r="0.8" fill="#ffffff" />
              <rect x="34" y="67" width="6" height="4" fill="#b91c1c" />
              <rect x="39" y="66" width="2" height="2" fill="#f59e0b" />
              <circle cx="37" cy="68" r="0.8" fill="#ffffff" />
            </g>
          ) : hasGuocMoc ? (
            /* Guốc mộc dân gian quai lụa đào */
            <g id="acc-guoc-moc">
              <rect x="25" y="68" width="5" height="3" fill="#78350f" />
              <rect x="25" y="67" width="5" height="1" fill="#f43f5e" />
              <rect x="34" y="68" width="5" height="3" fill="#78350f" />
              <rect x="34" y="67" width="5" height="1" fill="#f43f5e" />
            </g>
          ) : hasUngDa ? (
            /* Ủng da cổ phong đen bóng viền đồng */
            <g id="acc-ung-da">
              <rect x="24" y="64" width="6" height="7" fill="#090d16" />
              <rect x="24" y="69" width="7" height="2" fill="#1e293b" />
              <rect x="24" y="64" width="6" height="1" fill="#f59e0b" />
              <rect x="34" y="64" width="6" height="7" fill="#090d16" />
              <rect x="33" y="69" width="7" height="2" fill="#1e293b" />
              <rect x="34" y="64" width="6" height="1" fill="#f59e0b" />
            </g>
          ) : hasHaiCungDinh ? (
            /* Hài cung đình đính cườm */
            <g id="acc-hai-cung-dinh">
              <rect x="24" y="67" width="6" height="4" fill="#7c3aed" />
              <rect x="24" y="66" width="6" height="1" fill="#fef08a" />
              <circle cx="27" cy="68" r="0.8" fill="#ffffff" />
              <rect x="34" y="67" width="6" height="4" fill="#7c3aed" />
              <rect x="34" y="66" width="6" height="1" fill="#fef08a" />
              <circle cx="37" cy="68" r="0.8" fill="#ffffff" />
            </g>
          ) : hasGiayLua ? (
            /* Giày lụa thêu thắt nơ */
            <g id="acc-giay-lua">
              <rect x="25" y="67" width="5" height="4" fill="#ec4899" />
              <rect x="26" y="66" width="3" height="1" fill="#fbcfe8" />
              <rect x="34" y="67" width="5" height="4" fill="#ec4899" />
              <rect x="35" y="66" width="3" height="1" fill="#fbcfe8" />
            </g>
          ) : hasSneaker ? (
            /* Sneaker Neon Audition Remix */
            <g id="acc-sneaker-neon">
              <rect x="24" y="67" width="6" height="4" fill="#06b6d4" />
              <rect x="24" y="66" width="6" height="1" fill="#f43f5e" />
              <rect x="23" y="69" width="7" height="2" fill="#ffffff" />
              <rect x="34" y="67" width="6" height="4" fill="#06b6d4" />
              <rect x="34" y="66" width="6" height="1" fill="#f43f5e" />
              <rect x="34" y="69" width="7" height="2" fill="#ffffff" />
            </g>
          ) : hasGuocCaoGoc ? (
            /* Guốc cao gót sơn mài thếp vàng */
            <g id="acc-guoc-cao-goc">
              <rect x="25" y="67" width="5" height="2" fill="#991b1b" />
              <rect x="25" y="69" width="2" height="3" fill="#f59e0b" />
              <rect x="28" y="70" width="2" height="2" fill="#f59e0b" />
              <rect x="34" y="67" width="5" height="2" fill="#991b1b" />
              <rect x="34" y="69" width="2" height="3" fill="#f59e0b" />
              <rect x="37" y="70" width="2" height="2" fill="#f59e0b" />
            </g>
          ) : costume.id === 'ao-ma-doan' ? (
            /* Hia đen quan lại */
            <g id="mandarin-boots">
              <rect x="25" y="65" width="5" height="6" fill="#090d16" />
              <rect x="25" y="69" width="6" height="2" fill="#1e293b" />
              <rect x="34" y="65" width="5" height="6" fill="#090d16" />
              <rect x="33" y="69" width="6" height="2" fill="#1e293b" />
            </g>
          ) : (
            /* Giày vải / Hài mộc cổ truyền */
            <g id="default-shoes">
              <rect x="25" y="68" width="5" height="3" fill="#1b120c" />
              <rect x="25" y="67" width="5" height="1" fill="#f59e0b" />
              <rect x="34" y="68" width="5" height="3" fill="#1b120c" />
              <rect x="34" y="67" width="5" height="1" fill="#f59e0b" />
            </g>
          )}

          {/* ================= LỚP QUẦN / VÁY ĐỆM BÊN DƯỚI ================= */}
          {costume.id === 'ao-tu-than' ? (
            /* Áo Tứ Thân: Váy đụp đen chấm gót */
            <g id="tu-than-black-skirt">
              <rect x="21" y="47" width="22" height="21" fill="#0f172a" />
              <rect x="20" y="53" width="24" height="15" fill="#1e293b" />
              <line x1="25" y1="48" x2="25" y2="68" stroke="#334155" strokeWidth="1" />
              <line x1="39" y1="48" x2="39" y2="68" stroke="#334155" strokeWidth="1" />
            </g>
          ) : costume.id === 'ao-giao-linh' ? (
            /* Giao Lĩnh: Chân váy quây xếp nếp */
            <g id="giao-linh-thuong">
              <rect x="22" y="48" width="20" height="20" fill="#f4ede2" />
              <rect x="20" y="54" width="24" height="14" fill="#ebe1d1" />
              <line x1="24" y1="48" x2="24" y2="68" stroke="#d5c7b2" strokeWidth="1" />
              <line x1="28" y1="48" x2="28" y2="68" stroke="#d5c7b2" strokeWidth="1" />
              <line x1="32" y1="48" x2="32" y2="68" stroke="#d5c7b2" strokeWidth="1" />
              <line x1="36" y1="48" x2="36" y2="68" stroke="#d5c7b2" strokeWidth="1" />
              <line x1="40" y1="48" x2="40" y2="68" stroke="#d5c7b2" strokeWidth="1" />
              <rect x="20" y="66" width="24" height="2" fill={secondary} />
            </g>
          ) : (
            /* Quần lụa trắng hoặc đen */
            <g id="silk-pants">
              <rect x="24" y="58" width="7" height="10" fill="#ede8de" />
              <rect x="33" y="58" width="7" height="10" fill="#ede8de" />
              <rect x="25" y="64" width="5" height="4" fill="#dfd7c8" />
              <rect x="34" y="64" width="5" height="4" fill="#dfd7c8" />
            </g>
          )}

          {/* ================= CHI TIẾT TRANG PHỤC ================= */}

          {/* 1. ÁO MÃ ĐOÁN */}
          {costume.id === 'ao-ma-doan' && (
            <g id="costume-ao-ma-doan">
              <rect x="9" y="30" width="12" height="23" fill={secondary} />
              <rect x="11" y="32" width="9" height="21" fill={primary} />
              <rect x="9" y="49" width="12" height="4" fill={accent} />
              <rect x="43" y="30" width="12" height="23" fill={secondary} />
              <rect x="44" y="32" width="9" height="21" fill={primary} />
              <rect x="43" y="49" width="12" height="4" fill={accent} />
              <rect x="20" y="27" width="24" height="35" fill={primary} />
              <rect x="19" y="40" width="26" height="22" fill={primary} />
              <rect x="20" y="27" width="2" height="35" fill={secondary} />
              <rect x="42" y="27" width="2" height="35" fill={secondary} />
              <rect x="26" y="32" width="12" height="12" fill="#b91c1c" />
              <rect x="27" y="33" width="10" height="10" fill="#f59e0b" />
              <circle cx="32" cy="38" r="3" fill="#ffffff" />
              <circle cx="32" cy="38" r="1.5" fill="#b91c1c" />
              <rect x="27" y="23" width="10" height="4" fill={primary} />
              <rect x="28" y="23" width="8" height="1" fill="#f59e0b" />
              <circle cx="34" cy="27" r="1.2" fill="#ffd700" />
            </g>
          )}

          {/* 2. ÁO TỨ THÂN */}
          {costume.id === 'ao-tu-than' && (
            <g id="costume-ao-tu-than">
              <rect x="16" y="29" width="6" height="19" fill={secondary} />
              <rect x="17" y="30" width="4" height="18" fill={primary} />
              <rect x="42" y="29" width="6" height="19" fill={secondary} />
              <rect x="43" y="30" width="4" height="18" fill={primary} />
              <rect x="21" y="27" width="22" height="30" fill={primary} />
              <polygon points="27,24 37,24 35,35 29,35" fill="#e11d48" />
              <circle cx="32" cy="24" r="2" fill="#fed0ab" />
              <rect x="21" y="27" width="5" height="32" fill={secondary} />
              <rect x="38" y="27" width="5" height="32" fill={secondary} />
              <rect x="20" y="42" width="24" height="3" fill="#10b981" />
              <rect x="29" y="45" width="3" height="14" fill="#10b981" />
              <rect x="33" y="45" width="2" height="12" fill="#f43f5e" />
            </g>
          )}

          {/* 3. ÁO LẬP LĨNH */}
          {(costume.id === 'ao-lap-linh' || costume.id === 'ao-lap-linh-nam') && (
            <g id="costume-ao-lap-linh">
              <rect x="17" y="28" width="6" height="19" fill={secondary} />
              <rect x="18" y="29" width="4" height="18" fill={primary} />
              <rect x="41" y="28" width="6" height="19" fill={secondary} />
              <rect x="42" y="29" width="4" height="18" fill={primary} />
              <rect x="22" y="27" width="20" height="35" fill={primary} />
              <rect x="21" y="36" width="22" height="26" fill={primary} />
              <rect x="27" y="23" width="10" height="4" fill={primary} />
              <rect x="28" y="23" width="8" height="1" fill="#f59e0b" />
              <path d="M 32 27 L 37 32 L 37 42" stroke={secondary} strokeWidth="1" fill="none" />
              <circle cx="33" cy="25" r="1.2" fill="#ffd700" />
              <circle cx="35" cy="28" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="32" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="36" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="40" r="1.2" fill="#ffd700" />
              <rect x="21" y="61" width="22" height="2" fill={secondary} />
            </g>
          )}

          {/* 4. ÁO TRÀNG VẠT */}
          {costume.id === 'ao-trang-vat' && (
            <g id="costume-ao-trang-vat">
              <rect x="11" y="29" width="11" height="20" fill={secondary} />
              <rect x="12" y="30" width="9" height="19" fill={primary} />
              <rect x="42" y="29" width="11" height="20" fill={secondary} />
              <rect x="43" y="30" width="9" height="19" fill={primary} />
              <rect x="21" y="27" width="22" height="35" fill={primary} />
              <rect x="20" y="38" width="24" height="24" fill={primary} />
              <polygon points="25,23 38,36 34,38 23,25" fill={secondary} />
              <polygon points="39,23 26,38 30,40 41,25" fill="#f59e0b" />
              <polygon points="29,24 32,28 35,24" fill="#ffffff" />
              <rect x="21" y="44" width="22" height="3" fill="#1e293b" />
            </g>
          )}

          {/* 5. ÁO NHẬT BÌNH */}
          {costume.id === 'ao-nhat-binh' && (
            <g id="costume-ao-nhat-binh">
              <rect x="12" y="30" width="9" height="20" fill={secondary} />
              <rect x="13" y="31" width="7" height="19" fill={primary} />
              <rect x="12" y="44" width="9" height="1" fill="#c1272d" />
              <rect x="12" y="45" width="9" height="1" fill="#ffd700" />
              <rect x="12" y="46" width="9" height="1" fill="#29b6f6" />
              <rect x="12" y="47" width="9" height="1" fill="#ffffff" />
              <rect x="12" y="48" width="9" height="1" fill="#2e7d32" />
              <rect x="43" y="30" width="9" height="20" fill={secondary} />
              <rect x="44" y="31" width="7" height="19" fill={primary} />
              <rect x="43" y="44" width="9" height="1" fill="#c1272d" />
              <rect x="43" y="45" width="9" height="1" fill="#ffd700" />
              <rect x="43" y="46" width="9" height="1" fill="#29b6f6" />
              <rect x="43" y="47" width="9" height="1" fill="#ffffff" />
              <rect x="43" y="48" width="9" height="1" fill="#2e7d32" />
              <rect x="21" y="27" width="22" height="34" fill={primary} />
              <rect x="20" y="36" width="24" height="26" fill={primary} />
              <rect x="25" y="23" width="14" height="13" fill="#d4af37" />
              <rect x="26" y="24" width="12" height="11" fill="#b71c1c" />
              <rect x="28" y="26" width="8" height="7" fill="#ffd54f" />
              <circle cx="32" cy="29" r="1.5" fill="#c1272d" />
              <g id="nhat-binh-ribbons">
                <rect x="30" y="36" width="1" height="24" fill="#c1272d" />
                <rect x="31" y="36" width="1" height="24" fill="#ffd700" />
                <rect x="32" y="36" width="1" height="25" fill="#29b6f6" />
                <rect x="33" y="36" width="1" height="24" fill="#ffffff" />
                <rect x="34" y="36" width="1" height="24" fill="#2e7d32" />
                <rect x="30" y="36" width="5" height="3" fill="#a7ffeb" />
                <rect x="31" y="37" width="3" height="1" fill="#00bfa5" />
              </g>
              <rect x="20" y="58" width="24" height="4" fill="#1565c0" />
              <rect x="20" y="58" width="24" height="1" fill="#ffffff" />
              <rect x="20" y="60" width="24" height="1" fill="#ffd700" />
            </g>
          )}

          {/* 6. ÁO TẤC */}
          {(costume.id === 'ao-tac' || costume.id === 'ao-tac-nam' || costume.id === 'ao-tac-nu') && (
            <g id="costume-ao-tac">
              <rect x="10" y="30" width="11" height="22" fill={secondary} />
              <rect x="12" y="32" width="8" height="20" fill={primary} />
              <rect x="10" y="48" width="11" height="4" fill={accent} />
              <rect x="43" y="30" width="11" height="22" fill={secondary} />
              <rect x="44" y="32" width="8" height="20" fill={primary} />
              <rect x="43" y="48" width="11" height="4" fill={accent} />
              <rect x="21" y="27" width="22" height="34" fill={primary} />
              <rect x="20" y="34" width="24" height="27" fill={primary} />
              <rect x="19" y="44" width="26" height="18" fill={primary} />
              <line x1="32" y1="27" x2="32" y2="61" stroke={secondary} strokeWidth="1" />
              <circle cx="34" cy="27" r="1" fill="#ffd700" />
              <circle cx="35" cy="30" r="1" fill="#ffd700" />
              <rect x="19" y="60" width="26" height="2" fill={secondary} />
              <rect x="21" y="61" width="22" height="1" fill={accent} />
              <rect x="27" y="23" width="10" height="4" fill={primary} />
              <rect x="28" y="23" width="8" height="1" fill="#ffd700" />
            </g>
          )}

          {/* 7. ÁO GIAO LĨNH / TRỰC LĨNH */}
          {(costume.id === 'ao-giao-linh' || costume.id === 'ao-giao-linh-nam' || costume.id === 'ao-truc-linh-nam') && (
            <g id="costume-ao-giao-linh">
              <rect x="12" y="29" width="10" height="18" fill={secondary} />
              <rect x="13" y="30" width="8" height="16" fill={primary} />
              <rect x="42" y="29" width="10" height="18" fill={secondary} />
              <rect x="43" y="30" width="8" height="16" fill={primary} />
              <rect x="22" y="27" width="20" height="23" fill={primary} />
              <polygon points="26,23 37,35 34,37 24,25" fill={secondary} />
              <polygon points="38,23 27,37 30,39 40,25" fill="#c1272d" />
              <polygon points="30,24 32,27 34,24" fill="#ffffff" />
              <rect x="21" y="44" width="22" height="4" fill="#c1272d" />
              <rect x="30" y="48" width="2" height="16" fill="#c1272d" />
            </g>
          )}

          {/* 8. ÁO NGŨ THÂN TAY CHẼN / ÁO DÀI / MÃNG PHỤC / VIÊN LĨNH */}
          {(costume.id === 'ao-ngu-than' ||
            costume.id === 'ao-ngu-than-nam' ||
            costume.id === 'ao-ngu-than-nu' ||
            costume.id === 'ao-dai-nu' ||
            costume.id === 'ao-dai-nam' ||
            costume.id === 'mang-phuc-nu' ||
            costume.id === 'mang-phuc-nam' ||
            costume.id === 'ao-vien-linh-nu') && (
            <g id="costume-ao-ngu-than">
              <rect x="18" y="28" width="5" height="18" fill={secondary} />
              <rect x="19" y="29" width="3" height="17" fill={primary} />
              <rect x="41" y="28" width="5" height="18" fill={secondary} />
              <rect x="42" y="29" width="3" height="17" fill={primary} />
              <rect x="23" y="27" width="18" height="34" fill={primary} />
              <rect x="22" y="36" width="20" height="25" fill={primary} />
              {/* Thêu hoa văn rồng/mây nếu là Mãng Phục */}
              {(costume.id.includes('mang-phuc') || costume.id.includes('vien-linh')) && (
                <g id="dragon-embroidery">
                  <circle cx="32" cy="38" r="4.5" fill="#ffd700" />
                  <circle cx="32" cy="38" r="2.5" fill={secondary} />
                  <rect x="30" y="35" width="4" height="6" fill="#ffd700" />
                </g>
              )}
              <rect x="27" y="23" width="10" height="4" fill={primary} />
              <circle cx="33" cy="25" r="1.2" fill="#ffd700" />
              <circle cx="35" cy="28" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="32" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="36" r="1.2" fill="#ffd700" />
              <circle cx="37" cy="41" r="1.2" fill="#ffd700" />
            </g>
          )}

          {/* ================= BÀN TAY CƠ BẢN (NẾU KHÔNG CẦM VẬT PHẨM RIÊNG) ================= */}
          {!hasHandheldItem && (
            <>
              {pose === 'idle' && (
                <>
                  <rect x="18" y="46" width="4" height="4" fill={skin} />
                  <rect x="42" y="46" width="4" height="4" fill={skin} />
                </>
              )}
              {pose === 'salute' && (
                <>
                  <rect x="29" y="38" width="6" height="5" fill={skin} />
                  <line x1="32" y1="38" x2="32" y2="43" stroke={skinShadow} strokeWidth="1" />
                </>
              )}
              {pose === 'fan' && (
                <>
                  <rect x="18" y="46" width="4" height="4" fill={skin} />
                  <rect x="41" y="43" width="4" height="4" fill={skin} />
                  <polygon points="43,44 54,34 57,41 45,46" fill="#f59e0b" />
                  <polygon points="44,43 53,35 55,40 46,45" fill="#b91c1c" />
                </>
              )}
            </>
          )}
          {/* Tay trái khi cầm vật phẩm bên tay phải */}
          {hasHandheldItem && (
            <rect x="18" y="46" width="4" height="4" fill={skin} />
          )}

          {/* ================= ĐẦU, MẶT & TÓC ================= */}
          <rect x="29" y="21" width="6" height="4" fill={skin} />
          <rect x="26" y="12" width="12" height="10" fill={skin} />
          <rect x="27" y="21" width="10" height="2" fill={skin} />

          {/* Mắt Pixel */}
          {blink ? (
            <>
              <rect x="28" y="16" width="3" height="1" fill={eyesColor} />
              <rect x="33" y="16" width="3" height="1" fill={eyesColor} />
            </>
          ) : (
            <>
              <rect x="28" y="15" width="3" height="2" fill={eyesColor} />
              <rect x="29" y="15" width="1" height="1" fill="#ffffff" />
              <rect x="33" y="15" width="3" height="2" fill={eyesColor} />
              <rect x="34" y="15" width="1" height="1" fill="#ffffff" />
            </>
          )}

          {/* Nét mặt theo Giới tính Nam vs Nữ */}
          {gender === 'female' ? (
            <>
              <rect x="28" y="13" width="3" height="1" fill="#422e1b" />
              <rect x="33" y="13" width="3" height="1" fill="#422e1b" />
              <rect x="27" y="17" width="2" height="1" fill="#f472b6" opacity="0.9" />
              <rect x="35" y="17" width="2" height="1" fill="#f472b6" opacity="0.9" />
              <rect x="31" y="19" width="2" height="1" fill="#db2777" />
              <circle cx="25.5" cy="18" r="0.8" fill="#ffffff" />
              <circle cx="38.5" cy="18" r="0.8" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="27" y="13" width="4" height="1" fill="#1e1b4b" />
              <rect x="33" y="13" width="4" height="1" fill="#1e1b4b" />
              <rect x="31" y="19" width="2" height="1" fill="#c25953" />
            </>
          )}

          {/* Tóc cơ bản */}
          <rect x="25" y="12" width="2" height="6" fill={hairColor} />
          <rect x="37" y="12" width="2" height="6" fill={hairColor} />

          {/* ================= MŨ NÓN & PHỤ KIỆN ĐẦU (NHÓM 1) ================= */}
          {hasMan ? (
            /* Mấn hoàng cung / Khăn vành dây */
            <g id="acc-man">
              <rect x="23" y="6" width="18" height="6" fill="#f59e0b" />
              <rect x="24" y="4" width="16" height="4" fill="#fbbf24" />
              <rect x="25" y="2" width="14" height="3" fill="#ea580c" />
              <circle cx="32" cy="5" r="1.5" fill="#b91c1c" />
              <circle cx="32" cy="5" r="0.8" fill="#ffffff" />
            </g>
          ) : hasKhanXep ? (
            /* Khăn xếp nam (Khăn đóng 7 nếp) */
            <g id="acc-khan-xep">
              <rect x="24" y="6" width="16" height="7" fill="#0f172a" />
              <rect x="25" y="4" width="14" height="4" fill="#1e293b" />
              <line x1="25" y1="8" x2="39" y2="8" stroke="#475569" strokeWidth="1" />
              <line x1="26" y1="10" x2="38" y2="10" stroke="#475569" strokeWidth="1" />
            </g>
          ) : hasNonBaTam ? (
            /* Nón Ba Tầm (Nón quai thao to tròn) */
            <g id="acc-non-ba-tam">
              <rect x="15" y="4" width="34" height="4" fill="#fde047" />
              <rect x="13" y="6" width="38" height="2" fill="#ca8a04" />
              <rect x="18" y="2" width="28" height="2" fill="#fef08a" />
              <line x1="22" y1="8" x2="20" y2="38" stroke="#0f172a" strokeWidth="1.2" />
              <line x1="42" y1="8" x2="44" y2="38" stroke="#0f172a" strokeWidth="1.2" />
              <rect x="19" y="38" width="3" height="4" fill="#b91c1c" />
              <rect x="43" y="38" width="3" height="4" fill="#b91c1c" />
            </g>
          ) : hasNonLa ? (
            /* Nón lá cổ hút thanh thoát */
            <g id="acc-non-la">
              <polygon points="32,0 16,11 48,11" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
              <line x1="32" y1="0" x2="32" y2="11" stroke="#eab308" strokeWidth="0.8" />
              <line x1="25" y1="11" x2="32" y2="23" stroke="#ec4899" strokeWidth="1" />
              <line x1="39" y1="11" x2="32" y2="23" stroke="#ec4899" strokeWidth="1" />
            </g>
          ) : hasMuPhuong ? (
            /* Mũ Phượng Hoàng Cung */
            <g id="acc-mu-phuong">
              <rect x="22" y="4" width="20" height="8" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
              <circle cx="32" cy="4" r="2.5" fill="#e11d48" />
              <line x1="20" y1="7" x2="16" y2="13" stroke="#fef08a" strokeWidth="1.2" />
              <line x1="44" y1="7" x2="48" y2="13" stroke="#fef08a" strokeWidth="1.2" />
              <circle cx="16" cy="13" r="1" fill="#38bdf8" />
              <circle cx="48" cy="13" r="1" fill="#38bdf8" />
            </g>
          ) : hasNonNgua ? (
            /* Nón Ngựa Bình Định */
            <g id="acc-non-ngua">
              <polygon points="32,1 18,10 46,10" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <rect x="30" y="0" width="4" height="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
              <line x1="32" y1="0" x2="32" y2="3" stroke="#ef4444" strokeWidth="1" />
            </g>
          ) : hasMuOSa ? (
            /* Mũ Ô Sa quan lại hai cánh chuồn */
            <g id="acc-mu-o-sa">
              <rect x="25" y="4" width="14" height="7" fill="#090d16" />
              <rect x="27" y="2" width="10" height="3" fill="#1e293b" />
              <rect x="11" y="6" width="14" height="2.5" fill="#090d16" stroke="#475569" strokeWidth="0.5" />
              <rect x="39" y="6" width="14" height="2.5" fill="#090d16" stroke="#475569" strokeWidth="0.5" />
              <circle cx="32" cy="6" r="1.5" fill="#f59e0b" />
            </g>
          ) : hasMuPhocDau ? (
            /* Mũ Phốc Đầu */
            <g id="acc-mu-phoc-dau">
              <rect x="24" y="5" width="16" height="7" fill="#0f172a" />
              <rect x="28" y="1" width="8" height="5" fill="#1e293b" />
              <circle cx="32" cy="3" r="1.5" fill="#f59e0b" />
            </g>
          ) : hasMuKhoiGiap ? (
            /* Mũ Khôi Giáp Cổ Phong */
            <g id="acc-mu-khoi-giap">
              <polygon points="32,1 23,7 41,7" fill="#b45309" stroke="#78350f" strokeWidth="1" />
              <rect x="24" y="7" width="16" height="5" fill="#d97706" />
              <line x1="32" y1="0" x2="32" y2="4" stroke="#dc2626" strokeWidth="1.5" />
            </g>
          ) : (
            /* Mũ mặc định theo trang phục */
            <>
              {costume.id === 'ao-ma-doan' ? (
                <g id="mandarin-hat">
                  <rect x="25" y="5" width="14" height="7" fill="#090d16" />
                  <rect x="27" y="3" width="10" height="3" fill="#1e293b" />
                  <rect x="13" y="6" width="12" height="3" fill="#090d16" />
                  <rect x="39" y="6" width="12" height="3" fill="#090d16" />
                  <circle cx="32" cy="7" r="1.5" fill="#f59e0b" />
                </g>
              ) : costume.id === 'ao-tu-than' ? (
                <g id="khan-mo-qua">
                  <polygon points="32,7 23,4 41,4" fill="#0f172a" />
                  <rect x="24" y="6" width="16" height="4" fill="#1e293b" />
                </g>
              ) : costume.id === 'ao-nhat-binh' ? (
                <g id="nhat-binh-crown">
                  <rect x="22" y="6" width="20" height="6" fill="#f59e0b" />
                  <rect x="23" y="4" width="18" height="3" fill="#fef08a" />
                  <circle cx="32" cy="4" r="2" fill="#b91c1c" />
                </g>
              ) : (
                <g id="default-turban">
                  <rect x="24" y="7" width="16" height="5" fill="#1e293b" />
                  <circle cx="32" cy="6" r="1.2" fill="#f59e0b" />
                </g>
              )}
            </>
          )}

          {/* =========================================================================
              CRITICAL REQUIREMENT 3: TẦNG VẼ TRÊN CÙNG (TOPMOST LAYER / FOREGROUND)
              Đảm bảo khi chọn phụ kiện cầm tay hay trang sức Nhóm 2, hình ảnh món đồ
              được vẽ ĐÚNG TẦNG TRÊN CÙNG (nằm phía trước tay/áo nhân vật), không bị che!
             ========================================================================= */}
          <g id="group2-topmost-accessories">
            {/* 1. KIỀNG BẠC CHẠM TRỔ */}
            {hasKiengBac && (
              <g id="top-acc-kieng-bac">
                <path d="M 27 25 C 27 32, 37 32, 37 25" stroke="#f8fafc" strokeWidth="2.2" fill="none" />
                <path d="M 27 25 C 27 31, 37 31, 37 25" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <circle cx="32" cy="30" r="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
                <circle cx="32" cy="30" r="0.8" fill="#38bdf8" />
              </g>
            )}

            {/* 2. CHUỖI HẠT TRẦM HƯƠNG */}
            {hasChuoiHat && (
              <g id="top-acc-chuoi-hat-tram">
                <ellipse cx="32" cy="30" rx="5.5" ry="6.5" stroke="#451a03" strokeWidth="1.8" strokeDasharray="1.5,1.2" fill="none" />
                <circle cx="32" cy="36" r="1.5" fill="#78350f" stroke="#d97706" strokeWidth="0.6" />
                <line x1="32" y1="37" x2="32" y2="41" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="32" cy="41" r="0.8" fill="#f59e0b" />
              </g>
            )}

            {/* 3. QUAI THAO KÉP THẮT LỤA */}
            {hasQuaiThaoKep && (
              <g id="top-acc-quai-thao-kep">
                <line x1="28" y1="18" x2="27" y2="48" stroke="#1e293b" strokeWidth="1.4" />
                <line x1="36" y1="18" x2="37" y2="48" stroke="#1e293b" strokeWidth="1.4" />
                <rect x="25.5" y="47" width="3" height="4" fill="#f43f5e" />
                <rect x="35.5" y="47" width="3" height="4" fill="#f43f5e" />
                <circle cx="27" cy="47" r="1" fill="#fde047" />
                <circle cx="37" cy="47" r="1" fill="#fde047" />
              </g>
            )}

            {/* 4. DẢI THẮT LƯNG LỤA NGŨ SẮC */}
            {hasDaiThatLung && (
              <g id="top-acc-dai-that-lung-ngu-sac">
                <rect x="22" y="42" width="20" height="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
                <circle cx="32" cy="43.5" r="2" fill="#b91c1c" />
                <circle cx="32" cy="43.5" r="0.8" fill="#fef08a" />
                <rect x="29" y="45" width="1.2" height="17" fill="#ef4444" />
                <rect x="30.5" y="45" width="1.2" height="18" fill="#eab308" />
                <rect x="32" y="45" width="1.2" height="19" fill="#06b6d4" />
                <rect x="33.5" y="45" width="1.2" height="18" fill="#f8fafc" />
                <rect x="35" y="45" width="1.2" height="17" fill="#10b981" />
              </g>
            )}

            {/* 5. TÚI GẤM THÊU HOA VĂN ĐẠI VIỆT */}
            {hasTuiGam && (
              <g id="top-acc-tui-gam">
                <line x1="25.5" y1="41" x2="25.5" y2="43" stroke="#b91c1c" strokeWidth="1" />
                <rect x="23" y="43" width="5.5" height="6.5" rx="1.5" fill="#991b1b" stroke="#f59e0b" strokeWidth="0.6" />
                <circle cx="25.75" cy="46" r="1.5" fill="#f59e0b" />
                <rect x="24.5" y="49.5" width="2.5" height="2" fill="#d97706" />
                <line x1="25.75" y1="51.5" x2="25.75" y2="55" stroke="#fef08a" strokeWidth="0.8" />
              </g>
            )}

            {/* 6. NGỌC BỘI TREO THẮT LƯNG / THẺ BÀI NGÀ */}
            {hasNgocBoi && (
              <g id="top-acc-ngoc-boi">
                <line x1="38" y1="41" x2="38" y2="44" stroke="#dc2626" strokeWidth="1" />
                <rect x="36" y="44" width="4.5" height="6.5" rx="1" fill="#10b981" stroke="#064e3b" strokeWidth="0.6" />
                <circle cx="38.25" cy="47.25" r="1.2" fill="#34d399" />
                <circle cx="38.25" cy="51.5" r="0.8" fill="#f59e0b" />
                <line x1="38.25" y1="52" x2="38.25" y2="56" stroke="#fbbf24" strokeWidth="1" />
              </g>
            )}

            {/* 7. TRÂM CÀI TÓC ĐÍNH NGỌC */}
            {hasTramCai && (
              <g id="top-acc-tram-cai">
                <line x1="36" y1="4" x2="45" y2="11" stroke="#f59e0b" strokeWidth="1.8" />
                <rect x="43" y="10" width="3" height="3" fill="#10b981" />
                <rect x="44" y="11" width="1" height="1" fill="#ecfdf5" />
                <circle cx="44.5" cy="11.5" r="2.2" stroke="#fbbf24" strokeWidth="0.8" fill="none" />
                <line x1="45" y1="13" x2="45" y2="17" stroke="#fbbf24" strokeWidth="0.8" />
                <circle cx="45" cy="17" r="1" fill="#e11d48" />
              </g>
            )}

            {/* 8. QUẠT LỤA TRÒN CUNG ĐÌNH (TRÊN TAY PHẢI, NẰM TRÊN CÙNG) */}
            {hasQuatLua && (
              <g id="top-acc-quat-lua-tron">
                <line x1="44" y1="47" x2="51" y2="38" stroke="#78350f" strokeWidth="1.5" />
                <circle cx="51" cy="37" r="7" fill="#fffbeb" stroke="#b91c1c" strokeWidth="1" />
                <circle cx="51" cy="37" r="5.5" fill="#fef2f2" />
                <circle cx="51" cy="37" r="2" fill="#ec4899" />
                <circle cx="50" cy="38" r="1.2" fill="#10b981" />
                {/* Bàn tay giữ cán quạt */}
                <rect x="42" y="44" width="4" height="4" fill={skin} />
                <rect x="44" y="45" width="2" height="2" fill={skinShadow} />
                {/* Dải tua rua đỏ thướt tha */}
                <line x1="43" y1="48" x2="42" y2="54" stroke="#dc2626" strokeWidth="1" />
                <circle cx="42" cy="54" r="1" fill="#f59e0b" />
              </g>
            )}

            {/* 9. QUẠT GIẤY THƯ PHÁP AUDITION (TRÊN TAY PHẢI, NẰM TRÊN CÙNG) */}
            {hasQuatGiay && (
              <g id="top-acc-quat-giay-thu-phap">
                <polygon points="43,45 53,33 58,40 46,48" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                <line x1="44" y1="46" x2="53" y2="34" stroke="#b45309" strokeWidth="0.6" />
                <line x1="45" y1="46" x2="56" y2="36" stroke="#b45309" strokeWidth="0.6" />
                <line x1="46" y1="47" x2="57" y2="39" stroke="#b45309" strokeWidth="0.6" />
                {/* Nét thư pháp chữ Nôm */}
                <line x1="48" y1="41" x2="52" y2="38" stroke="#18181b" strokeWidth="1.2" />
                <line x1="50" y1="43" x2="54" y2="40" stroke="#18181b" strokeWidth="1" />
                {/* Bàn tay cầm quạt */}
                <rect x="42" y="45" width="4" height="4" fill={skin} />
                <line x1="43" y1="48" x2="41" y2="53" stroke="#b91c1c" strokeWidth="1" />
              </g>
            )}

            {/* 10. KIẾM CỔ PHONG NẠM NGỌC (TRÊN TAY PHẢI, NẰM TRÊN CÙNG) */}
            {hasKiem && (
              <g id="top-acc-kiem-co-phong">
                {/* Vỏ bao kiếm chạm bạc */}
                <line x1="44" y1="30" x2="52" y2="56" stroke="#1e293b" strokeWidth="2.5" />
                <line x1="44" y1="30" x2="52" y2="56" stroke="#f59e0b" strokeWidth="0.8" />
                {/* Chuôi kiếm & đốc nạm ngọc */}
                <line x1="42" y1="24" x2="44" y2="30" stroke="#92400e" strokeWidth="2.5" />
                <rect x="41" y="29" width="5" height="1.8" fill="#f59e0b" />
                <circle cx="41.5" cy="23" r="1.5" fill="#10b981" stroke="#f59e0b" strokeWidth="0.6" />
                {/* Bàn tay nắm đốc kiếm */}
                <rect x="42" y="27" width="4" height="4" fill={skin} />
                <line x1="43" y1="27" x2="43" y2="31" stroke={skinShadow} strokeWidth="0.6" />
                {/* Dây kiếm đỏ & ngọc bội */}
                <line x1="41.5" y1="23" x2="39" y2="30" stroke="#ef4444" strokeWidth="1" />
                <circle cx="39" cy="30" r="1" fill="#fbbf24" />
              </g>
            )}
          </g>

        </g>
      </svg>
    </div>
  );
};
