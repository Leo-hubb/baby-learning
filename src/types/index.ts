// ===== 通用类型 =====
export type ModuleType = 'english' | 'literacy' | 'math' | 'logic' | 'adventure';

export type ItemStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';

export interface ProgressItem {
  module: ModuleType;
  itemId: string;
  status: ItemStatus;
  score?: number;
  stars?: number;
  updatedAt: number;
}

export interface AdventureProgress {
  level: number;
  starsEarned: number;
  completed: boolean;
  completedAt?: number;
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: number;
}

export interface UserStats {
  totalStars: number;
  consecutiveDays: number;
  lastActiveDate: string;
  mathAdditionCount: number;
  logicQuestionCount: number;
}

export interface AppState {
  userId: string;
  progress: Record<string, ProgressItem>; // key: `${module}:${itemId}`
  adventure: Record<number, AdventureProgress>;
  badges: string[]; // earned badge ids
  stats: UserStats;
  lastSynced: number;
}

// ===== 英语乐园 =====
export interface EnglishWord {
  word: string;
  emoji: string;
  phonetic?: string;
}

export interface EnglishUnit {
  id: string;
  level: number;
  unitNumber: number;
  title: string;
  titleCn: string;
  words: EnglishWord[];
  sentences: string[];
  gameType: 'listen_select' | 'drag_match' | 'memory';
}

export interface EnglishLevel {
  level: number;
  name: string;
  units: EnglishUnit[];
}

// ===== 识字花园 =====
export interface ChineseChar {
  char: string;
  pinyin: string;
  radical: string;
  strokes: number;
  words: string[];
  example: string;
}

export interface LiteracyLevel {
  level: number;
  name: string;
  chars: ChineseChar[];
}

// ===== 数字王国 =====
export interface MathQuestion {
  type: 'addition' | 'subtraction' | 'counting';
  question: string;
  answer: number;
  options: number[];
  emoji?: string;
}

// ===== 逻辑挑战 =====
export interface LogicQuestion {
  type: 'pattern' | 'matching' | 'sorting';
  description: string;
  sequence?: string[];
  options: string[];
  answer: number; // index of correct option
  difficulty: number;
}

// ===== 闯关冒险 =====
export interface AdventureQuestion {
  module: ModuleType;
  type: string;
  question: string;
  options: string[];
  answer: number;
  emoji?: string;
  audioText?: string;
  audioLang?: 'en-US' | 'zh-CN';
}
