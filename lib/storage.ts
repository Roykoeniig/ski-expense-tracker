import { Expense, User, UserRole } from '@/types';

// 简单的本地存储管理（实际应用中应该使用数据库）
const STORAGE_KEYS = {
  USERS: 'ski_expense_users',
  EXPENSES: 'ski_expense_expenses',
};

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export function addExpense(expense: Expense): void {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
}

export function updateExpense(id: string, updates: Partial<Expense>): void {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    saveExpenses(expenses);
  }
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  saveExpenses(expenses.filter(e => e.id !== id));
}

