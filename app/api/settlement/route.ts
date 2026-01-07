import { NextRequest, NextResponse } from 'next/server';
import { calculateSettlements } from '@/lib/settlement';
import { getExchangeRates } from '@/lib/currency';
import { Expense, User, Currency } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { expenses, users, baseCurrency = 'EUR' }: {
      expenses: Expense[];
      users: User[];
      baseCurrency?: Currency;
    } = await request.json();

    const rates = await getExchangeRates(baseCurrency);
    const settlements = calculateSettlements(expenses, users, rates, baseCurrency);

    return NextResponse.json({ settlements });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate settlements' },
      { status: 500 }
    );
  }
}

