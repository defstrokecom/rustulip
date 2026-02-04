"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
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
    title: "Тюльпаны\nк 8 марта",
    subtitle: "Компания «РусТюльпан» предлагает вам тюльпаны, выращенные из отборных голландских луковиц.",
    buttonText: "Перейти в каталог",
    buttonLink: "/catalog",
    bgGradient: null,
  }

  const data = banner || defaultBanner

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#6F5D50]">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay" />
      

      {/* Gold line decorations */}
      <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
      <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-8"
          >
            {/* Tulip Icon */}
            <div className="text-[#C9A227] mb-4">
              <svg width="42" height="66" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2C14 2 6 10 6 18C6 22 9.5 25 14 25C18.5 25 22 22 22 18C22 10 14 2 14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M14 4C14 4 10 10 10 16C10 19 11.5 21 14 21C16.5 21 18 19 18 16C18 10 14 4 14 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M14 25V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 32C14 32 8 34 6 38C8 36 12 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M14 32C14 32 20 34 22 38C20 36 16 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <span className="font-heading text-[#C9A227] text-2xl tracking-wide">&quot;РусТюльпан&quot;</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-[#C9A227] leading-tight whitespace-pre-line mb-6 tracking-wide"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            {data.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <span className="font-heading text-[#C9A227] text-xl tracking-widest">ПРАЙС-ЛИСТ 2025</span>
          </motion.div>

          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-[#E8E0D4] mb-10 max-w-xl mx-auto leading-relaxed"
            >
              {data.subtitle}
            </motion.p>
          )}

          {/* Phone number */}
          <motion.a
            href="tel:+79609022444"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-3 text-[#E8E0D4] text-xl md:text-2xl mb-10 hover:text-[#C9A227] transition-colors"
          >
            <Phone className="w-6 h-6" />
            <span className="font-medium">8-960-902-24-44</span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {data.buttonText && data.buttonLink && (
              <Button 
                asChild 
                size="lg" 
                className="text-base bg-[#C9A227] hover:bg-[#D4AF37] text-[#3D3229] font-semibold px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={data.buttonLink}>
                  {data.buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#3D3229] px-8 py-6 rounded-lg transition-all" 
              asChild
            >
              <a href="tel:+79609022444">
                Позвонить нам
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-[#C9A227]/20"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-heading font-bold text-[#C9A227]">10 000+</p>
              <p className="text-sm text-[#E8E0D4]/70 mt-1">довольных клиентов</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-heading font-bold text-[#C9A227]">Голландия</p>
              <p className="text-sm text-[#E8E0D4]/70 mt-1">отборные луковицы</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-heading font-bold text-[#C9A227]">100%</p>
              <p className="text-sm text-[#E8E0D4]/70 mt-1">свежие цветы</p>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
