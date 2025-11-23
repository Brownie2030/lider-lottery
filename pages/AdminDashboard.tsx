import React, { useState, useEffect } from 'react';
import { User, Draw, Ticket } from '../types';
import { getCurrentDraw, performDraw, getDrawHistory, getAllTickets } from '../services/lotteryState';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [history, setHistory] = useState<Draw[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCurrentDraw(getCurrentDraw());
    setHistory(getDrawHistory());
    setAllTickets(getAllTickets());
  };

  const handleDraw = () => {
    if (!currentDraw) return;
    if (!window.confirm("Are you sure you want to trigger the draw? This cannot be undone.")) return;

    setDrawing(true);
    setTimeout(() => {
        try {
            performDraw(currentDraw.id);
            refreshData();
        } catch (e) {
            alert("Error performing draw");
        }
        setDrawing(false);
    }, 2000); // Simulate processing delay
  };

  if (!currentDraw) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white">Admin Control Panel</h1>
        <div className="bg-red-900/30 text-red-400 px-4 py-2 rounded border border-red-500/50 text-sm font-mono">
            SUPERUSER MODE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Draw Control */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z" /></svg>
            </div>

            <h2 className="text-xl font-bold mb-4 text-purple-300">Active Draw Management</h2>
            
            <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Draw ID</span>
                    <span className="font-mono text-white">{currentDraw.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-bold">{currentDraw.status}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Current Pot</span>
                    <span className="text-yellow-400 font-bold text-xl">${currentDraw.jackpot.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Tickets Sold</span>
                    <span className="text-white font-bold">{currentDraw.totalTicketsSold}</span>
                </div>
            </div>

            <button 
                onClick={handleDraw}
                disabled={drawing || currentDraw.status !== 'OPEN'}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3
                    ${drawing 
                        ? 'bg-slate-700 text-slate-500 cursor-wait' 
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white'}
                `}
            >
                {drawing ? (
                    <>Processing...</>
                ) : (
                    <>
                        <span>⚠️ TRIGGER DRAW</span>
                    </>
                )}
            </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
             <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
                 <span className="text-slate-400 text-xs uppercase mb-2">Total Revenue</span>
                 <span className="text-2xl font-bold text-green-400">${(allTickets.length * 5).toLocaleString()}</span>
             </div>
             <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
                 <span className="text-slate-400 text-xs uppercase mb-2">Total Payouts</span>
                 <span className="text-2xl font-bold text-red-400">
                     ${allTickets.reduce((acc, t) => acc + (t.winAmount || 0), 0).toLocaleString()}
                 </span>
             </div>
             <div className="glass-panel p-6 rounded-2xl col-span-2">
                 <h3 className="text-slate-400 text-sm uppercase mb-4">Recent Draws</h3>
                 <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                     {history.slice(1).map(h => (
                         <div key={h.id} className="flex justify-between text-sm border-b border-white/5 pb-1">
                             <span className="text-slate-500">{new Date(h.drawDate).toLocaleDateString()}</span>
                             <div className="flex gap-1">
                                 {h.winningNumbers?.map(n => (
                                     <span key={n} className="text-xs w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">{n}</span>
                                 ))}
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

      </div>

        {/* Global Ticket Log */}
       <div className="glass-panel rounded-2xl p-6">
           <h2 className="text-xl font-bold mb-4 text-white">Recent Ticket Activity</h2>
           <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-slate-400">
                   <thead className="text-xs uppercase bg-white/5 text-slate-200">
                       <tr>
                           <th className="px-4 py-3">Ticket ID</th>
                           <th className="px-4 py-3">User</th>
                           <th className="px-4 py-3">Numbers</th>
                           <th className="px-4 py-3">Status</th>
                           <th className="px-4 py-3">Win</th>
                       </tr>
                   </thead>
                   <tbody>
                       {allTickets.slice(0, 10).map(t => (
                           <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                               <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                               <td className="px-4 py-3">{t.userId}</td>
                               <td className="px-4 py-3">
                                   <div className="flex gap-1">
                                       {t.numbers.map(n => <span key={n} className="text-xs">{n}</span>)}
                                   </div>
                               </td>
                               <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-xs ${t.status === 'WON' ? 'bg-green-900 text-green-300' : 'bg-slate-700'}`}>
                                       {t.status}
                                   </span>
                               </td>
                               <td className="px-4 py-3 text-white">
                                   {t.winAmount ? `$${t.winAmount}` : '-'}
                                </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>

    </div>
  );
};