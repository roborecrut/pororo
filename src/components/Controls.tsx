import { Mode } from '../types';

interface ControlsProps {
  isRunning: boolean;
  mode: Mode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettings: () => void;
}

export default function Controls({ isRunning, mode, onStart, onPause, onReset, onSettings }: ControlsProps) {
  const buttonColor = mode === 'focus'
    ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
    : mode === 'shortBreak'
    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {/* Start / Pause */}
        {!isRunning ? (
          <button
            onClick={onStart}
            className={`${buttonColor} text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Старт
          </button>
        ) : (
          <button
            onClick={onPause}
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-amber-200 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Пауза
          </button>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          title="Сбросить"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Settings button */}
      <button
        onClick={onSettings}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Настройки
      </button>
    </div>
  );
}
