'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Filter } from 'lucide-react'
import { Expense, User, Currency } from '@/types'
import { getExpenses, getUsers, addExpenseSync, updateExpenseSync, deleteExpenseSync } from '@/lib/storage'
import { formatCurrency } from '@/lib/currency'
import ExpenseForm from '@/components/ExpenseForm'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/language'

export default function ExpensesPage() {
  const { t, locale } = useLanguage()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filter, setFilter] = useState<{ currency?: Currency; user?: string }>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [expensesData, usersData] = await Promise.all([
      getExpenses(),
      getUsers()
    ])
    setExpenses(expensesData)
    setUsers(usersData)
  }

  const handleAdd = (expense: Expense) => {
    addExpenseSync(expense)
    loadData()
    setShowForm(false)
  }

  const handleUpdate = (expense: Expense) => {
    updateExpenseSync(expense.id, expense)
    loadData()
    setEditingExpense(null)
  }

  const handleDelete = (id: string) => {
    if (confirm(t('expenses.deleteConfirm'))) {
      deleteExpenseSync(id)
      loadData()
    }
  }

  const filteredExpenses = expenses.filter(exp => {
    if (filter.currency && exp.currency !== filter.currency) return false
    if (filter.user && exp.paidBy !== filter.user) return false
    return true
  })

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || userId
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('expenses.title')}</h1>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button
            onClick={() => {
              setEditingExpense(null)
              setShowForm(true)
            }}
            className="flex items-center space-x-2 bg-ski-primary text-white px-4 py-2 rounded-lg hover:bg-ski-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{t('expenses.addExpense')}</span>
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 mb-6 shadow-2xl border border-white/20 flex items-center space-x-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <select
          value={filter.currency || ''}
          onChange={(e) => setFilter({ ...filter, currency: e.target.value as Currency || undefined })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">{t('expenses.allCurrencies')}</option>
          <option value="EUR">€ {t('form.currency')} (EUR)</option>
          <option value="CHF">CHF {t('form.currency')} (CHF)</option>
          <option value="CNY">¥ {t('form.currency')} (CNY)</option>
        </select>
        <select
          value={filter.user || ''}
          onChange={(e) => setFilter({ ...filter, user: e.target.value || undefined })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">{t('expenses.allUsers')}</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* 记账列表 */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl border border-white/20">
            <p className="text-gray-500 text-lg">{t('expenses.noExpenses')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-ski-primary hover:underline"
            >
              {t('expenses.addFirst')} →
            </button>
          </div>
        ) : (
          filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => (
              <div
                key={expense.id}
                className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-2xl border border-white/20 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{expense.description}</h3>
                      <span className="px-2 py-1 bg-ski-primary/10 text-ski-primary text-xs rounded-full">
                        {expense.currency}
                      </span>
                      {expense.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {expense.category}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{t('expenses.date')}: {new Date(expense.date).toLocaleDateString(locale)}</p>
                      <p>{t('expenses.paidBy')}: {getUserName(expense.paidBy)}</p>
                      <p>{t('expenses.sharedBy')}: {expense.sharedBy.map(id => getUserName(id)).join(', ')}</p>
                    </div>
                    {expense.imageUrl && (
                      <img src={expense.imageUrl} alt={expense.description} className="mt-3 w-32 h-32 object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <p className="text-2xl font-bold text-ski-primary">
                      {formatCurrency(expense.amount, expense.currency)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingExpense(expense)
                          setShowForm(true)
                        }}
                        className="p-2 text-gray-600 hover:text-ski-primary hover:bg-ski-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* 表单弹窗 */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          users={users}
          onSave={editingExpense ? handleUpdate : handleAdd}
          onCancel={() => {
            setShowForm(false)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}

