import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTimer } from '../hooks/useTimer';
import { Mode, MODE_LABELS, MODE_ICONS } from '../types';
import TimerCircle from '../components/TimerCircle';
import ModeSelector from '../components/ModeSelector';
import Controls from '../components/Controls';
import StatsCard from '../components/StatsCard';
import SettingsModal from '../components/SettingsModal';

export default function TimerPage() {
  const { mode, isRunning, completedPomodoros, settings, getTodayStats } = useStore();
  const { timeLeft, totalTime, start, pause, reset } = useTimer();
  const [showSettings, setShowSettings] = useState(false);
  const todayStats = getTodayStats();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {/* Mode Selector */}
      <div className="mb-8">
        <ModeSelector />
      </div>

      {/* Timer */}
      <div className="mb-8">
        <TimerCircle
          timeLeft={timeLeft}
          totalTime={totalTime}
          mode={mode}
          isRunning={isRunning}
        />
      </div>

      {/* Controls */}
      <div className="mb-8">
        <Controls
          isRunning={isRunning}
          mode={mode}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Pomodoro count */}
      {completedPomodoros > 0 && (
        <div className="flex items-center gap-1.5 mb-6 flex-wrap justify-center">
          {Array.from({ length: Math.min(completedPomodoros, 12) }).map((_, i) => (
            <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              🍅
            </span>
          ))}
          {completedPomodoros > 12 && (
            <span className="text-sm text-gray-500 ml-1">+{completedPomodoros - 12}</span>
          )}
        </div>
      )}

      {/* Today's Quick Stats */}
      <div className="w-full max-w-md">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
          Сегодня
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            icon="🎯"
            label="Сессий"
            value={todayStats.focusSessions}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatsCard
            icon="⏱️"
            label="Минут"
            value={todayStats.totalFocusMinutes}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatsCard
            icon="🍅"
            label="Помодоро"
            value={completedPomodoros}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
