import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Получить настройки уведомлений
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const emailSettings = await prisma.siteSettings.findUnique({
      where: { key: "email_notifications" },
    })
    const telegramSettings = await prisma.siteSettings.findUnique({
      where: { key: "telegram_notifications" },
    })

    return NextResponse.json({
      email: emailSettings ? JSON.parse(emailSettings.value) : {
        enabled: false,
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "",
        fromName: "РусТюльпан",
        adminEmail: "",
      },
      telegram: telegramSettings ? JSON.parse(telegramSettings.value) : {
        enabled: false,
        botToken: "",
        chatId: "",
      },
    })
  } catch (error) {
    console.error("Failed to fetch notification settings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// POST - Сохранить настройки уведомлений
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, settings } = body

    const key = type === "email" ? "email_notifications" : "telegram_notifications"
    const label = type === "email" ? "Email уведомления" : "Telegram уведомления"

    await prisma.siteSettings.upsert({
      where: { key },
      create: {
        key,
        value: JSON.stringify(settings),
        type: "json",
        label,
        group: "notifications",
      },
      update: {
        value: JSON.stringify(settings),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save notification settings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
