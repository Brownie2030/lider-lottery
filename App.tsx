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
    setCurrentPage(loggedInUser.role === UserRole.ADMIN ? 'admin' : 'dashboard');
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
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user && user.role === UserRole.USER 
          ? <UserDashboard user={user} refreshUser={handleRefreshUser} /> 
          : <div className="text-center mt-20 text-red-500">Access Denied. Please login.</div>;
      case 'admin':
        return user && user.role === UserRole.ADMIN 
          ? <AdminDashboard user={user} /> 
          : <div className="text-center mt-20 text-red-500">Access Denied. Admin only.</div>;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-purple-500 selection:text-white">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={(page) => {
            // Guard clauses for direct navigation
            if(page === 'dashboard' && (!user || user.role !== UserRole.USER)) return;
            if(page === 'admin' && (!user || user.role !== UserRole.ADMIN)) return;
            setCurrentPage(page);
        }} 
      />
      <main className="pb-20">
        {renderPage()}
      </main>
      
      <footer className="fixed bottom-0 w-full py-4 bg-black/40 backdrop-blur-md text-center text-xs text-slate-600 border-t border-white/5">
        <p>&copy; 2024 Nebula Lotto. Simulated Gambling Environment. No real money involved.</p>
      </footer>
    </div>
  );
}

export default App;