import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
    },
  })
  return product
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      NOT: { id: currentId },
    },
    include: { category: true },
    take: 4,
  })
  return products
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) return {}
  
  return {
    title: `${product.name} | РусТюльпан`,
    description: product.description || `Купить ${product.name} в РусТюльпан`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />
}
