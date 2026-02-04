"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  image: string | null
  bgGradient: string | null
  isActive: boolean
  sortOrder: number
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState<{ open: boolean; banner: Banner | null }>({
    open: false,
    banner: null,
  })
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm<Partial<Banner>>()

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners")
      if (res.ok) {
        const data = await res.json()
        setBanners(data.banners || [])
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error)
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (banner: Banner | null) => {
    if (banner) {
      setValue("title", banner.title)
      setValue("subtitle", banner.subtitle || "")
      setValue("buttonText", banner.buttonText || "")
      setValue("buttonLink", banner.buttonLink || "")
      setValue("image", banner.image || "")
      setValue("bgGradient", banner.bgGradient || "")
      setValue("isActive", banner.isActive)
    } else {
      reset({
        title: "",
        subtitle: "",
        buttonText: "Перейти в каталог",
        buttonLink: "/catalog",
        image: "",
        bgGradient: "linear-gradient(135deg, #ff2d55 0%, #bf5af2 100%)",
        isActive: true,
      })
    }
    setEditDialog({ open: true, banner })
  }

  const onSubmit = async (data: Partial<Banner>) => {
    setSaving(true)
    try {
      const url = editDialog.banner
        ? `/api/admin/banners/${editDialog.banner.id}`
        : "/api/admin/banners"
      const method = editDialog.banner ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast({
          title: editDialog.banner ? "Баннер обновлён" : "Баннер создан",
          variant: "success",
        })
        setEditDialog({ open: false, banner: null })
        fetchBanners()
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить баннер",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteBanner = async (id: string) => {
    if (!confirm("Удалить баннер?")) return

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id))
        toast({ title: "Баннер удалён", variant: "success" })
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить баннер",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Баннеры</h1>
          <p className="text-zinc-400 mt-1">Управление баннерами на главной</p>
        </div>
        <Button onClick={() => openEditDialog(null)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить баннер
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-zinc-800 rounded-t-2xl" />
              <CardContent className="p-4">
                <div className="h-6 bg-zinc-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Баннеров нет</h3>
            <p className="text-zinc-400 mb-4">Добавьте первый баннер</p>
            <Button onClick={() => openEditDialog(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить баннер
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div
                  className="h-32 flex items-center justify-center text-white p-6"
                  style={{
                    background: banner.bgGradient || "#1f1f23",
                  }}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold whitespace-pre-line">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-sm opacity-80 mt-1">{banner.subtitle}</p>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={banner.isActive ? "success" : "secondary"}>
                      {banner.isActive ? "Активен" : "Скрыт"}
                    </Badge>
                    {banner.buttonText && (
                      <span className="text-sm text-zinc-400">
                        Кнопка: {banner.buttonText}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(banner)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Изменить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => deleteBanner(banner.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, banner: null })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editDialog.banner ? "Редактировать баннер" : "Новый баннер"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок *</Label>
              <Textarea
                id="title"
                placeholder="Свежие цветы&#10;к любому празднику"
                {...register("title", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Подзаголовок</Label>
              <Input
                id="subtitle"
                placeholder="Доставка в день заказа"
                {...register("subtitle")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Текст кнопки</Label>
                <Input
                  id="buttonText"
                  placeholder="Перейти в каталог"
                  {...register("buttonText")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Ссылка кнопки</Label>
                <Input
                  id="buttonLink"
                  placeholder="/catalog"
                  {...register("buttonLink")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgGradient">CSS градиент фона</Label>
              <Input
                id="bgGradient"
                placeholder="linear-gradient(135deg, #ff2d55 0%, #bf5af2 100%)"
                {...register("bgGradient")}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-pink-500"
                {...register("isActive")}
              />
              <span className="text-zinc-300">Активен</span>
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditDialog({ open: false, banner: null })}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
