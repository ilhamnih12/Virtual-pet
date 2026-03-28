'use client';
import { useEffect, useRef } from 'react';
import { GameState } from '@/hooks/useGameState';

export default function AudioController({ state }: { state: GameState }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Basic Synthesized BGM using Web Audio API to avoid needing external audio files
    const startBGM = () => {
      if (isPlayingRef.current || state.settings.volume === 0) return;

      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Simple 8-bit style triangle wave for retro feel
        oscillator.type = 'triangle';

        // Arpeggiator loop
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (C Major Arpeggio)
        let now = ctx.currentTime;

        for (let i = 0; i < 1000; i++) { // Loop for a long time
           const note = notes[i % notes.length];
           oscillator.frequency.setValueAtTime(note, now + i * 0.25);
        }

        // Keep volume low so it's background music
        const targetVol = (state.settings.volume / 100) * 0.1;
        gainNode.gain.value = targetVol;

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();

        oscillatorRef.current = oscillator;
        gainNodeRef.current = gainNode;
        isPlayingRef.current = true;
      } catch (e) {
        console.error("Failed to start BGM", e);
      }
    };

    const stopBGM = () => {
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
            } catch (e) {}
            oscillatorRef.current = null;
        }
        isPlayingRef.current = false;
    };

    // Auto-play policy requires user interaction first
    const handleInteraction = () => {
      if (!isPlayingRef.current && state.settings.volume > 0) {
        startBGM();
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    // Handle volume changes
    if (gainNodeRef.current) {
        if (state.settings.volume === 0) {
            stopBGM();
        } else {
            gainNodeRef.current.gain.value = (state.settings.volume / 100) * 0.1;
            if (!isPlayingRef.current) startBGM();
        }
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      stopBGM();
    };
  }, [state.settings.volume]);

  return null; // Purely logical component
}