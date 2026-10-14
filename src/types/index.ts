export type Mode = 'focus' | 'shortBreak' | 'longBreak';

export interface Settings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export interface Session {
  id: string;
  mode: Mode;
  duration: number; // in minutes
  completedAt: string; // ISO string
  completed: boolean;
}

export interface DailyStats {
  date: string;
  focusSessions: number;
  totalFocusMinutes: number;
  completedPomodoros: number;
  sessions: Session[];
}

export interface AppState {
  settings: Settings;
  stats: DailyStats;
  allStats: DailyStats[];
  completedPomodoros: number;
  currentSession: Session | null;
}

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
};

export const MODE_LABELS: Record<Mode, string> = {
  focus: 'Фокусировка',
  shortBreak: 'Короткий перерыв',
  longBreak: 'Длинный перерыв',
};

export const MODE_ICONS: Record<Mode, string> = {
  focus: '🎯',
  shortBreak: '☕',
  longBreak: '🌴',
};
