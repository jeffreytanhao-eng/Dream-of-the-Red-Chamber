// 游戏核心类型定义

export type AttributeKey = 'talent' | 'beauty' | 'virtue' | 'cunning' | 'health';

export type CharacterId = 'narrator' | 'daiyu' | 'baoyu' | 'baochai' | 'xifeng' | 'jiamu' | 'xiren' | 'zijuan' | 'jiacun' | 'ladywang' | 'tanchun';

export interface Attributes {
  talent: number;   // 才情
  beauty: number;   // 容貌
  virtue: number;   // 德行
  cunning: number;  // 心计
  health: number;   // 健康
}

export interface Condition {
  type: 'attribute' | 'relationship' | 'flag';
  target: string;
  operator: '>=' | '<=' | '==' | '!=' | 'has' | '!has' | '>' | '<';
  value: number | string;
}

export interface Effect {
  type: 'attribute' | 'relationship' | 'flag';
  target?: string;
  value: number | string;
  operation?: 'add' | 'set';
}

export interface Choice {
  id: string;
  text: string;
  condition?: Condition;
  effects?: Effect[];
  next: string;
}

export interface Dialogue {
  id: string;
  speaker: CharacterId;
  speakerName: string;
  text: string;
  portrait?: CharacterId;
  background?: string;
  mood?: 'normal' | 'happy' | 'sad' | 'angry' | 'shy' | 'thoughtful';
  choices?: Choice[];
  effects?: Effect[];
  next?: string;
  chapterEnd?: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  intro: string;
  startDialogue: string;
  dialogues: Dialogue[];
}

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  description: string;
  color: string;
  portraitPrompt: string;
}

export interface Scene {
  id: string;
  name: string;
  prompt: string;
}

export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  poem: string;
  description: string;
  cgPrompt: string;
  condition: (state: GameState) => boolean;
  priority: number;
}

export interface GameState {
  currentChapter: number;
  currentDialogueId: string;
  attributes: Attributes;
  relationships: Record<string, number>;
  flags: string[];
  playerName: string;
  isStarted: boolean;
  isEnded: boolean;
  currentEndingId?: string;
  savedAt?: string;
}

export const INITIAL_STATE: GameState = {
  currentChapter: 0,
  currentDialogueId: 'ch1_001',
  playerName: '黛玉',
  attributes: {
    talent: 50,
    beauty: 60,
    virtue: 50,
    cunning: 30,
    health: 40,
  },
  relationships: {
    baoyu: 40,
    baochai: 30,
    xifeng: 35,
    jiamu: 50,
    xiren: 30,
    zijuan: 55,
    tanchun: 40,
  },
  flags: [],
  isStarted: false,
  isEnded: false,
};
