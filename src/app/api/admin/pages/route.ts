import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

// GET - Получить все страницы
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// POST - Создать страницу
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, metaTitle, metaDesc, isActive } = body

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    let slug = slugify(title)
    const existing = await prisma.page.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: content || "",
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error("Failed to create page:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
