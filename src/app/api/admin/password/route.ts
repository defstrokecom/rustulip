import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import bcrypt from "bcryptjs"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Изменить пароль
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: { id: session.user.id },
    })

    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный текущий пароль" },
        { status: 400 }
      )
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.admin.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to change password:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
