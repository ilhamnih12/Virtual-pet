import { useState, useEffect } from 'react';
import { Apple, Pizza, Carrot, IceCream, Banana, Cherry, Grape, Cookie } from 'lucide-react';

interface MemoryMatchProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
}

const ICONS = [
  <Apple key="1" size={32} className="text-red-500" />,
  <Pizza key="2" size={32} className="text-yellow-500" />,
  <Carrot key="3" size={32} className="text-orange-500" />,
  <IceCream key="4" size={32} className="text-pink-500" />,
  <Banana key="5" size={32} className="text-yellow-400" />,
  <Cherry key="6" size={32} className="text-red-600" />,
  <Grape key="7" size={32} className="text-purple-500" />,
  <Cookie key="8" size={32} className="text-yellow-600" />,
];

export default function MemoryMatch({ onEnd, onCancel }: MemoryMatchProps) {
  const [cards, setCards] = useState<{ id: number; iconIndex: number; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Initialize deck
    const deck = [...ICONS, ...ICONS].map((_, i) => ({
      id: i,
      iconIndex: i % 8,
      isFlipped: false,
      isMatched: false,
    })).sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].iconIndex === cards[newFlipped[1]].iconIndex;

      setTimeout(() => {
        if (match) {
          setMatches(m => m + 1);
          setCards(prev => prev.map((c, i) => newFlipped.includes(i) ? { ...c, isMatched: true } : c));
          if (matches + 1 === 8) {
            // Game over, calculate score based on moves
            const score = Math.max(10, 100 - ((moves + 1) * 2));
            onEnd(score);
          }
        } else {
          setCards(prev => prev.map((c, i) => newFlipped.includes(i) ? { ...c, isFlipped: false } : c));
        }
        setFlippedIndices([]);
      }, 1000);
    }
  };

  return (
    <div className="absolute inset-0 bg-indigo-100 z-50 flex flex-col">
      <div className="flex justify-between p-4 bg-white/50 backdrop-blur-sm z-10">
        <div className="font-bold text-xl text-indigo-600">Matches: {matches}/8</div>
        <div className="font-bold text-xl text-neutral-600">Moves: {moves}</div>
        <button onClick={onCancel} className="text-sm font-bold text-neutral-500 hover:text-neutral-800">Exit</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-inner rotate-y-180'
                  : 'bg-indigo-500 shadow-md hover:bg-indigo-400'
              }`}
              style={{ perspective: '1000px' }}
            >
              <div className={`transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
                {ICONS[card.iconIndex]}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
