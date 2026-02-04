import { prisma } from "@/lib/prisma"
import { CatalogClient } from "./catalog-client"

async function getCatalogData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  return { products, categories }
}

export const metadata = {
  title: "Каталог | РусТюльпан",
  description: "Каталог свежих тюльпанов и мимозы. Выберите идеальные цветы для любого случая.",
}

export default async function CatalogPage() {
  const { products, categories } = await getCatalogData()

  return <CatalogClient products={products} categories={categories} />
}
