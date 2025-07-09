"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Crown,
  Shield,
  Mountain,
  Waves,
  TreePine,
  Camera,
} from "lucide-react"
import { toast } from "sonner"
import { toursApi } from "@/lib/tours-api"
import type { Tour, PackageType, Difficulty, TourCategory } from "@/types/tour"

export default function PaquetesPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<PackageType | "all">("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTours, setTotalTours] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  // Función para cargar tours con useCallback para evitar el warning de dependencias
  const loadTours = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const response = await toursApi.getAll(page, 12)
      setTours(response.data)
      if (response.pagination) {
        setCurrentPage(response.pagination.page)
        setTotalPages(response.pagination.totalPages)
        setTotalTours(response.pagination.total)
      }

      // Check if we're using fallback data
      if (response.message.includes("desarrollo")) {
        toast.info("Usando datos de desarrollo", {
          description: "El servidor API no está disponible. Se están mostrando datos de prueba.",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error loading tours:", error)
      setTours([])
      setTotalPages(1)
      setTotalTours(0)

      toast.error("Error al cargar paquetes", {
        description: "No se pudieron cargar los paquetes turísticos. Por favor, intente más tarde.",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTours()
  }, [loadTours])

  // Filtrar tours
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || tour.packageType === selectedType
    const matchesDifficulty = selectedDifficulty === "all" || tour.difficulty === selectedDifficulty
    const matchesCategory = selectedCategory === "all" || tour.category === selectedCategory
    return matchesSearch && matchesType && matchesDifficulty && matchesCategory
  })

  // Manejar eliminación de tour
  const handleDeleteTour = async () => {
    if (!selectedTour) return
    try {
      setSubmitting(true)
      await toursApi.delete(selectedTour._id)
      setIsDeleteDialogOpen(false)
      setSelectedTour(null)
      loadTours(currentPage)

      toast.success("Paquete eliminado", {
        description: "El paquete turístico ha sido eliminado exitosamente.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error deleting tour:", error)

      toast.error("Error al eliminar paquete", {
        description: "No se pudo eliminar el paquete turístico. Por favor, intente más tarde.",
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteDialog = (tour: Tour) => {
    setSelectedTour(tour)
    setIsDeleteDialogOpen(true)
  }

  const openViewDialog = (tour: Tour) => {
    setSelectedTour(tour)
    setIsViewDialogOpen(true)
  }

  const getTourTypeBadge = (type: PackageType) => {
    switch (type) {
      case "Premium":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )
      case "Basico":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Package className="w-3 h-3 mr-1" />
            Básico
          </Badge>
        )
    }
  }

  const getCategoryBadge = (category: TourCategory) => {
    switch (category) {
      case "Aventura":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Mountain className="w-3 h-3 mr-1" />
            Aventura
          </Badge>
        )
      case "Cultural":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Camera className="w-3 h-3 mr-1" />
            Cultural
          </Badge>
        )
      case "Relax":
        return (
          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <Waves className="w-3 h-3 mr-1" />
            Relax
          </Badge>
        )
      case "Naturaleza":
        return (
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <TreePine className="w-3 h-3 mr-1" />
            Naturaleza
          </Badge>
        )
    }
  }

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Facil":
        return (
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Shield className="w-3 h-3 mr-1" />
            Fácil
          </Badge>
        )
      case "Moderado":
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            <Mountain className="w-3 h-3 mr-1" />
            Moderado
          </Badge>
        )
      case "Difícil":
        return (
          <Badge variant="outline" className="text-red-700 border-red-300">
            <Mountain className="w-3 h-3 mr-1" />
            Difícil
          </Badge>
        )
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(price)
  }

  const premiumCount = tours.filter((t) => t.packageType === "Premium").length
  const basicoCount = tours.filter((t) => t.packageType === "Basico").length

  // Estadísticas de tipos de tour
  const tourTypeStats = [
    { label: "Premium", count: premiumCount, color: "text-purple-600" },
    { label: "Básico", count: basicoCount, color: "text-green-600" },
  ]

  // Estadísticas por categoría
  const categoryStats = [
    { label: "Aventura", count: tours.filter((t) => t.category === "Aventura").length, color: "text-orange-600" },
    { label: "Cultural", count: tours.filter((t) => t.category === "Cultural").length, color: "text-blue-600" },
    { label: "Relax", count: tours.filter((t) => t.category === "Relax").length, color: "text-cyan-600" },
    { label: "Naturaleza", count: tours.filter((t) => t.category === "Naturaleza").length, color: "text-green-600" },
  ]

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
                <BreadcrumbPage>Paquetes Turísticos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paquetes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTours}</div>
              <p className="text-xs text-muted-foreground">Paquetes disponibles</p>
            </CardContent>
          </Card>

          {/* Mostrar estadísticas de tipos de tour */}
          {tourTypeStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                {stat.label === "Premium" ? (
                  <Crown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                <p className="text-xs text-muted-foreground">Paquetes {stat.label.toLowerCase()}</p>
              </CardContent>
            </Card>
          ))}

          {/* Estadística de categoría más popular */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Más Popular</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{Math.max(...categoryStats.map((c) => c.count))}</div>
              <p className="text-xs text-muted-foreground">
                {categoryStats.find((c) => c.count === Math.max(...categoryStats.map((s) => s.count)))?.label}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Paquetes Turísticos</CardTitle>
                <CardDescription>Gestiona los paquetes y tours disponibles</CardDescription>
              </div>
              <Button onClick={() => router.push("/dashboard/tours/new")} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Paquete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, ubicación o región..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={selectedType} onValueChange={(value: PackageType | "all") => setSelectedType(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Basico">Básico</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDifficulty}
                  onValueChange={(value: Difficulty | "all") => setSelectedDifficulty(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Facil">Fácil</SelectItem>
                    <SelectItem value="Moderado">Moderado</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCategory}
                  onValueChange={(value: TourCategory | "all") => setSelectedCategory(value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Aventura">Aventura</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Relax">Relax</SelectItem>
                    <SelectItem value="Naturaleza">Naturaleza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de paquetes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando paquetes...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <Card key={tour._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 relative">
                    <Image
                      src={tour.imageUrl || "/placeholder.svg?height=200&width=400&text=Tour"}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div className="absolute top-2 left-2 flex gap-2">
                    {getCategoryBadge(tour.category)}
                    {tour.packageType && getTourTypeBadge(tour.packageType)}
                    {tour.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Destacado
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openViewDialog(tour)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/paquetes/${tour._id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDeleteDialog(tour)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight">{tour.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tour.subtitle}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{tour.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tour.rating}</span>
                        <span className="text-sm text-muted-foreground">({tour.reviews})</span>
                      </div>
                      {getDifficultyBadge(tour.difficulty)}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{formatPrice(tour.price)}</div>
                        {tour.originalPrice && tour.originalPrice > tour.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(tour.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Disponible</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * 12 + 1} a {Math.min(currentPage * 12, totalTours)} de {totalTours} paquetes
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTours(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTours(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de visualización */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTour?.title}</DialogTitle>
            <DialogDescription>{selectedTour?.subtitle}</DialogDescription>
          </DialogHeader>
          {selectedTour && (
            <div className="space-y-6">
              <div className="w-full h-64 relative">
                <Image
                  src={selectedTour.imageUrl || "/placeholder.svg"}
                  alt={selectedTour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover rounded-lg"
                  priority={false}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ubicación:</span>
                    <span>
                      {selectedTour.location}, {selectedTour.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duración:</span>
                    <span>{selectedTour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Precio:</span>
                    <span>{formatPrice(selectedTour.price)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Rating:</span>
                    <span>
                      {selectedTour.rating} ({selectedTour.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Categoría:</span>
                    {getCategoryBadge(selectedTour.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dificultad:</span>
                    {getDifficultyBadge(selectedTour.difficulty)}
                  </div>
                </div>
              </div>
              {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTour.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedTour.includes && selectedTour.includes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Incluye</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedTour.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedTour.notIncludes && selectedTour.notIncludes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">No Incluye</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedTour.notIncludes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el paquete{" "}
              <strong>{selectedTour?.title}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTour} className="bg-red-600 hover:bg-red-700" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
