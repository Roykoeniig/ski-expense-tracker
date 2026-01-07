import { Expense, User } from '@/types'
import { createSupabaseClient } from './supabase'

// 数据库表名
const TABLES = {
  USERS: 'users',
  EXPENSES: 'expenses',
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
    return false
  }

  try {
    // 先删除所有现有用户（除了主管理员）
    const { error: deleteError } = await supabase
      .from(TABLES.USERS)
      .delete()
      .neq('id', 'main-admin')

    if (deleteError) {
      console.error('Error deleting users:', deleteError)
    }

    // 过滤掉主管理员（主管理员不在数据库中）
    const usersToSave = users.filter(u => u.id !== 'main-admin')

    if (usersToSave.length > 0) {
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
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Failed to save users:', error)
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
    return false
  }

  try {
    // 先删除所有现有记账
    const { error: deleteError } = await supabase
      .from(TABLES.EXPENSES)
      .delete()
      .neq('id', '')

    if (deleteError) {
      console.error('Error deleting expenses:', deleteError)
    }

    if (expenses.length > 0) {
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
        return false
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

