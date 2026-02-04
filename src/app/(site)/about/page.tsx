import { prisma } from "@/lib/prisma"
import { motion } from "framer-motion"
import { 
  Leaf, 
  Truck, 
  Award, 
  Heart,
  Users,
  Calendar,
  MapPin,
  Clock
} from "lucide-react"

async function getAboutData() {
  const settings = await prisma.siteSettings.findMany()
  const settingsMap = settings.reduce((acc: Record<string, string>, s: { key: string; value: string }) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, string>)
  
  return settingsMap
}

export default async function AboutPage() {
  const settings = await getAboutData()

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
      description: "Доставляем по Москве в течение 2 часов. Бережно упаковываем каждый заказ"
    },
    {
      icon: Award,
      title: "Качество",
      description: "Гарантируем качество каждого цветка. Если что-то не так — заменим или вернём деньги"
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              О компании{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                РусТюльпан
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300">
              Мы — команда энтузиастов, которые верят, что свежие цветы могут сделать любой день особенным. 
              С 2019 года мы доставляем радость в дома москвичей.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
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
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                Наша история
              </h2>
              <div className="space-y-4 text-zinc-300">
                <p>
                  Всё началось с простой идеи — сделать покупку свежих цветов простой и доступной. 
                  В 2019 году мы открыли первый склад и начали работать напрямую с плантациями 
                  в Голландии, Эквадоре и России.
                </p>
                <p>
                  Сегодня РусТюльпан — это современная компания с собственным складом площадью 
                  более 500 м², холодильными камерами для хранения цветов и командой профессиональных 
                  флористов.
                </p>
                <p>
                  Мы специализируемся на оптовых и розничных поставках тюльпанов и мимозы — 
                  самых востребованных цветов весеннего сезона. Наши клиенты — это цветочные 
                  магазины, event-агентства и частные покупатели.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-8xl mb-4 block">🌷</span>
                  <p className="text-2xl font-bold text-white">С 2019 года</p>
                  <p className="text-zinc-400">дарим радость</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Наши ценности
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Принципы, которые помогают нам каждый день становиться лучше
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800 hover:border-pink-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-400">
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы сделать заказ?
            </h2>
            <p className="text-zinc-400 mb-8">
              Выберите свежие цветы из нашего каталога или свяжитесь с нами для индивидуального заказа
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Перейти в каталог
              </a>
              <a
                href="/contacts"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors"
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
