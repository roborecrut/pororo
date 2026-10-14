import { useState } from 'react';
import { Settings } from '../types';
import { useStore } from '../store/useStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings, setMode } = useStore();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleChange = (key: keyof Settings, value: number | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setMode(useStore.getState().mode); // Refresh timer with new settings
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(useStore.getState().settings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">⚙️ Настройки</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Duration settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Длительность</h3>

            <SettingRow
              icon="🎯"
              label="Фокусировка"
              value={localSettings.focus}
              unit="мин"
              onChange={(v) => handleChange('focus', v)}
              min={1}
              max={120}
            />
            <SettingRow
              icon="☕"
              label="Короткий перерыв"
              value={localSettings.shortBreak}
              unit="мин"
              onChange={(v) => handleChange('shortBreak', v)}
              min={1}
              max={30}
            />
            <SettingRow
              icon="🌴"
              label="Длинный перерыв"
              value={localSettings.longBreak}
              unit="мин"
              onChange={(v) => handleChange('longBreak', v)}
              min={1}
              max={60}
            />
            <SettingRow
              icon="🔄"
              label="Интервал длинного перерыва"
              value={localSettings.longBreakInterval}
              unit="помодоро"
              onChange={(v) => handleChange('longBreakInterval', v)}
              min={2}
              max={10}
            />
          </div>

          {/* Toggle settings */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Поведение</h3>

            <ToggleRow
              label="Автозапуск перерывов"
              description="Автоматически начинать перерыв после фокуса"
              checked={localSettings.autoStartBreaks}
              onChange={(v) => handleChange('autoStartBreaks', v)}
            />
            <ToggleRow
              label="Автозапуск помодоро"
              description="Автоматически начинать фокус после перерыва"
              checked={localSettings.autoStartPomodoros}
              onChange={(v) => handleChange('autoStartPomodoros', v)}
            />
            <ToggleRow
              label="Звуковые уведомления"
              description="Воспроизводить звук при завершении таймера"
              checked={localSettings.soundEnabled}
              onChange={(v) => handleChange('soundEnabled', v)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleReset}
              className="flex-1 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors border border-red-100"
            >
              Сбросить
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  unit,
  onChange,
  min,
  max,
}: {
  icon: string;
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 font-bold transition-colors"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
          className="w-14 text-center text-sm font-semibold border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 font-bold transition-colors"
        >
          +
        </button>
        <span className="text-xs text-gray-400 w-14">{unit}</span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
