import React, { useEffect, useState } from 'react';
import { Draw } from '../types';
import { getCurrentDraw } from '../services/lotteryState';
import { getLotteryPrediction } from '../services/geminiService';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [prediction, setPrediction] = useState<string>('');

  useEffect(() => {
    setCurrentDraw(getCurrentDraw());
    getLotteryPrediction().then(setPrediction);
  }, []);

  if (!currentDraw) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 -z-10">
             <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-black mb-4 tracking-tight">
          NEXT JACKPOT
        </h1>
        <div className="text-6xl md:text-8xl font-black gold-gradient mb-8 drop-shadow-2xl font-mono">
          ${currentDraw.jackpot.toLocaleString()}
        </div>
        
        <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8 italic">
          "{prediction}"
        </p>

        <button 
          onClick={() => onNavigate('login')}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.4)]"
        >
          PLAY NOW
        </button>
      </section>

      {/* Info Cards */}
      <section className="w-full max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-purple-500">
          <h3 className="font-display text-xl font-bold mb-2">How to Play</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Select 5 lucky numbers from 1 to 50. Match all 5 to win the grand jackpot! 
            Match 4 or 3 for secondary prizes.
          </p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-blue-500">
          <h3 className="font-display text-xl font-bold mb-2">AI Powered</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Unsure what to pick? Use our Gemini AI integration to interpret your dreams 
            into lucky numbers.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t-4 border-green-500">
          <h3 className="font-display text-xl font-bold mb-2">Instant Wins</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Draws happen daily. Check your dashboard immediately after the draw 
            to see your winnings credited to your account.
          </p>
        </div>
      </section>
    </div>
  );
};