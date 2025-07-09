"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Save } from "lucide-react"

// Importar componentes de formulario
import { BasicInfoForm } from "@/components/dashboard/tour/basic-info-form"
import { TourDetailsForm } from "@/components/dashboard/tour/tour-details-form"
import { TransportForm } from "@/components/dashboard/tour/transport-form"
import { ItineraryForm } from "@/components/dashboard/tour/itinerary-form"
import { IncludesForm } from "@/components/dashboard/tour/includes-form"
import { RouteForm } from "@/components/dashboard/tour/route-form"

// Importar tipos y API
import type { TourFormData, UpdateTourDto, ItineraryDay, RoutePoint, TransportOption } from "@/types/tour"
import { toursApi } from "@/lib/tours-api"
import { uploadApi } from "@/lib/upload-api"

export default function EditTourPage() {
  const router = useRouter()
  const params = useParams()
  const tourId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [tourUpdated, setTourUpdated] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    subtitle: "",
    imageUrl: "",
    imageId: "",
    price: 0,
    originalPrice: 0,
    duration: "",
    rating: 0,
    reviews: 0,
    location: "",
    region: "",
    category: "Aventura",
    difficulty: "Facil",
    packageType: "Basico",
    highlights: [],
    featured: false,
    selectedTransports: [],
    transportOptionIds: [],
    itinerary: [],
    includes: [],
    notIncludes: [],
    toBring: [],
    conditions: [],
    slug: "",
  })

  // Función para manejar cambios en el formulario
  const handleFormChange = (data: Partial<TourFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }))
  }

  // Función para limpiar _id de objetos anidados
  const cleanItineraryForUpdate = (itinerary: ItineraryDay[]): ItineraryDay[] => {
    return itinerary.map((day) => {
      const cleanDay: ItineraryDay = {
        day: day.day,
        title: day.title,
        description: day.description,
        activities: day.activities,
        meals: day.meals,
        accommodation: day.accommodation,
        route: [], // Add this line to initialize route as empty array
      }

      // Limpiar rutas si existen
      if (day.route) {
        cleanDay.route = day.route.map((routePoint) => {
          const cleanRoute: RoutePoint = {
            location: routePoint.location,
            description: routePoint.description,
            imageUrl: routePoint.imageUrl,
          }
          return cleanRoute
        })
      }

      return cleanDay
    })
  }

  // Cargar datos del tour
  useEffect(() => {
    const loadTourData = async () => {
      try {
        setLoading(true)
        console.log("Loading tour with ID:", tourId)

        const tour = await toursApi.getById(tourId)
        console.log("Loaded tour data:", tour)

        // Convertir datos del tour al formato del formulario
        const formDataFromTour: TourFormData = {
          title: tour.title || "",
          subtitle: tour.subtitle || "",
          imageUrl: tour.imageUrl || "",
          imageId: tour.imageId || "",
          price: tour.price || 0,
          originalPrice: tour.originalPrice || 0,
          duration: tour.duration || "",
          rating: tour.rating || 0,
          reviews: tour.reviews || 0,
          location: tour.location || "",
          region: tour.region || "",
          category: tour.category || "Aventura",
          difficulty: tour.difficulty || "Facil",
          packageType: tour.packageType || "Basico",
          highlights: tour.highlights || [],
          featured: tour.featured || false,
          selectedTransports: Array.isArray(tour.transportOptionIds) ? tour.transportOptionIds : [],
          transportOptionIds: Array.isArray(tour.transportOptionIds)
            ? tour.transportOptionIds.map((t: TransportOption | string) => (typeof t === "string" ? t : t._id))
            : [],
          itinerary: tour.itinerary || [],
          includes: tour.includes || [],
          notIncludes: tour.notIncludes || [],
          toBring: tour.toBring || [],
          conditions: tour.conditions || [],
          slug: tour.slug || "",
        }

        console.log("Setting form data:", formDataFromTour)
        setFormData(formDataFromTour)
      } catch (error) {
        console.error("Error loading tour:", error)
        toast.error("Error al cargar el tour", {
          description: "No se pudo cargar la información del tour. Redirigiendo...",
          duration: 3000,
        })
        setTimeout(() => router.push("/dashboard/tours"), 2000)
      } finally {
        setLoading(false)
      }
    }

    if (tourId) {
      loadTourData()
    }
  }, [tourId, router])

  // Función para generar slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  // Actualizar slug cuando cambia el título
  useEffect(() => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }))
    }
  }, [formData.title])

  // Calcular progreso
  const calculateProgress = () => {
    const requiredFields = [
      formData.title,
      formData.subtitle,
      formData.location,
      formData.region,
      formData.duration,
      formData.price > 0,
    ]
    const completedFields = requiredFields.filter(Boolean).length
    return Math.round((completedFields / requiredFields.length) * 100)
  }

  // Validar formulario
  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.title.trim()) errors.push("El título es requerido")
    if (!formData.subtitle.trim()) errors.push("El subtítulo es requerido")
    if (!formData.location.trim()) errors.push("La ubicación es requerida")
    if (!formData.region.trim()) errors.push("La región es requerida")
    if (!formData.duration.trim()) errors.push("La duración es requerida")
    if (formData.price <= 0) errors.push("El precio debe ser mayor a 0")

    return errors
  }

  // Limpiar imágenes no utilizadas
  const cleanupUnusedImages = async () => {
    try {
      const imagesToCleanup: string[] = []

      // Agregar lógica para identificar imágenes no utilizadas
      // Por ejemplo, imágenes temporales que no se guardaron

      if (imagesToCleanup.length > 0) {
        await Promise.all(imagesToCleanup.map((imageId) => uploadApi.deleteImage(imageId).catch(console.error)))
      }
    } catch (error) {
      console.error("Error cleaning up images:", error)
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
      toast.error("Formulario incompleto", {
        description: errors.join(", "),
        duration: 5000,
      })
      return
    }

    try {
      setSubmitting(true)

      // Preparar datos para envío - limpiar _id de objetos anidados
      const updateData: UpdateTourDto = {
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl,
        imageId: formData.imageId,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        duration: formData.duration,
        rating: formData.rating,
        reviews: formData.reviews,
        location: formData.location,
        region: formData.region,
        category: formData.category,
        difficulty: formData.difficulty,
        packageType: formData.packageType,
        highlights: formData.highlights,
        featured: formData.featured,
        transportOptionIds: formData.transportOptionIds,
        itinerary: formData.itinerary ? cleanItineraryForUpdate(formData.itinerary) : undefined,
        includes: formData.includes,
        notIncludes: formData.notIncludes,
        toBring: formData.toBring,
        conditions: formData.conditions,
        slug: formData.slug,
      }

      console.log("Updating tour data:", updateData)

      await toursApi.update(tourId, updateData)

      setTourUpdated(true)

      toast.success("¡Paquete actualizado exitosamente!", {
        description: "El paquete turístico ha sido actualizado correctamente.",
        duration: 3000,
      })

      // Limpiar imágenes no utilizadas
      await cleanupUnusedImages()

      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push("/dashboard/tours")
      }, 1500)
    } catch (error) {
      console.error("Error updating tour:", error)
      toast.error("Error al actualizar paquete", {
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Manejar cancelación
  const handleCancel = () => {
    router.push("/dashboard/tours")
  }

  if (loading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando información del tour...</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

  if (tourUpdated) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Save className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Paquete Actualizado!</h2>
            <p className="text-muted-foreground mb-4">El paquete turístico ha sido actualizado exitosamente.</p>
            <p className="text-sm text-muted-foreground">Redirigiendo...</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

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
                <BreadcrumbLink href="/paquetes">Paquetes Turísticos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar Paquete</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Header con progreso */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Editar Paquete Turístico</CardTitle>
                <CardDescription>
                  Modifica la información del paquete turístico {formData.title || "Cargando..."}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={submitting}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Actualizar Paquete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso del formulario</span>
                <span>{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Formulario con pestañas */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic-info">Información Básica</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="transport">Transporte</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerario</TabsTrigger>
                <TabsTrigger value="includes">Incluye/No Incluye</TabsTrigger>
                <TabsTrigger value="route">Ruta</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="mt-6">
                <BasicInfoForm data={formData} onChange={handleFormChange} />
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <TourDetailsForm data={formData} onChange={handleFormChange} />
              </TabsContent>

              <TabsContent value="transport" className="mt-6">
                <TransportForm data={formData} onChange={handleFormChange} />
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <ItineraryForm data={formData} onChange={handleFormChange} />
              </TabsContent>

              <TabsContent value="includes" className="mt-6">
                <IncludesForm data={formData} onChange={handleFormChange} />
              </TabsContent>

              <TabsContent value="route" className="mt-6">
                <RouteForm _data={formData} _onChange={handleFormChange} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
