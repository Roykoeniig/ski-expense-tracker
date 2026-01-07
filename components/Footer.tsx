'use client'

import { useLanguage } from '@/lib/language'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-white/30 py-6 mt-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-gray-700 space-y-2 font-medium">
          <p>
            {t('copyright.ownedBy')} <span className="font-semibold">苏子云 Louis</span> {t('copyright.founded')} <span className="font-semibold">滑雪飞飞飞群体</span>
          </p>
          <p>
            {t('copyright.createdBy')} <span className="font-semibold">王荣舜 Roy</span>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} {t('copyright.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}

