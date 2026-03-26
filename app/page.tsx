'use client';

import { useGameState } from '@/hooks/useGameState';
import StatusBar from '@/components/StatusBar';
import PetDisplay from '@/components/PetDisplay';
import Navigation from '@/components/Navigation';
import RoomContainer from '@/components/RoomContainer';
import { useEffect, useState } from 'react';

export default function Home() {
  const { state, isLoaded, actions } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="animate-pulse text-2xl font-bold">Loading Pet...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[850px] max-h-[90vh] relative border-4 border-neutral-800">
        <StatusBar state={state} actions={actions} />
        
        <RoomContainer state={state} actions={actions}>
          <PetDisplay state={state} />
        </RoomContainer>
        
        <Navigation activeRoom={state.activeRoom} changeRoom={actions.changeRoom} isSleeping={state.isSleeping} />
      </div>
    </main>
  );
}
