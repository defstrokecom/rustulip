"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface UploadedImage {
  url: string
  name: string
  uploadedAt: Date
}

export default function MediaPage() {
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleAddUrl = () => {
    if (!imageUrl.trim()) {
      toast({ title: "Введите URL изображения", variant: "destructive" })
      return
    }

    // Validate URL
    try {
      new URL(imageUrl)
    } catch {
      toast({ title: "Некорректный URL", variant: "destructive" })
      return
    }

    const newImage: UploadedImage = {
      url: imageUrl.trim(),
      name: imageUrl.split("/").pop() || "image",
      uploadedAt: new Date(),
    }

    setUploadedImages((prev) => [newImage, ...prev])
    setImageUrl("")
    toast({ title: "Изображение добавлено", variant: "success" })
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast({ title: "Скопировано!", variant: "success" })
    } catch {
      toast({ title: "Ошибка копирования", variant: "destructive" })
    }
  }

  const externalImageHosts = [
    { name: "Imgur", url: "https://imgur.com/upload" },
    { name: "ImgBB", url: "https://imgbb.com" },
    { name: "Postimages", url: "https://postimages.org" },
    { name: "Cloudinary", url: "https://cloudinary.com" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Медиа</h1>
        <p className="text-zinc-400 mt-1">Управление изображениями</p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-zinc-300">
                Для хранения изображений рекомендуем использовать внешние сервисы.
                Загрузите изображение на один из сервисов ниже и вставьте полученную ссылку.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {externalImageHosts.map((host) => (
                  <a
                    key={host.name}
                    href={host.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
                  >
                    {host.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Image URL */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить изображение</CardTitle>
          <CardDescription>Вставьте URL изображения с внешнего хостинга</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddUrl()
                  }
                }}
              />
            </div>
            <Button onClick={handleAddUrl}>
              <Upload className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Добавленные изображения</CardTitle>
          <CardDescription>
            Нажмите на изображение, чтобы скопировать URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedImages.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Нет изображений
              </h3>
              <p className="text-zinc-400">
                Добавьте URL изображения выше
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={`${image.url}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-zinc-800 cursor-pointer"
                  onClick={() => copyToClipboard(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {copiedUrl === image.url ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : (
                      <Copy className="w-6 h-6 text-white" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Советы по работе с изображениями</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-400">
          <p>• Используйте изображения в форматах JPG, PNG или WebP</p>
          <p>• Оптимальный размер для товаров: 800×800 пикселей</p>
          <p>• Для баннеров рекомендуем размер 1920×600 пикселей</p>
          <p>• Сжимайте изображения перед загрузкой для быстрой загрузки сайта</p>
          <p>• Храните оригиналы изображений на случай, если понадобится перезаливка</p>
        </CardContent>
      </Card>
    </div>
  )
}
