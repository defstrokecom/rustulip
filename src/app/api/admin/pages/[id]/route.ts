import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

// GET - Получить страницу по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error("Failed to fetch page:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// PUT - Обновить страницу
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, metaTitle, metaDesc, isActive } = body

    const existing = await prisma.page.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    let slug = existing.slug
    if (title && title !== existing.title) {
      slug = slugify(title)
      const slugExists = await prisma.page.findFirst({
        where: { slug, NOT: { id } },
      })
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug,
        content: content !== undefined ? content : existing.content,
        metaTitle: metaTitle !== undefined ? metaTitle : existing.metaTitle,
        metaDesc: metaDesc !== undefined ? metaDesc : existing.metaDesc,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Failed to update page:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE - Удалить страницу
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.page.delete({ where: { id } })
    return NextResponse.json({ message: "Page deleted" })
  } catch (error) {
    console.error("Failed to delete page:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
