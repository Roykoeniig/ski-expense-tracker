'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mountain, Users, MessageSquare, Calculator, Camera, TrendingUp, Database } from 'lucide-react'
import { Expense, User as UserType } from '@/types'
import { getExpenses, getUsers, getUsersSync, getExpensesSync } from '@/lib/storage'
import { formatCurrency } from '@/lib/currency'
import UserManager from '@/components/UserManager'

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const [expensesData, usersData] = await Promise.all([
        getExpenses(),
        getUsers()
      ])
      setExpenses(expensesData)
      setUsers(usersData)
      
      // 计算总金额
      const total = expensesData.reduce((sum, exp) => sum + exp.amount, 0)
      setTotalAmount(total)
    }
    loadData()
  }, [])

  const recentExpenses = expenses.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-ski-gradient">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Mountain className="w-16 h-16 text-white mr-4" />
            <h1 className="text-5xl font-bold text-white">滑雪记账</h1>
          </div>
          <p className="text-xl text-white/90 mt-4">多人记账 · 多币种支持 · AI智能记账</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">总支出</p>
                <p className="text-3xl font-bold text-ski-primary">
                  {formatCurrency(totalAmount, 'EUR')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-ski-accent" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">记账笔数</p>
                <p className="text-3xl font-bold text-ski-primary">{expenses.length}</p>
              </div>
              <Calculator className="w-12 h-12 text-ski-secondary" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">参与人数</p>
                <p className="text-3xl font-bold text-ski-primary">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-ski-primary" />
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/expenses" className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <Calculator className="w-10 h-10 text-ski-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">记账管理</h3>
              <p className="text-gray-600">添加、查看和管理所有记账记录</p>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <MessageSquare className="w-10 h-10 text-ski-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI记账</h3>
              <p className="text-gray-600">通过聊天或拍照自动识别并记账</p>
            </div>
          </Link>

          <Link href="/settlement" className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <Users className="w-10 h-10 text-ski-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">结算中心</h3>
              <p className="text-gray-600">查看相互欠款和转账建议</p>
            </div>
          </Link>

          <Link href="/photos" className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <Camera className="w-10 h-10 text-ski-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">照片墙</h3>
              <p className="text-gray-600">上传和分享滑雪照片</p>
            </div>
          </Link>

          <Link href="/import-data" className="group">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-dashed border-ski-primary">
              <Database className="w-10 h-10 text-ski-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">数据导入</h3>
              <p className="text-gray-600">将本地数据导入到 Supabase</p>
            </div>
          </Link>
        </div>

        {/* 用户管理 */}
        <div className="mb-12">
          <UserManager />
        </div>

        {/* 最近记账 */}
        {recentExpenses.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">最近记账</h2>
            <div className="space-y-3">
              {recentExpenses.map((expense) => {
                const paidByUser = users.find(u => u.id === expense.paidBy)
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString('zh-CN')} · 
                        {paidByUser?.name || expense.paidBy} 支付
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
              查看全部 →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

