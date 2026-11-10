/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'zat_asal' | 'sifat_asal' | 'proses' | 'perilaku';

export const CATEGORY_LABELS: Record<Category, string> = {
  zat_asal: 'Zat Asal (Haram secara substansi/asal)',
  sifat_asal: 'Sifat Asal (Berubah haram krn sifat/bahaya/najis)',
  proses: 'Proses / Cara (Haram krn cara perolehan/pengolahan)',
  perilaku: 'Perilaku & Akhlak (Penerapan sehari-hari)',
};

// Game 1: Kilat Halal-Haram
export interface KilatQuestion {
  id: string;
  name: string;
  emoji: string;
  isHalal: boolean;
  category: Category;
  explanation: string;
}

// Game 2: Pilihan Ganda Kasus
export interface PilihanGandaQuestion {
  id: string;
  story: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  category: Category;
  explanation: string;
}

// Game 3: Keranjang Sortir
export type BasketType = 'halal' | 'haram_zat' | 'haram_sifat' | 'haram_proses';

export const BASKET_INFO: Record<BasketType, { title: string; subtitle: string; color: string; badge: string }> = {
  halal: {
    title: 'Halal & Thayyib',
    subtitle: 'Baik & dibolehkan syariat',
    color: 'emerald',
    badge: 'HALAL',
  },
  haram_zat: {
    title: 'Haram Zatnya',
    subtitle: 'Babi, bangkai, darah, khamr',
    color: 'rose',
    badge: 'ZAT',
  },
  haram_sifat: {
    title: 'Haram Sifatnya',
    subtitle: 'Basi, beracun, najis, memabukkan',
    color: 'amber',
    badge: 'SIFAT',
  },
  haram_proses: {
    title: 'Haram Prosesnya',
    subtitle: 'Curi, korupsi, tanpa basmalah',
    color: 'purple',
    badge: 'PROSES',
  },
};

export interface KeranjangItem {
  id: string;
  name: string;
  emoji: string;
  correctBasket: BasketType;
  category: Category;
  explanation: string;
}

// Game 4: Cocokkan Pasangan
export interface CocokkanPair {
  id: string;
  item: string;
  emoji: string;
  matchReason: string;
  category: Category;
  explanation: string;
}

// Game 5: Hakim Cilik (Skenario)
export interface HakimCilikOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface HakimCilikQuestion {
  id: string;
  character: string;
  scenario: string;
  question: string;
  options: [HakimCilikOption, HakimCilikOption, HakimCilikOption];
  category: Category;
  explanation: string;
}

// All Question Banks combined
export interface QuestionBank {
  kilat: KilatQuestion[];
  pilihanGanda: PilihanGandaQuestion[];
  keranjang: KeranjangItem[];
  cocokkan: CocokkanPair[];
  hakimCilik: HakimCilikQuestion[];
}

// Team Member & Team
export interface TeamMember {
  id: string;
  name: string;
  gameType: 1 | 2 | 3 | 4 | 5;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
}

export interface DuelResult {
  gameType: 1 | 2 | 3 | 4 | 5;
  gameName: string;
  playerAName: string;
  playerBName: string;
  scoreA: number;
  scoreB: number;
  winner: 'A' | 'B' | 'TIE';
  correctCountA: number;
  correctCountB: number;
  totalTimeMsA: number;
  totalTimeMsB: number;
}

export interface TournamentMatch {
  id: string;
  round: number; // 1 = Quarterfinal / Round 1, 2 = Semifinal, 3 = Final
  roundName: string;
  matchIndex: number;
  teamAId: string | null;
  teamBId: string | null;
  isBye?: boolean;
  duels: DuelResult[];
  winnerId: string | null;
  isCompleted: boolean;
}

export interface GameSettings {
  timePerQuestion: number; // default 10 seconds
  speedBonusEnabled: boolean; // up to 100 bonus
  wrongPenalty: number; // 0 or 25
  soundEnabled: boolean;
  randomizeQuestions: boolean;
  showExplanations: boolean;
  teacherPin: string;
  // Item count per duel
  kilatCount: number; // 10
  pilihanGandaCount: number; // 6
  keranjangCount: number; // 8
  cocokkanCount: number; // 6
  hakimCilikCount: number; // 5
}

export const GAME_TYPE_NAMES: Record<number, { name: string; desc: string; icon: string }> = {
  1: {
    name: 'Kilat Halal-Haram',
    desc: 'Tentukan HALAL atau HARAM secepat kilat!',
    icon: '⚡',
  },
  2: {
    name: 'Pilihan Ganda Kasus',
    desc: 'Analisis sebab zat, sifat, atau proses perolehan',
    icon: '📝',
  },
  3: {
    name: 'Keranjang Sortir',
    desc: 'Sortir item ke keranjang hukum yang tepat',
    icon: '🧺',
  },
  4: {
    name: 'Cocokkan Pasangan',
    desc: 'Pasangkan makanan/perbuatan dengan alasan hukumnya',
    icon: '🧩',
  },
  5: {
    name: 'Hakim Cilik',
    desc: 'Bantu kawan memilih keputusan berakhlak mulia',
    icon: '⚖️',
  },
};
