import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { 
  Leaf, 
  Truck, 
  Award, 
  Heart,
  Users,
  Calendar,
} from "lucide-react"

interface AboutContent {
  heroTitle: string
  heroSubtitle: string
  storyTitle: string
  storyText1: string
  storyText2: string
  storyText3: string
  storyImage: string
  storyImageTitle: string
  storyImageSubtitle: string
}

const defaultContent: AboutContent = {
  heroTitle: "О компании РусТюльпан",
  heroSubtitle: "Мы — команда энтузиастов, которые верят, что свежие цветы могут сделать любой день особенным. Предлагаем тюльпаны, выращенные из отборных голландских луковиц.",
  storyTitle: "Наша история",
  storyText1: "Всё началось с простой идеи — сделать покупку свежих цветов простой и доступной. Мы начали работать напрямую с плантациями в Голландии, Эквадоре и России.",
  storyText2: "Сегодня РусТюльпан — это современная компания с собственным складом, холодильными камерами для хранения цветов и командой профессионалов.",
  storyText3: "Мы специализируемся на оптовых и розничных поставках тюльпанов и мимозы — самых востребованных цветов весеннего сезона. Наши клиенты — это цветочные магазины, event-агентства и частные покупатели.",
  storyImage: "",
  storyImageTitle: "Голландские луковицы",
  storyImageSubtitle: "премиум качество",
}

async function getAboutContent(): Promise<AboutContent> {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: "about_page_content" },
    })

    if (setting) {
      return JSON.parse(setting.value)
    }
  } catch (error) {
    console.error("Failed to fetch about content:", error)
  }
  
  return defaultContent
}

export default async function AboutPage() {
  const content = await getAboutContent()

  const stats = [
    { icon: Users, value: "10 000+", label: "Довольных клиентов" },
    { icon: Calendar, value: "5 лет", label: "На рынке" },
    { icon: Truck, value: "50 000+", label: "Доставленных букетов" },
    { icon: Award, value: "100%", label: "Свежие цветы" },
  ]

  const values = [
    {
      icon: Leaf,
      title: "Свежесть",
      description: "Мы работаем напрямую с плантациями и получаем цветы в течение 24 часов после срезки"
    },
    {
      icon: Heart,
      title: "Забота",
      description: "Каждый букет собирается с любовью и вниманием к деталям нашими профессиональными флористами"
    },
    {
      icon: Truck,
      title: "Быстрая доставка",
      description: "Доставляем по всей России. Бережно упаковываем каждый заказ"
    },
    {
      icon: Award,
      title: "Качество",
      description: "Гарантируем качество каждого цветка. Если что-то не так — заменим или вернём деньги"
    },
  ]

  return (
    <div className="min-h-screen bg-[#6F5D50]">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {content.heroTitle.includes("РусТюльпан") ? (
                <>
                  {content.heroTitle.split("РусТюльпан")[0]}
                  <span className="text-[#C9A227]">РусТюльпан</span>
                  {content.heroTitle.split("РусТюльпан")[1]}
                </>
              ) : (
                content.heroTitle
              )}
            </h1>
            <p className="text-lg md:text-xl text-[#E8E0D4]/80">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#5A4A3F]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#C9A227] flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-[#3D3229]" />
                </div>
                <p className="text-3xl md:text-4xl font-heading font-bold text-[#C9A227] mb-1">{stat.value}</p>
                <p className="text-sm text-[#E8E0D4]/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#C9A227] mb-6">
                {content.storyTitle}
              </h2>
              <div className="space-y-4 text-[#E8E0D4]/80">
                {content.storyText1 && <p>{content.storyText1}</p>}
                {content.storyText2 && <p>{content.storyText2}</p>}
                {content.storyText3 && <p>{content.storyText3}</p>}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-[#5A4A3F] border border-[#C9A227]/20 flex items-center justify-center overflow-hidden">
                {content.storyImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={content.storyImage}
                      alt={content.storyImageTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D3229]/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 text-center p-6">
                      <p className="text-2xl font-heading font-bold text-[#C9A227]">{content.storyImageTitle}</p>
                      <p className="text-[#E8E0D4]/70">{content.storyImageSubtitle}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <span className="text-8xl mb-4 block">🌷</span>
                    <p className="text-2xl font-heading font-bold text-[#C9A227]">{content.storyImageTitle}</p>
                    <p className="text-[#E8E0D4]/70">{content.storyImageSubtitle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#5A4A3F]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#C9A227] mb-4">
              Наши ценности
            </h2>
            <p className="text-[#E8E0D4]/70 max-w-2xl mx-auto">
              Принципы, которые помогают нам каждый день становиться лучше
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-[#6F5D50]/50 border border-[#C9A227]/20 hover:border-[#C9A227]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C9A227] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-[#3D3229]" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[#E8E0D4]/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#C9A227] mb-6">
              Готовы сделать заказ?
            </h2>
            <p className="text-[#E8E0D4]/70 mb-8">
              Выберите свежие цветы из нашего каталога или свяжитесь с нами для индивидуального заказа
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#3D3229] font-semibold transition-colors"
              >
                Перейти в каталог
              </a>
              <a
                href="/contacts"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[#C9A227] text-[#C9A227] font-medium hover:bg-[#C9A227] hover:text-[#3D3229] transition-colors"
              >
                Связаться с нами
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
