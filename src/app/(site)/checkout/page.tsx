"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email").optional().or(z.literal("")),
  comment: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары перед оформлением заказа",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (res.ok) {
        const order = await res.json()
        
        // Сохраняем данные заказа для Telegram ссылки
        const orderData = {
          orderNumber: order.orderNumber,
          customerName: data.customerName,
          phone: data.phone,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: getTotal(),
          comment: data.comment || "",
        }
        sessionStorage.setItem("lastOrder", JSON.stringify(orderData))
        
        clearCart()
        router.push(`/checkout/success?order=${order.orderNumber}`)
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Попробуйте ещё раз.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-[#5A4A3F] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#C9A227]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              Корзина пуста
            </h1>
            <p className="text-[#E8E0D4]/70 mb-6">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button asChild>
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-heading text-3xl font-bold text-[#C9A227]">
            Оформление заказа
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 rounded-xl bg-[#5A4A3F] border border-[#C9A227]/20 space-y-6"
            >
              <h2 className="font-heading text-lg font-semibold text-white">
                Контактные данные
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Ваше имя *</Label>
                  <Input
                    id="customerName"
                    placeholder="Иван Петров"
                    {...register("customerName")}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-400">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (необязательно)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea
                  id="comment"
                  placeholder="Время доставки, особые пожелания..."
                  {...register("comment")}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Оформление...
                  </>
                ) : (
                  `Оформить заказ на ${formatPrice(getTotal())}`
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 rounded-xl bg-[#5A4A3F] border border-[#C9A227]/20 sticky top-24">
              <h2 className="font-heading text-lg font-semibold text-white mb-4">
                Ваш заказ
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#E8E0D4]/70">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#C9A227]/20 pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-white">Итого</span>
                  <span className="text-xl font-bold text-[#C9A227]">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
