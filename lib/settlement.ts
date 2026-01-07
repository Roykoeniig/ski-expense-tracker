import { Expense, Settlement, User, Currency, ExchangeRate } from '@/types';
import { convertCurrency } from './currency';

interface UserBalance {
  userId: string;
  balance: number; // 以基础货币计算
}

// 计算所有用户的欠款和应得金额
export function calculateSettlements(
  expenses: Expense[],
  users: User[],
  rates: ExchangeRate,
  baseCurrency: Currency = 'EUR'
): Settlement[] {
  // 初始化每个用户的余额
  const balances: Map<string, number> = new Map();
  users.forEach(user => balances.set(user.id, 0));

  // 计算每个用户的净支出/收入
  expenses.forEach(expense => {
    const amountInBase = convertCurrency(expense.amount, expense.currency, baseCurrency, rates);
    const sharePerPerson = amountInBase / expense.sharedBy.length;
    
    // 付款人应该收回的钱
    const paidByBalance = balances.get(expense.paidBy) || 0;
    balances.set(expense.paidBy, paidByBalance + amountInBase);
    
    // 每个共享者应该支付的钱
    expense.sharedBy.forEach(userId => {
      const userBalance = balances.get(userId) || 0;
      balances.set(userId, userBalance - sharePerPerson);
    });
  });

  // 转换为数组并排序
  const userBalances: UserBalance[] = Array.from(balances.entries()).map(([userId, balance]) => ({
    userId,
    balance,
  }));

  // 分离债权人和债务人
  const creditors = userBalances.filter(ub => ub.balance > 0.01).sort((a, b) => b.balance - a.balance);
  const debtors = userBalances.filter(ub => ub.balance < -0.01).sort((a, b) => a.balance - b.balance);

  const settlements: Settlement[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  // 使用贪心算法计算最优结算方案
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    if (amount > 0.01) {
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount,
        currency: baseCurrency,
      });

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance < 0.01) creditorIndex++;
      if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
    } else {
      break;
    }
  }

  return settlements;
}

