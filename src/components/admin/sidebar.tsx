"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Flower2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Image,
  Star,
  ChevronRight,
  Menu,
  X,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Дашборд",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Товары",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Категории",
    href: "/admin/categories",
    icon: Star,
  },
  {
    title: "Заказы",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Контент",
    href: "/admin/content",
    icon: FileText,
    children: [
      { title: "Баннеры", href: "/admin/content/banners" },
      { title: "Преимущества", href: "/admin/content/advantages" },
      { title: "Страницы", href: "/admin/content/pages" },
    ],
  },
  {
    title: "Медиа",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Рассылка",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">РусТюльпан</h1>
            <p className="text-xs text-zinc-500">Админ-панель</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.href)

          return (
            <div key={item.href}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500"
                    />
                  )}
                </Link>
              )}

              {/* Children */}
              {hasChildren && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 mt-1 space-y-1"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        pathname === child.href
                          ? "text-white bg-zinc-800"
                          : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                      {child.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name || "Администратор"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-red-400"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 transform transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
