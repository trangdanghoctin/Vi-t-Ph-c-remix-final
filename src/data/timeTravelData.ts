/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene } from '../types.ts';
import { SCENES_DATA, BG_IMAGE_1, BG_IMAGE_2, BG_IMAGE_3, BG_IMAGE_4, BG_IMAGE_5, BG_IMAGE_6 } from './scenes.ts';

export interface TimeTravelNode {
  id: string;
  order: number;
  name: string;
  title: string;
  subtitle: string;
  region: 'Bắc Bộ' | 'Thăng Long' | 'Cố Đô Huế' | 'Phố Hội' | 'Bồng Lai';
  era: string;
  landmark: string;
  sceneId: string;
  
  // Dynamic Background configuration variable
  // Sẵn sàng thay bằng URL link ảnh background cá nhân sau này
  bgUrl: string;

  // Tọa độ hiển thị trên Bản Đồ Pixel Đại Việt
  mapCoords: { xPercent: number; yPercent: number };

  // Con dấu di sản đại diện độc bản
  stamp: {
    id: string;
    title: string;
    symbol: string;
    sealText: string;
    description: string;
    color: string;
    accentColor: string;
    stampType: 'dan-gian' | 'hoang-gia' | 'cung-dinh' | 'pho-hoi' | 'tien-gioi';
  };

  // Kiến thức lịch sử & Nét đẹp Việt Phục đặc trưng
  knowledge: {
    title: string;
    summary: string;
    historyLore: string;
    costumeHighlight: string;
    costumeTags: string[];
    recommendedCostumeId: string;
    quote: string;
  };
}

export interface PassportStampRecord {
  nodeId: string;
  stampId: string;
  unlockedAt: string; // ISO String
  formattedDate: string; // "09/10/2026 17:35"
  stampNumber: number;
}

export interface PassportData {
  passportId: string;
  holderName: string;
  title: string;
  issuedDate: string;
  unlockedStamps: Record<string, PassportStampRecord>;
  hasCompletedJourney: boolean;
  completedDate?: string;
}

/**
 * =========================================================================
 * DANH SÁCH 5 ĐỊA ĐIỂM / GIAI ĐOẠN LỊCH SỬ HÀNH TRÌNH DU HÀNH VIỆT PHỤC
 * Thiết lập sẵn cấu trúc biến bgUrl để dễ dàng thay bằng link ảnh background cá nhân
 * =========================================================================
 */
export const TRAVEL_NODES: TimeTravelNode[] = [
  {
    id: 'bac-bo',
    order: 1,
    name: 'Dân Gian Bắc Bộ',
    title: '1. Dân Gian Bắc Bộ (Đầm Sen & Làng Cổ)',
    subtitle: 'Nét đẹp hồn hậu • Nón Ba Tầm • Áo Tứ Thân • Hương Sen Đồng Nội',
    region: 'Bắc Bộ',
    era: 'Văn Hóa Đồng Bằng Sông Hồng • Thời Lê - Nguyễn',
    landmark: 'Làng Cổ Đường Lâm & Đầm Sen Bách Diệp',
    sceneId: 'dam-sen',
    bgUrl: BG_IMAGE_4, // Biến ảnh background tùy chỉnh
    mapCoords: { xPercent: 38, yPercent: 18 },
    stamp: {
      id: 'stamp-khan-man-non-ba-tam',
      title: 'Dấu Khăn Mấn & Nón Ba Tầm',
      symbol: '👒',
      sealText: 'BẮC BỘ DÂN GIAN',
      description: 'Con dấu ghi nhận nét đẹp thanh tao, đoan trang của người phụ nữ Kinh Bắc bên tà áo tứ thân.',
      color: '#B45309',
      accentColor: '#FDE68A',
      stampType: 'dan-gian',
    },
    knowledge: {
      title: 'Nét Đẹp Hồn Hậu Dân Gian Bắc Bộ',
      summary: 'Áo Tứ Thân kết hợp Nón Ba Tầm quai thao dệt nên cốt cách dịu dàng, tần tảo nhưng vô cùng duyên dáng.',
      historyLore:
        'Vạt áo tứ thân buông thả mềm mại, thắt lưng bao đào hồng phấn thắt mối trước bụng tượng trưng cho tình nghĩa gia đình và ngũ thường. Chiếc nón ba tầm rợp bóng câu quan họ, làm say đắm lòng người qua bao thế hệ.',
      costumeHighlight: 'Áo Tứ Thân Vải Tơ Tằm Cổ Truyền & Khăn Mấn',
      costumeTags: ['Dân gian', 'Đoan trang', 'Lao động', 'Quan họ'],
      recommendedCostumeId: 'ao-tu-than',
      quote: '“Người ngoan nón dấu hoa quỳ / Người đẹp khăn mấn tóc buông đuôi gà.”',
    },
  },
  {
    id: 'thang-long',
    order: 2,
    name: 'Hoàng Thành Thăng Long',
    title: '2. Hoàng Thành Thăng Long (Điện Kính Thiên)',
    subtitle: 'Kinh Đô Ngàn Năm • Long Bào Rồng Thiêng • Áo Giao Lĩnh Tôn Nghiêm',
    region: 'Thăng Long',
    era: 'Kinh Đô Đế Vương • Triều Lý - Trần - Lê Sơ (TK XI - XVIII)',
    landmark: 'Điện Kính Thiên, Đoan Môn & Thành Cổ Thăng Long',
    sceneId: 'cuu-long',
    bgUrl: BG_IMAGE_3, // Biến ảnh background tùy chỉnh (Cửu Long Cuốn Thư)
    mapCoords: { xPercent: 49, yPercent: 23 },
    stamp: {
      id: 'stamp-an-rong-thang-long',
      title: 'Dấu Long Ấn Hoàng Triều',
      symbol: '🐲',
      sealText: 'THĂNG LONG ĐẾ ĐÔ',
      description: 'Con dấu ngọc tỉ chạm khắc ấn rồng thiêng Đại Việt, biểu trưng cho uy quyền và hào khí ngàn năm.',
      color: '#B91C1C',
      accentColor: '#FEF08A',
      stampType: 'hoang-gia',
    },
    knowledge: {
      title: 'Hào Khí Thăng Long Đế Đô Ngàn Năm',
      summary: 'Thời kỳ hưng thịnh của lễ chế Đại Việt với áo Giao Lĩnh cổ chéo rộng tay và Mãng Phục rồng vàng uy nghi.',
      historyLore:
        'Thời Lý - Trần - Lê, trang phục triều nghi tôn trọng quy thức đối xứng, cổ áo bắt chéo chữ Y (Giao Lĩnh) thể hiện tinh thần tự chủ văn hiến. Họa tiết rồng mây cuộn sóng, chim phượng ngậm hoa mẫu đơn được thêu tinh xảo bằng chỉ ngũ sắc dát vàng.',
      costumeHighlight: 'Áo Giao Lĩnh & Mãng Phục Triều Nghi',
      costumeTags: ['Vương giả', 'Triều phục', 'Uy nghiêm', 'Thăng Long'],
      recommendedCostumeId: 'ao-giao-linh',
      quote: '“Ngàn năm văn hiến chốn Thăng Long / Rồng cuộn hổ ngồi đất đế vương.”',
    },
  },
  {
    id: 'co-do-hue',
    order: 3,
    name: 'Cố Đô Huế',
    title: '3. Cố Đô Huế (Kinh Thành & Đại Nội)',
    subtitle: 'Hoàng Triều Nguyễn • Nhật Bình Ngũ Sắc • Áo Tấc Uy Nghi • Sông Hương',
    region: 'Cố Đô Huế',
    era: 'Triều Nguyễn Cung Đình (1802 - 1945)',
    landmark: 'Kinh Thành Huế, Ngọ Môn & Điện Thái Hòa',
    sceneId: 'cung-dinh',
    bgUrl: BG_IMAGE_6, // Biến ảnh background tùy chỉnh (Sảnh Cung Đình)
    mapCoords: { xPercent: 57, yPercent: 44 },
    stamp: {
      id: 'stamp-nhat-binh-cung-dinh',
      title: 'Dấu Nhật Bình & Phượng Hoàng',
      symbol: '👑',
      sealText: 'CỐ ĐÔ HUẾ TRIỀU NGUYỄN',
      description: 'Con dấu hoa văn Nhật Bình cung đình thêu phụng hoàng kim chỉ và hoa văn ngũ sắc chính thống.',
      color: '#7C2D12',
      accentColor: '#FDE047',
      stampType: 'cung-dinh',
    },
    knowledge: {
      title: 'Đỉnh Cao Điển Chế Lễ Phục Hoàng Cung Triều Nguyễn',
      summary: 'Áo Nhật Bình rực rỡ dải ngũ hành kết hợp Áo Tấc trang trọng trong các nghi lễ long trọng của triều đình.',
      historyLore:
        'Áo Nhật Bình là thường phục của Hoàng hậu, Công chúa và mệnh phụ triều Nguyễn. Đặc trưng với cổ áo hình chữ nhật viền ngũ hành (Thanh, Xích, Bạch, Hắc, Hoàng), thêu loan phượng và hoa cúc vàng. Đi cùng là Áo Tấc tay thụng thụng lễ nghi đạo mạo.',
      costumeHighlight: 'Áo Nhật Bình Cung Đình & Áo Tấc Hoàng Gia',
      costumeTags: ['Hoàng cung', 'Nhật Bình', 'Áo Tấc', 'Điển chế'],
      recommendedCostumeId: 'ao-nhat-binh',
      quote: '“Dạ thưa xứ Huế mộng mơ / Áo em Nhật Bình thêu dệt vần thơ hoàng thành.”',
    },
  },
  {
    id: 'pho-co-hoi-an',
    order: 4,
    name: 'Phố Cổ Hội An',
    title: '4. Phố Cổ Hội An (Thương Cảng Sông Hoài)',
    subtitle: 'Đèn Lồng Rực Rỡ • Áo Ngũ Thân Tay Chẽn • Quạt Lụa • Phố Hoài Mộng',
    region: 'Phố Hội',
    era: 'Đô Thị Cổ & Thương Cảng Faifo (TK XVI - XIX)',
    landmark: 'Chùa Cầu Cổ Kính, Bến Sông Hoài & Dãy Phố Hoa Đăng',
    sceneId: 'hoi-an',
    bgUrl: BG_IMAGE_5, // Biến ảnh background tùy chỉnh (Phố Cổ Hội An)
    mapCoords: { xPercent: 63, yPercent: 53 },
    stamp: {
      id: 'stamp-den-long-pho-hoi',
      title: 'Dấu Đèn Lồng Sông Hoài',
      symbol: '🏮',
      sealText: 'HỘI AN HOA ĐĂNG',
      description: 'Con dấu đèn lồng lục giác soi bóng dòng sông Hoài cùng tà áo ngũ thân thanh lịch của thương nhân nho nhã.',
      color: '#C2410C',
      accentColor: '#FED7AA',
      stampType: 'pho-hoi',
    },
    knowledge: {
      title: 'Giao Thoa Văn Hóa Bách Gia Phố Hội',
      summary: 'Áo Dài Ngũ Thân tay chẽn phối cùng quạt lụa thư pháp, biểu tượng của sự hào hoa, văn nhã và hội nhập thương mại.',
      historyLore:
        'Hội An thế kỷ XVII là thương cảng sầm uất bậc nhất Đông Nam Á. Tà áo Ngũ thân tay chẽn ra đời từ cải cách trang phục của Chúa Nguyễn Phúc Khoát, trở thành tiền thân của Áo Dài Việt Nam hiện đại, kết hợp chất liệu tơ lụa Bảo Lộc, Vạn Phúc danh tiếng.',
      costumeHighlight: 'Áo Ngũ Thân Tay Chẽn & Quạt Giấy Thư Pháp',
      costumeTags: ['Phố cổ', 'Ngũ thân', 'Lịch lãm', 'Thanh nhã'],
      recommendedCostumeId: 'ao-ngu-than-nam',
      quote: '“Đèn lồng giăng mắc lối xưa / Sông Hoài nước chảy lửng lơ tơ đào.”',
    },
  },
  {
    id: 'chon-bong-lai',
    order: 5,
    name: 'Chốn Bồng Lai',
    title: '5. Chốn Bồng Lai (Tiên Cảnh Di Sản)',
    subtitle: 'Mây Hồng Cam Pastel • Vầng Dương Hoàng Kim • Khí Chất Thần Tiên Phiêu Bồng',
    region: 'Bồng Lai',
    era: 'Tiên Cảnh Thần Thoại • Đại Việt Tiên Giới',
    landmark: 'Đỉnh Núi Phù Vân & Quầng Trăng Tiên Giới',
    sceneId: 'bong-lai',
    bgUrl: BG_IMAGE_1, // Biến ảnh background tùy chỉnh (Chốn Bồng Lai SVG Pastel)
    mapCoords: { xPercent: 50, yPercent: 33 },
    stamp: {
      id: 'stamp-may-tien-bong-lai',
      title: 'Dấu Mây Tiên & Vầng Dương',
      symbol: '☁️',
      sealText: 'BỒNG LAI TIÊN CẢNH',
      description: 'Con dấu linh thiêng ghi nhận người lữ khách đã đắc ngộ trọn vẹn tinh hoa bách phục và cốt cách tiên phong.',
      color: '#9333EA',
      accentColor: '#FED2B7',
      stampType: 'tien-gioi',
    },
    knowledge: {
      title: 'Phiêu Bồng Khí Chất Thần Tiên Cổ Phong',
      summary: 'Nơi giao hòa giữa lịch sử hào hùng và vẻ đẹp bất tử trong tâm thức người Việt, hoàn tất chuyến du hành di sản.',
      historyLore:
        'Bồng Lai trong mỹ cảm cổ phong tượng trưng cho cõi mộng an nhiên, nơi y phục hóa thành mây ngũ sắc, lụa là đón gió trời. Hoàn thành chặng đường thứ 5 minh chứng cho tấm lòng tha thiết trân quý và tiếp nối di sản văn hóa tổ tiên.',
      costumeHighlight: 'Bách Phục Hóa Tiên / Y Phục Hoàng Gia Bồng Lai',
      costumeTags: ['Tiên cảnh', 'Thần thoại', 'Thanh cao', 'Đại thành'],
      recommendedCostumeId: 'mang-phuc-nam',
      quote: '“Mây hồng chở cánh hạc bay / Bách phục tề tựu đong đầy nghìn thu.”',
    },
  },
];

const PASSPORT_STORAGE_KEY = 'vietphuc_passport_gamification_v1';

/**
 * Lấy dữ liệu Passport từ LocalStorage
 */
export function getPassportData(userName = 'Khách Du Ngoạn', userRole = 'noble'): PassportData {
  try {
    const raw = localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (raw) {
      const parsed: PassportData = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.warn('Cannot parse passport data:', err);
  }

  // Khởi tạo mặc định nếu chưa có
  const defaultPassportId = `VP-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
  const roleTitle =
    userRole === 'king'
      ? 'Quân Vương'
      : userRole === 'noble'
      ? 'Nữ Quý Tộc'
      : 'Lữ Khách Phương Nam';

  const initialData: PassportData = {
    passportId: defaultPassportId,
    holderName: userName,
    title: roleTitle,
    issuedDate: new Date().toLocaleDateString('vi-VN'),
    unlockedStamps: {},
    hasCompletedJourney: false,
  };

  savePassportData(initialData);
  return initialData;
}

/**
 * Lưu dữ liệu Passport vào LocalStorage
 */
export function savePassportData(data: PassportData): void {
  try {
    localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Cannot save passport data:', err);
  }
}

/**
 * Mở khóa và đóng con dấu vào Passport
 * Trả về { isNew: boolean, totalUnlocked: number, isComplete: boolean, passport: PassportData }
 */
export function unlockPassportStamp(node: TimeTravelNode): {
  isNew: boolean;
  totalUnlocked: number;
  isComplete: boolean;
  passport: PassportData;
} {
  const passport = getPassportData();
  const existingStamp = passport.unlockedStamps[node.id];

  const now = new Date();
  const formattedDate = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const isNew = !existingStamp;

  passport.unlockedStamps[node.id] = {
    nodeId: node.id,
    stampId: node.stamp.id,
    unlockedAt: now.toISOString(),
    formattedDate: existingStamp ? existingStamp.formattedDate : formattedDate,
    stampNumber: node.order,
  };

  const totalUnlocked = Object.keys(passport.unlockedStamps).length;
  const isComplete = totalUnlocked >= TRAVEL_NODES.length;

  if (isComplete && !passport.hasCompletedJourney) {
    passport.hasCompletedJourney = true;
    passport.completedDate = formattedDate;
    passport.title = 'ĐẠI SỨ VIỆT PHỤC DI SẢN';
  }

  savePassportData(passport);

  return {
    isNew,
    totalUnlocked,
    isComplete,
    passport,
  };
}

/**
 * Cập nhật danh xưng trên Hộ Chiếu
 */
export function updatePassportHolder(holderName: string, title: string): PassportData {
  const passport = getPassportData();
  passport.holderName = holderName;
  passport.title = title;
  savePassportData(passport);
  return passport;
}
