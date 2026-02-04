"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/site/product-card"

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
  images: string
  isNew: boolean
  isHit: boolean
  categoryId: string
  category: Category
}

interface CatalogClientProps {
  products: Product[]
  categories: Category[]
}

const colors = [
  "Красный",
  "Жёлтый",
  "Розовый",
  "Белый",
  "Фиолетовый",
  "Оранжевый",
]

const sortOptions = [
  { value: "newest", label: "Сначала новые" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "name", label: "По названию" },
]

export function CatalogClient({ products, categories }: CatalogClientProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory(null)
    setSelectedColors([])
    setSortBy("newest")
  }

  const hasActiveFilters = search || selectedCategory || selectedColors.length > 0

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.color.toLowerCase().includes(searchLower)
      )
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory)
    }

    // Colors
    if (selectedColors.length > 0) {
      result = result.filter((p) => selectedColors.includes(p.color))
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // newest - default order from DB
        break
    }

    return result
  }, [products, search, selectedCategory, selectedColors, sortBy])

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
            Каталог
          </h1>
          <p className="text-zinc-400">
            {filteredProducts.length} товаров
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 shrink-0 space-y-6"
          >
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Название, цвет..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Категория</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null
                      ? "bg-pink-500/20 text-pink-400"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Все категории
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-pink-500/20 text-pink-400"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Цвет</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedColors.includes(color)
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "bg-zinc-800 text-zinc-400 border border-transparent hover:border-zinc-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Сбросить фильтры
              </Button>
            )}
          </motion.aside>

          {/* Mobile filters toggle */}
          <div className="lg:hidden flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="lg:hidden space-y-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    selectedCategory === null
                      ? "bg-pink-500/20 text-pink-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Все
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      selectedCategory === cat.id
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      selectedColors.includes(color)
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="secondary">
                    {filteredProducts.length} из {products.length}
                  </Badge>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 focus:outline-none focus:border-pink-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-zinc-400 mb-4">Товары не найдены</p>
                <Button variant="outline" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
