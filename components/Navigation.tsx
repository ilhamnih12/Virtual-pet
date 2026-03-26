import { Room } from '@/hooks/useGameState';
import { Utensils, Bath, Beaker, Bed, Gamepad2, ShoppingBag } from 'lucide-react';

interface NavigationProps {
  activeRoom: Room;
  changeRoom: (room: Room) => void;
  isSleeping: boolean;
}

export default function Navigation({ activeRoom, changeRoom, isSleeping }: NavigationProps) {
  const navItems: { id: Room; icon: React.ReactNode; label: string }[] = [
    { id: 'Kitchen', icon: <Utensils size={24} />, label: 'Kitchen' },
    { id: 'Bathroom', icon: <Bath size={24} />, label: 'Bathroom' },
    { id: 'Lab', icon: <Beaker size={24} />, label: 'Lab' },
    { id: 'Bedroom', icon: <Bed size={24} />, label: 'Bedroom' },
    { id: 'GameCenter', icon: <Gamepad2 size={24} />, label: 'Games' },
    { id: 'Shop', icon: <ShoppingBag size={24} />, label: 'Shop' },
  ];

  return (
    <div className="bg-white border-t border-neutral-200 p-2 z-10">
      <div className="flex justify-between items-center px-2">
        {navItems.map((item) => {
          const isActive = activeRoom === item.id;
          const isDisabled = isSleeping && item.id !== 'Bedroom';
          return (
            <button
              key={item.id}
              onClick={() => changeRoom(item.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 scale-110 shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-100'
              } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
