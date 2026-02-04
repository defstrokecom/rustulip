"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Заказ оформлен!
          </h1>

          {orderNumber && (
            <p className="text-xl text-pink-400 font-medium mb-4">
              № {orderNumber}
            </p>
          )}

          <p className="text-zinc-400 mb-8">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа
          </p>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-8">
            <h3 className="font-medium text-white mb-3">Остались вопросы?</h3>
            <a
              href="tel:+79991234567"
              className="flex items-center justify-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +7 (999) 123-45-67
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
    <Suspense fallback={<div className="py-20 text-center text-zinc-400">Загрузка...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
