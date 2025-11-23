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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center border-b-4 border-yellow-500">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Your Balance</span>
            <span className="text-3xl font-mono font-bold text-white">${user.balance.toLocaleString()}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center border-b-4 border-blue-500">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Current Jackpot</span>
            <span className="text-3xl font-mono font-bold gold-gradient">${currentDraw?.jackpot.toLocaleString() || 'Loading...'}</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center border-b-4 border-purple-500">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Draw Date</span>
            <span className="text-xl font-bold text-white">
                {currentDraw ? new Date(currentDraw.drawDate).toLocaleDateString() : '...'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Purchase Section */}
        <section className="glass-panel p-6 md:p-8 rounded-2xl">
            <h2 className="text-2xl font-display font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-yellow-500 rounded-full inline-block"></span>
                Purchase Ticket
            </h2>
            
            {/* AI Assistant */}
            <div className="bg-indigo-900/30 p-4 rounded-xl mb-6 border border-indigo-500/30">
                <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center">
                    ✨ ASK THE ORACLE
                </h3>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={dreamInput}
                        onChange={(e) => setDreamInput(e.target.value)}
                        placeholder="e.g., I dreamt of flying over a golden ocean..."
                        className="flex-1 bg-black/30 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <button 
                        onClick={handleAiPick}
                        disabled={isAiLoading || !dreamInput}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {isAiLoading ? '...' : 'Interpret'}
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">Select {LOTTERY_CONFIG.selectionCount} numbers</span>
                <button 
                    onClick={handleRandomPick}
                    className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline"
                >
                    Quick Pick (Random)
                </button>
            </div>

            <NumberSelector selectedNumbers={selectedNumbers} onToggleNumber={handleToggleNumber} />

            <div className="mt-8 flex items-center justify-between">
                <div className="text-slate-300">
                    Cost: <span className="font-bold text-white">${LOTTERY_CONFIG.ticketPrice}</span>
                </div>
                <button 
                    onClick={handlePurchase}
                    disabled={selectedNumbers.length !== LOTTERY_CONFIG.selectionCount}
                    className={`
                        px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all
                        ${selectedNumbers.length === LOTTERY_CONFIG.selectionCount 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white' 
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                    `}
                >
                    Buy Ticket
                </button>
            </div>
            {purchaseMsg && (
                <div className={`mt-4 text-center text-sm font-bold ${purchaseMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {purchaseMsg.text}
                </div>
            )}
        </section>

        {/* History Section */}
        <section className="glass-panel p-6 md:p-8 rounded-2xl overflow-hidden flex flex-col h-[600px]">
             <h2 className="text-2xl font-display font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-purple-500 rounded-full inline-block"></span>
                My Tickets
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {tickets.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">No tickets purchased yet.</div>
                ) : (
                    tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-slate-400">ID: {ticket.id}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    ticket.status === 'WON' ? 'bg-green-500/20 text-green-400' : 
                                    ticket.status === 'LOST' ? 'bg-red-500/20 text-red-400' : 
                                    'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div className="flex gap-2 justify-center mb-3">
                                {ticket.numbers.map(n => (
                                    <span key={n} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm border border-slate-600">
                                        {n}
                                    </span>
                                ))}
                            </div>
                            {ticket.status === 'WON' && (
                                <div className="text-center text-green-400 font-bold text-sm">
                                    + ${ticket.winAmount?.toLocaleString()}
                                </div>
                            )}
                            <div className="text-center text-xs text-slate-500 mt-2">
                                {new Date(ticket.purchaseDate).toLocaleString()}
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