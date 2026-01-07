'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'
import LoginModal from './LoginModal'
import { User } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 检查是否已登录（包括记住我的状态）
    const checkAuth = () => {
      if (!isAuthenticated()) {
        setShowLogin(true)
      } else {
        setShowLogin(false)
      }
      setIsChecking(false)
    }
    
    // 延迟一点检查，确保localStorage已加载
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  const handleLoginSuccess = () => {
    setShowLogin(false)
    // 刷新页面以更新权限状态
    window.location.reload()
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ski-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <LoginModal isOpen={showLogin} onClose={() => {}} onLoginSuccess={handleLoginSuccess} />
  }

  return <>{children}</>
}

