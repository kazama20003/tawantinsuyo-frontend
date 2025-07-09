"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Calendar, Percent, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"
import { offersApi } from "@/lib/offers-api"
import type { Offer, OffersQueryParams } from "@/types/offer"
import {OfferFormDialog} from "@/components/dashboard/offer/offer-form-dialog"

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOffers, setTotalOffers] = useState(0)

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true)
      const params: OffersQueryParams = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      }

      const response = await offersApi.getOffers(params)
      setOffers(response.data)
      setTotalPages(response.meta.totalPages)
      setTotalOffers(response.meta.total)
    } catch {
      toast.error("No se pudieron cargar las ofertas")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleToggleStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      await offersApi.toggleOfferStatus(offerId, currentStatus)
      toast.success("Estado de la oferta actualizado")
      fetchOffers()
    } catch {
      toast.error("No se pudo actualizar el estado de la oferta")
    }
  }

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta oferta?")) return

    try {
      await offersApi.deleteOffer(offerId)
      toast.success("Oferta eliminada correctamente")
      fetchOffers()
    } catch {
      toast.error("No se pudo eliminar la oferta")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)
    return offer.isActive && now >= startDate && now <= endDate
  }

  const getOfferStatus = (offer: Offer) => {
    if (!offer.isActive) return { label: "Inactiva", variant: "secondary" as const }

    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)

    if (now < startDate) return { label: "Programada", variant: "outline" as const }
    if (now > endDate) return { label: "Expirada", variant: "destructive" as const }
    return { label: "Activa", variant: "default" as const }
  }

  // Estadísticas
  const activeOffers = offers.filter((offer) => isOfferActive(offer)).length
  const expiredOffers = offers.filter((offer) => {
    const now = new Date()
    const endDate = new Date(offer.endDate)
    return now > endDate
  }).length
  const scheduledOffers = offers.filter((offer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    return now < startDate && offer.isActive
  }).length

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Ofertas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ofertas</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOffers}</div>
              <p className="text-xs text-muted-foreground">Ofertas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ofertas Activas</CardTitle>
              <ToggleRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeOffers}</div>
              <p className="text-xs text-muted-foreground">En vigencia ahora</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programadas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{scheduledOffers}</div>
              <p className="text-xs text-muted-foreground">Próximas a iniciar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
              <ToggleLeft className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredOffers}</div>
              <p className="text-xs text-muted-foreground">Ya finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Ofertas</CardTitle>
            <CardDescription>Administra las ofertas y promociones de tu agencia de viajes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar ofertas..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
              <OfferFormDialog onOfferCreated={fetchOffers} />
            </div>
          </CardContent>
        </Card>

        {/* Lista de ofertas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const status = getOfferStatus(offer)
            return (
              <Card key={offer._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      {offer.description && <CardDescription className="mt-1">{offer.description}</CardDescription>}
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-600">{offer.discountPercentage}% OFF</div>
                    <div className="text-sm text-muted-foreground">
                      {offer.applicableTours.length} tour{offer.applicableTours.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span>{formatDate(offer.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fin:</span>
                      <span>{formatDate(offer.endDate)}</span>
                    </div>
                  </div>

                  {offer.discountCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Código:</span>
                      <Badge variant="outline">{offer.discountCode}</Badge>
                    </div>
                  )}

                  {offer.applicableTours.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Tours aplicables:</div>
                      <div className="space-y-1">
                        {offer.applicableTours.slice(0, 2).map((tour) => (
                          <div key={tour._id} className="text-xs text-muted-foreground flex justify-between">
                            <span className="truncate">{tour.title}</span>
                            <span>${tour.price}</span>
                          </div>
                        ))}
                        {offer.applicableTours.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{offer.applicableTours.length - 2} más...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(offer._id, offer.isActive)}>
                      {offer.isActive ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteOffer(offer._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {offers.length === 0 && !loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Percent className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay ofertas</h3>
              <p className="text-muted-foreground text-center mb-4">
                No se encontraron ofertas con los filtros aplicados.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Oferta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  )
}
