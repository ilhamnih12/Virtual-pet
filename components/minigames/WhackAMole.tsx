import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '@/lib/i18n';

interface WhackAMoleProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
  language: 'en' | 'id';
}

export default function WhackAMole({ onEnd, onCancel, language }: WhackAMoleProps) {
  const t = useTranslations(language);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const scoreRef = useRef(0);

  useEffect(() => { scoreRef.current = score; }, [score]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd(scoreRef.current);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  // Mole spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        const randomIdx = Math.floor(Math.random() * 9);
        newMoles[randomIdx] = Math.random() > 0.3; // 70% chance to spawn/despawn
        return newMoles;
      });
    }, 800);
    return () => clearInterval(spawner);
  }, []);

  const whack = (index: number) => {
    if (moles[index]) {
      setScore(s => s + 5);
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[index] = false;
        return newMoles;
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-green-900 z-50 flex flex-col">
      <div className="flex justify-between p-4 bg-white/50 backdrop-blur-sm z-10">
        <div className="font-bold text-xl text-green-800">{t('score')}: {score}</div>
        <div className="font-bold text-xl text-yellow-600">{t('time')}: {timeLeft}s</div>
        <button onClick={onCancel} className="text-sm font-bold text-neutral-800">{t('cancel')}</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {moles.map((isUp, i) => (
            <div key={i} className="relative w-full aspect-square bg-green-800 rounded-full border-b-8 border-green-950 overflow-hidden">
              {/* Hole */}
              <div className="absolute inset-4 bg-black/40 rounded-full" />
              {/* Mole */}
              <button
                onClick={() => whack(i)}
                className={`absolute inset-x-4 bottom-4 top-4 bg-amber-600 rounded-t-full transition-transform duration-100 ease-out border-4 border-amber-800 flex items-center justify-center text-3xl
                  ${isUp ? 'translate-y-0' : 'translate-y-full'}
                `}
              >
                🐛
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
