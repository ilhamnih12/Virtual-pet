import { GameState } from '@/hooks/useGameState';
import { useTranslations } from '@/lib/i18n';
import { FlaskConical } from 'lucide-react';

interface LabProps {
  state: GameState;
  usePotion: (potionType: string, itemId: string) => void;
}

export default function Lab({ state, usePotion }: LabProps) {
  const t = useTranslations(state.settings.language);
  const potions = state.inventory.filter(i => i.type === 'potion' && (i.quantity || 0) > 0);

  const handleDragStart = (e: React.DragEvent, type: string, id: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, id, category: 'potion' }));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[250px] flex flex-col">
      <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
        <FlaskConical /> {t('laboratory')}
      </h2>

      <div className="text-sm font-medium text-emerald-600 mb-4 text-center bg-emerald-50 p-2 rounded-lg border border-emerald-200">
        {t('dragToHeal')}
      </div>

      <div className="flex-1 overflow-x-auto flex gap-4 pb-4 items-center">
        {potions.length === 0 ? (
          <div className="w-full text-center text-neutral-400 font-medium">
            {t('emptyPotions')}
          </div>
        ) : (
          potions.map(potion => (
            <div
              key={potion.id}
              draggable
              onDragStart={(e) => handleDragStart(e, potion.id.replace('potion-', ''), potion.id)}
              className="flex-shrink-0 w-24 h-24 bg-white border-2 border-emerald-200 rounded-2xl flex flex-col items-center justify-center cursor-grab hover:scale-105 transition-transform hover:border-emerald-400 shadow-sm relative active:cursor-grabbing"
            >
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                {potion.quantity}
              </div>
              <div className={`text-3xl mb-1 ${
                potion.id.includes('health') ? 'text-red-500' :
                potion.id.includes('energy') ? 'text-yellow-500' :
                'text-emerald-500'
              }`}>
                ⚗️
              </div>
              <span className="text-[10px] font-bold text-neutral-600 truncate w-full px-2 text-center">
                {potion.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
