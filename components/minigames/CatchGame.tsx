import { useState, useEffect, useCallback, useRef } from 'react';
import { Apple, Pizza, Carrot, Bomb } from 'lucide-react';

interface CatchGameProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'food' | 'bomb';
  speed: number;
}

export default function CatchGame({ onEnd, onCancel }: CatchGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [playerX, setPlayerX] = useState(50); // percentage
  const playerXRef = useRef(50);
  const scoreRef = useRef(0);

  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Game loop
  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd(scoreRef.current);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const gameLoop = setInterval(() => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        // Spawn new item randomly
        if (Math.random() < 0.1) {
          newItems.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: -10,
            type: Math.random() < 0.2 ? 'bomb' : 'food',
            speed: Math.random() * 2 + 1,
          });
        }

        // Move items and check collision
        return newItems
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => {
            // Check collision with player (player is at y=80 to y=90, x=playerX-10 to playerX+10)
            if (item.y > 80 && item.y < 95 && Math.abs(item.x - playerXRef.current) < 15) {
              if (item.type === 'food') {
                setScore((s) => s + 10);
              } else {
                setScore((s) => Math.max(0, s - 20));
              }
              return false; // Remove item
            }
            return item.y < 100; // Keep if not at bottom
          });
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(gameLoop);
    };
  }, [timeLeft, onEnd]);

  // Handle touch/mouse movement
  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - container.left) / container.width) * 100;
    setPlayerX(Math.max(10, Math.min(90, x)));
  }, []);

  return (
    <div className="absolute inset-0 bg-sky-200 z-50 flex flex-col overflow-hidden">
      <div className="flex justify-between p-4 bg-white/50 backdrop-blur-sm z-10">
        <div className="font-bold text-xl text-rose-600">Score: {score}</div>
        <div className="font-bold text-xl text-blue-600">Time: {timeLeft}s</div>
        <button onClick={onCancel} className="text-sm font-bold text-neutral-500 hover:text-neutral-800">Exit</button>
      </div>

      <div 
        className="flex-1 relative touch-none"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* Falling Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute transition-transform duration-75"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.type === 'bomb' ? (
              <Bomb size={32} className="text-neutral-800" />
            ) : (
              <Apple size={32} className="text-red-500" />
            )}
          </div>
        ))}

        {/* Player Basket */}
        <div
          className="absolute bottom-10 w-20 h-10 bg-amber-700 rounded-b-full shadow-lg transition-transform duration-75"
          style={{ left: `calc(${playerX}% - 2.5rem)` }}
        >
          <div className="w-full h-2 bg-amber-900 absolute top-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
