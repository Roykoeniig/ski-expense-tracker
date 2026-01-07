import { Currency, ExchangeRate } from '@/types';

// 获取汇率（使用免费API）
export async function getExchangeRates(baseCurrency: Currency = 'EUR'): Promise<ExchangeRate> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const data = await response.json();
    
    // API返回的rates对象中，所有值都是相对于baseCurrency的汇率
    // 例如：如果base是EUR，rates.CHF = 0.95 表示 1 EUR = 0.95 CHF
    // 我们需要确保所有货币都有值
    const rates = {
      EUR: baseCurrency === 'EUR' ? 1 : (data.rates?.EUR || 1),
      CHF: baseCurrency === 'CHF' ? 1 : (data.rates?.CHF || 0.95),
      CNY: baseCurrency === 'CNY' ? 1 : (data.rates?.CNY || 7.8),
    };
    
    return {
      ...rates,
      base: baseCurrency,
      date: data.date || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // 返回默认汇率（示例值，实际应该使用缓存或备用API）
    // 这些是相对于EUR的汇率
    const defaultRates: Record<Currency, number> = {
      EUR: 1,
      CHF: 0.95,  // 1 EUR = 0.95 CHF (示例值)
      CNY: 7.8,   // 1 EUR = 7.8 CNY (示例值)
    };
    
    // 如果base不是EUR，需要转换
    if (baseCurrency !== 'EUR') {
      const eurToBase = 1 / defaultRates[baseCurrency];
      return {
        EUR: defaultRates.EUR * eurToBase,
        CHF: defaultRates.CHF * eurToBase,
        CNY: defaultRates.CNY * eurToBase,
        base: baseCurrency,
        date: new Date().toISOString().split('T')[0],
      };
    }
    
    return {
      ...defaultRates,
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
    };
  }
}

// 货币转换
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRate
): number {
  if (from === to) return amount;
  
  // 如果基础货币是EUR，rates对象中的值都是相对于EUR的汇率
  // 例如：rates.CHF = 0.95 表示 1 EUR = 0.95 CHF，所以 1 CHF = 1/0.95 EUR
  
  // 先转换为基础货币（EUR）
  let amountInBase: number;
  if (from === rates.base) {
    amountInBase = amount;
  } else {
    // 从其他货币转换为基础货币
    // 如果 rates.CHF = 0.95，表示 1 EUR = 0.95 CHF
    // 所以 amount CHF = amount / 0.95 EUR
    amountInBase = amount / rates[from];
  }
  
  // 再转换为目标货币
  if (to === rates.base) {
    return amountInBase;
  } else {
    // 从基础货币转换为目标货币
    return amountInBase * rates[to];
  }
}

// 格式化货币显示
export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    EUR: '€',
    CHF: 'CHF ',
    CNY: '¥',
  };
  
  return `${symbols[currency]}${amount.toFixed(2)}`;
}

