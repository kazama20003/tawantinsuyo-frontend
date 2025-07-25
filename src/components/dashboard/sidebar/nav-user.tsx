"use client"

import { useState } from "react"
import { Bell, ChevronsUpDown, LogOut, Settings, User, Shield, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/axiosInstance"
import { toast } from "sonner"

interface UserProfile {
  _id: string
  fullName: string
  email: string
  role: string
  authProvider: string
  phone?: string
  country?: string
  createdAt: string
  updatedAt: string
}

interface TourInfo {
  _id: string
  title: {
    es: string
    en?: string
  }
  subtitle: {
    es: string
    en?: string
  }
  imageUrl: string
  price: number
  duration: {
    es: string
    en?: string
  }
  region: string
}

interface OrderItem {
  tour: TourInfo
  startDate: string
  people: number
  notes: string
  pricePerPerson: number
  total: number
  _id: string
}

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  nationality: string
  _id: string
}

interface UserOrder {
  _id: string
  items: OrderItem[]
  customer: CustomerInfo
  totalPrice: number
  status: string
  paymentMethod: string
  notes: string
  createdAt: string
}

interface ProfileData {
  user: UserProfile
  orders: UserOrder[]
}

interface ApiResponse {
  message: string
  data: ProfileData
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const handleLogout = () => {
    // Eliminar todas las cookies relacionadas con la autenticación
    Cookies.remove("token")
    Cookies.remove("user")
    Cookies.remove("authToken")

    // Limpiar localStorage si hay datos guardados
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("authData")
    }

    toast.success("Sesión cerrada correctamente")

    // Redirigir al login
    router.push("/login")
  }

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true)
      const response = await api.get<ApiResponse>("/users/profile")
      setProfileData(response.data.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Error al cargar el perfil")
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleProfileClick = () => {
    setProfileOpen(true)
    if (!profileData) {
      fetchProfile()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "created":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmada"
      case "created":
        return "Creada"
      case "cancelled":
        return "Cancelada"
      case "completed":
        return "Completada"
      case "pending":
        return "Pendiente"
      default:
        return status
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "user":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Administrador"
      case "manager":
        return "Gerente"
      case "user":
        return "Usuario"
      default:
        return role
    }
  }

  const ProfileSkeleton = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const extractText = (field: string | { es: string; en?: string }): string => {
    if (typeof field === "string") return field
    return field?.es || field?.en || "No disponible"
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8 rounded-lg ring-2 ring-sidebar-border">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg border"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificaciones
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mi Perfil
            </DialogTitle>
            <DialogDescription>Información de tu cuenta y historial de reservas</DialogDescription>
          </DialogHeader>

          {loadingProfile ? (
            <ProfileSkeleton />
          ) : profileData ? (
            <div className="space-y-6">
              {/* Información del usuario */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>Detalles de tu cuenta y información de contacto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Nombre Completo
                      </label>
                      <p className="text-sm font-medium">{profileData.user.fullName}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm font-medium">{profileData.user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p className="text-sm">{profileData.user.phone || "No especificado"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        País
                      </label>
                      <p className="text-sm">{profileData.user.country || "No especificado"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Rol</label>
                      <Badge variant="outline" className={getRoleColor(profileData.user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleText(profileData.user.role)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Miembro desde
                      </label>
                      <p className="text-sm">{formatDate(profileData.user.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{profileData.orders.length}</p>
                        <p className="text-xs text-muted-foreground">Total Reservas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {profileData.orders.filter((o) => o.status === "created" || o.status === "confirmed").length}
                        </p>
                        <p className="text-xs text-muted-foreground">Confirmadas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <div>
                        <p className="text-2xl font-bold">
                          ${profileData.orders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Gastado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Historial de reservas */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Historial de Reservas ({profileData.orders.length})
                  </CardTitle>
                  <CardDescription>Todas tus reservas realizadas ordenadas por fecha</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileData.orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">No tienes reservas realizadas</h3>
                      <p className="text-sm">Cuando realices tu primera reserva, aparecerá aquí</p>
                      <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push("/tours")}>
                        Explorar Tours
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData.orders
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order) => (
                          <div
                            key={order._id}
                            className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {getStatusText(order.status)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  #{order._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-green-600">${order.totalPrice.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {order.paymentMethod?.replace("_", " ") || "N/A"}
                                </p>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="relative">
                                    <Image
                                      src={item.tour.imageUrl || "/placeholder.svg"}
                                      alt={extractText(item.tour.title)}
                                      width={80}
                                      height={80}
                                      className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                      {item.people}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm mb-1">{extractText(item.tour.title)}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                      {extractText(item.tour.subtitle)}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {extractText(item.tour.duration)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {item.tour.region}
                                      </span>
                                      <span>
                                        {item.people} persona{item.people > 1 ? "s" : ""}
                                      </span>
                                    </div>
                                    {item.startDate && (
                                      <p className="text-xs text-blue-600 mt-1">Inicio: {formatDate(item.startDate)}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-sm">${item.total.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">
                                      ${item.pricePerPerson.toLocaleString()}/persona
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {order.notes && (
                              <>
                                <Separator />
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <label className="text-xs font-medium text-blue-800 mb-1 block">
                                    Notas de la reserva:
                                  </label>
                                  <p className="text-sm text-blue-700">{order.notes}</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">Error al cargar el perfil</h3>
              <p className="text-sm mb-4">No se pudo obtener la información del perfil</p>
              <Button variant="outline" onClick={fetchProfile}>
                Reintentar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
