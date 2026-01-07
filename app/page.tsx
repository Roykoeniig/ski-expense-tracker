'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mountain, Users, MessageSquare, Calculator, Camera, TrendingUp } from 'lucide-react'
import { Expense, User as UserType } from '@/types'
import { getExpenses, getUsers } from '@/lib/storage'
import { formatCurrency } from '@/lib/currency'
import UserManager from '@/components/UserManager'
import { useLanguage } from '@/lib/language'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Home() {
  const { t, locale } = useLanguage()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    setExpenses(getExpenses())
    setUsers(getUsers())
    
    // 计算总金额
    const total = getExpenses().reduce((sum, exp) => sum + exp.amount, 0)
    setTotalAmount(total)
  }, [])

  const recentExpenses = expenses.slice(-5).reverse()

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 语言切换器 - 桌面版 */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Mountain className="w-16 h-16 text-white mr-4" />
            <h1 className="text-5xl font-bold text-white">{t('home.title')}</h1>
          </div>
          <p className="text-xl text-white/90 mt-4">{t('home.subtitle')}</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('home.totalExpenses')}</p>
                <p className="text-3xl font-bold text-ski-primary">
                  {formatCurrency(totalAmount, 'EUR')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-ski-accent" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('home.expenseCount')}</p>
                <p className="text-3xl font-bold text-ski-primary">{expenses.length}</p>
              </div>
              <Calculator className="w-12 h-12 text-ski-secondary" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('home.participants')}</p>
                <p className="text-3xl font-bold text-ski-primary">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-ski-primary" />
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/expenses" className="group">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all">
              <Calculator className="w-10 h-10 text-ski-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.expenseManagement')}</h3>
              <p className="text-gray-600">{t('home.expenseManagementDesc')}</p>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all">
              <MessageSquare className="w-10 h-10 text-ski-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.aiExpense')}</h3>
              <p className="text-gray-600">{t('home.aiExpenseDesc')}</p>
            </div>
          </Link>

          <Link href="/settlement" className="group">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all">
              <Users className="w-10 h-10 text-ski-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.settlement')}</h3>
              <p className="text-gray-600">{t('home.settlementDesc')}</p>
            </div>
          </Link>

          <Link href="/photos" className="group">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all">
              <Camera className="w-10 h-10 text-ski-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t('home.photoWall')}</h3>
              <p className="text-gray-600">{t('home.photoWallDesc')}</p>
            </div>
          </Link>
        </div>

        {/* 用户管理 */}
        <div className="mb-12">
          <UserManager />
        </div>

        {/* 最近记账 */}
        {recentExpenses.length > 0 && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('home.recentExpenses')}</h2>
            <div className="space-y-3">
              {recentExpenses.map((expense) => {
                const paidByUser = users.find(u => u.id === expense.paidBy)
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString(locale)} · 
                        {t('expenses.paidBy')}: {paidByUser?.name || expense.paidBy}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-ski-primary">
                      {formatCurrency(expense.amount, expense.currency)}
                    </p>
                  </div>
                )
              })}
            </div>
            <Link href="/expenses" className="block text-center mt-4 text-ski-primary hover:underline">
              {t('home.viewAll')} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

