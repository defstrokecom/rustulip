"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items } = useCartStore()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#5A4A3F]/95 backdrop-blur-md border-b border-[#C9A227]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* Tulip Icon */}
            <div className="text-[#C9A227]">
              <svg width="28" height="44" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Бутон тюльпана */}
                <path d="M14 2C14 2 6 10 6 18C6 22 9.5 25 14 25C18.5 25 22 22 22 18C22 10 14 2 14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                {/* Центральный лепесток */}
                <path d="M14 4C14 4 10 10 10 16C10 19 11.5 21 14 21C16.5 21 18 19 18 16C18 10 14 4 14 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                {/* Стебель */}
                <path d="M14 25V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Левый лист */}
                <path d="M14 32C14 32 8 34 6 38C8 36 12 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Правый лист */}
                <path d="M14 32C14 32 20 34 22 38C20 36 16 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-[#C9A227] text-xl tracking-wide">&quot;РусТюльпан&quot;</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#E8E0D4] hover:text-[#C9A227] transition-colors font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Phone */}
            <a
              href="tel:+79609022444"
              className="hidden lg:flex items-center gap-2 text-[#C9A227] hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">8-960-902-24-44</span>
            </a>

            {/* Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-[#E8E0D4] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] rounded-full text-xs font-medium flex items-center justify-center text-[#3D3229]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#E8E0D4] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#C9A227]/20 bg-[#5C4D42]/98 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#E8E0D4] hover:text-[#C9A227] py-3 transition-colors font-medium border-b border-[#C9A227]/10 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+79609022444"
                className="flex items-center gap-2 text-[#C9A227] py-3 font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>8-960-902-24-44</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
