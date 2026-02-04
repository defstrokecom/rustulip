import Link from "next/link"
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#5A4A3F] border-t border-[#C9A227]/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              {/* Tulip Icon */}
              <div className="text-[#C9A227]">
                <svg width="24" height="38" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2C14 2 6 10 6 18C6 22 9.5 25 14 25C18.5 25 22 22 22 18C22 10 14 2 14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M14 4C14 4 10 10 10 16C10 19 11.5 21 14 21C16.5 21 18 19 18 16C18 10 14 4 14 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M14 25V40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 32C14 32 8 34 6 38C8 36 12 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M14 32C14 32 20 34 22 38C20 36 16 35 14 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <span className="font-heading text-[#C9A227] text-xl">
                &quot;РусТюльпан&quot;
              </span>
            </Link>
            <p className="text-[#E8E0D4]/80 text-sm leading-relaxed">
              Компания «РусТюльпан» предлагает вам тюльпаны, выращенные из отборных голландских луковиц.
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/rustulip"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#6F5D50] hover:bg-[#C9A227] flex items-center justify-center text-[#E8E0D4] hover:text-[#3D3229] transition-all"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/79609022444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#6F5D50] hover:bg-[#C9A227] flex items-center justify-center text-[#E8E0D4] hover:text-[#3D3229] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-[#C9A227] mb-4 text-lg">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-[#C9A227] mb-4 text-lg">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=tulips" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Тюльпаны
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mimosa" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Мимоза
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=bouquets" className="text-[#E8E0D4]/80 hover:text-[#C9A227] transition-colors text-sm">
                  Букеты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-heading text-[#C9A227] mb-4 text-lg">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[#E8E0D4]/80 text-sm">
                <Phone className="w-4 h-4 text-[#C9A227]" />
                <a href="tel:+79609022444" className="hover:text-[#C9A227] transition-colors">
                  8-960-902-24-44
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#E8E0D4]/80 text-sm">
                <Mail className="w-4 h-4 text-[#C9A227]" />
                <a href="mailto:info@rustulip.ru" className="hover:text-[#C9A227] transition-colors">
                  info@rustulip.ru
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#E8E0D4]/80 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A227] mt-0.5" />
                <span>Россия, доставка по всей стране</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#C9A227]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#E8E0D4]/60 text-sm">
            © {new Date().getFullYear()} РусТюльпан. Все права защищены.
          </p>
          <p className="text-[#E8E0D4]/60 text-sm">
            Ежедневно с 8:00 до 20:00
          </p>
        </div>
      </div>
    </footer>
  )
}
