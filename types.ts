export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  balance: number;
}

export interface Ticket {
  id: string;
  userId: string;
  drawId: string;
  numbers: number[]; // Array of 5 numbers
  purchaseDate: string;
  status: 'PENDING' | 'WON' | 'LOST';
  winAmount?: number;
  matchCount?: number;
}

export interface Draw {
  id: string;
  drawDate: string;
  status: 'OPEN' | 'COMPLETED';
  winningNumbers: number[] | null;
  jackpot: number;
  totalTicketsSold: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const LOTTERY_CONFIG = {
  minNumber: 1,
  maxNumber: 50,
  selectionCount: 5,
  ticketPrice: 5,
};