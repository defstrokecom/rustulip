import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Обновить профиль
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, email } = await request.json()

    // Проверяем, не занят ли email
    if (email !== session.user.email) {
      const existing = await prisma.admin.findUnique({
        where: { email },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Email уже используется" },
          { status: 400 }
        )
      }
    }

    const admin = await prisma.admin.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    })
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
