"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Pencil,
  Trash2,
  Award,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface Advantage {
  id: string
  title: string
  description: string | null
  icon: string | null
  sortOrder: number
  isActive: boolean
}

const availableIcons = [
  "Star", "Heart", "Award", "Shield", "Truck", "Clock",
  "Leaf", "Gift", "Phone", "MapPin", "Sparkles", "BadgePercent"
]

export default function AdvantagesPage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState<{ open: boolean; advantage: Advantage | null }>({
    open: false,
    advantage: null,
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; advantage: Advantage | null }>({
    open: false,
    advantage: null,
  })
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "Star",
    sortOrder: 0,
    isActive: true,
  })

  const fetchAdvantages = async () => {
    try {
      const res = await fetch("/api/admin/advantages")
      if (res.ok) {
        const data = await res.json()
        setAdvantages(data.advantages || [])
      }
    } catch (error) {
      console.error("Failed to fetch advantages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvantages()
  }, [])

  const openEditDialog = (advantage: Advantage | null) => {
    if (advantage) {
      setForm({
        title: advantage.title,
        description: advantage.description || "",
        icon: advantage.icon || "Star",
        sortOrder: advantage.sortOrder,
        isActive: advantage.isActive,
      })
    } else {
      setForm({
        title: "",
        description: "",
        icon: "Star",
        sortOrder: advantages.length,
        isActive: true,
      })
    }
    setEditDialog({ open: true, advantage })
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Введите заголовок", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const url = editDialog.advantage
        ? `/api/admin/advantages/${editDialog.advantage.id}`
        : "/api/admin/advantages"
      
      const res = await fetch(url, {
        method: editDialog.advantage ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({
          title: editDialog.advantage ? "Преимущество обновлено" : "Преимущество создано",
          variant: "success",
        })
        setEditDialog({ open: false, advantage: null })
        fetchAdvantages()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save advantage:", error)
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.advantage) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/advantages/${deleteDialog.advantage.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({ title: "Преимущество удалено", variant: "success" })
        setDeleteDialog({ open: false, advantage: null })
        fetchAdvantages()
      }
    } catch (error) {
      console.error("Failed to delete advantage:", error)
      toast({ title: "Ошибка удаления", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (advantage: Advantage) => {
    try {
      const res = await fetch(`/api/admin/advantages/${advantage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !advantage.isActive }),
      })

      if (res.ok) {
        setAdvantages((prev) =>
          prev.map((a) =>
            a.id === advantage.id ? { ...a, isActive: !a.isActive } : a
          )
        )
        toast({
          title: advantage.isActive ? "Преимущество скрыто" : "Преимущество активировано",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Failed to toggle advantage:", error)
    }
  }

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Award className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Преимущества</h1>
          <p className="text-zinc-400 mt-1">Блок "Почему выбирают нас" на главной</p>
        </div>
        <Button onClick={() => openEditDialog(null)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {/* Advantages List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : advantages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Award className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Нет преимуществ</h3>
            <p className="text-zinc-400 mb-4">Добавьте преимущества вашей компании</p>
            <Button onClick={() => openEditDialog(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!advantage.isActive ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-zinc-500 cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                      {getIconComponent(advantage.icon || "Star")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">
                          {advantage.title}
                        </h3>
                        {!advantage.isActive && (
                          <span className="px-2 py-0.5 text-xs bg-zinc-700 text-zinc-300 rounded">
                            Скрыто
                          </span>
                        )}
                      </div>
                      {advantage.description && (
                        <p className="text-sm text-zinc-400 truncate">
                          {advantage.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(advantage)}
                      >
                        {advantage.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(advantage)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteDialog({ open: true, advantage })}
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
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, advantage: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.advantage ? "Редактировать" : "Новое преимущество"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Быстрая доставка"
              />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Доставим в течение 2 часов..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Иконка</Label>
              <Select value={form.icon} onValueChange={(value) => setForm({ ...form, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <span className="flex items-center gap-2">
                        {getIconComponent(icon)}
                        {icon}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Порядок сортировки</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-pink-500"
              />
              <span className="text-sm text-zinc-300">Активно</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialog({ open: false, advantage: null })}>
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
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, advantage: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить преимущество?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{deleteDialog.advantage?.title}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, advantage: null })}>
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
