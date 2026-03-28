import { GameState } from '@/hooks/useGameState';
import { memo } from 'react';

import { useState } from 'react';

export default memo(function PetDisplay({ state, onFeed, onUsePotion }: { state: GameState, onFeed?: (val: number, id: string) => void, onUsePotion?: (type: string, id: string) => void }) {
  const [isPetting, setIsPetting] = useState(false);

  // Determine pet expression based on stats
  let expression = 'happy';
  if (isPetting) expression = 'excited';
  if (state.isSleeping) expression = 'sleeping';
  else if (state.health < 30) expression = 'sick';
  else if (state.hunger < 30) expression = 'hungry';
  else if (state.energy < 30) expression = 'tired';
  else if (state.fun < 30) expression = 'bored';

  // Find equipped items
  const equippedSkin = state.inventory.find(i => i.type === 'skin' && i.equipped);
  const equippedHat = state.inventory.find(i => i.type === 'hat' && i.equipped);

  const equippedGlasses = state.inventory.find(i => i.type === 'glasses' && i.equipped);

  const skinColor = equippedSkin ? equippedSkin.name : '#D97706'; // Default orange

  const handlePet = () => {
    if (state.isSleeping) return;
    setIsPetting(true);

    // Play SFX (placeholder or simple web audio synth)
    if (state.settings.volume > 0) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime); // value in hertz
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(state.settings.volume / 100, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        // Audio API not supported or blocked
      }
    }

    setTimeout(() => {
      setIsPetting(false);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.type === 'food' && onFeed) {
        onFeed(data.value, data.id);
      } else if (data.category === 'potion' && onUsePotion) {
        onUsePotion(data.type, data.id);
      }
    } catch (err) {
      // ignore drop errors
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-64 h-64 mx-auto mt-12 cursor-pointer group ${isPetting ? 'animate-bounce' : 'animate-[bounce_3s_infinite]'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handlePet}
    >
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
        className="w-48 h-48 rounded-[40%] shadow-xl relative overflow-hidden flex items-center justify-center transition-colors duration-500 group-active:scale-95"
        style={{ backgroundColor: skinColor }}
      >
        {/* Face */}
        <div className="relative w-full h-full flex flex-col items-center justify-center mt-4">
          {/* Eyes */}
          <div className="flex gap-8 mb-4 relative">
            <Eye expression={expression} />
            <Eye expression={expression} />
            {/* Glasses */}
            {equippedGlasses && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl pointer-events-none drop-shadow-md">
                {equippedGlasses.id === 'glass-sun' ? '🕶️' : '👓'}
              </div>
            )}
          </div>

          {/* Mouth */}
          <Mouth expression={expression} />
        </div>
      </div>
    </div>
  );
});

function Eye({ expression }: { expression: string }) {
  if (expression === 'sleeping') {
    return <div className="w-8 h-2 bg-black rounded-full mt-4" />;
  }
  
  if (expression === 'excited') {
    return <div className="w-8 h-8 font-black text-2xl flex items-center justify-center">^</div>;
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
  if (expression === 'happy' || expression === 'excited') {
    return <div className="w-12 h-6 border-b-4 border-black rounded-b-full bg-red-400" />;
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
