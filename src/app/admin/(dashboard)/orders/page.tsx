"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Package,
  Loader2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    color: string
  }
}

interface Order {
  id: string
  customerName: string
  phone: string
  email: string | null
  address: string | null
  comment: string | null
  totalAmount: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Новый", color: "bg-blue-500" },
  PROCESSING: { label: "В обработке", color: "bg-yellow-500" },
  CONFIRMED: { label: "Подтверждён", color: "bg-purple-500" },
  DELIVERING: { label: "Доставляется", color: "bg-orange-500" },
  COMPLETED: { label: "Выполнен", color: "bg-green-500" },
  CANCELLED: { label: "Отменён", color: "bg-red-500" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewDialog, setViewDialog] = useState<{ open: boolean; order: Order | null }>({
    open: false,
    order: null,
  })
  const [updating, setUpdating] = useState(false)

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  useEffect(() => {
    const debounce = setTimeout(fetchOrders, 300)
    return () => clearTimeout(debounce)
  }, [search])

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const updated = await res.json()
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        )
        if (viewDialog.order?.id === orderId) {
          setViewDialog({ open: true, order: updated })
        }
        toast({ title: "Статус обновлён", variant: "success" })
      }
    } catch (error) {
      console.error("Failed to update order:", error)
      toast({ title: "Ошибка обновления", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Заказы</h1>
        <p className="text-zinc-400 mt-1">Управление заказами клиентов</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Поиск по имени, телефону, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-zinc-800 rounded w-1/3 mb-2" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Заказы не найдены</h3>
            <p className="text-zinc-400">
              {search || statusFilter !== "all"
                ? "Попробуйте изменить параметры поиска"
                : "Заказов пока нет"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusLabels[order.status] || { label: order.status, color: "bg-zinc-500" }
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">
                            {order.customerName}
                          </h3>
                          <Badge className={`${status.color} text-white`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="font-medium text-white">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateStatus(order.id, value)}
                          disabled={updating}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setViewDialog({ open: true, order })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, order: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Заказ от {viewDialog.order && formatDate(viewDialog.order.createdAt)}</DialogTitle>
          </DialogHeader>
          {viewDialog.order && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Клиент</h4>
                  <p className="text-white">{viewDialog.order.customerName}</p>
                  <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {viewDialog.order.phone}
                  </p>
                  {viewDialog.order.email && (
                    <p className="text-sm text-zinc-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {viewDialog.order.email}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Доставка</h4>
                  {viewDialog.order.address && (
                    <p className="text-sm text-zinc-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {viewDialog.order.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Товары</h4>
                <div className="space-y-2">
                  {viewDialog.order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-lg">
                      <div>
                        <p className="text-white">{item.product.name}</p>
                        <p className="text-sm text-zinc-400">{item.product.color} × {item.quantity} шт.</p>
                      </div>
                      <p className="font-medium text-white">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              {viewDialog.order.comment && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2">Комментарий</h4>
                  <p className="text-sm text-zinc-300 p-3 bg-zinc-800/50 rounded-lg">
                    {viewDialog.order.comment}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <span className="text-lg font-medium text-white">Итого</span>
                <span className="text-xl font-bold text-white">
                  {formatPrice(viewDialog.order.totalAmount)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
