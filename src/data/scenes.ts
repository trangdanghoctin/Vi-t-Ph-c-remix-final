import { Scene } from '../types.ts';
import imgSonThan from '../assets/scenes/scene_son_than.png';
import imgCuuLong from '../assets/scenes/scene_cuu_long.png';
import imgHoiAn from '../assets/scenes/scene_hoi_an.png';
import imgCungDinh from '../assets/scenes/scene_cung_dinh.png';
import imgDamSen from '../assets/images/lotus_pond_reg_1791561126163.jpg';

/**
 * =========================================================================
 * KHAI BÁO CÁC BIẾN CHỨA URL ẢNH BACKGROUND TƯƠNG TÁC
 * Được import trực tiếp nội bộ qua Vite Bundle & thư mục Static để người khác truy cập luôn hiển thị 100%
 * =========================================================================
 */
export const BG_IMAGE_1 = ""; // Cảnh 1: Chốn Bồng Lai (Mây Hồng Cam Pastel & Quầng Trăng Vàng Kem - Vẽ Vector SVG nghệ thuật)
export const BG_IMAGE_2 = imgSonThan; // Cảnh 2: Sơn Thần Tế Đàn (Rừng sâu huyền bí)
export const BG_IMAGE_3 = imgCuuLong; // Cảnh 3: Cửu Long Cuốn Thư (Uy nghiêm rồng phượng)
export const BG_IMAGE_4 = imgDamSen; // Cảnh 4: Đầm Sen Buổi Sớm (Tranh Thủy Mặc & Hoa Sen Rực Rỡ)
export const BG_IMAGE_5 = imgHoiAn; // Cảnh 5: Phố Cổ Hội An Lễ Hội Đêm (Đèn lồng lung linh & Hoa đăng sông Hoài)
export const BG_IMAGE_6 = imgCungDinh; // Cảnh 6: Sảnh Cung Đình Hoàng Gia (Sơn son thếp vàng)



export const SCENES_DATA: Scene[] = [
  {
    id: 'bong-lai',
    name: 'Chốn Bồng Lai (Mây Hồng Cam)',
    shortName: 'Bồng Lai',
    subtitle: 'Mây hồng rực rỡ • Vầng dương tiên cảnh • Tiên khí phiêu bồng',
    icon: '☁️',
    timeOfDay: 'Bình Minh Bồng Lai',
    wardrobeObjectName: 'Khối Mây Tiên Phát Sáng',
    wardrobeClosedIcon: '☁️',
    wardrobeOpenIcon: '✨',
    description: 'Chốn bồng lai tiên cảnh ngập tràn mây hồng cam bồng bềnh, vầng dương chiếu rọi đỉnh núi huyền ảo.',
    imageUrl: BG_IMAGE_1,
  },
  {
    id: 'son-than',
    name: 'Sơn Thần Tế Đàn (Rừng Sâu Huyền Bí)',
    shortName: 'Sơn Thần',
    subtitle: 'Đại ngàn thâm nghiêm • Tế đàn trống thiêng • Lụa tiên bay lượn',
    icon: '🥁',
    timeOfDay: 'Đêm Thiêng Huyền Bí',
    wardrobeObjectName: 'Chiếc Trống Đỏ Khổng Lồ',
    wardrobeClosedIcon: '🥁',
    wardrobeOpenIcon: '🌟',
    description: 'Tế đàn linh thiêng giữa đại ngàn non nước, trống thiêng trầm hùng hòa cùng ánh chớp và lụa ngũ sắc.',
    imageUrl: BG_IMAGE_2,
  },
  {
    id: 'cuu-long',
    name: 'Cửu Long Cuốn Thư (Uy Nghiêm)',
    shortName: 'Cửu Long',
    subtitle: 'Rồng lượn phượng múa • Thánh chỉ hoàng gia • Uy nghiêm thịnh thế',
    icon: '📜',
    timeOfDay: 'Hoàng Kim Thịnh Thế',
    wardrobeObjectName: 'Cuốn Thư Hoàng Gia Dát Vàng',
    wardrobeClosedIcon: '📜',
    wardrobeOpenIcon: '✨',
    description: 'Không gian uy nghiêm rồng phượng chầu nhật trên nền ngọc bích, cuốn thư thánh chỉ dát vàng uốn lượn rực rỡ.',
    imageUrl: BG_IMAGE_3,
  },
  {
    id: 'cung-dinh',
    name: 'Sảnh Cung Đình Hoàng Gia',
    shortName: 'Cung Đình',
    subtitle: 'Sơn son thếp vàng • Rồng phượng chầu nhật • Uy nghiêm đại triều',
    icon: '🏛️',
    timeOfDay: 'Đại Triều Buổi Sáng',
    wardrobeObjectName: 'Tủ Gỗ Lim Khảm Trai',
    wardrobeClosedIcon: '🚪',
    wardrobeOpenIcon: '✨',
    description: 'Không gian chánh điện cung đình thời Nguyễn, cột gỗ lim sơn son thếp vàng, chạm khắc rồng phượng tinh vi.',
    imageUrl: BG_IMAGE_6,
  },
  {
    id: 'dam-sen',
    name: 'Đầm Sen Chạng Vạng',
    shortName: 'Đầm Sen',
    subtitle: 'Nắng chiều buông • Cầu tre kẽo kẹt • Gió đồng ngát hương',
    icon: '🪷',
    timeOfDay: 'Hoàng Hôn Dân Gian',
    wardrobeObjectName: 'Đài Sen Khổng Lồ',
    wardrobeClosedIcon: '🪷',
    wardrobeOpenIcon: '🌸',
    description: 'Cảnh sắc đồng quê Bắc Bộ thanh bình, mặt nước phản chiếu ráng chiều hoàng hôn.',
    imageUrl: BG_IMAGE_4,
  },
  {
    id: 'hoi-an',
    name: 'Phố Cổ Hội An Lễ Hội Đêm',
    shortName: 'Phố Cổ',
    subtitle: 'Sông Hoài lấp lánh • Đèn lồng lung linh • Hoa đăng bồng bềnh',
    icon: '🏮',
    timeOfDay: 'Đêm Hội Hoa Đăng',
    wardrobeObjectName: 'Rương Cổ & Quầy Lụa Phố',
    wardrobeClosedIcon: '📦',
    wardrobeOpenIcon: '🏮',
    description: 'Phố hội lung linh đèn lồng rực rỡ, mái ngói rêu phong cổ kính và dòng sông Hoài ngập tràn hoa đăng.',
    imageUrl: BG_IMAGE_5,
  }
];
