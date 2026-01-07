import { NextRequest, NextResponse } from 'next/server';
import { Expense } from '@/types';

// 模拟数据存储（实际应用中应使用数据库）
let expenses: Expense[] = [];

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  try {
    const expense: Expense = await request.json();
    expenses.push(expense);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    expenses[index] = { ...expenses[index], ...updates };
    return NextResponse.json(expenses[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    expenses = expenses.filter(e => e.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}

