"use client"

import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import { LucideIcon, Star } from "lucide-react"

interface Advantage {
  id: string
  title: string
  description: string | null
  icon: string | null
}

// Type-safe icon lookup
const iconMap: Record<string, LucideIcon> = {
  Leaf: LucideIcons.Leaf,
  Truck: LucideIcons.Truck,
  BadgePercent: LucideIcons.BadgePercent,
  Clock: LucideIcons.Clock,
  Star: LucideIcons.Star,
  Heart: LucideIcons.Heart,
  Shield: LucideIcons.Shield,
  Award: LucideIcons.Award,
  Sparkles: LucideIcons.Sparkles,
  Gift: LucideIcons.Gift,
  Phone: LucideIcons.Phone,
  MapPin: LucideIcons.MapPin,
}

export function AdvantagesSection({ advantages }: { advantages: Advantage[] }) {
  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return Star
    return iconMap[iconName] || Star
  }

  return (
    <section className="py-20 bg-[#5A4A3F]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#C9A227] mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-[#E8E0D4]/80 max-w-2xl mx-auto">
            Мы делаем всё, чтобы ваши цветы были свежими, а доставка — быстрой
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = getIcon(advantage.icon)
            return (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-xl bg-[#6F5D50]/50 border border-[#C9A227]/20 hover:border-[#C9A227]/50 transition-all duration-300"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#C9A227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-[#C9A227] flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-6 h-6 text-[#3D3229]" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white mb-2">
                    {advantage.title}
                  </h3>
                  {advantage.description && (
                    <p className="text-sm text-[#E8E0D4]/70 leading-relaxed">
                      {advantage.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
