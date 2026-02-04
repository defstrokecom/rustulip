import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateOrderNumber } from "@/lib/utils"
import { sendEmail, formatOrderEmailHtml } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, phone, email, address, comment, items } = body

    if (!customerName || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Вычисляем общую сумму
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.price * item.quantity
    }

    // Генерируем уникальный номер заказа
    let orderNumber = generateOrderNumber()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      })
      if (!existing) break
      orderNumber = generateOrderNumber()
      attempts++
    }

    // Создаём заказ
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        email: email || null,
        address: address || null,
        comment: comment || null,
        totalAmount,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    // Отправляем уведомления
    await sendEmailNotification(order)
    await sendTelegramNotification(order)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// Email уведомление
async function sendEmailNotification(order: {
  orderNumber: string
  customerName: string
  phone: string
  email: string | null
  address: string | null
  comment: string | null
  totalAmount: number
  items: { product: { name: string; color: string }; quantity: number; price: number }[]
}) {
  try {
    const emailSettingsRow = await prisma.siteSettings.findUnique({
      where: { key: "email_notifications" },
    })

    if (!emailSettingsRow) return

    const settings = JSON.parse(emailSettingsRow.value)

    if (!settings.enabled || !settings.adminEmail || !settings.smtpHost) return

    const html = formatOrderEmailHtml(order)

    await sendEmail({
      to: settings.adminEmail,
      subject: `🌷 Новый заказ ${order.orderNumber}`,
      html,
      settings,
    })
  } catch (error) {
    console.error("Failed to send email notification:", error)
  }
}

async function sendTelegramNotification(order: {
  orderNumber: string
  customerName: string
  phone: string
  comment: string | null
  totalAmount: number
  items: { product: { name: string }; quantity: number; price: number }[]
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.product.name} × ${item.quantity} — ${(item.price * item.quantity / 100).toFixed(0)}₽`
    )
    .join("\n")

  const message = `
🌷 *Новый заказ ${order.orderNumber}*

👤 Клиент: ${order.customerName}
📱 Телефон: ${order.phone}

📦 *Состав заказа:*
${itemsList}

💰 *Итого: ${(order.totalAmount / 100).toFixed(0)}₽*
${order.comment ? `\n💬 Комментарий: ${order.comment}` : ""}
  `.trim()

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
  } catch (error) {
    console.error("Failed to send Telegram notification:", error)
  }
}
