import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '@/lib/i18n';
import { Bird, ArrowUp } from 'lucide-react';

interface FlappyPetProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
  language: 'en' | 'id';
}

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export default function FlappyPet({ onEnd, onCancel, language }: FlappyPetProps) {
  const t = useTranslations(language);
  const [score, setScore] = useState(0);
  const [petY, setPetY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const frameRef = useRef(0);

  const gravity = 0.5;
  const jumpStrength = -8;
  const pipeSpeed = 1.5;
  const gapSize = 35; // % of screen

  const jump = useCallback(() => {
    if (!gameOver) setVelocity(jumpStrength);
  }, [gameOver]);

  // Main game loop
  useEffect(() => {
    if (gameOver) return;

    const loop = setInterval(() => {
      frameRef.current++;

      // Update physics
      setPetY((y) => {
        const newY = y + velocity;
        if (newY < 0 || newY > 95) {
          setGameOver(true); // hit ceiling or floor
        }
        return newY;
      });
      setVelocity((v) => v + gravity);

      // Pipe generation & movement
      setPipes((prev) => {
        let newPipes = prev.map(p => ({ ...p, x: p.x - pipeSpeed }));

        // Spawn
        if (frameRef.current % 120 === 0) {
          const topHeight = Math.random() * (100 - gapSize - 20) + 10; // Min 10% each side
          newPipes.push({ x: 100, topHeight, passed: false });
        }

        // Collision & Scoring
        newPipes = newPipes.filter(p => p.x > -20); // remove off screen

        for (let p of newPipes) {
          // Check X intersection (pet is at 20% X)
          if (p.x < 30 && p.x > 10) {
            // Check Y intersection
            if (petY < p.topHeight || petY > p.topHeight + gapSize) {
              setGameOver(true);
            }
          }
          // Score point
          if (!p.passed && p.x < 20) {
            p.passed = true;
            setScore(s => s + 10);
          }
        }
        return newPipes;
      });

    }, 20); // ~50 fps

    return () => clearInterval(loop);
  }, [velocity, petY, gameOver]);

  // Handle Game Over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => onEnd(score), 1500); // end after 1.5s
    }
  }, [gameOver, score, onEnd]);

  return (
    <div
      className="absolute inset-0 bg-sky-300 z-50 overflow-hidden cursor-pointer touch-none"
      onClick={jump}
    >
      <div className="flex justify-between p-4 z-10 relative">
        <div className="font-black text-2xl text-white drop-shadow-md">{t('score')}: {score}</div>
        <button onClick={onCancel} className="text-sm font-bold text-white drop-shadow-md">{t('cancel')}</button>
      </div>

      <div className="absolute inset-0 flex flex-col pointer-events-none">
        {/* Background Clouds */}
        <div className="absolute top-20 left-10 w-20 h-8 bg-white/50 rounded-full blur-sm" />
        <div className="absolute top-40 right-20 w-32 h-10 bg-white/50 rounded-full blur-sm" />

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            {/* Top Pipe */}
            <div
              className="absolute top-0 w-16 bg-green-500 border-4 border-green-600 rounded-b-lg shadow-lg"
              style={{ left: `${pipe.x}%`, height: `${pipe.topHeight}%` }}
            />
            {/* Bottom Pipe */}
            <div
              className="absolute bottom-0 w-16 bg-green-500 border-4 border-green-600 rounded-t-lg shadow-lg"
              style={{ left: `${pipe.x}%`, height: `${100 - pipe.topHeight - gapSize}%` }}
            />
          </div>
        ))}

        {/* Pet / Bird */}
        <div
          className="absolute w-12 h-12 bg-amber-500 border-4 border-amber-700 rounded-[40%] flex items-center justify-center transition-transform"
          style={{
            left: '20%',
            top: `${petY}%`,
            transform: `rotate(${velocity * 3}deg)`
          }}
        >
          <div className="w-2 h-2 bg-black rounded-full absolute top-3 right-3" /> {/* Eye */}
          <div className="w-6 h-4 bg-orange-500 rounded-r-full absolute top-6 -right-2" /> {/* Beak */}
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-4 bg-green-800" />
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-4xl font-black text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] bg-white p-8 rounded-3xl">{t('crash')}</div>
        </div>
      )}
    </div>
  );
}
