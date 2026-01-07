'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getPhotos } from '@/lib/storage'
import { Photo } from '@/lib/database'

// 不同页面的默认背景图片 - 使用Unsplash的高质量滑雪小镇图片
const defaultBackgroundImages = {
  '/': 'https://images.unsplash.com/photo-1551524164-6cf77f5e1d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90', // Matterhorn 马特洪峰
  '/expenses': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90', // Zermatt 采尔马特
  '/chat': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90', // St. Moritz 圣莫里茨
  '/settlement': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90', // Davos 达沃斯
  '/photos': 'https://images.unsplash.com/photo-1551524164-687d55d7b9c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90', // Interlaken 因特拉肯
}

export default function BackgroundWallpaper() {
  const pathname = usePathname()
  const [currentImage, setCurrentImage] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [userPhotos, setUserPhotos] = useState<Photo[]>([])

  // 从数据库同步用户上传的照片
  useEffect(() => {
    const loadUserPhotos = async () => {
      try {
        // 先从数据库同步照片
        const photos = await getPhotos()
        // 确保照片数组有效
        if (photos.length > 0) {
          // 过滤出有效的照片URL
          const validPhotos = photos.filter(photo => 
            photo.url && 
            (photo.url.startsWith('data:') || photo.url.startsWith('http'))
          )
          setUserPhotos(validPhotos)
        } else {
          setUserPhotos([])
        }
      } catch (error) {
        console.error('Failed to load user photos:', error)
        // 如果数据库同步失败，尝试从本地存储读取
        try {
          const savedPhotos = localStorage.getItem('ski_photos')
          if (savedPhotos) {
            const photos: Photo[] = JSON.parse(savedPhotos)
            const validPhotos = photos.filter(photo => 
              photo.url && 
              (photo.url.startsWith('data:') || photo.url.startsWith('http'))
            )
            setUserPhotos(validPhotos)
          } else {
            setUserPhotos([])
          }
        } catch (e) {
          setUserPhotos([])
        }
      }
    }

    // 立即加载一次
    loadUserPhotos()
    
    // 监听storage变化，当照片墙有新照片时更新
    const handleStorageChange = () => {
      loadUserPhotos()
    }
    
    // 监听同窗口内的storage变化（通过自定义事件）
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('photosUpdated', handleStorageChange)
    
    // 定期检查（作为备用方案，确保照片更新能被检测到）
    const interval = setInterval(() => {
      loadUserPhotos()
    }, 5000) // 改为5秒检查一次，减少数据库请求
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('photosUpdated', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // 获取当前应该显示的图片列表
  useEffect(() => {
    const getImageList = (): string[] => {
      // 如果有用户上传的照片，所有页面都使用这些照片
      if (userPhotos.length > 0) {
        const validPhotos = userPhotos
          .map(photo => photo.url?.trim())
          .filter(url => url && (url.startsWith('data:') || url.startsWith('http')))
        if (validPhotos.length > 0) {
          return validPhotos
        }
      }
      
      // 如果没有照片，使用默认背景
      const defaultImage = defaultBackgroundImages[pathname as keyof typeof defaultBackgroundImages] || defaultBackgroundImages['/']
      return [defaultImage]
    }

    const imageList = getImageList()
    
    if (imageList.length > 0) {
      // 所有页面都根据currentIndex轮播
      const imageIndex = currentIndex % imageList.length
      const selectedImage = imageList[imageIndex]
      
      if (selectedImage && selectedImage.trim() !== '') {
        setCurrentImage(selectedImage)
        setIsLoading(true)
        
        // 预加载图片
        const img = new Image()
        img.src = selectedImage
        img.onload = () => {
          setIsLoading(false)
        }
        img.onerror = () => {
          // 如果加载失败，使用默认背景
          const defaultImage = defaultBackgroundImages[pathname as keyof typeof defaultBackgroundImages] || defaultBackgroundImages['/']
          setCurrentImage(defaultImage)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [pathname, userPhotos, currentIndex])

  // 自动轮播：每10秒切换到下一张（所有页面都轮播）
  useEffect(() => {
    const getImageList = (): string[] => {
      // 如果有用户上传的照片，使用这些照片
      if (userPhotos.length > 0) {
        const validPhotos = userPhotos
          .map(photo => photo.url?.trim())
          .filter(url => url && (url.startsWith('data:') || url.startsWith('http')))
        if (validPhotos.length > 0) {
          return validPhotos
        }
      }
      // 否则使用默认背景
      return [defaultBackgroundImages[pathname as keyof typeof defaultBackgroundImages] || defaultBackgroundImages['/']]
    }

    const imageList = getImageList()

    if (imageList.length <= 1) return // 只有一张图片时不需要轮播

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length)
    }, 10000) // 10秒切换一次

    return () => clearInterval(interval)
  }, [userPhotos, pathname])

  // 确保首页有背景图片（即使加载中）
  const displayImage = currentImage || (pathname === '/' ? defaultBackgroundImages['/'] : defaultBackgroundImages[pathname as keyof typeof defaultBackgroundImages] || defaultBackgroundImages['/'])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 背景图片 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: displayImage ? `url(${displayImage})` : undefined,
          backgroundAttachment: 'fixed', // 固定背景，滚动时产生视差效果
        }}
      >
        {/* 渐变遮罩层，确保内容可读性 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* 滑雪主题渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-br from-ski-primary/10 via-transparent to-ski-secondary/10" />
      </div>
      
      {/* 额外的装饰效果 - 模拟雪景光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
        
        {/* 雪花光点效果 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
      </div>
      
      {/* 加载时的占位背景 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
      )}
    </div>
  )
}

