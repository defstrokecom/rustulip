"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, Save, User, Lock, Globe, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

const profileSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  email: z.string().email("Введите корректный email"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string().min(1, "Подтвердите пароль"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

interface SiteSetting {
  id: string
  key: string
  value: string
  type: string
  label: string
  group: string
}

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (session?.user) {
      profileForm.setValue("name", session.user.name || "")
      profileForm.setValue("email", session.user.email || "")
    }
  }, [session])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || [])
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoadingSettings(false)
    }
  }

  const onProfileSubmit = async (data: ProfileForm) => {
    setSavingProfile(true)
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        await update({ name: data.name })
        toast({
          title: "Профиль обновлён",
          variant: "success",
        })
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setSavingPassword(true)
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (res.ok) {
        passwordForm.reset()
        toast({
          title: "Пароль изменён",
          description: "Используйте новый пароль при следующем входе",
          variant: "success",
        })
      } else {
        const error = await res.json()
        throw new Error(error.error || "Failed to change password")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось изменить пароль",
        variant: "destructive",
      })
    } finally {
      setSavingPassword(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    )
  }

  const saveSettings = async () => {
    setSavingSettings(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (res.ok) {
        toast({
          title: "Настройки сохранены",
          variant: "success",
        })
      } else {
        throw new Error()
      }
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      })
    } finally {
      setSavingSettings(false)
    }
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = []
    }
    acc[setting.group].push(setting)
    return acc
  }, {} as Record<string, SiteSetting[]>)

  const groupLabels: Record<string, { title: string; icon: typeof Globe }> = {
    general: { title: "Общие настройки", icon: Globe },
    contacts: { title: "Контакты", icon: MessageCircle },
    social: { title: "Социальные сети", icon: MessageCircle },
    seo: { title: "SEO", icon: Globe },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Настройки</h1>
        <p className="text-zinc-400 mt-1">Управление профилем и сайтом</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Профиль
              </CardTitle>
              <CardDescription>Ваши личные данные</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    {...profileForm.register("name")}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-400">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-400">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Смена пароля
              </CardTitle>
              <CardDescription>Изменить пароль для входа</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Текущий пароль</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-400">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-400">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-400">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Изменить пароль
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Настройки сайта</h2>
          <Button onClick={saveSettings} disabled={savingSettings}>
            {savingSettings ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Сохранить все
              </>
            )}
          </Button>
        </div>

        {loadingSettings ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-zinc-800 rounded w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-10 bg-zinc-800 rounded" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(groupedSettings).map(([group, items]) => {
              const groupInfo = groupLabels[group] || { title: group, icon: Globe }
              const Icon = groupInfo.icon
              return (
                <Card key={group}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {groupInfo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((setting) => (
                      <div key={setting.key} className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        {setting.type === "textarea" ? (
                          <Textarea
                            id={setting.key}
                            value={setting.value}
                            onChange={(e) => updateSetting(setting.key, e.target.value)}
                          />
                        ) : (
                          <Input
                            id={setting.key}
                            type={setting.type === "image" ? "url" : "text"}
                            value={setting.value}
                            onChange={(e) => updateSetting(setting.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
