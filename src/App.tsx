import { useState, useEffect, useCallback, useRef } from 'react';

type Mode = 'focus' | 'shortBreak' | 'longBreak';

interface Settings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface DailyStats {
  date: string;
  focusSessions: number;
  totalFocusMinutes: number;
}

const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

const MODE_LABELS: Record<Mode, string> = {
  focus: 'Фокусировка',
  shortBreak: 'Короткий перерыв',
  longBreak: 'Длинный перерыв',
};

const MODE_COLORS: Record<Mode, { bg: string; ring: string; text: string; button: string; buttonHover: string }> = {
  focus: {
    bg: 'bg-gradient-to-br from-red-50 to-orange-50',
    ring: 'stroke-red-500',
    text: 'text-red-600',
    button: 'bg-red-500',
    buttonHover: 'hover:bg-red-600',
  },
  shortBreak: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    ring: 'stroke-green-500',
    text: 'text-green-600',
    button: 'bg-green-500',
    buttonHover: 'hover:bg-green-600',
  },
  longBreak: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    ring: 'stroke-blue-500',
    text: 'text-blue-600',
    button: 'bg-blue-500',
    buttonHover: 'hover:bg-blue-600',
  },
};

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem('pomodoro-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SETTINGS;
}

function loadStats(): DailyStats {
  try {
    const saved = localStorage.getItem('pomodoro-stats');
    if (saved) {
      const stats = JSON.parse(saved);
      if (stats.date === getTodayKey()) return stats;
    }
  } catch {}
  return { date: getTodayKey(), focusSessions: 0, totalFocusMinutes: 0 };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function App() {
  const [mode, setMode] = useState<Mode>('focus');
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<DailyStats>(loadStats);
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const totalTime = settings[mode] * 60;
  const progress = (totalTime - timeLeft) / totalTime;

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = useCallback(() => {
    if (mode === 'focus') {
      setStats((prev) => ({
        ...prev,
        date: getTodayKey(),
        focusSessions: prev.focusSessions + 1,
        totalFocusMinutes: prev.totalFocusMinutes + settings.focus,
      }));
      setCompletedPomodoros((prev) => prev + 1);
    }
    // Play notification sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 300);
    } catch {}
  }, [mode, settings.focus]);

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode] * 60);
  };

  const handleSettingsChange = (key: keyof Settings, value: number) => {
    const clamped = Math.max(1, Math.min(120, value));
    setSettings((prev) => ({ ...prev, [key]: clamped }));
    if (key === mode && !isRunning) {
      setTimeLeft(clamped * 60);
    }
  };

  const colors = MODE_COLORS[mode];
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500 flex flex-col`}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🍅 Pomodoro Timer
        </h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600"
          title="Настройки"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === m
                  ? `${MODE_COLORS[m].button} text-white shadow-md`
                  : 'text-gray-600 hover:bg-white/80'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative mb-8">
          <svg className="w-72 h-72 -rotate-90" viewBox="0 0 260 260">
            {/* Background circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              className={`${colors.ring} transition-all duration-1000`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-mono font-bold ${colors.text} transition-colors duration-500`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-500 mt-2 text-sm font-medium">
              {MODE_LABELS[mode]}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className={`${colors.button} ${colors.buttonHover} text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95`}
            >
              ▶ Старт
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
            >
              ⏸ Пауза
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-lg shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
          >
            ↺ Сброс
          </button>
        </div>

        {/* Pomodoro count */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: Math.min(completedPomodoros, 8) }).map((_, i) => (
            <span key={i} className="text-2xl">🍅</span>
          ))}
          {completedPomodoros > 8 && (
            <span className="text-sm text-gray-500">+{completedPomodoros - 8}</span>
          )}
        </div>

        {/* Today's Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm w-full max-w-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Статистика за сегодня
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{stats.focusSessions}</div>
              <div className="text-xs text-gray-500 mt-1">Сессий фокуса</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{stats.totalFocusMinutes}</div>
              <div className="text-xs text-gray-500 mt-1">Минут фокуса</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalFocusMinutes / 60 * 10) / 10}</div>
              <div className="text-xs text-gray-500 mt-1">Часов</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{completedPomodoros}</div>
              <div className="text-xs text-gray-500 mt-1">Помодоро</div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">⚙️ Настройки</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Фокусировка (минуты)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingsChange('focus', settings.focus - 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={settings.focus}
                    onChange={(e) => handleSettingsChange('focus', parseInt(e.target.value) || 1)}
                    className="flex-1 text-center text-lg font-semibold border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                  <button
                    onClick={() => handleSettingsChange('focus', settings.focus + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ☕ Короткий перерыв (минуты)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingsChange('shortBreak', settings.shortBreak - 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={settings.shortBreak}
                    onChange={(e) => handleSettingsChange('shortBreak', parseInt(e.target.value) || 1)}
                    className="flex-1 text-center text-lg font-semibold border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button
                    onClick={() => handleSettingsChange('shortBreak', settings.shortBreak + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌴 Длинный перерыв (минуты)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingsChange('longBreak', settings.longBreak - 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={settings.longBreak}
                    onChange={(e) => handleSettingsChange('longBreak', parseInt(e.target.value) || 1)}
                    className="flex-1 text-center text-lg font-semibold border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleSettingsChange('longBreak', settings.longBreak + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSettings(DEFAULT_SETTINGS);
                    setTimeLeft(DEFAULT_SETTINGS[mode] * 60);
                    setIsRunning(false);
                  }}
                  className="w-full py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  Сбросить настройки по умолчанию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-400">
        Метод Pomodoro — работай фокусированно, отдыхай правильно
      </footer>
    </div>
  );
}
