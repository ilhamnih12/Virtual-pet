import { GameState } from '@/hooks/useGameState';
import { FlaskConical, Activity, Target } from 'lucide-react';

export default function Lab({ state }: { state: GameState }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
        <FlaskConical /> Laboratory
      </h2>
      
      <div className="w-full space-y-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1">
            <Activity size={16} /> Vitals
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-emerald-600">
            <div className="flex justify-between"><span>Age:</span> <span>{Math.floor((Date.now() - state.lastPlayed) / 86400000)} days</span></div>
            <div className="flex justify-between"><span>Weight:</span> <span>{Math.floor(state.hunger / 10 + 5)} kg</span></div>
            <div className="flex justify-between"><span>Mood:</span> <span>{state.fun > 50 ? 'Happy' : 'Sad'}</span></div>
            <div className="flex justify-between"><span>Hygiene:</span> <span>{100 - state.dirt}%</span></div>
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
          <h3 className="text-sm font-bold text-teal-700 mb-2 flex items-center gap-1">
            <Target size={16} /> Daily Quests
          </h3>
          <ul className="space-y-2 text-xs text-teal-600">
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={state.hunger > 80} readOnly className="rounded text-teal-500" />
              <span>Keep hunger above 80%</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={state.dirt === 0} readOnly className="rounded text-teal-500" />
              <span>Clean pet completely</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" checked={state.fun > 90} readOnly className="rounded text-teal-500" />
              <span>Play games until fun is 90%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
