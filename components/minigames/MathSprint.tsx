import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/lib/i18n';

interface MathSprintProps {
  onEnd: (score: number) => void;
  onCancel: () => void;
  language: 'en' | 'id';
}

export default function MathSprint({ onEnd, onCancel, language }: MathSprintProps) {
  const t = useTranslations(language);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [equation, setEquation] = useState({ num1: 0, num2: 0, op: '+', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const generateEquation = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let answer = 0;

    if (op === '+') answer = num1 + num2;
    else if (op === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive result
      answer = num1 - num2;
    } else if (op === '*') {
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      answer = num1 * num2;
    }

    setEquation({ num1, num2, op, answer });

    // Generate options
    const newOptions = [answer];
    while (newOptions.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
      if (!newOptions.includes(wrongAnswer) && wrongAnswer >= 0) {
        newOptions.push(wrongAnswer);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateEquation();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd(scoreRef.current);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  const handleAnswer = (selected: number) => {
    if (selected === equation.answer) {
      setScore((s) => s + 10);
      generateEquation();
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
  };

  return (
    <div className="absolute inset-0 bg-emerald-100 z-50 flex flex-col">
      <div className="flex justify-between p-4 bg-white/50 backdrop-blur-sm z-10">
        <div className="font-bold text-xl text-emerald-600">{t('score')}: {score}</div>
        <div className="font-bold text-xl text-teal-600">{t('time')}: {timeLeft}s</div>
        <button onClick={onCancel} className="text-sm font-bold text-neutral-500 hover:text-neutral-800">{t('cancel')}</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center mb-8">
          <div className="text-5xl font-black text-neutral-800 tracking-widest">
            {equation.num1} {equation.op} {equation.num2} = ?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-3xl font-bold py-6 rounded-2xl shadow-md transition-transform active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
