import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/lib/language'
import BackgroundWallpaper from '@/components/BackgroundWallpaper'
import AuthGuard from '@/components/AuthGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: '🎿 滑雪记账 - 多人记账应用 | Ski Expense Tracker',
  description: '专为滑雪旅行设计的多人记账应用，支持多币种、AI智能记账 | Multi-user expense tracker for ski trips with multi-currency and AI support',
  keywords: 'ski, expense tracker, 滑雪记账, 多人记账, multi-currency, AI, 苏子云 Louis, 王荣舜 Roy, 滑雪飞飞飞群体',
  authors: [
    { name: '王荣舜 Roy', url: 'https://github.com/rongshunwang' },
  ],
  creator: '王荣舜 Roy',
  publisher: '苏子云 Louis - 滑雪飞飞飞群体',
  openGraph: {
    title: '🎿 滑雪记账 - 多人记账应用',
    description: '专为滑雪旅行设计的多人记账应用',
    type: 'website',
    siteName: '滑雪记账 - Ski Expense Tracker',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthGuard>
            <BackgroundWallpaper />
            <Navigation />
            <main className="min-h-screen pb-20 relative z-10">
              {children}
            </main>
            <Footer />
          </AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  )
}

