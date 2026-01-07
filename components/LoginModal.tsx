'use client'

import { useState } from 'react'
import { X, Lock, User as UserIcon } from 'lucide-react'
import { login } from '@/lib/auth'
import { useLanguage } from '@/lib/language'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = login(username, password, rememberMe)
    
    if (result.success) {
      onLoginSuccess()
      onClose()
      setUsername('')
      setPassword('')
      setRememberMe(false)
    } else {
      setError(result.error || '登录失败')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full shadow-2xl border border-white/30">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">登录</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                placeholder="输入用户名"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码（管理员需要）
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                placeholder="输入密码（管理员必填）"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              提示：如果用户设置了密码，需要输入密码登录
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-ski-primary border-gray-300 rounded focus:ring-ski-primary"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              记住我（30天内自动登录）
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-ski-primary text-white py-3 rounded-lg font-medium hover:bg-ski-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

