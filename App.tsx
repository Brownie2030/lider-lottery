import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { initializeState, getSession, logout } from './services/lotteryState';
import { User, UserRole } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeState();
    const session = getSession();
    if (session) {
      setUser(session);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage(loggedInUser.role === UserRole.ADMIN ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('home');
  };

  const handleRefreshUser = () => {
      const session = getSession();
      if(session) setUser(session);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'login':
        // Separate login page for regular users
        return <Login mode="USER" onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin-login':
        // Separate login page for admins
        return <Login mode="ADMIN" onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user && user.role === UserRole.USER 
          ? <UserDashboard user={user} refreshUser={handleRefreshUser} /> 
          : <Login mode="USER" onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return user && user.role === UserRole.ADMIN 
          ? <AdminDashboard user={user} /> 
          : <Login mode="ADMIN" onLogin={handleLogin} onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-purple-500 selection:text-white flex flex-col">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage}
      />
      <main className="flex-grow pb-20 pt-4">
        {renderPage()}
      </main>
      
      <footer className="w-full py-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-xs text-slate-500 mb-2">
            &copy; 2024 Nebula Lotto System. Secure. Provably Fair.
        </p>
        {!user && (
            <button 
                onClick={() => setCurrentPage('admin-login')}
                className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors uppercase tracking-widest"
            >
                Staff Portal
            </button>
        )}
      </footer>
    </div>
  );
}

export default App;