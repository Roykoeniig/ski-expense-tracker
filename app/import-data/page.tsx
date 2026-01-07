'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language'
import { getUsersSync, getExpensesSync } from '@/lib/storage'
import { Upload, CheckCircle, XCircle, Loader2, Database, AlertCircle } from 'lucide-react'

export default function ImportDataPage() {
  const { t } = useLanguage()
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

  const [localData, setLocalData] = useState<{
    users: number
    expenses: number
  } | null>(null)

  // 检查本地数据
  const checkLocalData = () => {
    try {
      const users = getUsersSync()
      const expenses = getExpensesSync()
      
      // 过滤掉主管理员（不需要导入）
      const filteredUsers = users.filter(u => u.id !== 'main-admin')
      
      setLocalData({
        users: filteredUsers.length,
        expenses: expenses.length,
      })
    } catch (error: any) {
      setStatus({
        loading: false,
        success: false,
        message: `检查本地数据失败: ${error.message}`,
      })
    }
  }

  // 导入数据到 Supabase
  const importData = async () => {
    setStatus({ loading: true, success: null, message: '正在导入数据...' })

    try {
      // 从 localStorage 获取数据
      const users = getUsersSync()
      const expenses = getExpensesSync()

      // 过滤掉主管理员
      const filteredUsers = users.filter(u => u.id !== 'main-admin')

      if (filteredUsers.length === 0 && expenses.length === 0) {
        setStatus({
          loading: false,
          success: false,
          message: '本地没有可导入的数据',
        })
        return
      }

      // 发送到 API 导入
      const response = await fetch('/api/import-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: filteredUsers,
          expenses: expenses,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message: data.message || '导入成功！',
          details: data.imported,
        })
        
        // 重新检查本地数据
        checkLocalData()
      } else {
        setStatus({
          loading: false,
          success: false,
          message: data.error || '导入失败',
          details: data,
        })
      }
    } catch (error: any) {
      setStatus({
        loading: false,
        success: false,
        message: `导入失败: ${error.message}`,
        details: error,
      })
    }
  }

  // 页面加载时检查本地数据
  useEffect(() => {
    checkLocalData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-8 h-8 text-ski-primary" />
          <h1 className="text-3xl font-bold text-gray-800">📥 数据导入到 Supabase</h1>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            <strong>说明：</strong>此功能将把本地存储（localStorage）中的数据导入到 Supabase 数据库。
          </p>
          <p className="text-sm text-blue-700">
            导入后，所有设备都能看到相同的数据，实现数据同步。
          </p>
        </div>

        {/* 本地数据统计 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">📊 本地数据统计</h3>
          {localData ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">用户数量：</span>
                <span className="font-semibold">{localData.users} 个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">记账记录：</span>
                <span className="font-semibold">{localData.expenses} 条</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">点击下方按钮检查本地数据</p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3 mb-6">
          <button
            onClick={checkLocalData}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Database className="w-5 h-5" />
            <span>检查本地数据</span>
          </button>

          <button
            onClick={async () => {
              setStatus({ loading: true, success: null, message: '正在测试数据库连接...' });
              try {
                const response = await fetch('/api/test-import', { method: 'POST' });
                const data = await response.json();
                if (data.success) {
                  setStatus({
                    loading: false,
                    success: true,
                    message: data.message || '数据库测试通过！',
                    details: data.tests,
                  });
                } else {
                  setStatus({
                    loading: false,
                    success: false,
                    message: data.error || '数据库测试失败',
                    details: { ...data, hint: data.hint },
                  });
                }
              } catch (error: any) {
                setStatus({
                  loading: false,
                  success: false,
                  message: `测试失败: ${error.message}`,
                });
              }
            }}
            disabled={status.loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {status.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>测试中...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>测试数据库连接</span>
              </>
            )}
          </button>

          <button
            onClick={importData}
            disabled={status.loading || !localData || (localData.users === 0 && localData.expenses === 0)}
            className="w-full bg-ski-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ski-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {status.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>导入中...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>导入到 Supabase</span>
              </>
            )}
          </button>
        </div>

        {/* 状态显示 */}
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
                  <div className="mt-2">
                    {status.success && (
                      <div className="text-sm text-green-700">
                        {status.details.users !== undefined && (
                          <p>✅ 导入用户：{status.details.users} 个</p>
                        )}
                        {status.details.expenses !== undefined && (
                          <p>✅ 导入记账：{status.details.expenses} 条</p>
                        )}
                        {status.details.tests && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(status.details.tests).map(([key, value]) => (
                              <p key={key}>{String(value)}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {!status.success && (
                      <div className="mt-2 space-y-2">
                        {status.details.hint && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            <strong>💡 提示：</strong> {status.details.hint}
                          </div>
                        )}
                        {status.details.details && (
                          <div className="text-sm text-red-700">
                            <strong>错误详情：</strong> {status.details.details}
                          </div>
                        )}
                        {status.details.code && (
                          <div className="text-sm text-red-700">
                            <strong>错误代码：</strong> {status.details.code}
                          </div>
                        )}
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-red-600">
                            查看完整错误信息
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                            {JSON.stringify(status.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 提示信息 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 注意事项</h3>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>导入会覆盖 Supabase 数据库中的现有数据</li>
            <li>主管理员账户（舜）不会被导入，需要在 Supabase 中手动创建</li>
            <li>导入完成后，建议清除浏览器缓存并重新登录</li>
            <li>如果导入失败，请检查 Supabase 表是否已创建，RLS 策略是否已配置</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

