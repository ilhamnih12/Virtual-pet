import { GameState, InventoryItem } from '@/hooks/useGameState';
import { ShoppingCart, Palette, Crown, Apple, FlaskConical, Shirt } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useState } from 'react';

interface ShopProps {
  state: GameState;
  buyItem: (item: InventoryItem, cost: number) => void;
}

export default function Shop({ state, buyItem }: ShopProps) {
  const t = useTranslations(state.settings.language);

  const SHOP_ITEMS = [
    // Foods
    { id: 'food-apple', translationKey: 'apple', type: 'food', value: 10, cost: 5, icon: <Apple className="text-red-500" /> },
    { id: 'food-pizza', translationKey: 'pizza', type: 'food', value: 30, cost: 20, icon: <span className="text-xl">🍕</span> },

    // Potions
    { id: 'potion-energy', translationKey: 'energyPotion', type: 'potion', cost: 50, icon: <FlaskConical className="text-yellow-500" /> },
    { id: 'potion-health', translationKey: 'healthPotion', type: 'potion', cost: 100, icon: <FlaskConical className="text-red-500" /> },
    { id: 'potion-diet', translationKey: 'dietPotion', type: 'potion', cost: 75, icon: <FlaskConical className="text-emerald-500" /> },

    // Skins (don't translate colors)
    { id: 'skin-blue', name: '#3B82F6', type: 'skin', cost: 100, icon: <div className="w-6 h-6 rounded-full bg-blue-500" /> },
    { id: 'skin-green', name: '#10B981', type: 'skin', cost: 150, icon: <div className="w-6 h-6 rounded-full bg-emerald-500" /> },

    // Hats & Glasses
    { id: 'hat-cap', translationKey: 'cap', type: 'hat', cost: 50, icon: <span className="text-2xl">🧢</span> },
    { id: 'hat-crown', translationKey: 'crown', type: 'hat', cost: 500, icon: <span className="text-2xl">👑</span> },
    { id: 'glass-sun', translationKey: 'sunglasses', type: 'glasses', cost: 200, icon: <span className="text-2xl">🕶️</span> },
  ] as const;
  const [tab, setTab] = useState<'food' | 'potion' | 'clothes'>('food');

  const filteredItems = SHOP_ITEMS.filter(item => {
    if (tab === 'food') return item.type === 'food';
    if (tab === 'potion') return item.type === 'potion';
    return item.type === 'skin' || item.type === 'hat' || item.type === 'glasses';
  });

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-800 flex items-center gap-2">
          <ShoppingCart /> {t('shop')}
        </h2>
        <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
          💰 {state.coins}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('food')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${tab === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-neutral-100 text-neutral-500'}`}
        >{t('food')}</button>
        <button
          onClick={() => setTab('potion')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${tab === 'potion' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}
        >{t('potions')}</button>
        <button
          onClick={() => setTab('clothes')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${tab === 'clothes' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-500'}`}
        >{t('clothes')}</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const inventoryItem = state.inventory.find(i => i.id === item.id);
            const isOwned = inventoryItem !== undefined && (item.type === 'skin' || item.type === 'hat' || item.type === 'glasses');
            const canAfford = state.coins >= item.cost;
            const isConsumable = item.type === 'food' || item.type === 'potion';

            return (
              <div
                key={item.id}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  isOwned
                    ? 'border-blue-200 bg-blue-50'
                    : canAfford
                    ? 'border-amber-200 bg-amber-50 hover:border-amber-400'
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                {isConsumable && inventoryItem && inventoryItem.quantity! > 0 && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {inventoryItem.quantity}
                  </div>
                )}

                <div className="mb-2">{item.icon}</div>
                <div className="text-[10px] text-center font-medium text-neutral-600 mb-2 truncate w-full">{'translationKey' in item ? t(item.translationKey as any) : item.name}</div>
                
                {isOwned ? (
                  <div className="text-xs font-bold py-1 px-3 rounded-full w-full bg-neutral-200 text-neutral-500 text-center">
                    {t('owned')}
                  </div>
                ) : (
                  <button
                    onClick={() => buyItem({ id: item.id, name: 'translationKey' in item ? t(item.translationKey as any) : item.name, type: item.type as any, value: (item as any).value, equipped: false }, item.cost)}
                    disabled={!canAfford}
                    className="text-xs font-bold py-1 px-3 rounded-full w-full bg-amber-500 text-white hover:bg-amber-600 disabled:bg-neutral-300 disabled:text-neutral-500"
                  >
                    {item.cost} 💰
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
