import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Обновить баннер
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

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        buttonText: body.buttonText || null,
        buttonLink: body.buttonLink || null,
        image: body.image || null,
        bgGradient: body.bgGradient || null,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Failed to update banner:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE - Удалить баннер
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
    await prisma.heroBanner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete banner:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
