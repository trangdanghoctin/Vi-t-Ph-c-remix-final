export interface CostumeStat {
  label: string;
  value: number;
  max: number;
  color: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  patternColor: string;
  description: string;
}

export type CostumeId =
  | 'ao-ma-doan'
  | 'ao-trang-vat'
  | 'ao-tac-nam'
  | 'ao-ngu-than-nam'
  | 'ao-giao-linh-nam'
  | 'ao-truc-linh-nam'
  | 'ao-lap-linh-nam'
  | 'mang-phuc-nam'
  | 'ao-dai-nam'
  | 'ao-tu-than'
  | 'ao-lap-linh'
  | 'ao-nhat-binh'
  | 'ao-tac'
  | 'ao-tac-nu'
  | 'ao-giao-linh'
  | 'ao-ngu-than'
  | 'ao-ngu-than-nu'
  | 'ao-dai-nu'
  | 'ao-vien-linh-nu'
  | 'mang-phuc-nu'
  | string;

export interface Costume {
  id: CostumeId;
  name: string;
  chineseName?: string;
  gender: 'male' | 'female' | 'unisex';
  era: string;
  dynastyTag: string;
  rarity: 'Sử Thi (Epic)' | 'Vương Giả (Royal)' | 'Cổ Phong (Ancient)' | 'Chuẩn Mực (Standard)';
  tags: string[]; // e.g. ['Triều phục', 'Uy nghiêm'], ['Dân gian', 'Lao động'], ['Đoan trang']
  baseScore: number;
  specificNote?: string;
  characteristics: string[];
  fullDescription: string;
  historyLore: string;
  colors: string[];
  colorVariants: ColorVariant[];
  stats: CostumeStat[];
  anatomy: {
    collar: string;
    sleeves: string;
    panels: string;
    accessories: string;
  };
  quote: string;
}

export type AccessoryId =
  | 'man'
  | 'man-khan-xep'
  | 'non-ba-tam'
  | 'kieng-bac'
  | 'kieng-bac-cham-tro'
  | 'quat-lua-tron'
  | 'quat-lua-tron-cung-dinh'
  | 'hai-mui-vut'
  | 'hai-mui-vut-theu-phuong'
  | 'khan-xep'
  | 'khan-dong-nam'
  | 'the-bai-nga'
  | 'guoc-moc'
  | 'guoc-moc-dan-gian'
  | 'non-la-co-hut'
  | 'quai-thao-kep'
  | 'quai-thao-kep-that-lua'
  | 'tram-cai-da'
  | 'tram-cai-toc-dinh-ngoc'
  | 'mu-phuong-hoang-cung'
  | 'non-ngua-binh-dinh'
  | 'mu-o-sa'
  | 'mu-phoc-dau'
  | 'mu-khoi-giap-co-phong'
  | 'chuoi-hat-tram-huong'
  | 'quat-giay-thu-phap-audition'
  | 'kiem-co-phong-nam-ngoc'
  | 'tui-gam-theu-hoa-van'
  | 'dai-that-lung-lua-ngu-sac'
  | 'ngoc-boi-treo-that-lung'
  | 'ung-da-co-phong-nam'
  | 'hai-cung-dinh-dinh-cuom'
  | 'giay-lua-theu-that-no'
  | 'sneaker-neon-audition-remix'
  | 'guoc-cao-goc-son-mai'
  | string;

export type InventoryCategory = 'garment' | 'head' | 'jewelry' | 'feet';
export type InventoryGender = 'male' | 'female' | 'unisex';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  gender: InventoryGender;
  tag: string;
  tags?: string[];
  icon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
}

export type AccessoryCategory = 'head' | 'jewelry' | 'feet';

export interface Accessory {
  id: AccessoryId;
  name: string;
  category: AccessoryCategory;
  gender: 'male' | 'female' | 'unisex';
  slot: 'head' | 'neck' | 'hand' | 'feet' | 'waist';
  tags: string[];
  scoreBonus: number;
  compatibleCostumeIds: string[];
  incompatibleCostumeIds: string[];
  description: string;
  icon: string;
}

export type SceneId =
  | 'bong-lai'
  | 'son-than'
  | 'cuu-long'
  | 'cung-dinh'
  | 'dam-sen'
  | 'hoi-an'
  | string;

export interface Scene {
  id: SceneId;
  name: string;
  shortName: string;
  subtitle: string;
  icon: string;
  timeOfDay: string;
  wardrobeObjectName: string;
  wardrobeClosedIcon: string;
  wardrobeOpenIcon: string;
  description: string;
  imageUrl?: string;
}

export interface ScoreEvaluation {
  score: number;
  status: 'perfect' | 'good' | 'warning' | 'danger';
  title: string;
  feedback: string;
  sceneCommentary: string;
  ruleBreak: boolean;
  breakDetails?: string;
  bonuses: string[];
  penalties: string[];
}
