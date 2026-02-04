"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroBanner {
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  bgGradient: string | null
}

export function HeroSection({ banner }: { banner: HeroBanner | null }) {
  const defaultBanner = {
    title: "Свежие цветы\nк любому празднику",
    subtitle: "Тюльпаны и мимоза напрямую с плантаций. Доставка в день заказа.",
    buttonText: "Перейти в каталог",
    buttonLink: "/catalog",
    bgGradient: "linear-gradient(135deg, #ff2d55 0%, #bf5af2 100%)",
  }

  const data = banner || defaultBanner

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: data.bgGradient || defaultBanner.bgGradient }}
      />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-zinc-300">Весенняя коллекция 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight whitespace-pre-line mb-6"
          >
            {data.title}
          </motion.h1>

          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-300 mb-8 max-w-xl"
            >
              {data.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {data.buttonText && data.buttonLink && (
              <Button asChild size="lg" className="text-base">
                <Link href={data.buttonLink}>
                  {data.buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" className="text-base" asChild>
              <a href="tel:+79991234567">
                Позвонить нам
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
          >
            <div>
              <p className="text-3xl font-bold text-white">10 000+</p>
              <p className="text-sm text-zinc-400">довольных клиентов</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2 часа</p>
              <p className="text-sm text-zinc-400">быстрая доставка</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-sm text-zinc-400">свежие цветы</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
