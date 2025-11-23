import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-white/10 shadow-lg shadow-purple-900/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-full h-full bg-slate-900 rounded-lg flex items-center justify-center border border-white/20">
                <span className="font-display font-black text-white text-sm tracking-tighter">NL</span>
              </div>
          </div>
          <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-purple-200 transition-colors">
                  NEBULA
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-yellow-500 -mt-1">
                  SYSTEMS
              </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-white tracking-wide">{user.username}</span>
                <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-400/10 px-2 rounded-full border border-yellow-400/20">
                    ${user.balance.toLocaleString()}
                </span>
              </div>
              
              {user.role === UserRole.ADMIN && (
                <button 
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hidden md:block text-sm font-semibold text-rose-400 hover:text-white transition-colors"
                >
                  Control Panel
                </button>
              )}
               {user.role === UserRole.USER && (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="hidden md:block text-sm font-semibold text-indigo-300 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              )}

              <button 
                onClick={onLogout}
                className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-all hover:border-red-500/50 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <button 
                onClick={() => onNavigate('login')}
                className="group relative px-6 py-2.5 rounded-full overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105"></div>
                 <span className="relative font-bold text-sm text-white flex items-center gap-2">
                    PLAYER LOGIN
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};