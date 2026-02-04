"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  sortOrder: number
  isActive: boolean
  _count: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  })

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openEditDialog = (category: Category | null) => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        isActive: category.isActive,
      })
    } else {
      setForm({ name: "", description: "", image: "", isActive: true })
    }
    setEditDialog({ open: true, category })
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Введите название категории", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const url = editDialog.category
        ? `/api/admin/categories/${editDialog.category.id}`
        : "/api/admin/categories"
      
      const res = await fetch(url, {
        method: editDialog.category ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: editDialog.category ? "Категория обновлена" : "Категория создана",
          variant: "success",
        })
        setEditDialog({ open: false, category: null })
        fetchCategories()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save category:", error)
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.category) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${deleteDialog.category.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({ title: "Категория удалена", variant: "success" })
        setDeleteDialog({ open: false, category: null })
        fetchCategories()
      } else {
        const data = await res.json()
        toast({ title: data.error || "Ошибка удаления", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({ title: "Ошибка удаления", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      })

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === category.id ? { ...c, isActive: !c.isActive } : c
          )
        )
        toast({
          title: category.isActive ? "Категория скрыта" : "Категория активирована",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Failed to toggle category:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Категории</h1>
          <p className="text-zinc-400 mt-1">Управление категориями товаров</p>
        </div>
        <Button onClick={() => openEditDialog(null)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderTree className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Нет категорий</h3>
            <p className="text-zinc-400 mb-4">Создайте первую категорию товаров</p>
            <Button onClick={() => openEditDialog(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить категорию
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!category.isActive ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-zinc-500 cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">
                          {category.name}
                        </h3>
                        {!category.isActive && (
                          <span className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-300 rounded">
                            Скрыта
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {category._count.products} товаров • /{category.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(category)}
                        title={category.isActive ? "Скрыть" : "Показать"}
                      >
                        {category.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteDialog({ open: true, category })}
                        disabled={category._count.products > 0}
                        title={category._count.products > 0 ? "Нельзя удалить категорию с товарами" : "Удалить"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, category: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.category ? "Редактировать категорию" : "Новая категория"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Тюльпаны"
              />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Описание категории..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>URL изображения</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-pink-500"
              />
              <span className="text-sm text-zinc-300">Активна</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialog({ open: false, category: null })}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, category: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить категорию?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить категорию &quot;{deleteDialog.category?.name}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, category: null })}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
