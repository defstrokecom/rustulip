"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  isActive: boolean
  createdAt: string
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState<{ open: boolean; page: Page | null }>({
    open: false,
    page: null,
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; page: Page | null }>({
    open: false,
    page: null,
  })
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
  })

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages")
      if (res.ok) {
        const data = await res.json()
        setPages(data.pages || [])
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const openEditDialog = (page: Page | null) => {
    if (page) {
      setForm({
        title: page.title,
        content: page.content,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isActive: page.isActive,
      })
    } else {
      setForm({
        title: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
        isActive: true,
      })
    }
    setEditDialog({ open: true, page })
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const url = editDialog.page
        ? `/api/admin/pages/${editDialog.page.id}`
        : "/api/admin/pages"
      
      const res = await fetch(url, {
        method: editDialog.page ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: editDialog.page ? "Страница обновлена" : "Страница создана",
          variant: "success",
        })
        setEditDialog({ open: false, page: null })
        fetchPages()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save page:", error)
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.page) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/${deleteDialog.page.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({ title: "Страница удалена", variant: "success" })
        setDeleteDialog({ open: false, page: null })
        fetchPages()
      }
    } catch (error) {
      console.error("Failed to delete page:", error)
      toast({ title: "Ошибка удаления", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (page: Page) => {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !page.isActive }),
      })

      if (res.ok) {
        setPages((prev) =>
          prev.map((p) =>
            p.id === page.id ? { ...p, isActive: !p.isActive } : p
          )
        )
        toast({
          title: page.isActive ? "Страница скрыта" : "Страница опубликована",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Failed to toggle page:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Страницы</h1>
          <p className="text-zinc-400 mt-1">Статические страницы сайта</p>
        </div>
        <Button onClick={() => openEditDialog(null)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать страницу
        </Button>
      </div>

      {/* Pages List */}
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
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Нет страниц</h3>
            <p className="text-zinc-400 mb-4">Создайте первую статическую страницу</p>
            <Button onClick={() => openEditDialog(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать страницу
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!page.isActive ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">
                          {page.title}
                        </h3>
                        {!page.isActive && (
                          <span className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-300 rounded">
                            Черновик
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">/{page.slug}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(page)}
                      >
                        {page.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(page)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteDialog({ open: true, page })}
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
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, page: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editDialog.page ? "Редактировать страницу" : "Новая страница"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Заголовок *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Условия доставки"
              />
            </div>
            <div className="space-y-2">
              <Label>Содержимое</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Текст страницы (поддерживает HTML)..."
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Title (SEO)</Label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="Заголовок для поисковых систем"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description (SEO)</Label>
              <Textarea
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="Описание для поисковых систем"
                rows={2}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-pink-500"
              />
              <span className="text-sm text-zinc-300">Опубликовать</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialog({ open: false, page: null })}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, page: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить страницу?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить страницу &quot;{deleteDialog.page?.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, page: null })}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
