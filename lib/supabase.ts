import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建Supabase客户端（客户端使用）
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using localStorage fallback.')
    return null
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

// 服务端Supabase客户端（需要service role key，用于管理员操作）
export function createSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

