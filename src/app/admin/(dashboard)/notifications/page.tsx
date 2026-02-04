"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Send,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Bell,
  TestTube,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

// Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

interface EmailSettings {
  enabled: boolean
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  adminEmail: string
}

interface TelegramSettings {
  enabled: boolean
  sellerUsername: string // Username продавца для чата с клиентами
  botToken: string       // Для будущего функционала - бот для уведомлений
  chatId: string         // Chat ID для бота
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enabled: true,
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "РусТюльпан",
    adminEmail: "",
  })

  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    enabled: true,
    sellerUsername: "shapo_sh",
    botToken: "",
    chatId: "",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/notifications")
      if (res.ok) {
        const data = await res.json()
        if (data.email) setEmailSettings(data.email)
        if (data.telegram) setTelegramSettings({ ...telegramSettings, ...data.telegram })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveEmailSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", settings: emailSettings }),
      })

      if (res.ok) {
        toast({ title: "Настройки сохранены", variant: "success" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const saveTelegramSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "telegram", settings: telegramSettings }),
      })

      if (res.ok) {
        toast({ title: "Настройки сохранены", variant: "success" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({ title: "Ошибка сохранения", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const testEmail = async () => {
    if (!emailSettings.adminEmail) {
      toast({ title: "Укажите email администратора", variant: "destructive" })
      return
    }

    setTestingEmail(true)
    try {
      const res = await fetch("/api/admin/notifications/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailSettings.adminEmail }),
      })

      if (res.ok) {
        toast({ title: "Тестовое письмо отправлено", variant: "success" })
      } else {
        const data = await res.json()
        toast({ title: data.error || "Ошибка отправки", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to send test email:", error)
      toast({ title: "Ошибка отправки", variant: "destructive" })
    } finally {
      setTestingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Рассылка</h1>
        <p className="text-zinc-400 mt-1">Настройка уведомлений о заказах</p>
      </div>

      {/* Telegram Settings - Now Active! */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0088cc] to-[#00a0dc] flex items-center justify-center">
                  <TelegramIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Telegram чат</CardTitle>
                  <CardDescription>Чат с клиентами после оформления заказа</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {telegramSettings.enabled && telegramSettings.sellerUsername ? (
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Активен
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-zinc-500">
                    <AlertCircle className="w-4 h-4" />
                    Не настроен
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={telegramSettings.enabled}
                onChange={(e) => setTelegramSettings({ ...telegramSettings, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500"
              />
              <span className="text-white">Показывать кнопку &quot;Написать в Telegram&quot; после заказа</span>
            </label>

            {telegramSettings.enabled && (
              <>
                {/* Seller username */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Чат с клиентами
                  </h4>
                  <div className="space-y-2">
                    <Label>Username продавца в Telegram *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">@</span>
                      <Input
                        value={telegramSettings.sellerUsername}
                        onChange={(e) => setTelegramSettings({ ...telegramSettings, sellerUsername: e.target.value.replace('@', '') })}
                        placeholder="username"
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      После оформления заказа клиенту будет предложено написать вам в Telegram. 
                      Сообщение будет содержать данные заказа.
                    </p>
                  </div>

                  {telegramSettings.sellerUsername && (
                    <div className="p-3 bg-zinc-700/50 rounded-lg">
                      <p className="text-sm text-zinc-300 mb-2">Ссылка для клиентов:</p>
                      <code className="text-xs text-[#0088cc] break-all">
                        https://t.me/{telegramSettings.sellerUsername}
                      </code>
                    </div>
                  )}
                </div>

                {/* Bot notifications - Future */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4 opacity-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Уведомления через бота
                    </h4>
                    <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
                      Скоро
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    В будущем вы сможете получать автоматические уведомления о новых заказах через Telegram-бота.
                  </p>
                </div>

                {/* Actions */}
                <Button onClick={saveTelegramSettings} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Сохранить настройки
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Email рассылка</CardTitle>
                  <CardDescription>Уведомления о заказах на почту</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {emailSettings.enabled ? (
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    Активна
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-zinc-500">
                    <AlertCircle className="w-4 h-4" />
                    Отключена
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.enabled}
                onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-pink-500"
              />
              <span className="text-white">Включить email уведомления</span>
            </label>

            {emailSettings.enabled && (
              <>
                {/* Admin email */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Получатель уведомлений
                  </h4>
                  <div className="space-y-2">
                    <Label>Email администратора *</Label>
                    <Input
                      type="email"
                      value={emailSettings.adminEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, adminEmail: e.target.value })}
                      placeholder="admin@rustulip.ru"
                    />
                    <p className="text-xs text-zinc-500">На этот адрес будут приходить уведомления о новых заказах</p>
                  </div>
                </div>

                {/* SMTP Settings */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Настройки SMTP
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP сервер</Label>
                      <Input
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                        placeholder="smtp.yandex.ru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Порт</Label>
                      <Input
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Логин</Label>
                      <Input
                        value={emailSettings.smtpUser}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                        placeholder="noreply@rustulip.ru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Пароль</Label>
                      <Input
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* From settings */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Отправитель
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email отправителя</Label>
                      <Input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                        placeholder="noreply@rustulip.ru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Имя отправителя</Label>
                      <Input
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                        placeholder="РусТюльпан"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={saveEmailSettings} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Сохранить настройки
                  </Button>
                  <Button variant="outline" onClick={testEmail} disabled={testingEmail}>
                    {testingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <TestTube className="w-4 h-4 mr-2" />
                    )}
                    Тестовое письмо
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
