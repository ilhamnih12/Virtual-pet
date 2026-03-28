import { GameState } from '@/hooks/useGameState';
import { Gamepad2, Brain, Calculator, Target } from 'lucide-react';
import { useState, useCallback } from 'react';
import CatchGame from '../minigames/CatchGame';
import MemoryMatch from '../minigames/MemoryMatch';
import MathSprint from '../minigames/MathSprint';
import FlappyPet from '../minigames/FlappyPet';
import WhackAMole from '../minigames/WhackAMole';
import BlockJump from '../minigames/BlockJump';
import { useTranslations } from '@/lib/i18n';

interface GameCenterProps {
  state: GameState;
  playMiniGame: (rewardCoins: number, rewardFun: number) => void;
}

export default function GameCenter({ state, playMiniGame }: GameCenterProps) {
  const [activeGame, setActiveGame] = useState<'menu' | 'catch' | 'memory' | 'math' | 'flappy' | 'whack' | 'jump'>('menu');
  const t = useTranslations(state.settings.language);

  const handleGameEnd = useCallback((score: number) => {
    // Calculate rewards based on score
    const coins = Math.floor(score / 2);
    const fun = Math.min(100, score);
    playMiniGame(coins, fun);
    setActiveGame('menu');
  }, [playMiniGame]);

  if (activeGame === 'catch') return <CatchGame onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;
  if (activeGame === 'memory') return <MemoryMatch onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;
  if (activeGame === 'math') return <MathSprint onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;
  if (activeGame === 'flappy') return <FlappyPet onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;
  if (activeGame === 'whack') return <WhackAMole onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;
  if (activeGame === 'jump') return <BlockJump onEnd={handleGameEnd} onCancel={() => setActiveGame('menu')} language={state.settings.language} />;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[400px] flex flex-col">
      <h2 className="text-2xl font-bold text-rose-800 mb-4 flex items-center gap-2">
        <Gamepad2 /> {t('gameCenter')}
      </h2>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 pb-4 flex-1">
        <button
          onClick={() => setActiveGame('catch')}
          className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <Target size={32} />
          <span className="font-bold">{t('catchGame')}</span>
          <span className="text-xs opacity-80">{t('catchGameDesc')}</span>
        </button>

        <button
          onClick={() => setActiveGame('memory')}
          className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <Brain size={32} />
          <span className="font-bold">{t('memoryMatch')}</span>
          <span className="text-xs opacity-80">{t('memoryMatchDesc')}</span>
        </button>

        <button
          onClick={() => setActiveGame('math')}
          className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <Calculator size={32} />
          <span className="font-bold">{t('mathSprint')}</span>
          <span className="text-xs opacity-80">{t('mathSprintDesc')}</span>
        </button>

        <button
          onClick={() => setActiveGame('flappy')}
          className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <span className="text-3xl">🕊️</span>
          <span className="font-bold">{t('flappyPet')}</span>
          <span className="text-xs opacity-80 text-center">{t('flappyPetDesc')}</span>
        </button>

        <button
          onClick={() => setActiveGame('whack')}
          className="bg-gradient-to-br from-lime-500 to-green-600 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <span className="text-3xl">🔨</span>
          <span className="font-bold text-center leading-tight">{t('whackAMole')}</span>
          <span className="text-xs opacity-80 text-center">{t('whackAMoleDesc')}</span>
        </button>

        <button
          onClick={() => setActiveGame('jump')}
          className="bg-gradient-to-br from-fuchsia-400 to-purple-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2"
        >
          <span className="text-3xl">⬆️</span>
          <span className="font-bold">Block Jump</span>
          <span className="text-xs opacity-80 text-center">Platformer!</span>
        </button>
      </div>
    </div>
  );
}
