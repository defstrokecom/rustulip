import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Получить все баннеры
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json({ banners })
  } catch (error) {
    console.error("Failed to fetch banners:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST - Создать баннер
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, subtitle, buttonText, buttonLink, image, bgGradient, isActive } = body

    const maxOrder = await prisma.heroBanner.aggregate({
      _max: { sortOrder: true },
    })

    const banner = await prisma.heroBanner.create({
      data: {
        title,
        subtitle: subtitle || null,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        image: image || null,
        bgGradient: bgGradient || null,
        isActive: isActive ?? true,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Failed to create banner:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
