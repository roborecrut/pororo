import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, DailyStats, Session, Mode, DEFAULT_SETTINGS } from '../types';
import { getTodayKey, generateId, getEmptyDailyStats } from '../utils/helpers';

interface PomodoroStore {
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;

  // Timer state
  mode: Mode;
  timeLeft: number;
  isRunning: boolean;
  completedPomodoros: number;
  currentSession: Session | null;

  setMode: (mode: Mode) => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  startSession: () => void;
  completeSession: () => void;
  resetTimer: () => void;

  // Stats
  allStats: DailyStats[];
  getTodayStats: () => DailyStats;
  addSession: (session: Session) => void;
}

export const useStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      // Timer state
      mode: 'focus',
      timeLeft: DEFAULT_SETTINGS.focus * 60,
      isRunning: false,
      completedPomodoros: 0,
      currentSession: null,

      setMode: (mode) => {
        const settings = get().settings;
        set({
          mode,
          timeLeft: settings[mode] * 60,
          isRunning: false,
          currentSession: null,
        });
      },

      setTimeLeft: (timeLeft) => set({ timeLeft }),

      setIsRunning: (isRunning) => set({ isRunning }),

      startSession: () => {
        const { mode, settings } = get();
        const session: Session = {
          id: generateId(),
          mode,
          duration: settings[mode],
          completedAt: '',
          completed: false,
        };
        set({ currentSession: session, isRunning: true });
      },

      completeSession: () => {
        const { currentSession, mode, settings, completedPomodoros } = get();
        if (currentSession) {
          const completedSession: Session = {
            ...currentSession,
            completedAt: new Date().toISOString(),
            completed: true,
          };
          get().addSession(completedSession);

          if (mode === 'focus') {
            set({ completedPomodoros: completedPomodoros + 1 });
          }
        }
        set({ currentSession: null, isRunning: false });
      },

      resetTimer: () => {
        const { mode, settings } = get();
        set({
          timeLeft: settings[mode] * 60,
          isRunning: false,
          currentSession: null,
        });
      },

      // Stats
      allStats: [],

      getTodayStats: () => {
        const { allStats } = get();
        const today = getTodayKey();
        return allStats.find(s => s.date === today) || getEmptyDailyStats(today);
      },

      addSession: (session) => {
        const today = getTodayKey();
        set((state) => {
          const existingIndex = state.allStats.findIndex(s => s.date === today);
          const todayStats = existingIndex >= 0
            ? { ...state.allStats[existingIndex] }
            : getEmptyDailyStats(today);

          todayStats.sessions = [...todayStats.sessions, session];

          if (session.mode === 'focus' && session.completed) {
            todayStats.focusSessions += 1;
            todayStats.totalFocusMinutes += session.duration;
            todayStats.completedPomodoros += 1;
          }

          const newAllStats = existingIndex >= 0
            ? state.allStats.map((s, i) => i === existingIndex ? todayStats : s)
            : [...state.allStats, todayStats];

          return { allStats: newAllStats };
        });
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        allStats: state.allStats,
        completedPomodoros: state.completedPomodoros,
      }),
    }
  )
);
