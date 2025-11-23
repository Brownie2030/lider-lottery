import React, { useState } from 'react';
import { login } from '../services/lotteryState';
import { User } from '../types';

interface LoginProps {
  mode: 'USER' | 'ADMIN';
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ mode, onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'ADMIN') {
        if (username === 'admin' && password === 'admin') {
            const user = login('admin');
            if(user) onLogin(user);
            else setError('Admin account error');
        } else {
            setError('Invalid Admin Credentials (try admin/admin)');
        }
    } else {
        if (username.length > 2) {
            let user = login(username);
            if (!user) {
                 if(username === 'player') {
                     user = login('player');
                     if(user) onLogin(user);
                 } else {
                     setError("For demo, try username: 'player'");
                 }
            } else {
                onLogin(user);
            }
        } else {
            setError('Username must be at least 3 characters');
        }
    }
  };

  const isAdmin = mode === 'ADMIN';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Background decoration dependent on mode */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${isAdmin ? 'bg-red-900/10' : 'bg-transparent'}`}></div>

      <div className={`w-full max-w-md glass-panel p-10 rounded-3xl shadow-2xl relative border ${isAdmin ? 'border-red-500/20' : 'border-white/10'}`}>
        
        <div className="mb-10 text-center">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg ${
                isAdmin ? 'bg-gradient-to-br from-red-600 to-rose-900 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            }`}>
                {isAdmin ? '🛡️' : '🎲'}
            </div>
            <h2 className="text-3xl font-display font-bold mb-2 tracking-tight">
                {isAdmin ? 'System Access' : 'Player Portal'}
            </h2>
            <p className="text-slate-400 text-sm">
                {isAdmin ? 'Authorized personnel only.' : 'Welcome back to Nebula Lotto.'}
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                    {isAdmin ? 'Admin ID' : 'Username'}
                </label>
                <div className="relative group">
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full glass-input rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none transition-all ${isAdmin ? 'focus:border-red-500' : 'focus:border-purple-500'}`}
                        placeholder={isAdmin ? "Enter admin ID" : "Enter username"}
                    />
                </div>
            </div>
            
            {(isAdmin || mode === 'USER') && (
               // Simple text field for user 'password' simulation if needed, but for 'player' demo just username is enough.
               // However, for consistency let's hide password for USER in this specific demo unless strictly needed.
               // The prompt implies "login pages", usually implies password.
               // existing logic only checked password for admin. I'll render password field only for Admin to keep it simple as per original logic, 
               // OR add a dummy password field for user for "look and feel".
               isAdmin && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Security Key</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                         className={`w-full glass-input rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none transition-all ${isAdmin ? 'focus:border-red-500' : 'focus:border-purple-500'}`}
                        placeholder="••••••••"
                    />
                </div>
               )
            )}

            {error && (
                <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${isAdmin ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <button 
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl ${
                    isAdmin 
                    ? 'bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 shadow-red-900/20' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-purple-900/20'
                }`}
            >
                {isAdmin ? 'AUTHENTICATE' : 'ENTER LOTTO'}
            </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button 
                onClick={() => onNavigate('home')} 
                className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
                Return to Lobby
            </button>
        </div>
      </div>
    </div>
  );
};