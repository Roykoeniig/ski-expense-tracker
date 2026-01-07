'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestDBPage() {
  const [status, setStatus] = useState<{
    loading: boolean
    success: boolean | null
    message: string
    details?: any
  }>({
    loading: false,
    success: null,
    message: '',
  })

  const checkConfig = async () => {
    setStatus({ loading: true, success: null, message: '正在检查配置...' })
    
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message: data.message || '数据库连接成功！',
          details: data,
        })
      } else {
        setStatus({
          loading: false,
          success: false,
          message: data.message || '配置未完成',
          details: data,
        })
      }
    } catch (error: any) {
      setStatus({
        loading: false,
        success: false,
        message: `检查失败: ${error.message}`,
        details: error,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔍 数据库配置检查</h1>
        
        <div className="mb-6">
          <button
            onClick={checkConfig}
            disabled={status.loading}
            className="bg-ski-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ski-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {status.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>检查中...</span>
              </>
            ) : (
              <span>检查配置</span>
            )}
          </button>
        </div>

        {status.success !== null && (
          <div className={`p-4 rounded-lg ${
            status.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {status.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  status.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {status.message}
                </p>
                {status.details && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      查看详细信息
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(status.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {status.success === false && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📚 配置指南</h3>
            <p className="text-sm text-blue-700 mb-3">
              如果配置未完成，请按照以下步骤操作：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>访问 <a href="https://supabase.com" target="_blank" className="underline">Supabase</a> 创建项目</li>
              <li>在 SQL Editor 中执行建表 SQL（见 SETUP_STEP_BY_STEP.md）</li>
              <li>在 Settings{' > '}API 中获取 Project URL 和 anon key</li>
              <li>在 Vercel 中配置环境变量：
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                  <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                </ul>
              </li>
              <li>在 Vercel 中重新部署项目</li>
              <li>再次点击"检查配置"按钮</li>
            </ol>
            <p className="text-xs text-blue-600 mt-4">
              💡 详细步骤请查看项目中的 <strong>SETUP_STEP_BY_STEP.md</strong> 文件
            </p>
          </div>
        )}

        {status.success === true && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ 配置成功！</h3>
            <p className="text-sm text-green-700">
              你的数据库已正确配置。现在数据会自动同步到 Supabase，所有设备都能看到相同的数据了！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

