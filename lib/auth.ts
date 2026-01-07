import { User, UserRole } from '@/types';
import { saveUsersSync, getUsersSync } from '@/lib/storage';

// 主管理员初始账户
const MAIN_ADMIN = {
  id: 'main-admin',
  name: '舜',
  password: '20021025wrsETH',
  role: 'admin' as UserRole,
};

// 从localStorage获取当前登录用户
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  // 先检查记住我的登录状态
  const rememberedLogin = localStorage.getItem('rememberedLogin');
  if (rememberedLogin) {
    try {
      const { username, timestamp } = JSON.parse(rememberedLogin);
      // 检查是否过期（30天）
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp < thirtyDays) {
        // 从用户列表中找到用户
        const users = getUsersSync();
        let user = users.find(u => u.name === username);
        
        // 如果是主管理员
        if (username === MAIN_ADMIN.name) {
          user = MAIN_ADMIN;
        }
        
        if (user) {
          // 同时更新currentUser
          setCurrentUser(user);
          return user;
        }
      } else {
        // 过期了，清除
        localStorage.removeItem('rememberedLogin');
      }
    } catch (e) {
      console.error('Failed to parse remembered login:', e);
    }
  }
  
  // 回退到检查currentUser
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// 保存当前登录用户
export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
}

// 登录（异步版本，会在登录前尝试同步用户列表）
export async function loginAsync(username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; user?: User; error?: string }> {
  // 先尝试从数据库同步用户列表（如果可能）
  try {
    const { getUsers } = await import('@/lib/storage');
    await getUsers();
  } catch (err) {
    console.warn('同步用户列表失败，使用本地数据:', err);
  }
  
  // 然后使用同步版本的登录
  return login(username, password, rememberMe);
}

// 登录（同步版本，使用本地存储的用户列表）
export function login(username: string, password: string, rememberMe: boolean = false): { success: boolean; user?: User; error?: string } {
  // 检查是否是主管理员
  if (username === MAIN_ADMIN.name && password === MAIN_ADMIN.password) {
    setCurrentUser(MAIN_ADMIN);
    if (rememberMe) {
      localStorage.setItem('rememberedLogin', JSON.stringify({
        username: MAIN_ADMIN.name,
        timestamp: Date.now()
      }));
    }
    return { success: true, user: MAIN_ADMIN };
  }

  // 检查其他管理员和用户
  const users = getUsersSync();
  const user = users.find(u => u.name === username);
  
  if (!user) {
    return { success: false, error: '用户名或密码错误。如果这是新设备，请等待几秒让系统同步用户数据。' };
  }

  // 验证密码（如果用户有密码）
  if (user.password) {
    if (user.password !== password) {
      return { success: false, error: '用户名或密码错误' };
    }
  } else if (password) {
    // 如果用户没有密码但输入了密码，也拒绝
    return { success: false, error: '用户名或密码错误' };
  }

  setCurrentUser(user);
  
  // 如果选择了记住我，保存登录状态
  if (rememberMe) {
    localStorage.setItem('rememberedLogin', JSON.stringify({
      username: user.name,
      timestamp: Date.now()
    }));
  }
  
  return { success: true, user };
}

// 登出
export function logout(): void {
  setCurrentUser(null);
  localStorage.removeItem('rememberedLogin');
}

// 修改密码
export function changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: '未登录' };
  }

  // 检查旧密码
  if (user.id === 'main-admin') {
    if (oldPassword !== MAIN_ADMIN.password) {
      return { success: false, error: '原密码错误' };
    }
    // 主管理员密码不能通过这种方式修改（需要代码修改）
    return { success: false, error: '主管理员密码需要在代码中修改' };
  }

  const users = getUsersSync();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex === -1) {
    return { success: false, error: '用户不存在' };
  }

  // 验证旧密码
  if (users[userIndex].password && users[userIndex].password !== oldPassword) {
    return { success: false, error: '原密码错误' };
  }

  // 更新密码
  users[userIndex].password = newPassword;
  saveUsersSync(users);

  // 更新当前用户信息
  const updatedUser = { ...user, password: newPassword };
  setCurrentUser(updatedUser);

  return { success: true };
}


// 检查是否有权限
export function hasPermission(permission: 'manageUsers' | 'manageSubAdmins' | 'addUsers'): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (user.role === 'admin') {
    return true; // 主管理员拥有所有权限
  }

  if (user.role === 'subAdmin') {
    // 副管理员可以管理用户和添加用户，但不能管理副管理员
    return permission !== 'manageSubAdmins';
  }

  // 普通用户没有管理权限
  return false;
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}


