"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Instagram,
  Loader2,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export default function ContactsPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })

  const contacts = [
    {
      icon: Phone,
      title: "Телефон",
      value: "+7 (999) 123-45-67",
      link: "tel:+79991234567",
      description: "Звоните с 8:00 до 22:00"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+7 (999) 123-45-67",
      link: "https://wa.me/79991234567",
      description: "Быстрые ответы в мессенджере"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@rustulip.ru",
      link: "mailto:info@rustulip.ru",
      description: "Для деловых предложений"
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@rustulip",
      link: "https://instagram.com/rustulip",
      description: "Фото наших букетов"
    },
  ]

  const info = [
    {
      icon: MapPin,
      title: "Адрес",
      value: "г. Москва, ул. Цветочная, д. 1",
      description: "Пункт самовывоза"
    },
    {
      icon: Clock,
      title: "Время работы",
      value: "Ежедневно 8:00 - 22:00",
      description: "Без выходных"
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSubmitted(true)
    setLoading(false)
    toast({
      title: "Сообщение отправлено!",
      description: "Мы свяжемся с вами в ближайшее время",
      variant: "success"
    })
  }

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
              Контакты
            </h1>
            <p className="text-lg md:text-xl text-zinc-300">
              Свяжитесь с нами любым удобным способом — мы всегда рады помочь!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contacts.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.link}
                target={contact.link.startsWith("http") ? "_blank" : undefined}
                rel={contact.link.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-pink-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                  <contact.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-1">
                  {contact.title}
                </h3>
                <p className="text-pink-400 font-medium mb-1">{contact.value}</p>
                <p className="text-sm text-zinc-500">{contact.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Info & Form */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="font-heading text-3xl font-bold text-white mb-8">
                Информация
              </h2>
              
              <div className="space-y-6 mb-12">
                {info.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{item.title}</h3>
                      <p className="text-zinc-300">{item.value}</p>
                      <p className="text-sm text-zinc-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="aspect-video rounded-2xl bg-zinc-800 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Карта</p>
                    <p className="text-sm">г. Москва, ул. Цветочная, д. 1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-heading text-3xl font-bold text-white mb-8">
                Напишите нам
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Спасибо за обращение!
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                  </p>
                  <Button onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: "", phone: "", email: "", message: "" })
                  }}>
                    Отправить ещё
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input
                        id="name"
                        placeholder="Иван"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      placeholder="Ваш вопрос или комментарий..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-zinc-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
