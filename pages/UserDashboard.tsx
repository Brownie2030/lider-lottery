import React, { useState, useEffect } from 'react';
import { User, Ticket, Draw, LOTTERY_CONFIG } from '../types';
import { buyTicket, getCurrentDraw, getUserTickets } from '../services/lotteryState';
import { NumberSelector } from '../components/NumberSelector';
import { getAILuckyNumbers } from '../services/geminiService';

interface UserDashboardProps {
  user: User;
  refreshUser: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, refreshUser }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [dreamInput, setDreamInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const loadData = () => {
    setTickets(getUserTickets(user.id));
    setCurrentDraw(getCurrentDraw());
  };

  const handleToggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < LOTTERY_CONFIG.selectionCount) {
        setSelectedNumbers(prev => [...prev, num].sort((a,b) => a-b));
      }
    }
  };

  const handleRandomPick = () => {
    const nums: number[] = [];
    while(nums.length < LOTTERY_CONFIG.selectionCount) {
        const n = Math.floor(Math.random() * LOTTERY_CONFIG.maxNumber) + 1;
        if(!nums.includes(n)) nums.push(n);
    }
    setSelectedNumbers(nums.sort((a,b) => a-b));
  };

  const handleAiPick = async () => {
    if(!dreamInput.trim()) return;
    setIsAiLoading(true);
    const nums = await getAILuckyNumbers(dreamInput);
    if(nums.length === LOTTERY_CONFIG.selectionCount) {
        setSelectedNumbers(nums.sort((a,b) => a-b));
    }
    setIsAiLoading(false);
  };

  const handlePurchase = () => {
    if (selectedNumbers.length !== LOTTERY_CONFIG.selectionCount) {
        setPurchaseMsg({ type: 'error', text: `Please select ${LOTTERY_CONFIG.selectionCount} numbers.` });
        return;
    }
    const result = buyTicket(user.id, selectedNumbers);
    if (result.success) {
        setPurchaseMsg({ type: 'success', text: result.message });
        setSelectedNumbers([]);
        refreshUser();
        loadData();
    } else {
        setPurchaseMsg({ type: 'error', text: result.message });
    }
    setTimeout(() => setPurchaseMsg(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors"></div>
            <div className="relative z-10">
                <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Your Balance</div>
                <div className="text-4xl font-mono font-bold text-white tracking-tighter">${user.balance.toLocaleString()}</div>
            </div>
            <div className="absolute right-0 bottom-0 p-4 opacity-20">
                <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10"></div>
             <div className="relative z-10">
                <div className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">Current Jackpot</div>
                <div className="text-3xl font-mono font-bold gold-gradient tracking-tighter">${currentDraw?.jackpot.toLocaleString() || '...'}</div>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Next Draw</div>
                <div className="text-2xl font-bold text-white">
                    {currentDraw ? new Date(currentDraw.drawDate).toLocaleDateString() : '...'}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Purchase Section */}
        <section className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">1</span>
                    Pick Numbers
                </h2>
                <button 
                    onClick={handleRandomPick}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 transition-all"
                >
                    ⚡ QUICK PICK
                </button>
            </div>
            
            {/* AI Assistant */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900/50 p-5 rounded-2xl mb-8 border border-indigo-500/20">
                <label className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2">
                    <span className="animate-pulse">✨</span> AI DREAM INTERPRETER
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={dreamInput}
                        onChange={(e) => setDreamInput(e.target.value)}
                        placeholder="I dreamt of flying over a golden city..."
                        className="flex-1 bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                    <button 
                        onClick={handleAiPick}
                        disabled={isAiLoading || !dreamInput}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAiLoading ? 'Thinking...' : 'Generate'}
                    </button>
                </div>
            </div>

            <NumberSelector selectedNumbers={selectedNumbers} onToggleNumber={handleToggleNumber} />

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="text-slate-400 text-sm">
                    Ticket Price: <span className="font-bold text-white text-lg ml-2">${LOTTERY_CONFIG.ticketPrice}</span>
                </div>
                <button 
                    onClick={handlePurchase}
                    disabled={selectedNumbers.length !== LOTTERY_CONFIG.selectionCount}
                    className={`
                        px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase shadow-lg transition-all
                        ${selectedNumbers.length === LOTTERY_CONFIG.selectionCount 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white hover:scale-105' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                    `}
                >
                    Confirm Purchase
                </button>
            </div>
            {purchaseMsg && (
                <div className={`mt-4 p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 animate-bounce ${purchaseMsg.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                   {purchaseMsg.type === 'success' ? '🎟️' : '⚠️'} {purchaseMsg.text}
                </div>
            )}
        </section>

        {/* History Section */}
        <section className="glass-panel p-8 rounded-3xl flex flex-col h-[650px] border border-white/10">
             <h2 className="text-2xl font-display font-bold mb-6 text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/40">2</span>
                My Tickets
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tickets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        <p>No active tickets found</p>
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <div key={ticket.id} className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                            ticket.status === 'WON' ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30' : 
                            ticket.status === 'LOST' ? 'bg-red-900/5 border-red-500/10 opacity-75' : 
                            'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}>
                            {ticket.status === 'WON' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>}
                            
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">#{ticket.id.slice(-8)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    ticket.status === 'WON' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                                    ticket.status === 'LOST' ? 'text-red-400 bg-red-900/20' : 
                                    'text-yellow-400 bg-yellow-900/20'
                                }`}>
                                    {ticket.status}
                                </span>
                            </div>
                            
                            <div className="flex gap-2 justify-center mb-3">
                                {ticket.numbers.map(n => (
                                    <span key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${
                                        ticket.status === 'WON' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                                    }`}>
                                        {n}
                                    </span>
                                ))}
                            </div>
                            
                            {ticket.status === 'WON' && (
                                <div className="mt-2 text-center">
                                    <span className="text-green-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                                        + ${ticket.winAmount?.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            
                            <div className="text-center text-[10px] text-slate-500 mt-2">
                                Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
      </div>

    </div>
  );
};