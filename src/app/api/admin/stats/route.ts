import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    // Получаем статистику по товарам
    const [totalProducts, activeProducts, lowStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { quantity: { lt: 10 } } }),
    ])

    // Получаем статистику по заказам
    const [totalOrders, todayOrders, weekOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: weekStart } },
      }),
    ])

    // Получаем выручку
    const todayRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: todayStart },
        status: { not: "CANCELLED" },
      },
    })

    const weekRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: weekStart },
        status: { not: "CANCELLED" },
      },
    })

    // Получаем последние заказы
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      todayOrders,
      weekOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      weekRevenue: weekRevenue._sum.totalAmount || 0,
      recentOrders,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
