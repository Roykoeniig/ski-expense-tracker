import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';

// 测试数据库连接的API
export async function GET() {
  try {
    const supabase = createSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured',
        message: '请检查环境变量 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 是否已配置',
      });
    }

    // 测试连接：尝试查询用户表
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    // 测试连接：尝试查询记账表
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .limit(1);

    if (usersError || expensesError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: {
          usersError: usersError?.message,
          expensesError: expensesError?.message,
        },
        message: '数据库连接失败，请检查：1. 表是否已创建 2. RLS策略是否正确配置',
      });
    }

    return NextResponse.json({
      success: true,
      message: '数据库连接成功！',
      tables: {
        users: '连接正常',
        expenses: '连接正常',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '测试数据库连接时出错',
    });
  }
}


