import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '@/lib/i18n';
import { ArrowUp } from 'lucide-react';

interface BlockJumpProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
  language: 'en' | 'id';
}

interface Platform {
  id: number;
  x: number;
  y: number;
  w: number;
  type: 'normal' | 'boost';
}

export default function BlockJump({ onEnd, onCancel, language }: BlockJumpProps) {
  const t = useTranslations(language);
  const [score, setScore] = useState(0);
  const [petX, setPetX] = useState(50); // percentage
  const [petY, setPetY] = useState(80); // percentage (0 is top)
  const [velocity, setVelocity] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 0, x: 50, y: 90, w: 30, type: 'normal' },
    { id: 1, x: 30, y: 70, w: 25, type: 'normal' },
    { id: 2, x: 70, y: 50, w: 25, type: 'normal' },
    { id: 3, x: 40, y: 30, w: 20, type: 'normal' },
    { id: 4, x: 60, y: 10, w: 20, type: 'boost' },
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [cameraY, setCameraY] = useState(0);
  const gravity = 0.4;
  const jumpStrength = -10;

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse/Touch movement
  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameOver || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const container = containerRef.current.getBoundingClientRect();
    const x = ((clientX - container.left) / container.width) * 100;
    setPetX(Math.max(5, Math.min(95, x))); // Keep in bounds
  }, [gameOver]);

  // Main game loop
  useEffect(() => {
    if (gameOver) return;

    const loop = setInterval(() => {
      setPetY((y) => {
        let nextY = y + velocity;
        let newVelocity = velocity + gravity;

        // Fall handling
        if (newVelocity > 0) { // falling down
          for (let p of platforms) {
            // AABB collision approximation (pet width ~10%)
            if (nextY >= p.y - 5 && y <= p.y - 5 && petX > p.x - p.w / 2 && petX < p.x + p.w / 2) {
              nextY = p.y - 5;
              newVelocity = p.type === 'boost' ? jumpStrength * 1.5 : jumpStrength;
              break;
            }
          }
        }

        setVelocity(newVelocity);

        // Camera follow
        if (nextY < 40) {
          const diff = 40 - nextY;
          setCameraY(prev => prev + diff);
          nextY = 40; // Lock pet to 40% height while moving camera
          setScore(s => s + Math.floor(diff));

          // Move platforms down based on camera
          setPlatforms(prev => {
            const newPlats = prev.map(p => ({ ...p, y: p.y + diff })).filter(p => p.y < 110);

            // Generate new ones if needed
            while (newPlats.length < 7) {
              const lastY = Math.min(...newPlats.map(p => p.y));
              newPlats.push({
                id: Math.random(),
                x: Math.random() * 80 + 10,
                y: lastY - (Math.random() * 15 + 15),
                w: Math.random() * 10 + 20,
                type: Math.random() > 0.8 ? 'boost' : 'normal'
              });
            }
            return newPlats;
          });
        }

        if (nextY > 100) {
          setGameOver(true);
        }

        return nextY;
      });
    }, 20); // ~50 fps

    return () => clearInterval(loop);
  }, [velocity, platforms, petX, gameOver]);

  // Handle Game Over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => onEnd(score), 1500); // end after 1.5s
    }
  }, [gameOver, score, onEnd]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-gradient-to-b from-blue-300 to-indigo-400 z-50 overflow-hidden cursor-pointer touch-none"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="flex justify-between p-4 z-10 relative bg-white/30 backdrop-blur-sm">
        <div className="font-black text-2xl text-white drop-shadow-md">{t('score')}: {score}</div>
        <button onClick={onCancel} className="text-sm font-bold text-white drop-shadow-md">{t('cancel')}</button>
      </div>

      <div className="absolute inset-0 flex flex-col pointer-events-none">

        {/* Platforms */}
        {platforms.map((plat) => (
          <div
            key={plat.id}
            className={`absolute h-4 rounded-full border-b-4 ${
              plat.type === 'boost' ? 'bg-amber-400 border-amber-600' : 'bg-emerald-400 border-emerald-600'
            }`}
            style={{
              left: `${plat.x - plat.w / 2}%`,
              top: `${plat.y}%`,
              width: `${plat.w}%`
            }}
          >
            {plat.type === 'boost' && <ArrowUp className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce" size={20} />}
          </div>
        ))}

        {/* Pet Character */}
        <div
          className="absolute w-10 h-10 bg-orange-500 border-2 border-orange-700 rounded-full shadow-lg flex items-center justify-center transition-transform"
          style={{
            left: `calc(${petX}% - 1.25rem)`,
            top: `${petY}%`,
          }}
        >
           <div className="w-2 h-2 bg-black rounded-full absolute top-2 right-2" />
           <div className="w-2 h-2 bg-black rounded-full absolute top-2 left-2" />
        </div>
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] flex flex-col items-center">
            <span>{t('fallen')}</span>
            <span className="text-2xl mt-4">{t('score')}: {score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
