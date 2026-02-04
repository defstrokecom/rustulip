import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Получить все настройки
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const settings = await prisma.siteSettings.findMany({
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// PUT - Обновить настройки
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { settings } = await request.json()

    for (const setting of settings) {
      await prisma.siteSettings.update({
        where: { key: setting.key },
        data: { value: setting.value },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
