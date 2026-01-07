import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';
import { User, Expense } from '@/types';

// 测试导入功能
export async function POST(request: Request) {
  try {
    const supabase = createSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase 未配置',
        hint: '请检查环境变量 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
      });
    }

    // 测试 1: 检查表是否存在
    const { error: usersTableError } = await supabase.from('users').select('id').limit(1);
    const { error: expensesTableError } = await supabase.from('expenses').select('id').limit(1);

    if (usersTableError) {
      return NextResponse.json({
        success: false,
        error: 'users 表访问失败',
        details: usersTableError.message,
        code: usersTableError.code,
        hint: usersTableError.code === '42P01' ? '表不存在，请先创建表' : 
              usersTableError.code === '42501' ? 'RLS 策略未配置，请配置 RLS' : 
              '请检查表是否存在和 RLS 策略'
      });
    }

    if (expensesTableError) {
      return NextResponse.json({
        success: false,
        error: 'expenses 表访问失败',
        details: expensesTableError.message,
        code: expensesTableError.code,
        hint: expensesTableError.code === '42P01' ? '表不存在，请先创建表' : 
              expensesTableError.code === '42501' ? 'RLS 策略未配置，请配置 RLS' : 
              '请检查表是否存在和 RLS 策略'
      });
    }

    // 测试 2: 尝试插入测试数据
    const testUser: User = {
      id: 'test-import-' + Date.now(),
      name: '测试用户',
      role: 'user'
    };

    const { error: insertUserError } = await supabase
      .from('users')
      .insert({
        id: testUser.id,
        name: testUser.name,
        role: testUser.role || 'user',
        avatar: null,
        password: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertUserError) {
      return NextResponse.json({
        success: false,
        error: '插入测试用户失败',
        details: insertUserError.message,
        code: insertUserError.code,
        hint: insertUserError.code === '42501' ? 'RLS 策略不允许插入，请检查 RLS 策略' : 
              '请检查表结构和 RLS 策略'
      });
    }

    // 删除测试用户
    await supabase.from('users').delete().eq('id', testUser.id);

    // 测试 3: 尝试插入测试记账
    const testExpense: Expense = {
      id: 'test-expense-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: '测试记账',
      amount: 10.00,
      currency: 'EUR',
      paidBy: testUser.id,
      sharedBy: [testUser.id],
      category: '其他',
      createdAt: new Date().toISOString(),
    };

    const { error: insertExpenseError } = await supabase
      .from('expenses')
      .insert({
        id: testExpense.id,
        date: testExpense.date,
        description: testExpense.description,
        amount: testExpense.amount,
        currency: testExpense.currency,
        paid_by: testExpense.paidBy,
        shared_by: testExpense.sharedBy,
        category: testExpense.category,
        image_url: null,
        created_at: testExpense.createdAt,
        updated_at: new Date().toISOString(),
      });

    if (insertExpenseError) {
      return NextResponse.json({
        success: false,
        error: '插入测试记账失败',
        details: insertExpenseError.message,
        code: insertExpenseError.code,
        hint: insertExpenseError.code === '42501' ? 'RLS 策略不允许插入，请检查 RLS 策略' : 
              '请检查表结构和 RLS 策略'
      });
    }

    // 删除测试记账
    await supabase.from('expenses').delete().eq('id', testExpense.id);

    return NextResponse.json({
      success: true,
      message: '所有测试通过！数据库配置正确，可以导入数据了。',
      tests: {
        usersTable: '✅ 正常',
        expensesTable: '✅ 正常',
        insertUser: '✅ 正常',
        insertExpense: '✅ 正常',
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || '测试失败',
      details: error.stack
    });
  }
}

