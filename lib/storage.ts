import { Expense, User, UserRole } from '@/types';
import {
  getUsersFromDB,
  saveUsersToDB,
  deleteUserFromDB,
  getExpensesFromDB,
  saveExpensesToDB,
  addExpenseToDB,
  updateExpenseInDB,
  deleteExpenseFromDB,
  getPhotosFromDB,
  savePhotosToDB,
  addPhotoToDB,
  deletePhotoFromDB,
  Photo,
} from './database';

// 简单的本地存储管理（作为缓存和离线支持）
const STORAGE_KEYS = {
  USERS: 'ski_expense_users',
  EXPENSES: 'ski_expense_expenses',
  PHOTOS: 'ski_photos',
  LAST_SYNC: 'ski_expense_last_sync',
};

// 检查是否配置了数据库
function hasDatabase(): boolean {
  if (typeof window === 'undefined') {
    // 服务端检查
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }
  // 客户端检查（从window对象获取，因为环境变量在客户端需要NEXT_PUBLIC_前缀）
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// 同步数据到数据库
async function syncToDatabase(users: User[], expenses: Expense[], photos?: Photo[]): Promise<boolean> {
  if (!hasDatabase()) {
    // 如果没有配置数据库，返回false但不报错
    return false;
  }

  try {
    const photosToSync = photos || getPhotosSync();
    console.log('Syncing to database:', { usersCount: users.length, expensesCount: expenses.length, photosCount: photosToSync.length });
    const [usersSuccess, expensesSuccess, photosSuccess] = await Promise.all([
      saveUsersToDB(users),
      saveExpensesToDB(expenses),
      savePhotosToDB(photosToSync),
    ]);
    
    if (usersSuccess && expensesSuccess && photosSuccess) {
      // 同时更新本地缓存
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      if (photosToSync.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photosToSync));
      }
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
      console.log('Successfully synced to database');
      return true;
    }
    console.warn('Partial sync success:', { usersSuccess, expensesSuccess, photosSuccess });
    return false;
  } catch (error) {
    console.error('Failed to sync to database:', error);
    return false;
  }
}

// 从数据库同步数据
async function syncFromDatabase(): Promise<{ users: User[]; expenses: Expense[]; photos: Photo[] } | null> {
  if (!hasDatabase()) {
    return null;
  }

  try {
    console.log('Syncing from database...');
    const [users, expenses, photos] = await Promise.all([
      getUsersFromDB(),
      getExpensesFromDB(),
      getPhotosFromDB(),
    ]);

    console.log('Fetched from database:', { usersCount: users.length, expensesCount: expenses.length, photosCount: photos.length });

    // 更新本地缓存
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

    return { users, expenses, photos };
  } catch (error) {
    console.error('Failed to sync from database:', error);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  if (typeof window === 'undefined') return [];
  
  // 先尝试从数据库同步
  if (hasDatabase()) {
    try {
      // 设置超时，避免长时间等待
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 5000); // 5秒超时
      });
      
      const dbDataPromise = syncFromDatabase();
      const dbData = await Promise.race([dbDataPromise, timeoutPromise]);
      
      if (dbData) {
        // 如果数据库有数据，使用数据库数据
        if (dbData.users.length > 0 || dbData.expenses.length > 0 || dbData.photos.length > 0) {
          console.log('从数据库获取用户列表:', dbData.users.length);
          return dbData.users;
        }
        // 如果数据库是空的，检查本地是否有数据需要上传
        const localUsers = getUsersSync();
        const localExpenses = getExpensesSync();
        const localPhotos = getPhotosSync();
        if (localUsers.length > 0 || localExpenses.length > 0 || localPhotos.length > 0) {
          // 本地有数据，上传到数据库（异步，不阻塞）
          syncToDatabase(localUsers, localExpenses, localPhotos).catch(console.error);
          console.log('使用本地用户列表并上传到数据库:', localUsers.length);
          return localUsers;
        }
        // 数据库和本地都为空，返回空数组
        console.log('数据库和本地都没有用户数据');
        return [];
      } else {
        // 同步超时或失败，使用本地数据
        console.warn('数据库同步超时或失败，使用本地数据');
      }
    } catch (error) {
      console.error('Failed to sync from database, using local data:', error);
    }
  }
  
  // 如果数据库不可用或同步失败，使用本地缓存数据
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  const localUsers = data ? JSON.parse(data) : [];
  console.log('使用本地存储的用户列表:', localUsers.length);
  return localUsers;
}

export function getUsersSync(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export async function saveUsers(users: User[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // 异步同步到数据库（不阻塞）
  const expenses = getExpensesSync();
  const photos = getPhotosSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export function saveUsersSync(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  // 异步同步到数据库
  const expenses = getExpensesSync();
  const photos = getPhotosSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export async function deleteUser(id: string): Promise<void> {
  // 先尝试从数据库删除
  if (hasDatabase()) {
    const success = await deleteUserFromDB(id);
    if (success) {
      // 数据库删除成功，更新本地缓存
      const users = getUsersSync();
      const filtered = users.filter(u => u.id !== id);
      saveUsersSync(filtered);
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
  const users = await getUsers();
  await saveUsers(users.filter(u => u.id !== id));
}

export function deleteUserSync(id: string): void {
  const users = getUsersSync();
  const filtered = users.filter(u => u.id !== id);
  saveUsersSync(filtered);
  // 异步同步到数据库
  const expenses = getExpensesSync();
  const photos = getPhotosSync();
  syncToDatabase(filtered, expenses, photos).catch(console.error);
  
  // 同时尝试从数据库删除
  if (hasDatabase()) {
    deleteUserFromDB(id).catch(console.error);
  }
}

export async function getExpenses(): Promise<Expense[]> {
  if (typeof window === 'undefined') return [];
  
  // 先尝试从数据库同步
  if (hasDatabase()) {
    try {
      const dbData = await syncFromDatabase();
      if (dbData) {
        // 如果数据库有数据，使用数据库数据
        if (dbData.users.length > 0 || dbData.expenses.length > 0) {
          return dbData.expenses;
        }
        // 如果数据库是空的，检查本地是否有数据需要上传
        const localUsers = getUsersSync();
        const localExpenses = getExpensesSync();
        const localPhotos = getPhotosSync();
        if (localUsers.length > 0 || localExpenses.length > 0 || localPhotos.length > 0) {
          // 本地有数据，上传到数据库
          await syncToDatabase(localUsers, localExpenses, localPhotos);
          return localExpenses;
        }
      }
    } catch (error) {
      console.error('Failed to sync from database, using local data:', error);
    }
  }
  
  // 如果数据库不可用或同步失败，使用本地缓存数据
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
  // 异步同步到数据库（不阻塞）
  const users = getUsersSync();
  const photos = getPhotosSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export function saveExpensesSync(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  // 异步同步到数据库
  const users = getUsersSync();
  const photos = getPhotosSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export async function addExpense(expense: Expense): Promise<void> {
  // 先尝试直接添加到数据库
  if (hasDatabase()) {
    const success = await addExpenseToDB(expense);
    if (success) {
      // 数据库添加成功，更新本地缓存
      const expenses = getExpensesSync();
      expenses.push(expense);
      saveExpensesSync(expenses);
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
  const expenses = await getExpenses();
  expenses.push(expense);
  await saveExpenses(expenses);
}

export function addExpenseSync(expense: Expense): void {
  const expenses = getExpensesSync();
  expenses.push(expense);
  saveExpensesSync(expenses);
  // 异步同步到数据库
  const users = getUsersSync();
  const photos = getPhotosSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
  
  // 同时尝试直接添加到数据库
  if (hasDatabase()) {
    addExpenseToDB(expense).catch(console.error);
  }
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
  // 先尝试直接更新数据库
  if (hasDatabase()) {
    const success = await updateExpenseInDB(id, updates);
    if (success) {
      // 数据库更新成功，更新本地缓存
      const expenses = getExpensesSync();
      const index = expenses.findIndex(e => e.id === id);
      if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updates };
        saveExpensesSync(expenses);
      }
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
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
    // 异步同步到数据库
    const users = getUsersSync();
    const photos = getPhotosSync();
    syncToDatabase(users, expenses, photos).catch(console.error);
    
    // 同时尝试直接更新数据库
    if (hasDatabase()) {
      updateExpenseInDB(id, updates).catch(console.error);
    }
  }
}

export async function deleteExpense(id: string): Promise<void> {
  // 先尝试从数据库删除
  if (hasDatabase()) {
    const success = await deleteExpenseFromDB(id);
    if (success) {
      // 数据库删除成功，更新本地缓存
      const expenses = getExpensesSync();
      const filtered = expenses.filter(e => e.id !== id);
      saveExpensesSync(filtered);
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
  const expenses = await getExpenses();
  await saveExpenses(expenses.filter(e => e.id !== id));
}

export function deleteExpenseSync(id: string): void {
  const expenses = getExpensesSync();
  const filtered = expenses.filter(e => e.id !== id);
  saveExpensesSync(filtered);
  // 异步同步到数据库
  const users = getUsersSync();
  const photos = getPhotosSync();
  syncToDatabase(users, filtered, photos).catch(console.error);
  
  // 同时尝试从数据库删除
  if (hasDatabase()) {
    deleteExpenseFromDB(id).catch(console.error);
  }
}

// 照片同步函数
export async function getPhotos(): Promise<Photo[]> {
  if (typeof window === 'undefined') return [];
  
  // 先尝试从数据库同步
  if (hasDatabase()) {
    try {
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 5000);
      });
      
      const dbDataPromise = syncFromDatabase();
      const dbData = await Promise.race([dbDataPromise, timeoutPromise]);
      
      if (dbData && dbData.photos.length > 0) {
        console.log('从数据库获取照片列表:', dbData.photos.length);
        return dbData.photos;
      }
    } catch (error) {
      console.error('Failed to sync photos from database, using local data:', error);
    }
  }
  
  // 如果数据库不可用或同步失败，使用本地缓存数据
  const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
  const localPhotos = data ? JSON.parse(data) : [];
  console.log('使用本地存储的照片列表:', localPhotos.length);
  return localPhotos;
}

export function getPhotosSync(): Photo[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
  return data ? JSON.parse(data) : [];
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  // 异步同步到数据库
  const users = getUsersSync();
  const expenses = getExpensesSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export function savePhotosSync(photos: Photo[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  // 异步同步到数据库
  const users = getUsersSync();
  const expenses = getExpensesSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
}

export async function addPhoto(photo: Photo): Promise<void> {
  // 先尝试直接添加到数据库
  if (hasDatabase()) {
    const success = await addPhotoToDB(photo);
    if (success) {
      // 数据库添加成功，更新本地缓存
      const photos = getPhotosSync();
      photos.push(photo);
      savePhotosSync(photos);
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
  const photos = await getPhotos();
  photos.push(photo);
  await savePhotos(photos);
}

export function addPhotoSync(photo: Photo): void {
  const photos = getPhotosSync();
  photos.push(photo);
  savePhotosSync(photos);
  // 异步同步到数据库
  const users = getUsersSync();
  const expenses = getExpensesSync();
  syncToDatabase(users, expenses, photos).catch(console.error);
  
  // 同时尝试直接添加到数据库
  if (hasDatabase()) {
    addPhotoToDB(photo).catch(console.error);
  }
}

export async function deletePhoto(id: string): Promise<void> {
  // 先尝试从数据库删除
  if (hasDatabase()) {
    const success = await deletePhotoFromDB(id);
    if (success) {
      // 数据库删除成功，更新本地缓存
      const photos = getPhotosSync();
      const filtered = photos.filter(p => p.id !== id);
      savePhotosSync(filtered);
      return;
    }
  }
  
  // 如果数据库不可用，使用本地存储
  const photos = await getPhotos();
  await savePhotos(photos.filter(p => p.id !== id));
}

export function deletePhotoSync(id: string): void {
  const photos = getPhotosSync();
  const filtered = photos.filter(p => p.id !== id);
  savePhotosSync(filtered);
  // 异步同步到数据库
  const users = getUsersSync();
  const expenses = getExpensesSync();
  syncToDatabase(users, expenses, filtered).catch(console.error);
  
  // 同时尝试从数据库删除
  if (hasDatabase()) {
    deletePhotoFromDB(id).catch(console.error);
  }
}


