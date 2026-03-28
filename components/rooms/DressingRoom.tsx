import { GameState } from '@/hooks/useGameState';
import { Shirt } from 'lucide-react';

interface DressingRoomProps {
  state: GameState;
  equipItem: (itemId: string, type: 'skin' | 'hat' | 'glasses' | 'wallpaper') => void;
}

import { useTranslations } from '@/lib/i18n';

export default function DressingRoom({ state, equipItem }: DressingRoomProps) {
  const t = useTranslations(state.settings.language);
  const getItemsByType = (type: string) => state.inventory.filter(i => i.type === type);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[300px] flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <Shirt /> {t('dressingRoom')}
      </h2>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Skins */}
        <div>
          <h3 className="text-sm font-bold text-neutral-500 mb-2 uppercase">{t('colors')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getItemsByType('skin').map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id, 'skin')}
                className={`flex-shrink-0 w-16 h-16 rounded-full border-4 transition-all ${
                  item.equipped ? 'border-green-500 scale-110' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: item.name }}
              />
            ))}
            {getItemsByType('skin').length === 0 && <span className="text-sm text-neutral-400">{t('emptyColors')}</span>}
          </div>
        </div>

        {/* Hats */}
        <div>
          <h3 className="text-sm font-bold text-neutral-500 mb-2 uppercase">{t('hats')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getItemsByType('hat').map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id, 'hat')}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-3xl bg-neutral-100 transition-all ${
                  item.equipped ? 'border-green-500 bg-green-50 scale-110' : 'border-transparent hover:scale-105'
                }`}
              >
                {item.id === 'hat-cap' ? '🧢' : item.id === 'hat-crown' ? '👑' : '🎩'}
              </button>
            ))}
            {getItemsByType('hat').length === 0 && <span className="text-sm text-neutral-400">{t('emptyHats')}</span>}
          </div>
        </div>

        {/* Glasses */}
        <div>
          <h3 className="text-sm font-bold text-neutral-500 mb-2 uppercase">{t('glasses')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getItemsByType('glasses').map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id, 'glasses')}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-3xl bg-neutral-100 transition-all ${
                  item.equipped ? 'border-green-500 bg-green-50 scale-110' : 'border-transparent hover:scale-105'
                }`}
              >
                {item.id === 'glass-sun' ? '🕶️' : '👓'}
              </button>
            ))}
            {getItemsByType('glasses').length === 0 && <span className="text-sm text-neutral-400">{t('emptyGlasses')}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
