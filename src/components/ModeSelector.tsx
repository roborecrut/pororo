import { Mode, MODE_LABELS, MODE_ICONS } from '../types';
import { useStore } from '../store/useStore';

export default function ModeSelector() {
  const { mode, setMode, isRunning } = useStore();

  const modes: Mode[] = ['focus', 'shortBreak', 'longBreak'];

  return (
    <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-100">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          disabled={isRunning}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            mode === m
              ? m === 'focus'
                ? 'bg-red-500 text-white shadow-md shadow-red-200'
                : m === 'shortBreak'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-blue-500 text-white shadow-md shadow-blue-200'
              : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <span>{MODE_ICONS[m]}</span>
          <span className="hidden sm:inline">{MODE_LABELS[m]}</span>
        </button>
      ))}
    </div>
  );
}
