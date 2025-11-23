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

  if (!currentDraw) return <div className="flex items-center justify-center h-screen">Loading Nebula...</div>;

  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full min-h-[70vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
        
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300 mb-6 backdrop-blur-md">
            NEXT DRAW: {new Date(currentDraw.drawDate).toLocaleDateString()}
        </span>

        <h1 className="font-display text-5xl md:text-8xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
          DREAM <span className="text-purple-500">BIG</span>
        </h1>
        
        <div className="relative mb-8 group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative text-6xl md:text-9xl font-black gold-gradient font-mono tracking-tighter drop-shadow-2xl">
              ${currentDraw.jackpot.toLocaleString()}
            </div>
            <div className="text-sm text-yellow-500/80 font-bold tracking-[0.5em] uppercase mt-2">Current Jackpot</div>
        </div>
        
        <p className="text-slate-300 max-w-lg mx-auto text-lg mb-10 leading-relaxed font-light">
          <span className="text-purple-400 font-bold">"</span>
          {prediction}
          <span className="text-purple-400 font-bold">"</span>
        </p>

        <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-1 border border-indigo-400/30"
            >
              PLAY NOW
            </button>
            <button 
                onClick={() => document.getElementById('prizes')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 glass-panel rounded-xl text-white font-bold text-lg hover:bg-white/10 transition-all border border-white/20"
            >
                VIEW PRIZES
            </button>
        </div>
      </section>

      {/* Prize Breakdown Section */}
      <section id="prizes" className="w-full max-w-6xl px-4 py-20">
        <div className="flex flex-col items-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Winning Scheme</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 3 Matches */}
            <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden hover:border-blue-400/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-black">3</span>
                </div>
                <div className="mb-4 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                    3x
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Starter Luck</h3>
                <p className="text-slate-400 mb-6">Match 3 numbers to win a quick return.</p>
                <div className="text-3xl font-mono font-bold text-white">$50</div>
            </div>

            {/* 4 Matches */}
            <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden border-t-2 border-purple-500/50 hover:border-purple-400 transition-colors transform md:-translate-y-4">
                 <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-black">4</span>
                </div>
                <div className="relative mb-4 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                    4x
                </div>
                <h3 className="relative font-display text-2xl font-bold mb-2">Fortune Hunter</h3>
                <p className="relative text-slate-400 mb-6">Match 4 numbers for a significant prize.</p>
                <div className="relative text-3xl font-mono font-bold text-white">$5,000</div>
            </div>

            {/* 5 Matches */}
            <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden border-t-2 border-yellow-500/50 hover:border-yellow-400 transition-colors">
                <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-black">5</span>
                </div>
                <div className="relative mb-4 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold border border-yellow-500/30">
                    5x
                </div>
                <h3 className="relative font-display text-2xl font-bold mb-2 text-yellow-200">Jackpot King</h3>
                <p className="relative text-slate-400 mb-6">Match all 5 numbers to take it all!</p>
                <div className="relative text-3xl font-mono font-bold gold-gradient">JACKPOT</div>
            </div>
        </div>
      </section>

      {/* AI Feature */}
      <section className="w-full py-20 bg-gradient-to-b from-transparent to-black/40">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                  <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                      Powered by <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Gemini Intelligence</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                      Don't rely on random chance. Describe your dreams, feelings, or day to our integrated AI, and let the stars interpret your lucky numbers for the next draw.
                  </p>
              </div>
              <div className="flex-1 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full animate-float blur-sm opacity-80 flex items-center justify-center">
                       <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                           <span className="text-6xl">🔮</span>
                       </div>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};