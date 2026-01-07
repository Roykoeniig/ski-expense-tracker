import { Expense, User, UserRole } from '@/types';

// 简单的本地存储管理（实际应用中应该使用数据库）
const STORAGE_KEYS = {
  USERS: 'ski_expense_users',
  EXPENSES: 'ski_expense_expenses',
  LAST_SYNC: 'ski_expense_last_sync',
};

// 同步数据到服务器
async function syncToServer(users: User[], expenses: Expense[]): Promise<boolean> {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users, expenses }),
    });
    
    if (response.ok) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to sync to server:', error);
    return false;
  }
}

// 从服务器同步数据
async function syncFromServer(): Promise<{ users: User[]; expenses: Expense[] } | null> {
  try {
    const response = await fetch('/api/sync');
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          users: data.users || [],
          expenses: data.expenses || [],
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to sync from server:', error);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  if (typeof window === 'undefined') return [];
  
  // 先尝试从服务器同步
  const serverData = await syncFromServer();
  if (serverData && serverData.users.length > 0) {
    // 如果服务器有数据，使用服务器数据并更新本地
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(serverData.users));
    return serverData.users;
  }
  
  // 否则使用本地数据
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function getUsersSync(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export async function saveUsers(users: User[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // 异步同步到服务器（不阻塞）
  syncToServer(users, getExpensesSync()).catch(console.error);
}

export function saveUsersSync(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export async function getExpenses(): Promise<Expense[]> {
  if (typeof window === 'undefined') return [];
  
  // 先尝试从服务器同步
  const serverData = await syncFromServer();
  if (serverData && serverData.expenses.length > 0) {
    // 如果服务器有数据，使用服务器数据并更新本地
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(serverData.expenses));
    return serverData.expenses;
  }
  
  // 否则使用本地数据
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
}

export function getExpensesSync(): Expense[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  // 异步同步到服务器（不阻塞）
  syncToServer(getUsersSync(), expenses).catch(console.error);
}

export function saveExpensesSync(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export async function addExpense(expense: Expense): Promise<void> {
  const expenses = await getExpenses();
  expenses.push(expense);
  await saveExpenses(expenses);
}

export function addExpenseSync(expense: Expense): void {
  const expenses = getExpensesSync();
  expenses.push(expense);
  saveExpensesSync(expenses);
  // 异步同步到服务器
  syncToServer(getUsersSync(), expenses).catch(console.error);
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  const expenses = await getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    await saveExpenses(expenses);
  }
}

export function updateExpenseSync(id: string, updates: Partial<Expense>): void {
  const expenses = getExpensesSync();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    saveExpensesSync(expenses);
    // 异步同步到服务器
    syncToServer(getUsersSync(), expenses).catch(console.error);
  }
}

export async function deleteExpense(id: string): Promise<void> {
  const expenses = await getExpenses();
  await saveExpenses(expenses.filter(e => e.id !== id));
}

export function deleteExpenseSync(id: string): void {
  const expenses = getExpensesSync();
  const filtered = expenses.filter(e => e.id !== id);
  saveExpensesSync(filtered);
  // 异步同步到服务器
  syncToServer(getUsersSync(), filtered).catch(console.error);
}

