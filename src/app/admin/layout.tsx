import { SessionProvider } from "@/components/providers/session-provider"

export const metadata = {
  title: "Админ-панель | РусТюльпан",
  description: "Управление магазином РусТюльпан",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
