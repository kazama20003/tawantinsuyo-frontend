"use client"

import type * as React from "react"
import {
  Plane,
  Users,
  Calendar,
  Car,
  BarChart3,
  Package,
  FileText,
  Globe,
} from "lucide-react"

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

const data = {
  user: {
    name: "Ana García",
    email: "ana@viajesparadiso.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
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
    // {
    //   title: "Finanzas",
    //   url: "/finanzas",
    //   icon: CreditCard,
    //   items: [
    //     {
    //       title: "Facturación",
    //       url: "/finanzas/facturacion",
    //     },
    //     {
    //       title: "Pagos",
    //       url: "/finanzas/pagos",
    //     },
    //     {
    //       title: "Comisiones",
    //       url: "/finanzas/comisiones",
    //     },
    //     {
    //       title: "Reportes Financieros",
    //       url: "/finanzas/reportes",
    //     },
    //   ],
    // },
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
  projects: [
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Plane className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Viajes Paraíso</span>
                  <span className="truncate text-xs">Panel Administrativo</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
