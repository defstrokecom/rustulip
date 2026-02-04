import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "РусТюльпан — Свежие тюльпаны и мимоза с доставкой",
  description: "Купить свежие тюльпаны и мимозу в Москве. Быстрая доставка, низкие цены, широкий ассортимент.",
  keywords: ["тюльпаны", "мимоза", "цветы", "доставка цветов", "купить тюльпаны", "Москва"],
  openGraph: {
    title: "РусТюльпан — Свежие тюльпаны и мимоза",
    description: "Купить свежие тюльпаны и мимозу с доставкой",
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
    <html lang="ru" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body antialiased bg-[#0a0a0b] text-zinc-100`}
      >
        {children}
      </body>
    </html>
  )
}
