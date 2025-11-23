import React, { useState } from 'react';
import { login } from '../services/lotteryState';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'USER' | 'ADMIN'>('USER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock validation
    // In a real app, this would be a secure API call
    if (activeTab === 'ADMIN') {
        if (username === 'admin' && password === 'admin') {
            const user = login('admin');
            if(user) onLogin(user);
            else setError('Admin account error');
        } else {
            setError('Invalid Admin Credentials (try admin/admin)');
        }
    } else {
        // Allow any login for 'player' demo or register new mock
        if (username.length > 2) {
            let user = login(username);
            if (!user) {
                // Auto-register for demo purposes if not found
                 // NOTE: In a real app, this is separate. Here we simplify.
                 // We will fail if not 'player' for simplicity of the prompt instructions requiring separate logins? 
                 // Let's just allow 'player' as the main demo user defined in services.
                 if(username === 'player') {
                     user = login('player');
                     if(user) onLogin(user);
                 } else {
                     setError("Demo User: try 'player'");
                 }
            } else {
                onLogin(user);
            }
        } else {
            setError('Username too short');
        }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl relative">
        
        {/* Tab Switcher */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-8">
            <button 
                onClick={() => setActiveTab('USER')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'USER' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                PLAYER LOGIN
            </button>
            <button 
                onClick={() => setActiveTab('ADMIN')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                ADMIN PANEL
            </button>
        </div>

        <h2 className="text-2xl font-display font-bold text-center mb-2">
            {activeTab === 'USER' ? 'Welcome Back, Winner' : 'System Administration'}
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
            {activeTab === 'USER' ? 'Enter your details to access your tickets.' : 'Secure access only.'}
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder={activeTab === 'USER' ? "Try 'player'" : "Try 'admin'"}
                />
            </div>
            
            {activeTab === 'ADMIN' && (
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Try 'admin'"
                    />
                </div>
            )}

            {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}

            <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/20"
            >
                {activeTab === 'USER' ? 'LOGIN' : 'ACCESS DASHBOARD'}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={() => onNavigate('home')} className="text-slate-500 text-sm hover:text-white">Back to Home</button>
        </div>

      </div>
    </div>
  );
};