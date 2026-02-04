import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/site/hero-section"
import { AdvantagesSection } from "@/components/site/advantages-section"
import { ProductsSection } from "@/components/site/products-section"

async function getHomeData() {
  const [banner, advantages, products] = await Promise.all([
    prisma.heroBanner.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.advantage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ])

  return { banner, advantages, products }
}

export default async function HomePage() {
  const { banner, advantages, products } = await getHomeData()

  return (
    <>
      {/* Hero Section */}
      <HeroSection banner={banner} />

      {/* Advantages */}
      {advantages.length > 0 && (
        <AdvantagesSection advantages={advantages} />
      )}

      {/* Popular Products */}
      {products.length > 0 && (
        <ProductsSection
          title="Популярные товары"
          subtitle="Самые востребованные цветы этого сезона"
          products={products}
        />
      )}
    </>
  )
}
