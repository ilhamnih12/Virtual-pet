import { GameState, InventoryItem } from '@/hooks/useGameState';
import { ShoppingCart, Check, Palette, Crown } from 'lucide-react';

interface ShopProps {
  state: GameState;
  buyItem: (item: InventoryItem, cost: number) => void;
  equipItem: (itemId: string, type: 'skin' | 'hat' | 'wallpaper') => void;
}

const SHOP_ITEMS: { id: string; name: string; type: 'skin' | 'hat' | 'wallpaper'; cost: number; icon: React.ReactNode }[] = [
  { id: 'skin-blue', name: '#3B82F6', type: 'skin', cost: 100, icon: <div className="w-6 h-6 rounded-full bg-blue-500" /> },
  { id: 'skin-green', name: '#10B981', type: 'skin', cost: 150, icon: <div className="w-6 h-6 rounded-full bg-emerald-500" /> },
  { id: 'skin-pink', name: '#EC4899', type: 'skin', cost: 200, icon: <div className="w-6 h-6 rounded-full bg-pink-500" /> },
  { id: 'hat-cap', name: 'Cap', type: 'hat', cost: 50, icon: <span className="text-2xl">🧢</span> },
  { id: 'hat-top', name: 'Top Hat', type: 'hat', cost: 120, icon: <span className="text-2xl">🎩</span> },
  { id: 'hat-crown', name: 'Crown', type: 'hat', cost: 500, icon: <span className="text-2xl">👑</span> },
];

export default function Shop({ state, buyItem, equipItem }: ShopProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-800 flex items-center gap-2">
          <ShoppingCart /> Shop
        </h2>
        <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
          💰 {state.coins}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {SHOP_ITEMS.map((item) => {
            const isOwned = state.inventory.some((i) => i.id === item.id);
            const isEquipped = state.inventory.some((i) => i.id === item.id && i.equipped);
            const canAfford = state.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  isEquipped
                    ? 'border-green-500 bg-green-50'
                    : isOwned
                    ? 'border-blue-200 bg-blue-50 hover:border-blue-400'
                    : canAfford
                    ? 'border-amber-200 bg-amber-50 hover:border-amber-400'
                    : 'border-neutral-200 bg-neutral-50 opacity-60'
                }`}
              >
                <div className="mb-2">{item.icon}</div>
                
                {isOwned ? (
                  <button
                    onClick={() => equipItem(item.id, item.type)}
                    className={`text-xs font-bold py-1 px-3 rounded-full w-full ${
                      isEquipped
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyItem({ id: item.id, name: item.name, type: item.type, equipped: false }, item.cost)}
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
