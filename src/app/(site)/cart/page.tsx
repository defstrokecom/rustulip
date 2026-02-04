"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-zinc-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              Корзина пуста
            </h1>
            <p className="text-zinc-400 mb-6">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button asChild>
              <Link href="/catalog">
                Перейти в каталог
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-bold text-white mb-8"
        >
          Корзина
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3">{item.color}</p>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h2 className="font-heading text-lg font-semibold text-white mb-4">
                Итого
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Товаров</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Сумма</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between">
                  <span className="font-medium text-white">К оплате</span>
                  <span className="text-xl font-bold text-white">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  Оформить заказ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <p className="text-xs text-zinc-500 text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <Link href="/privacy" className="text-pink-400 hover:underline">
                  политикой конфиденциальности
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
