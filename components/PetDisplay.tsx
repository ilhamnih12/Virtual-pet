import { GameState } from '@/hooks/useGameState';

export default function PetDisplay({ state }: { state: GameState }) {
  // Determine pet expression based on stats
  let expression = 'happy';
  if (state.isSleeping) expression = 'sleeping';
  else if (state.health < 30) expression = 'sick';
  else if (state.hunger < 30) expression = 'hungry';
  else if (state.energy < 30) expression = 'tired';
  else if (state.fun < 30) expression = 'bored';

  // Find equipped items
  const equippedSkin = state.inventory.find(i => i.type === 'skin' && i.equipped);
  const equippedHat = state.inventory.find(i => i.type === 'hat' && i.equipped);

  const skinColor = equippedSkin ? equippedSkin.name : '#D97706'; // Default orange

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-64 mx-auto mt-12 animate-bounce">
      {/* Dirt overlay */}
      {state.dirt > 50 && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 bg-black/20 rounded-[40%] blur-md" />
        </div>
      )}

      {/* Hat */}
      {equippedHat && (
        <div className="absolute -top-8 z-30 text-6xl">
          {equippedHat.name === 'Crown' ? '👑' : equippedHat.name === 'Cap' ? '🧢' : '🎩'}
        </div>
      )}

      {/* Pet Body */}
      <div 
        className="w-48 h-48 rounded-[40%] shadow-xl relative overflow-hidden flex items-center justify-center transition-colors duration-500"
        style={{ backgroundColor: skinColor }}
      >
        {/* Face */}
        <div className="relative w-full h-full flex flex-col items-center justify-center mt-4">
          {/* Eyes */}
          <div className="flex gap-8 mb-4">
            <Eye expression={expression} />
            <Eye expression={expression} />
          </div>

          {/* Mouth */}
          <Mouth expression={expression} />
        </div>
      </div>
    </div>
  );
}

function Eye({ expression }: { expression: string }) {
  if (expression === 'sleeping') {
    return <div className="w-8 h-2 bg-black rounded-full mt-4" />;
  }
  
  if (expression === 'sick' || expression === 'tired') {
    return (
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <div className="w-8 h-4 bg-black/20 absolute top-0" />
        <div className="w-4 h-4 bg-black rounded-full mt-2" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-black rounded-full" />
    </div>
  );
}

function Mouth({ expression }: { expression: string }) {
  if (expression === 'happy') {
    return <div className="w-12 h-6 border-b-4 border-black rounded-b-full" />;
  }
  if (expression === 'sleeping') {
    return <div className="w-4 h-4 border-2 border-black rounded-full animate-pulse" />;
  }
  if (expression === 'hungry' || expression === 'sick') {
    return <div className="w-12 h-6 border-t-4 border-black rounded-t-full mt-2" />;
  }
  if (expression === 'bored') {
    return <div className="w-10 h-1 bg-black rounded-full mt-2" />;
  }
  
  return <div className="w-12 h-6 border-b-4 border-black rounded-b-full" />;
}
