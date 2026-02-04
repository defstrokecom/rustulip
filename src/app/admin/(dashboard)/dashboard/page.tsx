"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDateTime } from "@/lib/utils"

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalOrders: number
  todayOrders: number
  weekOrders: number
  todayRevenue: number
  weekRevenue: number
  recentOrders: {
    id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }[]
}

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "danger" | "secondary" }> = {
  NEW: { label: "Новый", variant: "warning" },
  PROCESSING: { label: "В обработке", variant: "secondary" },
  COMPLETED: { label: "Выполнен", variant: "success" },
  CANCELLED: { label: "Отменён", variant: "danger" },
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Всего товаров",
      value: stats?.totalProducts || 0,
      subValue: `${stats?.activeProducts || 0} активных`,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      trend: null,
    },
    {
      title: "Заказов за неделю",
      value: stats?.weekOrders || 0,
      subValue: `${stats?.todayOrders || 0} сегодня`,
      icon: ShoppingCart,
      color: "from-pink-500 to-purple-500",
      trend: stats?.todayOrders && stats?.todayOrders > 0 ? "up" : null,
    },
    {
      title: "Выручка за неделю",
      value: formatPrice(stats?.weekRevenue || 0),
      subValue: `${formatPrice(stats?.todayRevenue || 0)} сегодня`,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      trend: stats?.todayRevenue && stats?.todayRevenue > 0 ? "up" : null,
    },
    {
      title: "Мало на складе",
      value: stats?.lowStockProducts || 0,
      subValue: "товаров",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
      trend: stats?.lowStockProducts && stats?.lowStockProducts > 5 ? "down" : null,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Дашборд</h1>
        <p className="text-zinc-400 mt-1">Обзор вашего магазина</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
                />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">{stat.title}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">
                          {loading ? "..." : stat.value}
                        </span>
                        {stat.trend && (
                          <span
                            className={`flex items-center text-xs ${
                              stat.trend === "up"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {stat.trend === "up" ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{stat.subValue}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-zinc-800/50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => {
                  const status = statusLabels[order.status] || statusLabels.NEW
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <span className="text-xs text-zinc-500">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Заказов пока нет</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
