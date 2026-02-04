import type { Metadata } from "next"
import { Playfair_Display, Open_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "РусТюльпан — Свежие тюльпаны к 8 марта",
  description: "Компания «РусТюльпан» предлагает вам тюльпаны, выращенные из отборных голландских луковиц. Доставка по всей России.",
  keywords: ["тюльпаны", "8 марта", "цветы", "доставка цветов", "купить тюльпаны", "голландские тюльпаны", "РусТюльпан"],
  openGraph: {
    title: "РусТюльпан — Свежие тюльпаны к 8 марта",
    description: "Тюльпаны из отборных голландских луковиц с доставкой",
    type: "website",
    locale: "ru_RU",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body
        className={`${playfair.variable} ${openSans.variable} font-body antialiased bg-[#6B5B4F] text-white`}
      >
        {children}
      </body>
    </html>
  )
}
