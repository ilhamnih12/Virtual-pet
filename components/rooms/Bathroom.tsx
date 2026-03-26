import { GameState } from '@/hooks/useGameState';
import { ShowerHead, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface BathroomProps {
  state: GameState;
  clean: () => void;
}

export default function Bathroom({ state, clean }: BathroomProps) {
  const [isCleaning, setIsCleaning] = useState(false);

  const handleClean = () => {
    setIsCleaning(true);
    setTimeout(() => {
      clean();
      setIsCleaning(false);
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-cyan-800 mb-4">Bathroom</h2>
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-cyan-700 mb-1">Dirt Level</p>
          <div className="w-48 h-4 bg-cyan-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-600 transition-all duration-500"
              style={{ width: `${state.dirt}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleClean}
          disabled={state.dirt === 0 || isCleaning}
          className="relative overflow-hidden group bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          {isCleaning ? (
            <>
              <Sparkles className="animate-spin" />
              Scrubbing...
            </>
          ) : (
            <>
              <ShowerHead />
              Clean Pet
            </>
          )}
          
          {/* Bubble animation overlay */}
          {isCleaning && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/40 rounded-full animate-ping"
                  style={{
                    width: Math.random() * 10 + 5 + 'px',
                    height: Math.random() * 10 + 5 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDuration: Math.random() * 1 + 0.5 + 's',
                    animationDelay: Math.random() * 0.5 + 's',
                  }}
                />
              ))}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
