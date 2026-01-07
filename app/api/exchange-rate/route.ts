import { NextRequest, NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/currency';
import { Currency } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = (searchParams.get('base') as Currency) || 'EUR';
    const rates = await getExchangeRates(base);
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

