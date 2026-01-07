'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mountain, Home, Calculator, MessageSquare, Users, Camera } from 'lucide-react'
import { useLanguage } from '@/lib/language'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/', labelKey: 'common.home', icon: Home },
    { href: '/expenses', labelKey: 'common.expenses', icon: Calculator },
    { href: '/chat', labelKey: 'common.chat', icon: MessageSquare },
    { href: '/settlement', labelKey: 'common.settlement', icon: Users },
    { href: '/photos', labelKey: 'common.photos', icon: Camera },
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
                className={`flex flex-col items-center space-y-1 px-2 sm:px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-ski-primary bg-ski-primary/10'
                    : 'text-gray-600 hover:text-ski-primary'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs font-medium hidden sm:inline">{t(item.labelKey)}</span>
              </Link>
            )
          })}
          <div className="flex flex-col items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}

