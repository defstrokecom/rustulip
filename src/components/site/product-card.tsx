"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import { toast } from "@/hooks/use-toast"

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
  category: {
    name: string
    slug: string
  }
}

// Color to gradient mapping for flower placeholders
const colorGradients: Record<string, { bg: string; icon: string }> = {
  "Красный": { bg: "from-red-600 via-red-500 to-rose-400", icon: "🌷" },
  "Жёлтый": { bg: "from-yellow-500 via-amber-400 to-orange-300", icon: "🌷" },
  "Розовый": { bg: "from-pink-500 via-rose-400 to-pink-300", icon: "🌷" },
  "Белый": { bg: "from-slate-200 via-white to-gray-100", icon: "🌷" },
  "Фиолетовый": { bg: "from-purple-600 via-violet-500 to-purple-400", icon: "🌷" },
  "Оранжевый": { bg: "from-orange-500 via-amber-400 to-yellow-400", icon: "🌷" },
}

const defaultGradient = { bg: "from-yellow-500 via-amber-400 to-orange-300", icon: "🌷" }

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [imageError, setImageError] = useState(false)

  const images = (() => {
    try {
      return JSON.parse(product.images)
    } catch {
      return []
    }
  })()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "",
      color: product.color,
    })

    toast({
      title: "Добавлено в корзину",
      description: product.name,
      variant: "success",
    })
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const gradientStyle = colorGradients[product.color] || defaultGradient
  const showPlaceholder = !images[0] || imageError

  return (
    <Link href={`/catalog/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative rounded-xl bg-[#5A4A3F] border border-[#C9A227]/20 overflow-hidden hover:border-[#C9A227]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative aspect-square bg-[#6F5D50] overflow-hidden">
          {showPlaceholder ? (
            <div className={`w-full h-full bg-gradient-to-br ${gradientStyle.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
              <span className="text-7xl opacity-90 drop-shadow-lg">{gradientStyle.icon}</span>
            </div>
          ) : (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge className="bg-[#C9A227] text-[#3D3229]">Новинка</Badge>}
            {product.isHit && <Badge className="bg-red-600 text-white">Хит</Badge>}
            {discount > 0 && <Badge className="bg-red-600 text-white">-{discount}%</Badge>}
          </div>

          {/* Quick add button - always visible */}
          <div className="absolute bottom-3 left-3 right-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#C9A227]/90 hover:bg-[#D4AF37] text-[#3D3229] font-semibold backdrop-blur-sm"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              В корзину
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#C9A227]/70 mb-1 uppercase tracking-wide">{product.category.name}</p>
          <h3 className="font-heading font-medium text-white mb-1 line-clamp-1 group-hover:text-[#C9A227] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[#E8E0D4]/70 mb-3">{product.color}</p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#C9A227]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[#E8E0D4]/50 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
