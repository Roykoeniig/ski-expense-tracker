'use client'

import { useEffect, useState } from 'react'
import { Calculator, ArrowRight, Users } from 'lucide-react'
import { Expense, User, Settlement, Currency } from '@/types'
import { getExpenses, getUsers } from '@/lib/storage'
import { formatCurrency } from '@/lib/currency'
import { getExchangeRates } from '@/lib/currency'
import { calculateSettlements } from '@/lib/settlement'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/language'

export default function SettlementPage() {
  const { t } = useLanguage()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [baseCurrency, setBaseCurrency] = useState<Currency>('EUR')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (expenses.length > 0 && users.length > 0) {
      calculateSettlement()
    }
  }, [expenses, users, baseCurrency])

  const loadData = () => {
    setExpenses(getExpenses())
    setUsers(getUsers())
  }

  const calculateSettlement = async () => {
    setIsLoading(true)
    try {
      const rates = await getExchangeRates(baseCurrency)
      const result = calculateSettlements(expenses, users, rates, baseCurrency)
      setSettlements(result)
    } catch (error) {
      console.error('Failed to calculate settlement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || userId
  }

  // 计算每个用户的余额
  const getUserBalances = () => {
    const balances: Record<string, number> = {}
    users.forEach(user => {
      balances[user.id] = 0
    })

    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / expense.sharedBy.length
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount
      expense.sharedBy.forEach(userId => {
        balances[userId] = (balances[userId] || 0) - sharePerPerson
      })
    })

    return balances
  }

  const balances = getUserBalances()

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('settlement.title')}</h1>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('settlement.baseCurrency')}:</span>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value as Currency)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="EUR">EUR</option>
              <option value="CHF">CHF</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl border border-white/20">
          <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('settlement.noExpenses')}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl border border-white/20">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('settlement.noUsers')}</p>
        </div>
      ) : (
        <>
          {/* 用户余额概览 */}
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 mb-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('settlement.userBalances')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => {
                const balance = balances[user.id] || 0
                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border-2 ${
                      balance > 0
                        ? 'border-green-200 bg-green-50'
                        : balance < 0
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 mb-1">{user.name}</p>
                    <p
                      className={`text-2xl font-bold ${
                        balance > 0
                          ? 'text-green-600'
                          : balance < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {balance > 0 ? '+' : ''}
                      {formatCurrency(Math.abs(balance), baseCurrency)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {balance > 0 ? t('settlement.shouldReceive') : balance < 0 ? t('settlement.shouldPay') : t('settlement.balanced')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 结算建议 */}
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('settlement.suggestions')}</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-500">{t('settlement.calculating')}</p>
              </div>
            ) : settlements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('settlement.allBalanced')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors border border-white/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold">
                          {getUserName(settlement.from)[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {getUserName(settlement.from)}
                        </p>
                        <p className="text-sm text-gray-500">{t('settlement.shouldPay')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-xl font-bold text-ski-primary">
                        {formatCurrency(settlement.amount, settlement.currency)}
                      </p>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">
                          {getUserName(settlement.to)[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {getUserName(settlement.to)}
                        </p>
                        <p className="text-sm text-gray-500">{t('settlement.shouldReceive')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

