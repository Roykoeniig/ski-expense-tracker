import { Expense, User } from '@/types'
import { createSupabaseClient } from './supabase'

// 数据库表名
const TABLES = {
  USERS: 'users',
  EXPENSES: 'expenses',
  PHOTOS: 'photos',
}

// 获取用户列表
export async function getUsersFromDB(): Promise<User[]> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    // 如果没有配置Supabase，返回空数组
    return []
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return (data || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      password: user.password, // 注意：生产环境应该加密存储
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
  }
}

// 保存用户列表
export async function saveUsersToDB(users: User[]): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    console.warn('Supabase not configured')
    return false
  }

  try {
    // 过滤掉主管理员（主管理员不在数据库中）
    const usersToSave = users.filter(u => u.id !== 'main-admin')

    if (usersToSave.length > 0) {
      // 使用 upsert 而不是先删除再插入，这样更高效且不会丢失数据
      const { error: insertError } = await supabase
        .from(TABLES.USERS)
        .upsert(usersToSave.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || null,
          role: user.role || 'user',
          password: user.password || null,
          updated_at: new Date().toISOString(),
        })), {
          onConflict: 'id'
        })

      if (insertError) {
        console.error('Error saving users:', insertError)
        throw new Error(`保存用户失败: ${insertError.message} (${insertError.code || 'unknown'})`)
      }
    } else {
      // 如果没有用户要保存，也返回成功（可能是清空操作）
      return true
    }

    return true
  } catch (error) {
    console.error('Failed to save users:', error)
    return false
  }
}

// 删除用户
export async function deleteUserFromDB(id: string): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    // 主管理员不能被删除
    if (id === 'main-admin') {
      return false
    }

    const { error } = await supabase
      .from(TABLES.USERS)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to delete user:', error)
    return false
  }
}

// 获取记账列表
export async function getExpensesFromDB(): Promise<Expense[]> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.EXPENSES)
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
      return []
    }

    return (data || []).map((expense: any) => ({
      id: expense.id,
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      paidBy: expense.paid_by,
      sharedBy: expense.shared_by || [],
      category: expense.category || null,
      imageUrl: expense.image_url || null,
      createdAt: expense.created_at,
    }))
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
    return []
  }
}

// 保存记账列表
export async function saveExpensesToDB(expenses: Expense[]): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    console.warn('Supabase not configured')
    return false
  }

  try {
    if (expenses.length > 0) {
      // 使用 upsert 批量保存，自动处理冲突
      const { error: insertError } = await supabase
        .from(TABLES.EXPENSES)
        .upsert(expenses.map(expense => ({
          id: expense.id,
          date: expense.date,
          description: expense.description,
          amount: expense.amount,
          currency: expense.currency,
          paid_by: expense.paidBy,
          shared_by: expense.sharedBy,
          category: expense.category || null,
          image_url: expense.imageUrl || null,
          created_at: expense.createdAt,
          updated_at: new Date().toISOString(),
        })), {
          onConflict: 'id'
        })

      if (insertError) {
        console.error('Error saving expenses:', insertError)
        throw new Error(`保存记账失败: ${insertError.message} (${insertError.code || 'unknown'})`)
      }
    }

    return true
  } catch (error) {
    console.error('Failed to save expenses:', error)
    return false
  }
}

// 添加单个记账
export async function addExpenseToDB(expense: Expense): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from(TABLES.EXPENSES)
      .insert({
        id: expense.id,
        date: expense.date,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        paid_by: expense.paidBy,
        shared_by: expense.sharedBy,
        category: expense.category || null,
        image_url: expense.imageUrl || null,
        created_at: expense.createdAt,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error adding expense:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to add expense:', error)
    return false
  }
}

// 更新记账
export async function updateExpenseInDB(id: string, updates: Partial<Expense>): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.date) updateData.date = updates.date
    if (updates.description) updateData.description = updates.description
    if (updates.amount !== undefined) updateData.amount = updates.amount
    if (updates.currency) updateData.currency = updates.currency
    if (updates.paidBy) updateData.paid_by = updates.paidBy
    if (updates.sharedBy) updateData.shared_by = updates.sharedBy
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl

    const { error } = await supabase
      .from(TABLES.EXPENSES)
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating expense:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to update expense:', error)
    return false
  }
}

// 删除记账
export async function deleteExpenseFromDB(id: string): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from(TABLES.EXPENSES)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting expense:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to delete expense:', error)
    return false
  }
}

// 照片接口
export interface Photo {
  id: string
  url: string
  description?: string
  date: string
}

// 获取照片列表
export async function getPhotosFromDB(): Promise<Photo[]> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching photos:', error)
      return []
    }

    return (data || []).map((photo: any) => ({
      id: photo.id,
      url: photo.url,
      description: photo.description || undefined,
      date: photo.date,
    }))
  } catch (error) {
    console.error('Failed to fetch photos:', error)
    return []
  }
}

// 保存照片列表
export async function savePhotosToDB(photos: Photo[]): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    console.warn('Supabase not configured')
    return false
  }

  try {
    if (photos.length > 0) {
      // 使用 upsert 批量保存
      const { error: insertError } = await supabase
        .from(TABLES.PHOTOS)
        .upsert(photos.map(photo => ({
          id: photo.id,
          url: photo.url,
          description: photo.description || null,
          date: photo.date,
          updated_at: new Date().toISOString(),
        })), {
          onConflict: 'id'
        })

      if (insertError) {
        console.error('Error saving photos:', insertError)
        throw new Error(`保存照片失败: ${insertError.message} (${insertError.code || 'unknown'})`)
      }
    } else {
      // 如果没有照片要保存，也返回成功（可能是清空操作）
      return true
    }

    return true
  } catch (error) {
    console.error('Failed to save photos:', error)
    return false
  }
}

// 添加单个照片
export async function addPhotoToDB(photo: Photo): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from(TABLES.PHOTOS)
      .insert({
        id: photo.id,
        url: photo.url,
        description: photo.description || null,
        date: photo.date,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error adding photo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to add photo:', error)
    return false
  }
}

// 删除照片
export async function deletePhotoFromDB(id: string): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase
      .from(TABLES.PHOTOS)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting photo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to delete photo:', error)
    return false
  }
}

