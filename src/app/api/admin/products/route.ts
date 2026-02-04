import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

// GET - Получить все товары
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")
    const isActive = searchParams.get("isActive")

    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (isActive !== null && isActive !== "") {
      where.isActive = isActive === "true"
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// POST - Создать новый товар
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, color, price, oldPrice, quantity, minOrder, images, categoryId, isActive, isNew, isHit } = body

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Генерируем slug
    let slug = slugify(name)
    
    // Проверяем уникальность slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || "",
        price: parseInt(price),
        oldPrice: oldPrice ? parseInt(oldPrice) : null,
        quantity: parseInt(quantity) || 0,
        minOrder: parseInt(minOrder) || 1,
        images: JSON.stringify(images || []),
        categoryId,
        isActive: isActive ?? true,
        isNew: isNew ?? false,
        isHit: isHit ?? false,
      },
      include: { category: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
