import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Получить преимущество по ID
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
    const advantage = await prisma.advantage.findUnique({
      where: { id },
    })

    if (!advantage) {
      return NextResponse.json({ error: "Advantage not found" }, { status: 404 })
    }

    return NextResponse.json(advantage)
  } catch (error) {
    console.error("Failed to fetch advantage:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// PUT - Обновить преимущество
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
    const { title, description, icon, sortOrder, isActive } = body

    const existing = await prisma.advantage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Advantage not found" }, { status: 404 })
    }

    const advantage = await prisma.advantage.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description !== undefined ? description : existing.description,
        icon: icon ?? existing.icon,
        sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    })

    return NextResponse.json(advantage)
  } catch (error) {
    console.error("Failed to update advantage:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE - Удалить преимущество
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
    await prisma.advantage.delete({ where: { id } })
    return NextResponse.json({ message: "Advantage deleted" })
  } catch (error) {
    console.error("Failed to delete advantage:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
