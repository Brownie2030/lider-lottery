import { User, Ticket, Draw, UserRole, LOTTERY_CONFIG } from "../types";

// Mock DB structure in LocalStorage keys:
// 'nl_users': User[]
// 'nl_tickets': Ticket[]
// 'nl_draws': Draw[]
// 'nl_session': User | null

const INITIAL_JACKPOT = 1000000;

export const initializeState = () => {
  if (!localStorage.getItem('nl_users')) {
    const admin: User = { id: 'admin1', username: 'admin', role: UserRole.ADMIN, balance: 999999 };
    const demoUser: User = { id: 'user1', username: 'player', role: UserRole.USER, balance: 100 };
    localStorage.setItem('nl_users', JSON.stringify([admin, demoUser]));
  }
  
  if (!localStorage.getItem('nl_draws')) {
    const initialDraw: Draw = {
      id: 'draw_' + Date.now(),
      drawDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: 'OPEN',
      winningNumbers: null,
      jackpot: INITIAL_JACKPOT,
      totalTicketsSold: 0
    };
    localStorage.setItem('nl_draws', JSON.stringify([initialDraw]));
  }

  if (!localStorage.getItem('nl_tickets')) {
    localStorage.setItem('nl_tickets', JSON.stringify([]));
  }
};

export const login = (username: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem('nl_users') || '[]');
  const user = users.find(u => u.username === username);
  if (user) {
    localStorage.setItem('nl_session', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('nl_session');
};

export const getSession = (): User | null => {
  const session = localStorage.getItem('nl_session');
  return session ? JSON.parse(session) : null;
};

export const getCurrentDraw = (): Draw => {
  const draws: Draw[] = JSON.parse(localStorage.getItem('nl_draws') || '[]');
  // Return the last open draw or the most recent one
  return draws.find(d => d.status === 'OPEN') || draws[draws.length - 1];
};

export const getDrawHistory = (): Draw[] => {
    return JSON.parse(localStorage.getItem('nl_draws') || '[]').reverse();
}

export const getUserTickets = (userId: string): Ticket[] => {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('nl_tickets') || '[]');
  return tickets.filter(t => t.userId === userId).reverse();
};

export const buyTicket = (userId: string, numbers: number[]): { success: boolean, message: string } => {
  const users: User[] = JSON.parse(localStorage.getItem('nl_users') || '[]');
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return { success: false, message: 'User not found' };
  
  if (users[userIndex].balance < LOTTERY_CONFIG.ticketPrice) {
    return { success: false, message: 'Insufficient funds' };
  }

  const currentDraw = getCurrentDraw();
  if (currentDraw.status !== 'OPEN') return { success: false, message: 'Draw is closed' };

  // Deduct balance
  users[userIndex].balance -= LOTTERY_CONFIG.ticketPrice;
  localStorage.setItem('nl_users', JSON.stringify(users));
  
  // Update Session
  localStorage.setItem('nl_session', JSON.stringify(users[userIndex]));

  // Create Ticket
  const newTicket: Ticket = {
    id: 'tkt_' + Date.now() + Math.random().toString(36).substr(2, 5),
    userId,
    drawId: currentDraw.id,
    numbers,
    purchaseDate: new Date().toISOString(),
    status: 'PENDING'
  };

  const tickets: Ticket[] = JSON.parse(localStorage.getItem('nl_tickets') || '[]');
  tickets.push(newTicket);
  localStorage.setItem('nl_tickets', JSON.stringify(tickets));

  // Update Draw Pot (Simple logic: add ticket price to jackpot for simulation)
  const draws: Draw[] = JSON.parse(localStorage.getItem('nl_draws') || '[]');
  const drawIndex = draws.findIndex(d => d.id === currentDraw.id);
  if (drawIndex !== -1) {
      draws[drawIndex].jackpot += (LOTTERY_CONFIG.ticketPrice * 0.5); // 50% goes to pot
      draws[drawIndex].totalTicketsSold += 1;
      localStorage.setItem('nl_draws', JSON.stringify(draws));
  }

  return { success: true, message: 'Ticket purchased successfully!' };
};

export const performDraw = (drawId: string): Draw => {
  const draws: Draw[] = JSON.parse(localStorage.getItem('nl_draws') || '[]');
  const drawIndex = draws.findIndex(d => d.id === drawId);
  
  if (drawIndex === -1 || draws[drawIndex].status === 'COMPLETED') {
    throw new Error("Invalid draw or already completed");
  }

  // Generate Winning Numbers
  const winningNumbers: number[] = [];
  while(winningNumbers.length < LOTTERY_CONFIG.selectionCount) {
    const n = Math.floor(Math.random() * LOTTERY_CONFIG.maxNumber) + 1;
    if(!winningNumbers.includes(n)) winningNumbers.push(n);
  }
  winningNumbers.sort((a,b) => a-b);

  draws[drawIndex].winningNumbers = winningNumbers;
  draws[drawIndex].status = 'COMPLETED';
  
  // Check Winners
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('nl_tickets') || '[]');
  const updatedTickets = tickets.map(ticket => {
    if (ticket.drawId === drawId && ticket.status === 'PENDING') {
      const matchCount = ticket.numbers.filter(n => winningNumbers.includes(n)).length;
      let winAmount = 0;
      let status: 'WON' | 'LOST' = 'LOST';

      if (matchCount === 5) {
        winAmount = draws[drawIndex].jackpot;
        status = 'WON';
      } else if (matchCount === 4) {
        winAmount = 5000;
        status = 'WON';
      } else if (matchCount === 3) {
        winAmount = 50;
        status = 'WON';
      }

      // Credit User
      if (winAmount > 0) {
        const users: User[] = JSON.parse(localStorage.getItem('nl_users') || '[]');
        const uIdx = users.findIndex(u => u.id === ticket.userId);
        if (uIdx !== -1) {
          users[uIdx].balance += winAmount;
          localStorage.setItem('nl_users', JSON.stringify(users));
          // Refresh session if it's the current user
          const currentSession = getSession();
          if (currentSession && currentSession.id === ticket.userId) {
             localStorage.setItem('nl_session', JSON.stringify(users[uIdx]));
          }
        }
      }

      return { ...ticket, status, winAmount, matchCount };
    }
    return ticket;
  });
  
  localStorage.setItem('nl_tickets', JSON.stringify(updatedTickets));
  localStorage.setItem('nl_draws', JSON.stringify(draws));

  // Create Next Draw
  const newDraw: Draw = {
      id: 'draw_' + Date.now(),
      drawDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'OPEN',
      winningNumbers: null,
      jackpot: INITIAL_JACKPOT,
      totalTicketsSold: 0
  };
  draws.unshift(newDraw); // Add to front if sorting by recent? No, append. 
  // Actually, let's just append and handle sorting in retrieval.
  // Correction: performDraw updates draws array in place, so we push new one.
  draws.push(newDraw);
  localStorage.setItem('nl_draws', JSON.stringify(draws));

  return draws[drawIndex];
};

export const getAllTickets = (): Ticket[] => {
    return JSON.parse(localStorage.getItem('nl_tickets') || '[]').reverse();
};