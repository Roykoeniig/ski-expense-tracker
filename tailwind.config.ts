import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ski: {
          primary: '#1E40AF', // 深蓝色 - 滑雪主题
          secondary: '#3B82F6', // 亮蓝色
          accent: '#F59E0B', // 橙色 - 雪地阳光
          snow: '#F8FAFC', // 雪白色
          dark: '#0F172A', // 深色
        },
      },
      backgroundImage: {
        'ski-gradient': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
        'snow-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      },
    },
  },
  plugins: [],
}
export default config

