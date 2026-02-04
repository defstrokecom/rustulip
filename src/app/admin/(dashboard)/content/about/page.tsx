"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface AboutContent {
  heroTitle: string
  heroSubtitle: string
  storyTitle: string
  storyText1: string
  storyText2: string
  storyText3: string
  storyImage: string
  storyImageTitle: string
  storyImageSubtitle: string
}

export default function AboutContentPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState<AboutContent>({
    heroTitle: "О компании РусТюльпан",
    heroSubtitle: "Мы — команда энтузиастов, которые верят, что свежие цветы могут сделать любой день особенным.",
    storyTitle: "Наша история",
    storyText1: "Всё началось с простой идеи — сделать покупку свежих цветов простой и доступной. Мы начали работать напрямую с плантациями в Голландии, Эквадоре и России.",
    storyText2: "Сегодня РусТюльпан — это современная компания с собственным складом, холодильными камерами для хранения цветов и командой профессионалов.",
    storyText3: "Мы специализируемся на оптовых и розничных поставках тюльпанов и мимозы — самых востребованных цветов весеннего сезона. Наши клиенты — это цветочные магазины, event-агентства и частные покупатели.",
    storyImage: "",
    storyImageTitle: "Голландские луковицы",
    storyImageSubtitle: "премиум качество",
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content/about")
      if (res.ok) {
        const data = await res.json()
        if (data.content) {
          setContent(data.content)
        }
      }
    } catch (error) {
      console.error("Failed to fetch content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (res.ok) {
        toast({
          title: "Сохранено",
          description: "Контент страницы 'О нас' обновлён",
          variant: "success",
        })
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const file = files[0]

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setContent((prev) => ({ ...prev, storyImage: data.url }))
        toast({
          title: "Изображение загружено",
          variant: "success",
        })
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить файл",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Страница "О компании"</h1>
          <p className="text-zinc-400 mt-1">Редактирование контента страницы</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Заголовок страницы</CardTitle>
              <CardDescription>Верхняя часть страницы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  placeholder="О компании РусТюльпан"
                />
              </div>
              <div className="space-y-2">
                <Label>Подзаголовок</Label>
                <Textarea
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Story Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Изображение</CardTitle>
              <CardDescription>Картинка в секции "Наша история"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image preview/upload */}
              <div className="space-y-2">
                <Label>Изображение</Label>
                {content.storyImage ? (
                  <div className="relative aspect-square max-w-[200px] rounded-lg overflow-hidden bg-zinc-800 group">
                    <img
                      src={content.storyImage}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, storyImage: "" })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-6 text-center transition-colors max-w-[200px] aspect-square flex flex-col items-center justify-center">
                    <input
                      type="file"
                      id="story-image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label htmlFor="story-image-upload" className="cursor-pointer block">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 mx-auto text-zinc-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
                          <p className="text-sm text-zinc-400">Загрузить</p>
                        </>
                      )}
                    </label>
                  </div>
                )}
                
                {/* URL input alternative */}
                <div className="flex gap-2 mt-2">
                  <Input
                    value={content.storyImage}
                    onChange={(e) => setContent({ ...content, storyImage: e.target.value })}
                    placeholder="Или вставьте URL изображения"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Заголовок под картинкой</Label>
                <Input
                  value={content.storyImageTitle}
                  onChange={(e) => setContent({ ...content, storyImageTitle: e.target.value })}
                  placeholder="Голландские луковицы"
                />
              </div>

              <div className="space-y-2">
                <Label>Подпись под картинкой</Label>
                <Input
                  value={content.storyImageSubtitle}
                  onChange={(e) => setContent({ ...content, storyImageSubtitle: e.target.value })}
                  placeholder="премиум качество"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Секция "Наша история"</CardTitle>
              <CardDescription>Текстовый контент</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Заголовок секции</Label>
                <Input
                  value={content.storyTitle}
                  onChange={(e) => setContent({ ...content, storyTitle: e.target.value })}
                  placeholder="Наша история"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Абзац 1</Label>
                  <Textarea
                    value={content.storyText1}
                    onChange={(e) => setContent({ ...content, storyText1: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Абзац 2</Label>
                  <Textarea
                    value={content.storyText2}
                    onChange={(e) => setContent({ ...content, storyText2: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Абзац 3</Label>
                  <Textarea
                    value={content.storyText3}
                    onChange={(e) => setContent({ ...content, storyText3: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
