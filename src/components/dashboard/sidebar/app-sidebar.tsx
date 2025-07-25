"use client"

import { useState, useEffect } from "react"
import type * as React from "react"
import { Plane, Users, Calendar, Car, BarChart3, Package, FileText, Globe } from "lucide-react"
import Cookies from "js-cookie"
import { NavMain } from "@/components/dashboard/sidebar/nav-main"
import { NavProjects } from "@/components/dashboard/sidebar/nav-projects"
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary"
import { NavUser } from "@/components/dashboard/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/axiosInstance"

interface UserData {
  _id: string
  fullName: string
  email: string
  role: string
  avatar?: string
}

const staticData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Resumen General",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Reservas",
      url: "/dashboard/booking",
      icon: Calendar,
      items: [
        {
          title: "Todas las Reservas",
          url: "/dashboard/booking",
        },
        {
          title: "Pendientes",
          url: "/dashboard/reservas/pendientes",
        },
        {
          title: "Confirmadas",
          url: "/reservas/confirmadas",
        },
        {
          title: "Canceladas",
          url: "/reservas/canceladas",
        },
      ],
    },
    {
      title: "Paquetes Turísticos",
      url: "/dashboard/tours",
      icon: Package,
      items: [
        {
          title: "Todos los Paquetes",
          url: "/dashboard/tours",
        },
        {
          title: "Crear Paquete",
          url: "/dashboard/tours/new",
        },
        {
          title: "Promociones",
          url: "/dashboard/offer",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Lista de Clientes",
          url: "/dashboard/users",
        },
        {
          title: "Historial",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Transportes",
      url: "/dashboard/transport",
      icon: Car,
      items: [
        {
          title: "Creación de Transportes",
          url: "/dashboard/transport",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentación",
      url: "/dashboard/documentacion",
      icon: FileText,
    },
    {
      title: "Soporte Técnico",
      url: "/dashboard/soporte",
      icon: Globe,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)

        // Primero intentar obtener desde la API
        try {
          const response = await api.get("/users/profile")
          const userData = response.data.data.user
          setUserData({
            _id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar,
          })
        } catch (apiError) {
          console.warn("API not available, trying cookies/localStorage:", apiError)

          // Fallback: intentar desde cookies
          const userCookie = Cookies.get("user")
          if (userCookie) {
            const parsedUser = JSON.parse(userCookie)
            setUserData(parsedUser)
          } else {
            // Fallback: intentar desde localStorage
            const userLocal = localStorage.getItem("user")
            if (userLocal) {
              const parsedUser = JSON.parse(userLocal)
              setUserData(parsedUser)
            } else {
              // Datos por defecto si no hay nada
              setUserData({
                _id: "default",
                fullName: "Usuario",
                email: "usuario@ejemplo.com",
                role: "user",
              })
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setUserData({
          _id: "default",
          fullName: "Usuario",
          email: "usuario@ejemplo.com",
          role: "user",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Función para generar avatar por defecto
  const generateAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    return `/placeholder.svg?height=32&width=32&text=${initials}`
  }

  // Preparar datos del usuario para NavUser
  const userForNav = userData
    ? {
        name: userData.fullName,
        email: userData.email,
        avatar: userData.avatar || generateAvatar(userData.fullName),
      }
    : {
        name: "Cargando...",
        email: "cargando@ejemplo.com",
        avatar: "/placeholder.svg?height=32&width=32",
      }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="hover:bg-sidebar-accent/50 transition-colors">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                  <Plane className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Viajes Paraíso</span>
                  <span className="truncate text-xs text-muted-foreground">Panel Administrativo</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavProjects projects={staticData.projects} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          <NavUser user={userForNav} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
