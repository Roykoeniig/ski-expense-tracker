'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'de' as const, label: 'Deutsch', flag: '🇩🇪' },
  ]

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="切换语言 / Switch Language / Sprache wechseln"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.label}
        </span>
        <span className="text-base sm:hidden">
          {languages.find(l => l.code === language)?.flag}
        </span>
      </button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  language === lang.code ? 'bg-ski-primary/10 text-ski-primary font-semibold' : 'text-gray-700'
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

