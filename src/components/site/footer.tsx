import Link from "next/link"
import { Flower2, Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-zinc-900/50 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                РусТюльпан
              </span>
            </Link>
            <p className="text-zinc-400 text-sm">
              Свежие тюльпаны и мимоза напрямую с плантаций. Доставка по Москве в день заказа.
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/rustulip"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/tulips" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Тюльпаны
                </Link>
              </li>
              <li>
                <Link href="/catalog/mimosa" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Мимоза
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-4 h-4 text-pink-500" />
                <a href="tel:+79991234567" className="hover:text-white transition-colors">
                  +7 (999) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-4 h-4 text-pink-500" />
                <a href="mailto:info@rustulip.ru" className="hover:text-white transition-colors">
                  info@rustulip.ru
                </a>
              </li>
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-pink-500 mt-0.5" />
                <span>Москва, ул. Цветочная, д. 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} РусТюльпан. Все права защищены.
          </p>
          <p className="text-zinc-500 text-sm">
            Ежедневно с 8:00 до 22:00
          </p>
        </div>
      </div>
    </footer>
  )
}
