import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Получить все преимущества
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const advantages = await prisma.advantage.findMany({
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json({ advantages })
  } catch (error) {
    console.error("Failed to fetch advantages:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// POST - Создать преимущество
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, icon, sortOrder, isActive } = body

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const advantage = await prisma.advantage.create({
      data: {
        title,
        description: description || null,
        icon: icon || "Star",
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(advantage, { status: 201 })
  } catch (error) {
    console.error("Failed to create advantage:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
