"use client"

import React from "react"

import { useState, useRef } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { toursApi } from "@/lib/tours-api"
import { uploadApi } from "@/lib/upload-api"
import type { CreateTourDto, TourFormData } from "@/types/tour"

// Componentes del formulario
import { BasicInfoForm } from "@/components/dashboard/tour/basic-info-form"
import TourDetailsForm from "@/components/dashboard/tour/tour-details-form"
import { TransportForm } from "@/components/dashboard/tour/transport-form"
import { RouteForm } from "@/components/dashboard/tour/route-form"
import { ItineraryForm } from "@/components/dashboard/tour/itinerary-form"
import { IncludesForm } from "@/components/dashboard/tour/includes-form"

// Función para generar slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Remover guiones duplicados
}

export default function NewTourPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [submitting, setSubmitting] = useState(false)
  const [tourCreated, setTourCreated] = useState(false)
  const temporaryImagesRef = useRef<Set<string>>(new Set())

  // Usar TourFormData internamente
  const [formData, setFormData] = useState<TourFormData>({
    title: "",
    subtitle: "",
    imageUrl: "",
    imageId: "",
    price: 0,
    originalPrice: undefined,
    duration: "",
    rating: 0,
    reviews: 0,
    location: "",
    region: "",
    category: "Aventura", // Valor por defecto
    difficulty: "Facil", // Sin tilde
    packageType: "Basico", // Valor por defecto
    highlights: [],
    featured: false,
    selectedTransports: [], // Para mostrar en el formulario
    transportOptionIds: [], // Para enviar al backend
    itinerary: [],
    includes: [],
    notIncludes: [],
    toBring: [],
    conditions: [],
    slug: "", // Agregar slug
  })

  // Función para agregar imagen temporal
  const addTemporaryImage = (imageId: string) => {
    if (imageId && imageId.trim() !== "") {
      temporaryImagesRef.current.add(imageId)
      console.log(`Imagen temporal agregada: ${imageId}`)
    }
  }

  // Función para remover imagen temporal (cuando se convierte en permanente)
  const removeTemporaryImage = (imageId: string) => {
    if (imageId && imageId.trim() !== "") {
      temporaryImagesRef.current.delete(imageId)
      console.log(`Imagen removida de temporales: ${imageId}`)
    }
  }

  // Función para limpiar solo imágenes temporales
  const cleanupTemporaryImages = async () => {
    const tempImages = Array.from(temporaryImagesRef.current)
    if (tempImages.length === 0) return

    console.log(`Limpiando ${tempImages.length} imágenes temporales...`)

    for (const imageId of tempImages) {
      try {
        const result = await uploadApi.deleteImage(imageId)
        if (result.success) {
          console.log(`Imagen temporal ${imageId} eliminada`)
        } else {
          console.warn(`No se pudo eliminar imagen temporal ${imageId}:`, result.message)
        }
      } catch (error) {
        console.warn(`Error al eliminar imagen temporal ${imageId}:`, error)
      }
    }

    // Limpiar el set
    temporaryImagesRef.current.clear()
  }

  const updateFormData = (section: string, data: Partial<TourFormData>) => {
    // Rastrear nuevas imágenes subidas como temporales
    if (data.imageId && data.imageId !== formData.imageId) {
      addTemporaryImage(data.imageId)
    }

    // Rastrear imágenes en itinerario
    if (data.itinerary) {
      data.itinerary.forEach((day) => {
        if (day.imageId) {
          addTemporaryImage(day.imageId)
        }
        // Rastrear imágenes en rutas del día
        day.route?.forEach((point) => {
          if (point.imageId) {
            addTemporaryImage(point.imageId)
          }
        })
      })
    }

    // Generar slug automáticamente cuando cambie el título
    if (data.title && data.title !== formData.title) {
      data.slug = generateSlug(data.title)
    }

    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Función para marcar imágenes como permanentes
  const markImagesAsPermanent = (tourData: CreateTourDto) => {
    // Imagen principal
    if (tourData.imageId) {
      removeTemporaryImage(tourData.imageId)
    }

    // Imágenes del itinerario
    tourData.itinerary?.forEach((day) => {
      if (day.imageId) {
        removeTemporaryImage(day.imageId)
      }
      // Imágenes en rutas del día
      day.route?.forEach((point) => {
        if (point.imageId) {
          removeTemporaryImage(point.imageId)
        }
      })
    })
  }

  const validateFormData = (): string[] => {
    const errors: string[] = []

    // Validaciones básicas
    if (!formData.title.trim()) errors.push("El título es requerido")
    if (!formData.subtitle.trim()) errors.push("El subtítulo es requerido")
    if (!formData.location.trim()) errors.push("La ubicación es requerida")
    if (!formData.region.trim()) errors.push("La región es requerida")
    if (!formData.duration.trim()) errors.push("La duración es requerida")
    if (formData.price <= 0) errors.push("El precio debe ser mayor a 0")

    return errors
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Validar datos
      const validationErrors = validateFormData()
      if (validationErrors.length > 0) {
        toast.error("Errores de validación", {
          description: validationErrors.join(", "),
        })
        setActiveTab("basic")
        return
      }

      // Crear el DTO correcto para el backend (con slug)
      const tourData: CreateTourDto = {
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl,
        imageId: formData.imageId || undefined,
        price: formData.price,
        originalPrice: formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : undefined,
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
        transportOptionIds: formData.transportOptionIds?.length ? formData.transportOptionIds : undefined,
        itinerary: formData.itinerary?.length ? formData.itinerary : undefined,
        includes: formData.includes?.length ? formData.includes : undefined,
        notIncludes: formData.notIncludes?.length ? formData.notIncludes : undefined,
        toBring: formData.toBring?.length ? formData.toBring : undefined,
        conditions: formData.conditions?.length ? formData.conditions : undefined,
        slug: formData.slug || generateSlug(formData.title), // Incluir slug
      }

      console.log("Sending tour data:", tourData)

      await toursApi.create(tourData)

      // Marcar el tour como creado exitosamente
      setTourCreated(true)

      // Marcar todas las imágenes como permanentes (no temporales)
      markImagesAsPermanent(tourData)

      toast.success("Paquete creado", {
        description: "El paquete turístico ha sido creado exitosamente.",
      })

      router.push("/dashboard/tours")
    } catch (error) {
      console.error("Error creating tour:", error)

      // Mostrar error más específico
      if (error instanceof Error) {
        toast.error("Error al crear paquete", {
          description: error.message || "No se pudo crear el paquete turístico.",
        })
      } else {
        toast.error("Error al crear paquete", {
          description: "No se pudo crear el paquete turístico. Por favor, intente más tarde.",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async () => {
    // Mostrar confirmación antes de salir
    const hasData = Object.values(formData).some(
      (value) =>
        (typeof value === "string" && value.trim() !== "") ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === "number" && value > 0),
    )

    if (hasData) {
      if (window.confirm("¿Estás seguro de cancelar? Se perderán todos los datos ingresados.")) {
        // Limpiar imágenes temporales antes de salir
        await cleanupTemporaryImages()
        router.back()
      }
    } else {
      router.back()
    }
  }

  // Usar useEffect para manejar la limpieza al desmontar el componente
  React.useEffect(() => {
    const handleUnload = () => {
      if (!tourCreated) {
        // Solo limpiar si el tour no fue creado exitosamente
        cleanupTemporaryImages()
      }
    }

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      // Solo limpiar al desmontar si el tour no fue creado
      if (!tourCreated) {
        cleanupTemporaryImages()
      }
    }
  }, [tourCreated])

  const tabs = [
    { id: "basic", label: "Información Básica", required: true },
    { id: "details", label: "Detalles del Tour", required: true },
    { id: "transport", label: "Transporte", required: false },
    { id: "route", label: "Información de Rutas", required: false },
    { id: "itinerary", label: "Itinerario", required: false },
    { id: "includes", label: "Incluye/No Incluye", required: false },
  ]

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const progress = ((currentTabIndex + 1) / tabs.length) * 100

  // Calcular completitud de cada sección
  const getTabCompleteness = (tabId: string): number => {
    switch (tabId) {
      case "basic":
        const basicFields = [formData.title, formData.subtitle, formData.location, formData.region, formData.category]
        return (basicFields.filter(Boolean).length / basicFields.length) * 100
      case "details":
        const detailFields = [formData.duration, formData.price > 0, formData.packageType, formData.difficulty]
        return (detailFields.filter(Boolean).length / detailFields.length) * 100
      case "transport":
        return formData.selectedTransports && formData.selectedTransports.length > 0 ? 100 : 0
      case "route":
        return 100 // Siempre completo ya que es informativo
      case "itinerary":
        return formData.itinerary && formData.itinerary.length > 0 ? 100 : 0
      case "includes":
        return formData.includes && formData.includes.length > 0 ? 100 : 0
      default:
        return 0
    }
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
                <BreadcrumbPage>Nuevo Paquete</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Crear Nuevo Paquete Turístico</h1>
            </div>
            <p className="text-muted-foreground">Completa la información para crear un nuevo paquete turístico</p>
            {formData.slug && (
              <p className="text-xs text-muted-foreground">
                URL: <code className="bg-muted px-1 rounded">/tours/{formData.slug}</code>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear Paquete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del formulario</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Formulario */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              {/* Navegación de pestañas - Responsive */}
              <div className="border-b">
                {/* Desktop: Pestañas horizontales */}
                <div className="hidden md:block">
                  <TabsList className="grid w-full grid-cols-6 h-auto p-1">
                    {tabs.map((tab) => {
                      const completeness = getTabCompleteness(tab.id)
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex flex-col items-center gap-1 py-3 px-2 text-xs leading-tight relative"
                        >
                          <span className="font-medium">{tab.label}</span>
                          {tab.required && <span className="text-red-500 text-xs">*</span>}
                          {completeness > 0 && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-500 rounded-full opacity-60" />
                          )}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>

                {/* Mobile: Selector dropdown */}
                <div className="md:hidden p-4">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    {tabs.map((tab) => {
                      const completeness = getTabCompleteness(tab.id)
                      return (
                        <option key={tab.id} value={tab.id}>
                          {tab.label} {tab.required ? "*" : ""} {completeness > 0 ? "✓" : ""}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {/* Contenido de las pestañas */}
              <div className="p-6">
                <TabsContent value="basic" className="mt-0">
                  <BasicInfoForm
                    data={formData}
                    onChange={(data: Partial<TourFormData>) => updateFormData("basic", data)}
                  />
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <TourDetailsForm
                    data={formData}
                    onChange={(data: Partial<TourFormData>) => updateFormData("details", data)}
                  />
                </TabsContent>

                <TabsContent value="transport" className="mt-0">
                  <TransportForm
                    data={formData}
                    onChange={(data: Partial<TourFormData>) => updateFormData("transport", data)}
                  />
                </TabsContent>

                <TabsContent value="route" className="mt-0">
                  <RouteForm
                    _data={formData}
                    _onChange={(data: Partial<TourFormData>) => updateFormData("route", data)}
                  />
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0">
                  <ItineraryForm
                    data={formData}
                    onChange={(data: Partial<TourFormData>) => updateFormData("itinerary", data)}
                  />
                </TabsContent>

                <TabsContent value="includes" className="mt-0">
                  <IncludesForm
                    data={formData}
                    onChange={(data: Partial<TourFormData>) => updateFormData("includes", data)}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Información de ayuda */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-blue-800">
                <p className="font-medium">Consejos para crear un buen paquete turístico:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Completa toda la información básica (marcada con *)</li>
                  <li>Agrega imágenes atractivas para cada sección</li>
                  <li>Selecciona las opciones de transporte disponibles</li>
                  <li>Define claramente qué incluye y qué no incluye el tour</li>
                  <li>Crea un itinerario detallado día por día con rutas específicas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
