import { Mode } from '../types';
import { formatTime } from '../utils/helpers';

interface TimerCircleProps {
  timeLeft: number;
  totalTime: number;
  mode: Mode;
  isRunning: boolean;
}

const MODE_THEMES: Record<Mode, { ring: string; text: string; glow: string }> = {
  focus: {
    ring: 'stroke-red-500',
    text: 'text-red-600',
    glow: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))',
  },
  shortBreak: {
    ring: 'stroke-emerald-500',
    text: 'text-emerald-600',
    glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))',
  },
  longBreak: {
    ring: 'stroke-blue-500',
    text: 'text-blue-600',
    glow: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
  },
};

export default function TimerCircle({ timeLeft, totalTime, mode, isRunning }: TimerCircleProps) {
  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);
  const theme = MODE_THEMES[mode];

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90"
        viewBox="0 0 260 260"
        style={{ filter: isRunning ? theme.glow : 'none' }}
      >
        {/* Background circle */}
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="130"
          cy="130"
          r="120"
          fill="none"
          className={`${theme.ring} transition-all duration-1000 ease-linear`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-6xl sm:text-7xl font-mono font-bold ${theme.text} transition-colors duration-500`}>
          {formatTime(timeLeft)}
        </span>
        {isRunning && (
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                mode === 'focus' ? 'bg-red-400' : mode === 'shortBreak' ? 'bg-emerald-400' : 'bg-blue-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                mode === 'focus' ? 'bg-red-500' : mode === 'shortBreak' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}></span>
            </span>
            <span className="text-sm text-gray-500 font-medium">Работает...</span>
          </div>
        )}
      </div>
    </div>
  );
}
