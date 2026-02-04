"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Plus, X, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const productSchema = z.object({
  name: z.string().min(1, "Введите название товара"),
  description: z.string().optional(),
  color: z.string().min(1, "Укажите цвет"),
  price: z.string().min(1, "Укажите цену"),
  oldPrice: z.string().optional(),
  quantity: z.string().min(1, "Укажите количество"),
  minOrder: z.string().optional(),
  categoryId: z.string().min(1, "Выберите категорию"),
  isActive: z.boolean(),
  isNew: z.boolean(),
  isHit: z.boolean(),
})

type ProductForm = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
      price: "",
      oldPrice: "",
      quantity: "0",
      minOrder: "1",
      categoryId: "",
      isActive: true,
      isNew: false,
      isHit: false,
    },
  })

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    }
    fetchCategories()
  }, [])

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Math.round(parseFloat(data.price) * 100),
          oldPrice: data.oldPrice ? Math.round(parseFloat(data.oldPrice) * 100) : null,
          quantity: parseInt(data.quantity),
          minOrder: parseInt(data.minOrder || "1"),
          images,
        }),
      })

      if (res.ok) {
        toast({
          title: "Товар создан",
          description: "Товар успешно добавлен в каталог",
          variant: "success",
        })
        router.push("/admin/products")
      } else {
        const error = await res.json()
        throw new Error(error.message || "Failed to create product")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать товар",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImageUrl = () => {
    const url = prompt("Введите URL изображения:")
    if (url) {
      setImages([...images, url])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
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
          <h1 className="text-3xl font-bold text-white">Новый товар</h1>
          <p className="text-zinc-400 mt-1">Добавление товара в каталог</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      placeholder="Тюльпан Red Princess"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      placeholder="Описание товара..."
                      {...register("description")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Цвет *</Label>
                      <Input
                        id="color"
                        placeholder="Красный"
                        {...register("color")}
                      />
                      {errors.color && (
                        <p className="text-sm text-red-400">{errors.color.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Категория *</Label>
                      <Select
                        value={watch("categoryId")}
                        onValueChange={(value) => setValue("categoryId", value)}
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
                      {errors.categoryId && (
                        <p className="text-sm text-red-400">{errors.categoryId.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Цена и наличие</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Цена (₽) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="45.00"
                        {...register("price")}
                      />
                      {errors.price && (
                        <p className="text-sm text-red-400">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oldPrice">Старая цена (₽)</Label>
                      <Input
                        id="oldPrice"
                        type="number"
                        step="0.01"
                        placeholder="55.00"
                        {...register("oldPrice")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Количество (шт.) *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="100"
                        {...register("quantity")}
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-400">{errors.quantity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minOrder">Мин. заказ (шт.)</Label>
                      <Input
                        id="minOrder"
                        type="number"
                        placeholder="1"
                        {...register("minOrder")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Изображения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800 group"
                      >
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 hover:border-pink-500 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-pink-400 transition-colors"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Добавить</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Статус</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-pink-500 focus:ring-pink-500"
                      {...register("isActive")}
                    />
                    <span className="text-zinc-300">Активен</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-pink-500 focus:ring-pink-500"
                      {...register("isNew")}
                    />
                    <span className="text-zinc-300">Новинка</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-pink-500 focus:ring-pink-500"
                      {...register("isHit")}
                    />
                    <span className="text-zinc-300">Хит продаж</span>
                  </label>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Создать товар
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}
