import { GameState } from '@/hooks/useGameState';
import { Gamepad2, Brain, Calculator, Target } from 'lucide-react';
import { useState, useCallback } from 'react';
import CatchGame from '../minigames/CatchGame';
import MemoryMatch from '../minigames/MemoryMatch';
import MathSprint from '../minigames/MathSprint';

interface GameCenterProps {
  state: GameState;
  playMiniGame: (rewardCoins: number, rewardFun: number) => void;
}

export default function GameCenter({ state, playMiniGame }: GameCenterProps) {
  const [activeGame, setActiveGame] = useState<'menu' | 'catch' | 'memory' | 'math'>('menu');

  const handleGameEnd = useCallback((score: number) => {
    // Calculate rewards based on score
    const coins = Math.floor(score / 2);
    const fun = Math.min(100, score);
    playMiniGame(coins, fun);
    setActiveGame('menu');
  }, [playMiniGame]);

  if (activeGame === 'catch') return <CatchGame onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} />;
  if (activeGame === 'memory') return <MemoryMatch onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} />;
  if (activeGame === 'math') return <MathSprint onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} />;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[400px] flex flex-col">
      <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center gap-2">
        <Gamepad2 /> Game Center
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveGame('catch')}
          className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <Target size={32} />
          <span className="font-bold">Catch Game</span>
          <span className="text-xs opacity-80">Catch falling food!</span>
        </button>

        <button
          onClick={() => setActiveGame('memory')}
          className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <Brain size={32} />
          <span className="font-bold">Memory Match</span>
          <span className="text-xs opacity-80">Find the pairs!</span>
        </button>

        <button
          onClick={() => setActiveGame('math')}
          className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2 col-span-2"
        >
          <Calculator size={32} />
          <span className="font-bold">Math Sprint</span>
          <span className="text-xs opacity-80">Solve fast!</span>
        </button>
      </div>
    </div>
  );
}
