export type Currency = 'EUR' | 'CHF' | 'CNY';

export type UserRole = 'admin' | 'subAdmin' | 'user';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: UserRole;
  password?: string; // 仅用于管理员
}

export interface Expense {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  currency: Currency;
  paidBy: string; // user id
  sharedBy: string[]; // user ids
  category?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ExchangeRate {
  EUR: number;
  CHF: number;
  CNY: number;
  base: Currency;
  date: string;
}

export interface Settlement {
  from: string; // user id
  to: string; // user id
  amount: number;
  currency: Currency;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
}

