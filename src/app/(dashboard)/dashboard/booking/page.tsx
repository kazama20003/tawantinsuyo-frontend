"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  User,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Phone,
  Mail,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import Image from "next/image"
import { OrderFormDialog } from "@/components/booking/order-form-dialog"
import { getOrders, deleteOrder } from "@/lib/orders-api"
import type { Order, OrdersQueryParams } from "@/types/order"

// Utility functions
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0"
  }
  return price.toLocaleString()
}

const getSafePrice = (price: number | undefined | null): number => {
  if (price === undefined || price === null || isNaN(price)) {
    return 0
  }
  return price
}

// Función mejorada para formatear fechas
const formatDate = (date: Date, formatStr: string): string => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const shortMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  if (formatStr === "MMM yyyy") {
    return `${shortMonths[date.getMonth()]} ${date.getFullYear()}`
  }
  if (formatStr === "MMMM yyyy") {
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  if (formatStr === "dd/MM") {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`
  }
  if (formatStr === "d") {
    return String(date.getDate())
  }
  if (formatStr === "dd 'de' MMMM 'de' yyyy") {
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }
  return date.toLocaleDateString()
}

// Función para formatear fecha de orden correctamente
const formatOrderDate = (dateString: string): string => {
  if (!dateString) return "N/A"
  try {
    // Crear fecha en UTC para evitar problemas de zona horaria
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "N/A"

    // Formatear en zona horaria de Lima
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Lima",
    }
    return date.toLocaleDateString("es-PE", options)
  } catch {
    return "N/A"
  }
}

// Función para obtener la fecha correcta para el calendario
const getCalendarDate = (dateString: string): Date | null => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}

export default function ReservasPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage] = useState(1)
  const [, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const params: OrdersQueryParams = {
          page: currentPage,
          limit: 100,
        }
        if (searchTerm) params.search = searchTerm
        if (statusFilter && statusFilter !== "all") params.status = statusFilter

        const response = await getOrders(params)
        if (response && response.data && Array.isArray(response.data)) {
          setOrders(response.data)
          if (response.meta) {
            setTotalPages(response.meta.totalPages || 1)
            setTotalOrders(response.meta.total || 0)
          } else {
            setTotalPages(1)
            setTotalOrders(response.data.length)
          }
          if (isRefresh) {
            toast.success("Datos actualizados correctamente")
          }
        } else {
          setOrders([])
          setTotalPages(1)
          setTotalOrders(0)
          setError(response.message || "Formato de respuesta inesperado")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Error al cargar las reservas")
        toast.error("Error al cargar las reservas")
        setOrders([])
        setTotalPages(1)
        setTotalOrders(0)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [currentPage, searchTerm, statusFilter],
  )

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return

    try {
      await deleteOrder(orderId)
      toast.success("Reserva eliminada exitosamente")
      fetchOrders()
    } catch {
      toast.error("Error al eliminar la reserva")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500"
      case "created":
        return "bg-amber-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "created":
        return "Creada"
      case "cancelled":
        return "Cancelada"
      case "completed":
        return "Completada"
      default:
        return status
    }
  }

  // Calendar functions
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getOrdersForDay = (day: Date) => {
    return orders.filter((order) => {
      const orderDate = getCalendarDate(order.startDate)
      if (!orderDate) return false
      return isSameDay(orderDate, day)
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  // Statistics
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length
  const createdOrders = orders.filter((o) => o.status === "created").length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const totalRevenue = orders.reduce((sum, order) => {
    const price = getSafePrice(order.totalPrice)
    return sum + price
  }, 0)

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Panel Administrativo</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reservas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando reservas...</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Panel Administrativo</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Reservas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button onClick={() => fetchOrders(true)} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Reservas</h1>
            <p className="text-muted-foreground">Administra y supervisa todas las reservas de tu agencia de viajes.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
              {totalOrders} Reservas Activas
            </Badge>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-red-800">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2">❌ Error del Sistema</h4>
                  <p className="text-sm mb-3">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {String(currentDate.getMonth() + 1)}/{String(currentDate.getFullYear())}
              </p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{confirmedOrders}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUpRight className="h-3 w-3" />+{completedOrders}
                </div>
                <p className="text-xs text-muted-foreground">completadas</p>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{createdOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/{formatPrice(totalRevenue)}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  Total
                </div>
                <p className="text-xs text-muted-foreground">actual</p>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Calendar/List */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Calendario de Reservas</CardTitle>
                    <CardDescription>{`${String(currentDate.getMonth() + 1)}/${String(currentDate.getFullYear())}`}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant={viewMode === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Cal</span>
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Lista</span>
                      </Button>
                    </div>
                    <OrderFormDialog mode="create" onOrderUpdated={() => fetchOrders()} />
                  </div>
                </div>

                {/* Calendar controls */}
                {viewMode === "calendar" && (
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Anterior</span>
                    </Button>
                    <h3 className="text-lg font-semibold capitalize">{formatDate(currentDate, "MMMM yyyy")}</h3>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <span className="mr-1 hidden sm:inline">Siguiente</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* List view filters */}
                {viewMode === "list" && (
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por cliente, tour..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="created">Creadas</SelectItem>
                        <SelectItem value="confirmed">Confirmadas</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {viewMode === "calendar" ? (
                // Calendar View
                <div className="p-6">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const dayOrders = getOrdersForDay(day)
                      const isCurrentDay = isToday(day)
                      const dayKey = day.toISOString()
                      const isExpanded = expandedDay === dayKey
                      const maxVisible = 2

                      return (
                        <div
                          key={dayKey}
                          className={cn(
                            "min-h-[120px] p-2 border rounded-lg hover:bg-muted/30 transition-colors",
                            isCurrentDay && "bg-blue-50 border-blue-200",
                          )}
                        >
                          <div
                            className={cn(
                              "text-sm font-semibold mb-2",
                              isCurrentDay ? "text-blue-600" : "text-foreground",
                            )}
                          >
                            {String(day.getDate())}
                            {isCurrentDay && (
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block ml-1"></div>
                            )}
                          </div>
                          <div className="space-y-1">
                            {/* Show visible orders */}
                            {(isExpanded ? dayOrders : dayOrders.slice(0, maxVisible)).map((order) => (
                              <div
                                key={order._id}
                                className="text-xs p-1.5 rounded cursor-pointer hover:shadow-sm transition-shadow group relative"
                                style={{ backgroundColor: `${getStatusColor(order.status)}20` }}
                                onClick={() => setSelectedOrder(order)}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <div
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                  ></div>
                                  <span className="font-medium truncate text-xs">
                                    {order.customer?.fullName || "Cliente"}
                                  </span>
                                </div>
                                <div className="truncate text-muted-foreground text-xs">
                                  {order.tour?.title || "Tour no disponible"}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Users className="h-3 w-3" />
                                  <span className="text-xs">{order.people || 0}</span>
                                  <DollarSign className="h-3 w-3 ml-1" />
                                  <span className="text-xs">S/{formatPrice(order.totalPrice)}</span>
                                </div>
                                {/* Edit button on hover - Solo mostrar si el tour existe */}
                                {order.tour && (
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <OrderFormDialog
                                      mode="edit"
                                      order={order}
                                      onOrderUpdated={() => fetchOrders()}
                                      trigger={
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 w-5 p-0 bg-white/90 hover:bg-white shadow-sm"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            {/* Show more button */}
                            {dayOrders.length > maxVisible && (
                              <div
                                className="text-xs text-center text-muted-foreground py-1 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors flex items-center justify-center gap-1"
                                onClick={() => setExpandedDay(isExpanded ? null : dayKey)}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                                <span>{isExpanded ? "Menos" : `+${dayOrders.length - maxVisible} más`}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* Empty state */}
                  {orders.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                      <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">No hay reservas este mes</h3>
                      <p className="text-sm text-muted-foreground">Las reservas aparecerán aquí cuando se creen</p>
                    </div>
                  )}
                </div>
              ) : (
                // List View
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4 p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-2">No hay reservas disponibles</h3>
                        <p className="text-sm text-muted-foreground">Crea tu primera reserva para comenzar</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <Card
                          key={order._id}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src={order.tour?.imageUrl || "/placeholder.svg?height=64&width=64&text=Tour"}
                                  alt={order.tour?.title || "Tour"}
                                  fill
                                  sizes="64px"
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-base">{order.customer?.fullName || "Cliente"}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {order.tour?.title || "Tour no disponible"}
                                    </p>
                                  </div>
                                  <Badge
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${getStatusColor(order.status)}20`,
                                      color: getStatusColor(order.status),
                                      borderColor: getStatusColor(order.status),
                                    }}
                                  >
                                    {getStatusText(order.status)}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                    <span>{formatOrderDate(order.startDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-muted-foreground" />
                                    <span>{order.people || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                                    <span>S/{formatPrice(order.totalPrice)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="truncate">{order.tour?.region || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* Solo mostrar botón de editar si el tour existe */}
                              {order.tour && (
                                <OrderFormDialog
                                  mode="edit"
                                  order={order}
                                  onOrderUpdated={() => fetchOrders()}
                                  trigger={
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  }
                                />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteOrder(order._id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Details Panel */}
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Detalles de Reserva</CardTitle>
                  <CardDescription>{selectedOrder ? "Información completa" : "Selecciona una reserva"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {/* Customer header */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {(selectedOrder.customer?.fullName || "C")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{selectedOrder.customer?.fullName || "Cliente"}</h3>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: `${getStatusColor(selectedOrder.status)}20`,
                            color: getStatusColor(selectedOrder.status),
                            borderColor: getStatusColor(selectedOrder.status),
                          }}
                        >
                          {getStatusText(selectedOrder.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Tour information */}
                    {selectedOrder.tour && (
                      <div className="space-y-3">
                        <div className="relative w-full h-24">
                          <Image
                            src={selectedOrder.tour.imageUrl || "/placeholder.svg?height=96&width=200&text=Tour"}
                            alt={selectedOrder.tour.title}
                            fill
                            sizes="200px"
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{selectedOrder.tour.title}</h4>
                          {selectedOrder.tour.subtitle && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {selectedOrder.tour.subtitle}
                            </p>
                          )}
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder.tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder.tour.region}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>Precio base: S/{formatPrice(selectedOrder.tour.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking details */}
                    <div className="space-y-3 border-t pt-3">
                      <h5 className="font-semibold text-sm text-muted-foreground">DETALLES DE LA RESERVA</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">Fecha de inicio</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedOrder.startDate
                                ? (() => {
                                    try {
                                      const date = new Date(selectedOrder.startDate)
                                      const options: Intl.DateTimeFormatOptions = {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "America/Lima",
                                      }
                                      return date.toLocaleDateString("es-PE", options)
                                    } catch {
                                      return "Fecha no válida"
                                    }
                                  })()
                                : "No especificada"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{selectedOrder.people || 0} personas</p>
                            <p className="text-xs text-muted-foreground">
                              Total: S/{formatPrice(selectedOrder.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer information */}
                    <div className="space-y-3 border-t pt-3">
                      <h5 className="font-semibold text-sm text-muted-foreground">INFORMACIÓN DEL CLIENTE</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <span className="font-medium">Nombre:</span>
                            <span className="ml-1">{selectedOrder.customer?.fullName || "No especificado"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <div className="flex-1">
                            <span className="font-medium">Email:</span>
                            <span className="ml-1 break-all">{selectedOrder.customer?.email || "No especificado"}</span>
                          </div>
                        </div>
                        {selectedOrder.customer?.phone && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Teléfono:</span>
                              <span className="ml-1">{selectedOrder.customer.phone}</span>
                            </div>
                          </div>
                        )}
                        {selectedOrder.customer?.nationality && (
                          <div className="flex items-center gap-2 text-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Nacionalidad:</span>
                              <span className="ml-1">{selectedOrder.customer.nationality}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment and additional info */}
                    {(selectedOrder.paymentMethod || selectedOrder.notes) && (
                      <div className="space-y-3 border-t pt-3">
                        <h5 className="font-semibold text-sm text-muted-foreground">INFORMACIÓN ADICIONAL</h5>
                        <div className="space-y-2">
                          {selectedOrder.paymentMethod && (
                            <div className="flex items-center gap-2 text-xs">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <div className="flex-1">
                                <span className="font-medium">Método de pago:</span>
                                <span className="ml-1 capitalize">{selectedOrder.paymentMethod}</span>
                              </div>
                            </div>
                          )}
                          {selectedOrder.notes && (
                            <div className="text-xs">
                              <span className="font-medium text-muted-foreground">Notas:</span>
                              <p className="mt-1 text-foreground bg-muted/50 p-2 rounded text-xs">
                                {selectedOrder.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      {/* Solo mostrar botón de editar si el tour existe */}
                      {selectedOrder.tour && (
                        <OrderFormDialog
                          mode="edit"
                          order={selectedOrder}
                          onOrderUpdated={() => fetchOrders()}
                          trigger={
                            <Button size="sm" className="flex-1 text-sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Reserva
                            </Button>
                          }
                        />
                      )}
                      <Button variant="outline" size="sm" className="flex-1 text-sm bg-transparent">
                        <Eye className="mr-2 h-4 w-4" />
                        Imprimir Detalles
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-3">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Selecciona una reserva</h3>
                  <p className="text-sm">Haz clic en cualquier reserva para ver sus detalles completos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
