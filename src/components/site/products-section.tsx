"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"

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

interface ProductsSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  showViewAll?: boolean
  viewAllLink?: string
}

export function ProductsSection({
  title,
  subtitle,
  products,
  showViewAll = true,
  viewAllLink = "/catalog",
}: ProductsSectionProps) {
  return (
    <section className="py-20 bg-[#6B5B4F]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#C9A227] mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-[#E8E0D4]/80">{subtitle}</p>}
          </div>
          {showViewAll && (
            <Button 
              variant="ghost" 
              asChild
              className="text-[#C9A227] hover:text-[#D4AF37] hover:bg-[#C9A227]/10"
            >
              <Link href={viewAllLink}>
                Смотреть все
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
