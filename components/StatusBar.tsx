import { GameState } from '@/hooks/useGameState';
import { Coins, Star, Heart, Zap, Smile, Drumstick } from 'lucide-react';

export default function StatusBar({ state }: { state: GameState }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-4 flex flex-col gap-3 z-10 border-b border-neutral-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold">
          <Coins size={18} />
          <span>{state.coins}</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full text-purple-700 font-bold">
          <Star size={18} />
          <span>Lvl {state.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatBar icon={<Drumstick size={14} />} value={state.hunger} color="bg-orange-500" />
        <StatBar icon={<Heart size={14} />} value={state.health} color="bg-red-500" />
        <StatBar icon={<Zap size={14} />} value={state.energy} color="bg-blue-500" />
        <StatBar icon={<Smile size={14} />} value={state.fun} color="bg-green-500" />
      </div>
    </div>
  );
}

function StatBar({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-neutral-500">{icon}</div>
      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
