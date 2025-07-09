"use client"

import { useState } from "react"
import { Bell, ChevronsUpDown, LogOut, Settings, User } from "lucide-react"
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
  title: string
  subtitle: string
  imageUrl: string
  price: number
  duration: string
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500"
      case "created":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
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
      default:
        return status
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notificaciones
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mi Perfil</DialogTitle>
            <DialogDescription>Información de tu cuenta y historial de reservas</DialogDescription>
          </DialogHeader>

          {loadingProfile ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : profileData ? (
            <div className="space-y-6">
              {/* Información del usuario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                      <p className="text-sm">{profileData.user.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{profileData.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p className="text-sm">{profileData.user.phone || "No especificado"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">País</label>
                      <p className="text-sm">{profileData.user.country || "No especificado"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Rol</label>
                      <Badge variant="secondary" className="capitalize">
                        {profileData.user.role}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Miembro desde</label>
                      <p className="text-sm">{formatDate(profileData.user.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Historial de reservas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Historial de Reservas ({profileData.orders.length})
                  </CardTitle>
                  <CardDescription>Todas tus reservas realizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileData.orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No tienes reservas realizadas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData.orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.totalPrice}</p>
                              <p className="text-xs text-muted-foreground">{order.paymentMethod?.toUpperCase()}</p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-3">
                                <Image
                                  src={item.tour.imageUrl || "/placeholder.svg"}
                                  alt={item.tour.title}
                                  width={64}
                                  height={64}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{item.tour.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{item.tour.subtitle}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span>{item.tour.duration}</span>
                                    <span>{item.tour.region}</span>
                                    <span>
                                      {item.people} persona{item.people > 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-sm">${item.total}</p>
                                  <p className="text-xs text-muted-foreground">${item.pricePerPerson}/persona</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.notes && (
                            <>
                              <Separator />
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Notas:</label>
                                <p className="text-sm">{order.notes}</p>
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
            <div className="text-center py-8 text-muted-foreground">
              <p>Error al cargar el perfil</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
