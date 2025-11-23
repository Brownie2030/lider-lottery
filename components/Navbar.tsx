import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10">
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => onNavigate('home')}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="font-display font-bold text-black text-xs">NL</span>
        </div>
        <span className="font-display font-bold text-2xl tracking-wider text-white">NEBULA<span className="text-yellow-400">LOTTO</span></span>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-sm font-semibold text-white">{user.username}</span>
              <span className="text-xs text-yellow-400 font-mono">${user.balance.toLocaleString()} CR</span>
            </div>
            
            {user.role === UserRole.ADMIN && (
              <button 
                onClick={() => onNavigate('admin')}
                className="text-sm font-semibold text-purple-300 hover:text-white transition-colors"
              >
                Admin Panel
              </button>
            )}
             {user.role === UserRole.USER && (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-sm font-semibold text-blue-300 hover:text-white transition-colors"
              >
                My Tickets
              </button>
            )}

            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="space-x-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/20"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};