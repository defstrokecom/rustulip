"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  color: string
  price: number
  oldPrice: number | null
  quantity: number
  images: string
  isActive: boolean
  isNew: boolean
  isHit: boolean
  category: Category
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter)
      if (statusFilter !== "all") params.set("isActive", statusFilter)

      const res = await fetch(`/api/admin/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

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

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [search, categoryFilter, statusFilter])

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      })

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isActive: !p.isActive } : p
          )
        )
        toast({
          title: product.isActive ? "Товар скрыт" : "Товар активирован",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Failed to toggle product:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус товара",
        variant: "destructive",
      })
    }
  }

  const deleteProduct = async () => {
    if (!deleteDialog.product) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteDialog.product.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteDialog.product?.id))
        toast({
          title: "Товар удалён",
          variant: "success",
        })
        setDeleteDialog({ open: false, product: null })
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const getProductImages = (imagesJson: string): string[] => {
    try {
      return JSON.parse(imagesJson)
    } catch {
      return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Товары</h1>
          <p className="text-zinc-400 mt-1">
            Управление каталогом товаров
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="true">Активные</SelectItem>
                <SelectItem value="false">Скрытые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-zinc-800 rounded-t-2xl" />
              <CardContent className="p-4 space-y-3">
                <div className="h-5 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Товары не найдены
            </h3>
            <p className="text-zinc-400 mb-4">
              {search || categoryFilter !== "all" || statusFilter !== "all"
                ? "Попробуйте изменить параметры поиска"
                : "Добавьте первый товар в каталог"}
            </p>
            {!search && categoryFilter === "all" && statusFilter === "all" && (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить товар
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => {
            const images = getProductImages(product.images)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden ${!product.isActive ? "opacity-60" : ""}`}>
                  {/* Image */}
                  <div className="relative h-48 bg-zinc-800">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {product.isNew && <Badge variant="new">Новинка</Badge>}
                      {product.isHit && <Badge variant="hit">Хит</Badge>}
                      {!product.isActive && <Badge variant="secondary">Скрыт</Badge>}
                    </div>
                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleActive(product)}
                        title={product.isActive ? "Скрыть" : "Показать"}
                      >
                        {product.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Category */}
                    <p className="text-xs text-zinc-500 mb-1">
                      {product.category.name}
                    </p>

                    {/* Name */}
                    <h3 className="font-medium text-white mb-1 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Color & Stock */}
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                      <span>{product.color}</span>
                      <span>•</span>
                      <span className={product.quantity < 10 ? "text-amber-400" : ""}>
                        {product.quantity} шт.
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-zinc-500 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="w-4 h-4 mr-1" />
                          Изменить
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteDialog({ open: true, product })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, product: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить товар?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{deleteDialog.product?.name}&quot;?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialog({ open: false, product: null })}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProduct}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
