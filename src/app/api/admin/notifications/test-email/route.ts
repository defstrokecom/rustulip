import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Получаем настройки
    const emailSettings = await prisma.siteSettings.findUnique({
      where: { key: "email_notifications" },
    })

    if (!emailSettings) {
      return NextResponse.json(
        { error: "Email настройки не найдены. Сначала сохраните настройки." },
        { status: 400 }
      )
    }

    const settings = JSON.parse(emailSettings.value)

    if (!settings.smtpHost || !settings.smtpUser) {
      return NextResponse.json(
        { error: "Заполните SMTP настройки" },
        { status: 400 }
      )
    }

    // Отправляем тестовое письмо
    const result = await sendEmail({
      to: email,
      subject: "Тестовое письмо от РусТюльпан",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">🌷 РусТюльпан</h1>
          <p>Это тестовое письмо для проверки настроек email-рассылки.</p>
          <p>Если вы видите это письмо — настройки работают корректно!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Время отправки: ${new Date().toLocaleString("ru-RU")}
          </p>
        </div>
      `,
      settings,
    })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: result.error || "Ошибка отправки" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Failed to send test email:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
