'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react'
import { ChatMessage } from '@/types'
import { parseExpenseFromText } from '@/lib/ai'
import { addExpense } from '@/lib/storage'
import { getUsers } from '@/lib/storage'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/language'

export default function ChatPage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  
  useEffect(() => {
    // 根据语言设置欢迎消息
    setMessages([{
      id: '1',
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: new Date().toISOString(),
    }])
  }, [language, t])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async () => {
    if (!input.trim() && !imageFile) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      imageUrl: imagePreview || undefined,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 如果有图片，先上传
      let imageUrl = imagePreview
      if (imageFile) {
        // 这里应该上传到服务器，暂时使用base64
        imageUrl = imagePreview
      }

      // 调用AI解析
      const expense = await parseExpenseFromText(input || t('chat.placeholder'), imageUrl || undefined)

      if (expense) {
        // 自动创建记账
        const users = getUsers()
        if (users.length > 0) {
          const newExpense = {
            id: Date.now().toString(),
            ...expense,
            paidBy: expense.paidBy || users[0].id,
            sharedBy: expense.sharedBy || users.map(u => u.id),
            createdAt: new Date().toISOString(),
          }
          addExpense(newExpense)

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `✅ ${t('chat.autoRecorded')}\n\n${t('expenses.date')}: ${expense.date}\n${t('form.description')}: ${expense.description}\n${t('form.amount')}: ${expense.amount} ${expense.currency}\n${t('form.category')}: ${expense.category || t('form.categories.other')}`,
            timestamp: new Date().toISOString(),
          }
          setMessages(prev => [...prev, assistantMessage])
        }
      } else {
        // 普通聊天
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input, imageUrl }),
        })

        const data = await response.json()
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || t('chat.error'),
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chat.error'),
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setImageFile(null)
      setImagePreview(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('chat.title')}</h1>
        <LanguageSwitcher />
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-ski-primary text-white shadow-lg'
                    : 'bg-white/90 backdrop-blur-md text-gray-800 shadow-2xl border border-white/20'
                }`}
              >
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="上传的图片"
                  className="mb-2 rounded-lg max-w-full h-auto"
                />
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-white/20">
              <Loader2 className="w-5 h-5 animate-spin text-ski-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img
              src={imagePreview}
              alt="预览"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setImagePreview(null)
                setImageFile(null)
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-end space-x-2">
          <label className="p-2 text-gray-600 hover:text-ski-primary cursor-pointer">
            <ImageIcon className="w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={t('chat.placeholder')}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageFile)}
            className="bg-ski-primary text-white p-3 rounded-lg hover:bg-ski-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

