import nodemailer from "nodemailer"

interface EmailSettings {
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  settings: EmailSettings
}

export async function sendEmail({ to, subject, html, settings }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: parseInt(settings.smtpPort) || 587,
      secure: parseInt(settings.smtpPort) === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    })

    await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail || settings.smtpUser}>`,
      to,
      subject,
      html,
    })

    return { success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function formatOrderEmailHtml(order: {
  orderNumber: string
  customerName: string
  phone: string
  email?: string | null
  address?: string | null
  comment?: string | null
  totalAmount: number
  items: Array<{
    product: { name: string; color: string }
    quantity: number
    price: number
  }>
}): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          ${item.product.name} (${item.product.color})
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity} шт.
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          ${(item.price * item.quantity / 100).toLocaleString("ru-RU")} ₽
        </td>
      </tr>
    `
    )
    .join("")

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ec4899; margin: 0;">🌷 РусТюльпан</h1>
        <p style="color: #888; margin: 5px 0 0;">Новый заказ</p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #111; margin: 0 0 10px; font-size: 18px;">
          Заказ ${order.orderNumber}
        </h2>
        <p style="color: #666; margin: 0;">
          ${new Date().toLocaleString("ru-RU")}
        </p>
      </div>

      <h3 style="color: #111; font-size: 16px; margin: 20px 0 10px;">Клиент</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #666;">Имя:</td>
          <td style="padding: 5px 0; color: #111;">${order.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #666;">Телефон:</td>
          <td style="padding: 5px 0; color: #111;">
            <a href="tel:${order.phone}" style="color: #ec4899;">${order.phone}</a>
          </td>
        </tr>
        ${order.email ? `
        <tr>
          <td style="padding: 5px 0; color: #666;">Email:</td>
          <td style="padding: 5px 0; color: #111;">${order.email}</td>
        </tr>
        ` : ""}
        ${order.address ? `
        <tr>
          <td style="padding: 5px 0; color: #666;">Адрес:</td>
          <td style="padding: 5px 0; color: #111;">${order.address}</td>
        </tr>
        ` : ""}
      </table>

      ${order.comment ? `
      <h3 style="color: #111; font-size: 16px; margin: 20px 0 10px;">Комментарий</h3>
      <p style="color: #666; background: #f9fafb; padding: 10px; border-radius: 4px; margin: 0;">
        ${order.comment}
      </p>
      ` : ""}

      <h3 style="color: #111; font-size: 16px; margin: 20px 0 10px;">Товары</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 8px; text-align: left; font-weight: 600;">Товар</th>
            <th style="padding: 10px 8px; text-align: center; font-weight: 600;">Кол-во</th>
            <th style="padding: 10px 8px; text-align: right; font-weight: 600;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 15px 8px; font-weight: 600; font-size: 18px;">
              Итого:
            </td>
            <td style="padding: 15px 8px; font-weight: 600; font-size: 18px; text-align: right; color: #ec4899;">
              ${(order.totalAmount / 100).toLocaleString("ru-RU")} ₽
            </td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders" 
           style="display: inline-block; background: #ec4899; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          Открыть в админке
        </a>
      </div>

      <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
        Это автоматическое уведомление от сайта РусТюльпан
      </p>
    </div>
  `
}
