import { NextRequest, NextResponse } from 'next/server';

// 简单的内存存储（生产环境应该使用数据库）
// 注意：Vercel是无服务器的，每次请求可能在不同的实例上
// 这个方案只适用于演示，生产环境应该使用数据库（如PostgreSQL、MongoDB等）

let dataStore: {
  users: any[];
  expenses: any[];
} = {
  users: [],
  expenses: [],
};

// 从环境变量或外部存储加载数据（这里简化处理）
// 生产环境应该使用数据库
async function loadData() {
  // 这里可以从数据库加载
  // 暂时使用内存存储
  return dataStore;
}

async function saveData(data: typeof dataStore) {
  // 这里应该保存到数据库
  // 暂时使用内存存储
  dataStore = data;
}

export async function GET(request: NextRequest) {
  try {
    const data = await loadData();
    return NextResponse.json({
      success: true,
      users: data.users,
      expenses: data.expenses,
    });
  } catch (error) {
    console.error('Failed to load data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { users, expenses } = body;

    if (!users || !expenses) {
      return NextResponse.json(
        { success: false, error: 'Missing users or expenses' },
        { status: 400 }
      );
    }

    await saveData({ users, expenses });

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully',
    });
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

