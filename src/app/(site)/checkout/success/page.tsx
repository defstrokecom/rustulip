"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Phone, ArrowRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { formatPrice } from "@/lib/utils"

// Telegram username продавца
const TELEGRAM_USERNAME = "shapo_sh"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderData {
  orderNumber: string
  customerName: string
  phone: string
  items: OrderItem[]
  total: number
  comment: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [telegramUrl, setTelegramUrl] = useState<string>("")

  useEffect(() => {
    // Получаем данные заказа из sessionStorage
    const savedOrder = sessionStorage.getItem("lastOrder")
    if (savedOrder) {
      const data: OrderData = JSON.parse(savedOrder)
      setOrderData(data)
      
      // Формируем текст сообщения для Telegram
      const itemsList = data.items
        .map(item => `• ${item.name} × ${item.quantity} шт. = ${formatPrice(item.price * item.quantity)}`)
        .join("\n")
      
      const message = `🌷 Заказ №${data.orderNumber}

👤 Имя: ${data.customerName}
📞 Телефон: ${data.phone}

📦 Состав заказа:
${itemsList}

💰 Итого: ${formatPrice(data.total)}${data.comment ? `\n\n💬 Комментарий: ${data.comment}` : ""}

Здравствуйте! Я оформил заказ на сайте и хотел бы уточнить детали.`
      
      // Создаём ссылку на Telegram
      const encodedMessage = encodeURIComponent(message)
      setTelegramUrl(`https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`)
      
      // Очищаем sessionStorage после использования
      // sessionStorage.removeItem("lastOrder")
    }
  }, [])

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Заказ оформлен!
          </h1>

          {orderNumber && (
            <p className="text-xl text-[#C9A227] font-medium mb-4">
              № {orderNumber}
            </p>
          )}

          <p className="text-[#E8E0D4]/80 mb-8">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа
          </p>

          {/* Telegram Button */}
          {telegramUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-lg bg-[#0088cc] hover:bg-[#0099dd] text-white font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                Написать в Telegram
              </a>
              <p className="text-sm text-[#E8E0D4]/60 mt-2">
                Откроется чат с данными вашего заказа
              </p>
            </motion.div>
          )}

          <div className="p-6 rounded-xl bg-[#5A4A3F] border border-[#C9A227]/20 mb-8">
            <h3 className="font-medium text-white mb-3">Остались вопросы?</h3>
            <a
              href="tel:+79609022444"
              className="flex items-center justify-center gap-2 text-[#C9A227] hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-4 h-4" />
              8-960-902-24-44
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/catalog">
                Продолжить покупки
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#E8E0D4]/70">Загрузка...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
