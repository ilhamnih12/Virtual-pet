import { GameState } from '@/hooks/useGameState';
import { Volume2, X, AlertTriangle, Bell, Vibrate } from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
  state: GameState;
  actions: any; // We'll pass the full actions object here
  onClose: () => void;
}

export default function SettingsModal({ state, actions, onClose }: SettingsModalProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const t = state.settings.language === 'id' ? {
    settings: 'Pengaturan',
    developer: 'Pengembang',
    volume: 'Volume Suara',
    language: 'Bahasa',
    english: 'Inggris',
    indonesian: 'Indonesia',
    notifications: 'Notifikasi',
    vibration: 'Getaran',
    on: 'Nyala',
    off: 'Mati',
    resetGame: 'Reset Game',
    resetConfirm: 'Apakah Anda yakin ingin mereset semua data permainan? Ini tidak bisa dikembalikan!',
    cancel: 'Batal',
    confirm: 'Ya, Reset',
  } : {
    settings: 'Settings',
    developer: 'Developer',
    volume: 'Sound Volume',
    language: 'Language',
    english: 'English',
    indonesian: 'Indonesian',
    notifications: 'Notifications',
    vibration: 'Vibration',
    on: 'On',
    off: 'Off',
    resetGame: 'Reset Game',
    resetConfirm: 'Are you sure you want to reset all game data? This cannot be undone!',
    cancel: 'Cancel',
    confirm: 'Yes, Reset',
  };

  const handleReset = () => {
    actions.resetGame();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-neutral-100 p-4 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800">{t.settings}</h2>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-200 hover:bg-neutral-300 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Developer Info */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <span className="text-sm text-blue-600 font-medium uppercase tracking-wider">{t.developer}</span>
            <p className="text-xl font-bold text-blue-900 mt-1">Edinst</p>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
              <Volume2 size={18} className="text-neutral-500" />
              {t.volume} ({state.settings.volume}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={state.settings.volume}
              onChange={(e) => actions.updateSettings({ volume: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Toggles: Notifications & Vibration */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-3">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Bell size={18} className="text-neutral-500" />
                {t.notifications}
              </label>
              <button
                onClick={() => actions.updateSettings({ notifications: !state.settings.notifications })}
                className={`w-full py-2 px-4 rounded-xl border-2 transition-all font-medium ${
                  state.settings.notifications
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-neutral-200 bg-neutral-100 text-neutral-500'
                }`}
              >
                {state.settings.notifications ? t.on : t.off}
              </button>
            </div>

            <div className="flex-1 space-y-3">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Vibrate size={18} className="text-neutral-500" />
                {t.vibration}
              </label>
              <button
                onClick={() => actions.updateSettings({ vibration: !state.settings.vibration })}
                className={`w-full py-2 px-4 rounded-xl border-2 transition-all font-medium ${
                  state.settings.vibration
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-neutral-200 bg-neutral-100 text-neutral-500'
                }`}
              >
                {state.settings.vibration ? t.on : t.off}
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-neutral-700">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => actions.updateSettings({ language: 'en' })}
                className={`py-2 px-4 rounded-xl border-2 transition-all font-medium ${
                  state.settings.language === 'en'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {t.english}
              </button>
              <button
                onClick={() => actions.updateSettings({ language: 'id' })}
                className={`py-2 px-4 rounded-xl border-2 transition-all font-medium ${
                  state.settings.language === 'id'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {t.indonesian}
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-neutral-200" />

          {/* Reset Game */}
          <div className="space-y-3">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-3 px-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle size={18} />
                {t.resetGame}
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-xl border-2 border-red-500 space-y-3">
                <p className="text-sm text-red-800 font-medium text-center">
                  {t.resetConfirm}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 px-3 bg-white border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
