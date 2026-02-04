"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  Upload,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductForm {
  name: string
  slug: string
  description: string
  color: string
  price: string
  oldPrice: string
  quantity: string
  minOrder: string
  categoryId: string
  isActive: boolean
  isNew: boolean
  isHit: boolean
  images: string[]
}

const colors = [
  "Красный",
  "Жёлтый",
  "Розовый",
  "Белый",
  "Фиолетовый",
  "Оранжевый",
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    description: "",
    color: "",
    price: "",
    oldPrice: "",
    quantity: "",
    minOrder: "1",
    categoryId: "",
    isActive: true,
    isNew: false,
    isHit: false,
    images: [],
  })
  const [newImageUrl, setNewImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [productId])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        const product = data.product || data
        
        let images: string[] = []
        try {
          images = JSON.parse(product.images || "[]")
        } catch {
          images = []
        }

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          color: product.color || "",
          price: String(product.price || ""),
          oldPrice: product.oldPrice ? String(product.oldPrice) : "",
          quantity: String(product.quantity || ""),
          minOrder: String(product.minOrder || "1"),
          categoryId: product.categoryId || "",
          isActive: product.isActive ?? true,
          isNew: product.isNew ?? false,
          isHit: product.isHit ?? false,
          images,
        })
      } else {
        toast({
          title: "Ошибка",
          description: "Товар не найден",
          variant: "destructive",
        })
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товар",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    const translitMap: Record<string, string> = {
      а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
      з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
      п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
      ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
    }

    return name
      .toLowerCase()
      .split("")
      .map((char) => translitMap[char] || char)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }))
      setNewImageUrl("")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        
        if (res.ok) {
          const data = await res.json()
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }))
        } else {
          const error = await res.json()
          toast({
            title: "Ошибка загрузки",
            description: error.error || "Не удалось загрузить файл",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить файл",
          variant: "destructive",
        })
      }
    }
    
    setUploading(false)
    // Reset input
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          color: form.color,
          price: parseFloat(form.price),
          oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
          quantity: parseInt(form.quantity),
          minOrder: parseInt(form.minOrder) || 1,
          categoryId: form.categoryId,
          isActive: form.isActive,
          isNew: form.isNew,
          isHit: form.isHit,
          images: JSON.stringify(form.images),
        }),
      })

      if (res.ok) {
        toast({
          title: "Товар обновлён",
          description: "Изменения успешно сохранены",
          variant: "success",
        })
        router.push("/admin/products")
      } else {
        const data = await res.json()
        throw new Error(data.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Failed to update product:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить товар",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Редактирование товара</h1>
          <p className="text-zinc-400 mt-1">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Тюльпан Red Beauty"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL (slug)</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="tulip-red-beauty"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Подробное описание товара..."
                    rows={4}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория *</Label>
                    <Select
                      value={form.categoryId}
                      onValueChange={(value) => setForm({ ...form, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Цвет *</Label>
                    <Select
                      value={form.color}
                      onValueChange={(value) => setForm({ ...form, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите цвет" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Цена и наличие</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldPrice">Старая цена (₽)</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.oldPrice}
                      onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Мин. заказ</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      min="1"
                      value={form.minOrder}
                      onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Изображения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File upload */}
                <div className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-6 text-center transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    {uploading ? (
                      <>
                        <Loader2 className="w-10 h-10 mx-auto text-zinc-500 mb-3 animate-spin" />
                        <p className="text-zinc-400">Загрузка...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto text-zinc-500 mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">Нажмите для загрузки</p>
                        <p className="text-sm text-zinc-500">JPG, PNG, WebP, GIF до 5MB</p>
                      </>
                    )}
                  </label>
                </div>

                {/* URL input */}
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Или вставьте URL: https://example.com/image.jpg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addImage()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {form.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {form.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg bg-zinc-800 overflow-hidden group"
                      >
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ""
                            ;(e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs bg-[#C9A227] text-[#3D3229] font-medium rounded">
                            Главное
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-zinc-500 py-4">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет загруженных изображений</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Статус</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <p className="font-medium text-white">Активен</p>
                    <p className="text-sm text-zinc-400">Отображается в каталоге</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <p className="font-medium text-white">Новинка</p>
                    <p className="text-sm text-zinc-400">Показать бейдж "Новинка"</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isHit}
                    onChange={(e) => setForm({ ...form, isHit: e.target.checked })}
                    className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <p className="font-medium text-white">Хит продаж</p>
                    <p className="text-sm text-zinc-400">Показать бейдж "Хит"</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/admin/products")}
                >
                  Отмена
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
