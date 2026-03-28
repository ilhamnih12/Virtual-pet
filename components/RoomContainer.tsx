import { GameState } from '@/hooks/useGameState';
import Kitchen from './rooms/Kitchen';
import Bathroom from './rooms/Bathroom';
import Bedroom from './rooms/Bedroom';
import GameCenter from './rooms/GameCenter';
import Shop from './rooms/Shop';
import Lab from './rooms/Lab';
import DressingRoom from './rooms/DressingRoom';

interface RoomContainerProps {
  state: GameState;
  actions: any;
  children: React.ReactNode;
}

import { memo } from 'react';

export default memo(function RoomContainer({ state, actions, children }: RoomContainerProps) {
  // Determine background based on room
  let bgClass = 'bg-gradient-to-b from-blue-200 to-blue-400';
  
  if (state.activeRoom === 'Kitchen') bgClass = 'bg-gradient-to-b from-orange-100 to-orange-300';
  else if (state.activeRoom === 'Bathroom') bgClass = 'bg-gradient-to-b from-cyan-100 to-cyan-300';
  else if (state.activeRoom === 'Bedroom') bgClass = state.isSleeping ? 'bg-gradient-to-b from-indigo-900 to-black' : 'bg-gradient-to-b from-indigo-200 to-purple-300';
  else if (state.activeRoom === 'GameCenter') bgClass = 'bg-gradient-to-b from-pink-200 to-rose-400';
  else if (state.activeRoom === 'Shop') bgClass = 'bg-gradient-to-b from-yellow-100 to-amber-300';
  else if (state.activeRoom === 'Lab') bgClass = 'bg-gradient-to-b from-emerald-100 to-teal-300';
  else if (state.activeRoom === 'DressingRoom') bgClass = 'bg-gradient-to-b from-fuchsia-100 to-fuchsia-300';

  return (
    <div className={`flex-1 relative overflow-hidden transition-colors duration-1000 ${bgClass}`}>
      {/* Stars in bedroom when sleeping */}
      {state.activeRoom === 'Bedroom' && state.isSleeping && (
        <div className="absolute inset-0 z-0 opacity-50">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Pet Display (passed as children) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
        {children}
      </div>

      {/* Room specific UI */}
      <div className="absolute inset-0 z-20 pointer-events-auto flex flex-col justify-end p-4">
        {state.activeRoom === 'Kitchen' && <Kitchen state={state} feed={actions.feed} />}
        {state.activeRoom === 'Bathroom' && <Bathroom state={state} clean={actions.clean} />}
        {state.activeRoom === 'Bedroom' && <Bedroom state={state} toggleSleep={actions.toggleSleep} />}
        {state.activeRoom === 'GameCenter' && <GameCenter state={state} playMiniGame={actions.playMiniGame} />}
        {state.activeRoom === 'Shop' && <Shop state={state} buyItem={actions.buyItem} />}
        {state.activeRoom === 'Lab' && <Lab state={state} usePotion={actions.usePotion} />}
        {state.activeRoom === 'DressingRoom' && <DressingRoom state={state} equipItem={actions.equipItem} />}
      </div>
    </div>
  );
});
