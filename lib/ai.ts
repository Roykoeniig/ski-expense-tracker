import { Expense, Currency } from '@/types';

// 解析AI返回的记账信息
export interface ParsedExpense {
  date: string;
  description: string;
  amount: number;
  currency: Currency;
  paidBy?: string;
  sharedBy?: string[];
  category?: string;
}

// 调用OpenAI API解析记账信息
export async function parseExpenseFromText(
  text: string,
  imageUrl?: string
): Promise<ParsedExpense | null> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        imageUrl,
        mode: 'parse_expense',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to parse expense');
    }

    const data = await response.json();
    return data.expense;
  } catch (error) {
    console.error('Error parsing expense:', error);
    return null;
  }
}

// 从文本中提取日期
export function extractDate(text: string): string {
  const today = new Date();
  const dateRegex = /(\d{1,2})[月\/\-](\d{1,2})/;
  const match = text.match(dateRegex);
  
  if (match) {
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    const year = today.getFullYear();
    return new Date(year, month - 1, day).toISOString().split('T')[0];
  }
  
  return today.toISOString().split('T')[0];
}

// 从文本中提取金额和货币
export function extractAmountAndCurrency(text: string): { amount: number; currency: Currency } | null {
  // 匹配各种格式：€50, 50欧元, CHF 100, 100瑞士法郎, ¥200, 200人民币
  const patterns = [
    { regex: /€\s*(\d+\.?\d*)/, currency: 'EUR' as Currency },
    { regex: /(\d+\.?\d*)\s*欧元/, currency: 'EUR' as Currency },
    { regex: /CHF\s*(\d+\.?\d*)/, currency: 'CHF' as Currency },
    { regex: /(\d+\.?\d*)\s*瑞士法郎/, currency: 'CHF' as Currency },
    { regex: /¥\s*(\d+\.?\d*)/, currency: 'CNY' as Currency },
    { regex: /(\d+\.?\d*)\s*人民币/, currency: 'CNY' as Currency },
    { regex: /(\d+\.?\d*)\s*元/, currency: 'CNY' as Currency },
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      return {
        amount: parseFloat(match[1]),
        currency: pattern.currency,
      };
    }
  }

  return null;
}

