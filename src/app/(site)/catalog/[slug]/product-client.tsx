"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  Truck,
  Shield,
  Clock,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import { toast } from "@/hooks/use-toast"
import { ProductCard } from "@/components/site/product-card"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  price: number
  oldPrice: number | null
  quantity: number
  minOrder: number
  images: string
  isNew: boolean
  isHit: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  color: string
  price: number
  oldPrice: number | null
  images: string
  isNew: boolean
  isHit: boolean
  category: {
    name: string
    slug: string
  }
}

// Color to gradient mapping
const colorGradients: Record<string, { bg: string; icon: string }> = {
  "Красный": { bg: "from-red-600 via-red-500 to-rose-400", icon: "🌷" },
  "Жёлтый": { bg: "from-yellow-500 via-amber-400 to-orange-300", icon: "🌻" },
  "Розовый": { bg: "from-pink-500 via-rose-400 to-pink-300", icon: "🌸" },
  "Белый": { bg: "from-slate-200 via-white to-gray-100", icon: "🤍" },
  "Фиолетовый": { bg: "from-purple-600 via-violet-500 to-purple-400", icon: "💜" },
  "Оранжевый": { bg: "from-orange-500 via-amber-400 to-yellow-400", icon: "🧡" },
}

const defaultGradient = { bg: "from-pink-500 via-rose-400 to-red-400", icon: "🌺" }

export function ProductPageClient({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: RelatedProduct[]
}) {
  const addItem = useCartStore((state) => state.addItem)
  const [qty, setQty] = useState(product.minOrder || 1)
  const [imageError, setImageError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const images = (() => {
    try {
      return JSON.parse(product.images)
    } catch {
      return []
    }
  })()

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || "",
        color: product.color,
      })
    }

    toast({
      title: "Добавлено в корзину",
      description: `${product.name} × ${qty}`,
      variant: "success",
    })
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const gradientStyle = colorGradients[product.color] || defaultGradient
  const showPlaceholder = !images[0] || imageError

  const features = [
    { icon: Truck, text: "Доставка от 2 часов" },
    { icon: Shield, text: "Гарантия свежести" },
    { icon: Clock, text: "Работаем 24/7" },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-white transition-colors">
            Каталог
          </Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.category.slug}`}
            className="hover:text-white transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Back button */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад в каталог
        </Link>

        {/* Product */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900"
            >
              {showPlaceholder ? (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradientStyle.bg} flex items-center justify-center`}
                >
                  <span className="text-9xl opacity-80 drop-shadow-lg">
                    {gradientStyle.icon}
                  </span>
                </div>
              ) : (
                <Image
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">Новинка</Badge>}
                {product.isHit && <Badge variant="hit">Хит</Badge>}
                {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-pink-500"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <p className="text-pink-400 text-sm mb-2">{product.category.name}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-zinc-400">{product.color}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-zinc-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-green-400 font-medium">
                  Экономия {formatPrice(product.oldPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-zinc-300">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-zinc-400">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQty(Math.max(product.minOrder || 1, qty - 1))}
                    disabled={qty <= (product.minOrder || 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-white font-medium">
                    {qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQty(qty + 1)}
                    disabled={product.quantity > 0 && qty >= product.quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {product.minOrder > 1 && (
                  <span className="text-sm text-zinc-500">
                    Мин. заказ: {product.minOrder} шт.
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  В корзину — {formatPrice(product.price * qty)}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-pink-400" />
                    </div>
                    <p className="text-xs text-zinc-400">{feature.text}</p>
                  </div>
                )
              })}
            </div>

            {/* Stock info */}
            {product.quantity > 0 && product.quantity <= 10 && (
              <p className="text-amber-400 text-sm">
                ⚠️ Осталось только {product.quantity} шт.
              </p>
            )}
          </motion.div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">
              Похожие товары
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
