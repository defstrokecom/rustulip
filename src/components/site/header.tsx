"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
            <Image 
              src="/logo.png" 
              alt="РусТюльпан" 
              width={32} 
              height={50}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-heading text-[#C9A227] text-xl tracking-wide">РусТюльпан</span>
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
