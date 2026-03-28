import { GameState } from '@/hooks/useGameState';
import { Apple, Pizza, IceCream, Carrot } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface KitchenProps {
  state: GameState;
  feed: (foodValue: number, cost: number) => void;
}

export default function Kitchen({ state, feed }: KitchenProps) {
  const t = useTranslations(state.settings.language);
  const foods = [
    { id: 'apple', name: 'Apple', icon: <Apple size={32} className="text-red-500" />, value: 10, cost: 5 },
    { id: 'carrot', name: 'Carrot', icon: <Carrot size={32} className="text-orange-500" />, value: 15, cost: 8 },
    { id: 'pizza', name: 'Pizza', icon: <Pizza size={32} className="text-yellow-500" />, value: 30, cost: 20 },
    { id: 'icecream', name: 'Ice Cream', icon: <IceCream size={32} className="text-pink-500" />, value: 20, cost: 15 },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
      <h2 className="text-lg font-bold text-neutral-800 mb-3 text-center">{t('kitchen')}</h2>
      <div className="grid grid-cols-4 gap-2">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => feed(food.value, food.cost)}
            disabled={state.coins < food.cost || state.hunger >= 100}
            className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="bg-neutral-100 p-2 rounded-full">{food.icon}</div>
            <span className="text-xs font-medium text-neutral-600">{food.name}</span>
            <span className="text-[10px] text-yellow-600 font-bold flex items-center">
              💰 {food.cost}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
