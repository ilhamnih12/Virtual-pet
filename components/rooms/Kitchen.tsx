import { GameState } from '@/hooks/useGameState';
import { useTranslations } from '@/lib/i18n';
import { Apple, Utensils } from 'lucide-react';

interface KitchenProps {
  state: GameState;
  feed: (foodValue: number, itemId?: string) => void;
}

export default function Kitchen({ state, feed }: KitchenProps) {
  const t = useTranslations(state.settings.language);
  const foods = state.inventory.filter(i => i.type === 'food' && (i.quantity || 0) > 0);

  const handleDragStart = (e: React.DragEvent, value: number, id: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ value, id, type: 'food' }));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[250px] flex flex-col">
      <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center gap-2">
        <Utensils /> {t('kitchen')}
      </h2>

      <div className="text-sm font-medium text-orange-600 mb-4 text-center bg-orange-50 p-2 rounded-lg border border-orange-200">
        {t('dragToFeed')}
      </div>

      <div className="flex-1 overflow-x-auto flex gap-4 pb-4 items-center">
        {foods.length === 0 ? (
          <div className="w-full text-center text-neutral-400 font-medium">
            {t('emptyFood')}
          </div>
        ) : (
          foods.map(food => (
            <div
              key={food.id}
              draggable
              onDragStart={(e) => handleDragStart(e, food.value || 10, food.id)}
              className="flex-shrink-0 w-24 h-24 bg-white border-2 border-orange-200 rounded-2xl flex flex-col items-center justify-center cursor-grab hover:scale-105 transition-transform hover:border-orange-400 shadow-sm relative active:cursor-grabbing"
            >
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                {food.quantity}
              </div>
              <div className="text-3xl mb-1">
                {food.id === 'food-apple' ? '🍎' : '🍕'}
              </div>
              <span className="text-[10px] font-bold text-neutral-600 truncate w-full px-2 text-center">
                {food.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
