'use client'

import { useState, useEffect } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/language'
import { getPhotos, addPhotoSync, deletePhotoSync } from '@/lib/storage'
import { Photo } from '@/lib/database'

export default function PhotosPage() {
  const { t } = useLanguage()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 从数据库同步照片
    const loadPhotos = async () => {
      setIsLoading(true)
      try {
        const photosData = await getPhotos()
        setPhotos(photosData)
      } catch (error) {
        console.error('Failed to load photos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPhotos()
  }, [])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: reader.result as string,
          date: new Date().toISOString(),
        }
        const updatedPhotos = [...photos, newPhoto]
        setPhotos(updatedPhotos)
        // 使用同步函数，会自动同步到数据库
        addPhotoSync(newPhoto)
        
        // 触发自定义事件，通知背景组件更新
        window.dispatchEvent(new Event('photosUpdated'))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(t('photos.deleteConfirm'))) {
      const updatedPhotos = photos.filter(p => p.id !== id)
      setPhotos(updatedPhotos)
      // 使用同步函数，会自动同步到数据库
      deletePhotoSync(id)
      
      // 触发自定义事件，通知背景组件更新
      window.dispatchEvent(new Event('photosUpdated'))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('photos.title')}</h1>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <label className="flex items-center space-x-2 bg-ski-primary text-white px-4 py-2 rounded-lg hover:bg-ski-primary/90 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>{t('photos.upload')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl border border-white/20">
          <div className="w-16 h-16 border-4 border-ski-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">正在加载照片...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-12 text-center shadow-2xl border border-white/20">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">{t('photos.noPhotos')}</p>
          <label className="inline-flex items-center space-x-2 bg-ski-primary text-white px-4 py-2 rounded-lg hover:bg-ski-primary/90 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>{t('photos.uploadFirst')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.description || '滑雪照片'}
                className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(photo.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 功能说明 */}
      <div className="mt-8 bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-ski-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t('photos.wallpaperFeature')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('photos.wallpaperDesc')}
            </p>
            <p className="text-sm text-gray-600 mt-3">
              💡 {t('photos.wallpaperTip')}
            </p>
            {photos.length > 0 && (
              <div className="mt-4 p-3 bg-ski-primary/10 rounded-lg">
                <p className="text-sm text-ski-primary font-medium">
                  📸 {t('photos.currentCount', { count: photos.length })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 照片预览弹窗 */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.description || '滑雪照片'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

