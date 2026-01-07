import { NextResponse } from 'next/server';
import { saveUsersToDB, saveExpensesToDB } from '@/lib/database';
import { User, Expense } from '@/types';

// 从请求体获取要导入的数据
export async function POST(request: Request) {
  try {
    const { users, expenses } = await request.json();

    if (!users || !expenses) {
      return NextResponse.json(
        { success: false, error: '缺少 users 或 expenses 数据' },
        { status: 400 }
      );
    }

    // 验证数据格式
    if (!Array.isArray(users) || !Array.isArray(expenses)) {
      return NextResponse.json(
        { success: false, error: '数据格式错误：users 和 expenses 必须是数组' },
        { status: 400 }
      );
    }

    // 导入用户数据
    try {
      const usersSaved = await saveUsersToDB(users as User[]);
      if (!usersSaved) {
        return NextResponse.json(
          { 
            success: false, 
            error: '导入用户数据失败',
            hint: '请检查：1. Supabase 表是否已创建 2. RLS策略是否已配置 3. 环境变量是否正确'
          },
          { status: 500 }
        );
      }
    } catch (userError: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: '导入用户数据失败',
          details: userError.message || '未知错误',
          hint: '请检查：1. Supabase 表是否已创建 2. RLS策略是否已配置 3. 环境变量是否正确'
        },
        { status: 500 }
      );
    }

    // 导入记账数据
    try {
      const expensesSaved = await saveExpensesToDB(expenses as Expense[]);
      if (!expensesSaved) {
        return NextResponse.json(
          { 
            success: false, 
            error: '导入记账数据失败',
            hint: '请检查：1. Supabase 表是否已创建 2. RLS策略是否已配置 3. 环境变量是否正确'
          },
          { status: 500 }
        );
      }
    } catch (expenseError: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: '导入记账数据失败',
          details: expenseError.message || '未知错误',
          hint: '请检查：1. Supabase 表是否已创建 2. RLS策略是否已配置 3. 环境变量是否正确'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${users.length} 个用户和 ${expenses.length} 条记账记录`,
      imported: {
        users: users.length,
        expenses: expenses.length,
      },
    });
  } catch (error: any) {
    console.error('导入数据失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '导入数据时出错' },
      { status: 500 }
    );
  }
}

