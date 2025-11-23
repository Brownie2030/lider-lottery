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
    if (!window.confirm("⚠️ SECURITY WARNING\n\nInitiating the draw will finalize all bets and distribute prizes. This action is irreversible.\n\nProceed?")) return;

    setDrawing(true);
    setTimeout(() => {
        try {
            performDraw(currentDraw.id);
            refreshData();
        } catch (e) {
            alert("Error performing draw");
        }
        setDrawing(false);
    }, 3000);
  };

  if (!currentDraw) return <div className="text-white">Initializing Admin Protocol...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">CONTROL CENTER</h1>
            <p className="text-slate-500 text-xs font-mono mt-1">SYSTEM STATUS: <span className="text-green-400">ONLINE</span> // ID: {user.username}</p>
        </div>
        <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded border border-red-500/20 text-xs font-mono animate-pulse">
            ● ADMINISTRATOR PRIVILEGES
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Draw Control */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-2xl border-t-4 border-red-500 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z" /></svg>
            </div>

            <div>
                <h2 className="text-lg font-bold mb-6 text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    ACTIVE SESSION
                </h2>
                
                <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-slate-500">SESSION ID</span>
                        <span className="text-white">{currentDraw.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-slate-500">STATE</span>
                        <span className="text-green-400 font-bold tracking-wider">{currentDraw.status}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-slate-500">POOL</span>
                        <span className="text-yellow-400 font-bold">${currentDraw.jackpot.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-slate-500">VOLUME</span>
                        <span className="text-white">{currentDraw.totalTicketsSold} TIX</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleDraw}
                disabled={drawing || currentDraw.status !== 'OPEN'}
                className={`w-full mt-8 py-5 rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg transition-all relative overflow-hidden group
                    ${drawing 
                        ? 'bg-slate-800 text-slate-500 cursor-wait' 
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'}
                `}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <span className="relative flex items-center justify-center gap-3">
                    {drawing ? (
                         <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            EXECUTING SEQUENCE...
                         </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            INITIATE DRAW
                        </>
                    )}
                </span>
            </button>
        </div>

        {/* Stats & Logs */}
        <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                 <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-500">
                     <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Gross Revenue</span>
                     <div className="text-2xl font-mono font-bold text-white mt-1">${(allTickets.length * 5).toLocaleString()}</div>
                 </div>
                 <div className="glass-panel p-6 rounded-2xl border-l-4 border-orange-500">
                     <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total Liability</span>
                     <div className="text-2xl font-mono font-bold text-white mt-1">
                         ${allTickets.reduce((acc, t) => acc + (t.winAmount || 0), 0).toLocaleString()}
                     </div>
                 </div>
             </div>

             <div className="glass-panel p-6 rounded-2xl">
                 <h3 className="text-slate-400 text-xs uppercase font-bold mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                     Draw History Log
                 </h3>
                 <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                     {history.slice(1).map(h => (
                         <div key={h.id} className="flex justify-between items-center text-xs bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
                             <div className="flex flex-col">
                                <span className="text-slate-300 font-mono">{h.id}</span>
                                <span className="text-[10px] text-slate-500">{new Date(h.drawDate).toLocaleString()}</span>
                             </div>
                             <div className="flex gap-1.5">
                                 {h.winningNumbers?.map(n => (
                                     <span key={n} className="w-6 h-6 bg-black/40 rounded-full flex items-center justify-center font-bold text-blue-300 border border-blue-500/20">{n}</span>
                                 ))}
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

      </div>

        {/* Global Ticket Log */}
       <div className="glass-panel rounded-2xl p-6 overflow-hidden">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Live Transaction Feed</h2>
           <div className="overflow-x-auto">
               <table className="w-full text-left text-slate-400">
                   <thead className="text-[10px] uppercase bg-black/20 text-slate-500">
                       <tr>
                           <th className="px-4 py-3 rounded-l-lg">Ticket REF</th>
                           <th className="px-4 py-3">User</th>
                           <th className="px-4 py-3">Selection</th>
                           <th className="px-4 py-3">State</th>
                           <th className="px-4 py-3 rounded-r-lg text-right">Payout</th>
                       </tr>
                   </thead>
                   <tbody className="text-xs font-mono">
                       {allTickets.slice(0, 8).map(t => (
                           <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                               <td className="px-4 py-3 text-slate-300">{t.id}</td>
                               <td className="px-4 py-3 text-purple-300">{t.userId}</td>
                               <td className="px-4 py-3">
                                   <div className="flex gap-1">
                                       {t.numbers.map(n => <span key={n} className="text-slate-400">{n}</span>)}
                                   </div>
                               </td>
                               <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                       t.status === 'WON' ? 'bg-green-500/20 text-green-400' : 
                                       t.status === 'LOST' ? 'bg-red-500/10 text-red-500' : 
                                       'bg-yellow-500/10 text-yellow-500'
                                   }`}>
                                       {t.status}
                                   </span>
                               </td>
                               <td className="px-4 py-3 text-right text-white font-bold">
                                   {t.winAmount ? `$${t.winAmount.toLocaleString()}` : '-'}
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