'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Expense, User, Currency } from '@/types'
import { useLanguage } from '@/lib/language'

interface ExpenseFormProps {
  expense?: Expense | null
  users: User[]
  onSave: (expense: Expense) => void
  onCancel: () => void
}

export default function ExpenseForm({ expense, users, onSave, onCancel }: ExpenseFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'EUR' as Currency,
    date: new Date().toISOString().split('T')[0],
    paidBy: users[0]?.id || '',
    sharedBy: [] as string[],
    category: '',
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        currency: expense.currency,
        date: expense.date,
        paidBy: expense.paidBy,
        sharedBy: expense.sharedBy,
        category: expense.category || '',
      })
    }
  }, [expense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newExpense: Expense = {
      id: expense?.id || Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: expense?.createdAt || new Date().toISOString(),
    }
    onSave(newExpense)
  }

  const toggleSharedBy = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      sharedBy: prev.sharedBy.includes(userId)
        ? prev.sharedBy.filter(id => id !== userId)
        : [...prev.sharedBy, userId],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {expense ? t('form.editExpense') : t('form.addExpense')}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.description')}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.amount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.currency')}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
              >
                <option value="EUR">€ EUR</option>
                <option value="CHF">CHF</option>
                <option value="CNY">¥ CNY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.date')}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.paidBy')}
            </label>
            <select
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
              required
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.sharedBy')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {users.map(user => (
                <label
                  key={user.id}
                  className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.sharedBy.includes(user.id)}
                    onChange={() => toggleSharedBy(user.id)}
                    className="w-4 h-4 text-ski-primary focus:ring-ski-primary"
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.category')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
            >
              <option value="">{t('form.selectCategory')}</option>
              <option value={t('form.categories.food.value')}>{t('form.categories.food')}</option>
              <option value={t('form.categories.accommodation.value')}>{t('form.categories.accommodation')}</option>
              <option value={t('form.categories.transport.value')}>{t('form.categories.transport')}</option>
              <option value={t('form.categories.skiEquipment.value')}>{t('form.categories.skiEquipment')}</option>
              <option value={t('form.categories.skiTicket.value')}>{t('form.categories.skiTicket')}</option>
              <option value={t('form.categories.shopping.value')}>{t('form.categories.shopping')}</option>
              <option value={t('form.categories.other.value')}>{t('form.categories.other')}</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-ski-primary text-white py-3 rounded-lg font-medium hover:bg-ski-primary/90 transition-colors"
            >
              {t('common.save')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

