"use client"

import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  Package,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  DollarSign,
  Eye,
  RefreshCw,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { api } from "@/lib/axiosInstance"
import { toast } from "sonner"

interface DashboardStats {
  ordersThisMonth: number
  usersThisMonth: number
  totalOrders: number
  totalUsers: number
  totalTours: number
  activeCustomers: number
}

interface MonthlyIncome {
  month: string
  total: number
}

interface ActivityItem {
  type: string
  message: string
  date: string
}

interface DashboardData {
  stats: DashboardStats
  monthlyIncome: MonthlyIncome[]
  activity: ActivityItem[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const response = await api.get("/dashboard/summary")
      setDashboardData(response.data)
      if (isRefresh) {
        toast.success("Datos actualizados correctamente")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Error al cargar los datos del dashboard")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
    }
    const days = Math.floor(diffInMinutes / 1440)
    return `Hace ${days} día${days > 1 ? "s" : ""}`
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "reserva":
        return <Calendar className="h-4 w-4 text-emerald-500" />
      case "cliente":
        return <Users className="h-4 w-4 text-blue-500" />
      case "tour":
        return <Package className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "reserva":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "cliente":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "tour":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const calculateGrowth = (current: number, total: number) => {
    if (total === 0) return 0
    return ((current / total) * 100).toFixed(1)
  }

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
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
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="col-span-4 animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded"></div>
              </CardContent>
            </Card>
            <Card className="col-span-3 animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-28 mb-2"></div>
                <div className="h-4 bg-muted rounded w-36"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    )
  }

  if (!dashboardData) {
    return (
      <SidebarInset>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Error al cargar los datos</p>
            <p className="text-muted-foreground mb-4">No se pudieron obtener los datos del dashboard</p>
            <Button onClick={() => fetchDashboardData()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  const { stats, monthlyIncome, activity } = dashboardData
  const totalIncome = monthlyIncome.reduce((sum, month) => sum + month.total, 0)

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button onClick={() => fetchDashboardData(true)} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido de vuelta!</h1>
            <p className="text-muted-foreground">Aquí tienes un resumen de tu agencia de viajes hoy.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <div className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></div>
              Sistema Activo
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas del Mes</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ordersThisMonth}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  {calculateGrowth(stats.ordersThisMonth, stats.totalOrders)}%
                </div>
                <p className="text-xs text-muted-foreground">del total ({stats.totalOrders})</p>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usersThisMonth}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-emerald-600 text-sm">
                  <ArrowUpRight className="h-3 w-3" />
                  {calculateGrowth(stats.usersThisMonth, stats.totalUsers)}%
                </div>
                <p className="text-xs text-muted-foreground">del total ({stats.totalUsers})</p>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tours Disponibles</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTours}</div>
              <p className="text-xs text-muted-foreground mt-1">Paquetes turísticos activos</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Últimos 6 meses</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          </Card>
        </div>

        {/* Gráficos y estadísticas */}
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ingresos Mensuales</CardTitle>
                  <CardDescription>Tendencia de ingresos de los últimos 6 meses</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyIncome} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Ingresos"]}
                      labelStyle={{ color: "#1e293b" }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="url(#colorIncome)"
                      radius={[6, 6, 0, 0]}
                      stroke="#3b82f6"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Resumen Ejecutivo</CardTitle>
              <CardDescription>Métricas clave del negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-700">{stats.totalOrders}</div>
                    <div className="text-xs text-blue-600">Total Reservas</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Users className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-2xl font-bold text-emerald-700">{stats.totalUsers}</div>
                    <div className="text-xs text-emerald-600">Total Usuarios</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Tours Activos</div>
                        <div className="text-sm text-muted-foreground">Paquetes disponibles</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{stats.totalTours}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">Clientes Activos</div>
                        <div className="text-sm text-muted-foreground">Con reservas recientes</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{stats.activeCustomers}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Ingresos Acumulados</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    ${totalIncome.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Últimos 6 meses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.length} actividades
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No hay actividad reciente</h3>
                  <p className="text-sm text-muted-foreground">
                    Las nuevas actividades aparecerán aquí cuando ocurran.
                  </p>
                </div>
              ) : (
                activity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-background border rounded-lg group-hover:shadow-sm transition-shadow">
                        {getActivityIcon(item.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={`text-xs ${getActivityBadgeColor(item.type)}`}>
                          {item.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground break-words leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
