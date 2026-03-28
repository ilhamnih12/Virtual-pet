import { GameState } from '@/hooks/useGameState';
import { useTranslations } from '@/lib/i18n';
import { Star, Trophy } from 'lucide-react';

interface LevelUpModalProps {
  state: GameState;
  onClose: () => void;
}

export default function LevelUpModal({ state, onClose }: LevelUpModalProps) {
  const t = useTranslations(state.settings.language);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Confetti simulation using CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full animate-fall ${
              ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][i % 5]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDuration: `${Math.random() * 2 + 1}s`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationTimingFunction: 'linear'
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(250,204,21,0.5)] flex flex-col items-center text-center animate-bounce-in relative z-10 border-4 border-yellow-400">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Trophy size={40} className="text-yellow-500" />
        </div>

        <h2 className="text-3xl font-black text-yellow-500 mb-2 drop-shadow-sm uppercase">
          {t('levelUp')}
        </h2>

        <p className="text-neutral-600 font-medium mb-6">
          {t('levelUpDesc')} <span className="font-bold text-xl text-purple-600">{state.level}</span>!
        </p>

        <div className="bg-neutral-100 w-full p-4 rounded-2xl mb-6">
          <p className="text-sm text-neutral-500 mb-2 font-bold uppercase tracking-widest">Reward</p>
          <div className="flex justify-center items-center gap-2 text-2xl font-black text-yellow-600">
            <span>+50</span>
            <span>💰</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          {t('awesome')}
        </button>
      </div>
    </div>
  );
}
