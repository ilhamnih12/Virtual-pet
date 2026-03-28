import { GameState } from '@/hooks/useGameState';
import { Moon, Sun, BedDouble } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface BedroomProps {
  state: GameState;
  toggleSleep: () => void;
}

export default function Bedroom({ state, toggleSleep }: BedroomProps) {
  const t = useTranslations(state.settings.language);
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-indigo-800 mb-4">{t('bedroom')}</h2>
      
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-medium text-indigo-700 mb-1">{t('energyLevel')}</p>
          <div className="w-48 h-4 bg-indigo-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${state.energy}%` }}
            />
          </div>
        </div>

        <button
          onClick={toggleSleep}
          className={`relative overflow-hidden group font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-lg ${
            state.isSleeping 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white'
          }`}
        >
          {state.isSleeping ? (
            <>
              <Sun className="animate-spin-slow" />
              {t('wakeUp')}
            </>
          ) : (
            <>
              <Moon className="animate-pulse" />
              {t('sleep')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
