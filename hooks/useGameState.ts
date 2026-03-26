import { useState, useEffect, useCallback } from 'react';

export type Room = 'Kitchen' | 'Bathroom' | 'Lab' | 'Bedroom' | 'GameCenter' | 'Shop';

export interface InventoryItem {
  id: string;
  name: string;
  type: 'skin' | 'hat' | 'wallpaper';
  equipped: boolean;
}

export interface GameState {
  hunger: number;
  health: number;
  energy: number;
  fun: number;
  dirt: number;
  coins: number;
  xp: number;
  level: number;
  inventory: InventoryItem[];
  activeRoom: Room;
  isSleeping: boolean;
  lastPlayed: number;
  settings: {
    volume: number;
    language: 'en' | 'id';
  };
}

const INITIAL_STATE: GameState = {
  hunger: 100,
  health: 100,
  energy: 100,
  fun: 100,
  dirt: 0,
  coins: 100,
  xp: 0,
  level: 1,
  inventory: [],
  activeRoom: 'Kitchen',
  isSleeping: false,
  lastPlayed: Date.now(),
  settings: {
    volume: 100,
    language: 'en',
  },
};

const MAX_STAT = 100;
const XP_PER_LEVEL = 100;

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('virtualPetState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Calculate offline decay
        const now = Date.now();
        const timeDiff = now - (parsed.lastPlayed || now);
        const intervalsPassed = Math.floor(timeDiff / 30000); // 30 seconds intervals

        if (intervalsPassed > 0) {
          parsed.hunger = Math.max(0, parsed.hunger - intervalsPassed * 2);
          parsed.fun = Math.max(0, parsed.fun - intervalsPassed * 2);
          parsed.dirt = Math.min(MAX_STAT, parsed.dirt + intervalsPassed * 1);
          
          if (parsed.isSleeping) {
            parsed.energy = Math.min(MAX_STAT, parsed.energy + intervalsPassed * 5);
          } else {
            parsed.energy = Math.max(0, parsed.energy - intervalsPassed * 1);
          }

          if (parsed.hunger < 20 || parsed.dirt > 80) {
            parsed.health = Math.max(0, parsed.health - intervalsPassed * 2);
          }
        }
        
        parsed.lastPlayed = now;
        // ensure settings exist if loading from old state
        if (!parsed.settings) {
          parsed.settings = INITIAL_STATE.settings;
        }
        setState({ ...INITIAL_STATE, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('virtualPetState', JSON.stringify({ ...state, lastPlayed: Date.now() }));
    }
  }, [state, isLoaded]);

  // Real-time decay loop
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const newState = { ...prev, lastPlayed: Date.now() };

        // Decay stats
        newState.hunger = Math.max(0, prev.hunger - 1);
        newState.fun = Math.max(0, prev.fun - 1);
        newState.dirt = Math.min(MAX_STAT, prev.dirt + 0.5);

        // Energy logic
        if (prev.isSleeping) {
          newState.energy = Math.min(MAX_STAT, prev.energy + 5);
        } else {
          newState.energy = Math.max(0, prev.energy - 0.5);
        }

        // Health logic (decreases if hungry or dirty)
        if (newState.hunger < 20 || newState.dirt > 80) {
          newState.health = Math.max(0, prev.health - 1);
        } else if (newState.hunger > 80 && newState.dirt < 20 && newState.energy > 50) {
          newState.health = Math.min(MAX_STAT, prev.health + 1);
        }

        return newState;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isLoaded]);

  // Actions
  const feed = useCallback((foodValue: number, cost: number) => {
    setState((prev) => {
      if (prev.coins < cost) return prev;
      return {
        ...prev,
        hunger: Math.min(MAX_STAT, prev.hunger + foodValue),
        coins: prev.coins - cost,
        xp: prev.xp + 5,
      };
    });
  }, []);

  const clean = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dirt: 0,
      health: Math.min(MAX_STAT, prev.health + 10),
      xp: prev.xp + 10,
    }));
  }, []);

  const toggleSleep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSleeping: !prev.isSleeping,
    }));
  }, []);

  const playMiniGame = useCallback((rewardCoins: number, rewardFun: number) => {
    setState((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      fun: Math.min(MAX_STAT, prev.fun + rewardFun),
      energy: Math.max(0, prev.energy - 10),
      xp: prev.xp + 15,
    }));
  }, []);

  const buyItem = useCallback((item: InventoryItem, cost: number) => {
    setState((prev) => {
      if (prev.coins < cost || prev.inventory.some(i => i.id === item.id)) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        inventory: [...prev.inventory, item],
      };
    });
  }, []);

  const equipItem = useCallback((itemId: string, type: 'skin' | 'hat' | 'wallpaper') => {
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.map(item => {
        if (item.type === type) {
          return { ...item, equipped: item.id === itemId };
        }
        return item;
      }),
    }));
  }, []);

  const changeRoom = useCallback((room: Room) => {
    setState((prev) => {
      if (prev.isSleeping && room !== 'Bedroom') return prev; // Can't leave bedroom while sleeping
      return { ...prev, activeRoom: room };
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameState['settings']>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Level up logic
  useEffect(() => {
    if (state.xp >= state.level * XP_PER_LEVEL) {
      setState((prev) => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - prev.level * XP_PER_LEVEL,
        coins: prev.coins + 50, // Level up reward
      }));
    }
  }, [state.xp, state.level]);

  return {
    state,
    isLoaded,
    actions: {
      feed,
      clean,
      toggleSleep,
      playMiniGame,
      buyItem,
      equipItem,
      changeRoom,
      updateSettings,
      resetGame,
    },
  };
}
