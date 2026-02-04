import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Получить публичные настройки Telegram (для клиентов)
export async function GET() {
  try {
    const telegramSettings = await prisma.siteSettings.findUnique({
      where: { key: "telegram_notifications" },
    })

    if (telegramSettings) {
      const settings = JSON.parse(telegramSettings.value)
      // Возвращаем только публичные данные
      return NextResponse.json({
        enabled: settings.enabled ?? false,
        sellerUsername: settings.sellerUsername ?? "",
      })
    }

    // Дефолтные настройки
    return NextResponse.json({
      enabled: true,
      sellerUsername: "shapo_sh",
    })
  } catch (error) {
    console.error("Failed to fetch telegram settings:", error)
    return NextResponse.json({
      enabled: true,
      sellerUsername: "shapo_sh",
    })
  }
}
