'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Home, Calculator, MessageSquare, Users, Camera } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/expenses', label: '记账', icon: Calculator },
    { href: '/chat', label: 'AI记账', icon: MessageSquare },
    { href: '/settlement', label: '结算', icon: Users },
    { href: '/photos', label: '照片', icon: Camera },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-ski-primary bg-ski-primary/10'
                    : 'text-gray-600 hover:text-ski-primary'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

