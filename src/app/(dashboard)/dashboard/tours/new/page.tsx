"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Plus,
  Minus,
  Save,
  ArrowLeft,
  Loader2,
  Package,
  MapPin,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Backpack,
  FileText,
  Car,
  Crown,
} from "lucide-react"
import { toast } from "sonner"
import { toursApi } from "@/lib/tours-api"
import { transportApi } from "@/lib/transport-api"
import type { CreateTourDto, TransportOption } from "@/types/tour"

// Schema de validación completo con actividades multilingües
const tourSchema = z.object({
  title: z.object({
    es: z.string().min(1, "El título en español es requerido"),
    en: z.string().optional(),
  }),
  subtitle: z.object({
    es: z.string().min(1, "El subtítulo en español es requerido"),
    en: z.string().optional(),
  }),
  imageUrl: z.string().min(1, "La imagen principal es requerida"),
  imageId: z.string().optional(),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  originalPrice: z.number().optional(),
  duration: z.object({
    es: z.string().min(1, "La duración en español es requerida"),
    en: z.string().optional(),
  }),
  rating: z.number().min(0).max(5, "El rating debe estar entre 0 y 5"),
  reviews: z.number().min(0, "Las reseñas deben ser 0 o más"),
  location: z.string().min(1, "La ubicación es requerida"),
  region: z.string().min(1, "La región es requerida"),
  category: z.enum([
    "Aventura",
    "Cultural",
    "Relajación",
    "Naturaleza",
    "Trekking",
    "Panoramico",
    "Transporte Turistico",
  ]),
  difficulty: z.enum(["Facil", "Moderado", "Difícil"]),
  packageType: z.enum(["Basico", "Premium"]),
  highlights: z
    .array(
      z.object({
        es: z.string().min(1, "El highlight en español es requerido"),
        en: z.string().optional(),
      }),
    )
    .min(1, "Debe tener al menos un highlight"),
  featured: z.boolean().optional(),
  slug: z.string().min(1, "El slug es requerido"),
  // Transportes obligatorios
  transportOptionIds: z.array(z.string()).min(1, "Debe seleccionar al menos un transporte para el paquete"),
  itinerary: z
    .array(
      z.object({
        day: z.number().min(1),
        title: z.object({
          es: z.string().min(1, "El título del día es requerido"),
          en: z.string().optional(),
        }),
        description: z.object({
          es: z.string().min(1, "La descripción del día es requerida"),
          en: z.string().optional(),
        }),
        // ✅ Actividades ahora multilingües
        activities: z
          .array(
            z.object({
              es: z.string().min(1, "La actividad en español es requerida"),
              en: z.string().optional(),
            }),
          )
          .min(1, "Debe tener al menos una actividad"),
        meals: z.array(z.string()).optional(),
        accommodation: z.string().optional(),
        imageId: z.string().optional(),
        imageUrl: z.string().optional(),
        route: z
          .array(
            z.object({
              location: z.object({
                es: z.string().min(1, "La ubicación es requerida"),
                en: z.string().optional(),
              }),
              description: z
                .object({
                  es: z.string().optional(),
                  en: z.string().optional(),
                })
                .optional(),
              imageId: z.string().optional(),
              imageUrl: z.string().optional(),
            }),
          )
          .min(1, "Debe tener al menos un punto de ruta"),
      }),
    )
    .min(1, "Debe tener al menos un día de itinerario"),
  includes: z
    .array(
      z.object({
        es: z.string().min(1, "El item incluido en español es requerido"),
        en: z.string().optional(),
      }),
    )
    .min(1, "Debe especificar qué incluye el tour"),
  notIncludes: z
    .array(
      z.object({
        es: z.string().min(1, "El item no incluido en español es requerido"),
        en: z.string().optional(),
      }),
    )
    .min(1, "Debe especificar qué no incluye el tour"),
  toBring: z
    .array(
      z.object({
        es: z.string().min(1, "El item a traer en español es requerido"),
        en: z.string().optional(),
      }),
    )
    .min(1, "Debe especificar qué traer"),
  conditions: z
    .array(
      z.object({
        es: z.string().min(1, "La condición en español es requerida"),
        en: z.string().optional(),
      }),
    )
    .min(1, "Debe especificar las condiciones del tour"),
})

type TourFormData = z.infer<typeof tourSchema>

export default function NewTourPage() {
  const [loading, setLoading] = useState(false)
  const [loadingTransports, setLoadingTransports] = useState(true)
  const [availableTransports, setAvailableTransports] = useState<TransportOption[]>([])
  const router = useRouter()

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: { es: "", en: "" },
      subtitle: { es: "", en: "" },
      imageUrl: "",
      imageId: "",
      price: 0,
      originalPrice: 0,
      duration: { es: "", en: "" },
      rating: 5,
      reviews: 0,
      location: "",
      region: "",
      category: "Aventura",
      difficulty: "Facil",
      packageType: "Basico",
      highlights: [{ es: "", en: "" }],
      featured: false,
      slug: "",
      transportOptionIds: [],
      itinerary: [
        {
          day: 1,
          title: { es: "", en: "" },
          description: { es: "", en: "" },
          activities: [{ es: "", en: "" }], // ✅ Ahora multilingüe
          meals: [],
          accommodation: "",
          imageId: "",
          imageUrl: "",
          route: [
            {
              location: { es: "", en: "" },
              description: { es: "", en: "" },
              imageId: "",
              imageUrl: "",
            },
          ],
        },
      ],
      includes: [{ es: "", en: "" }],
      notIncludes: [{ es: "", en: "" }],
      toBring: [{ es: "", en: "" }],
      conditions: [{ es: "", en: "" }],
    },
  })

  // Memoize functions to prevent unnecessary re-renders
  const generateSlugCallback = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  // Cargar transportes disponibles
  useEffect(() => {
    const loadTransports = async () => {
      try {
        setLoadingTransports(true)
        const response = await transportApi.getAll(1, 100) // Cargar todos los transportes
        setAvailableTransports(response.data)
      } catch (error) {
        console.error("Error loading transports:", error)
        toast.error("Error al cargar transportes", {
          description: "No se pudieron cargar las opciones de transporte.",
        })
      } finally {
        setLoadingTransports(false)
      }
    }

    loadTransports()
  }, [])

  // Field arrays
  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control: form.control,
    name: "highlights",
  })

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control: form.control,
    name: "itinerary",
  })

  const {
    fields: includesFields,
    append: appendIncludes,
    remove: removeIncludes,
  } = useFieldArray({
    control: form.control,
    name: "includes",
  })

  const {
    fields: notIncludesFields,
    append: appendNotIncludes,
    remove: removeNotIncludes,
  } = useFieldArray({
    control: form.control,
    name: "notIncludes",
  })

  const {
    fields: toBringFields,
    append: appendToBring,
    remove: removeToBring,
  } = useFieldArray({
    control: form.control,
    name: "toBring",
  })

  const {
    fields: conditionsFields,
    append: appendConditions,
    remove: removeConditions,
  } = useFieldArray({
    control: form.control,
    name: "conditions",
  })


  // Watch title changes to auto-generate slug
  const titleEs = form.watch("title.es")
  useEffect(() => {
    if (titleEs) {
      const newSlug = generateSlugCallback(titleEs)
      form.setValue("slug", newSlug)
    }
  }, [titleEs, generateSlugCallback, form])

  // Helper functions for dynamic fields
  const addItineraryDay = () => {
    const newDay = itineraryFields.length + 1
    appendItinerary({
      day: newDay,
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      activities: [{ es: "", en: "" }], // ✅ Ahora multilingüe
      meals: [],
      accommodation: "",
      imageId: "",
      imageUrl: "",
      route: [
        {
          location: { es: "", en: "" },
          description: { es: "", en: "" },
          imageId: "",
          imageUrl: "",
        },
      ],
    })
  }

  // ✅ Funciones actualizadas para actividades multilingües
  const addActivityToDay = (dayIndex: number) => {
    const currentActivities = form.getValues(`itinerary.${dayIndex}.activities`)
    form.setValue(`itinerary.${dayIndex}.activities`, [...currentActivities, { es: "", en: "" }])
  }

  const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
    const currentActivities = form.getValues(`itinerary.${dayIndex}.activities`)
    if (currentActivities.length > 1) {
      const newActivities = currentActivities.filter((_, index) => index !== activityIndex)
      form.setValue(`itinerary.${dayIndex}.activities`, newActivities)
    }
  }

  const addRouteToDay = (dayIndex: number) => {
    const currentRoute = form.getValues(`itinerary.${dayIndex}.route`)
    form.setValue(`itinerary.${dayIndex}.route`, [
      ...currentRoute,
      {
        location: { es: "", en: "" },
        description: { es: "", en: "" },
        imageId: "",
        imageUrl: "",
      },
    ])
  }

  const removeRouteFromDay = (dayIndex: number, routeIndex: number) => {
    const currentRoute = form.getValues(`itinerary.${dayIndex}.route`)
    if (currentRoute.length > 1) {
      const newRoute = currentRoute.filter((_, index) => index !== routeIndex)
      form.setValue(`itinerary.${dayIndex}.route`, newRoute)
    }
  }

  // Filtrar transportes por tipo de paquete
  const packageType = form.watch("packageType")
  const filteredTransports = availableTransports.filter((transport) => transport.type === packageType)

  const onSubmit = async (data: TourFormData) => {
    try {
      setLoading(true)

      const tourData: CreateTourDto = {
        ...data,
      }

      await toursApi.create(tourData)

      toast.success("Tour creado", {
        description: "El tour se ha creado exitosamente.",
      })

      router.push("/dashboard/tours")
    } catch (error) {
      console.error("Error creating tour:", error)
      toast.error("Error al crear tour", {
        description: error instanceof Error ? error.message : "No se pudo crear el tour.",
      })
    } finally {
      setLoading(false)
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
                <BreadcrumbLink href="/dashboard/tours">Paquetes Turísticos</BreadcrumbLink>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Tour</h1>
            <p className="text-muted-foreground">
              Completa toda la información para crear un paquete turístico completo
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información Básica
                </CardTitle>
                <CardDescription>Información principal del tour</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title.es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (Español) *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Machu Picchu 2 días" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (Inglés)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Machu Picchu 2 days" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subtitle.es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtítulo (Español) *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción breve del tour..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtítulo (Inglés)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief tour description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Slug automático (solo lectura) */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL) - Generado automáticamente</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                          placeholder="Se genera automáticamente del título..."
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        El slug se genera automáticamente basado en el título en español
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Imagen Principal *</Label>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            imageId={form.getValues("imageId")}
                            onChange={(url, imageId) => {
                              field.onChange(url)
                              form.setValue("imageId", imageId)
                            }}
                            onRemove={() => {
                              field.onChange("")
                              form.setValue("imageId", "")
                            }}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detalles del Tour */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Detalles del Tour
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación *</FormLabel>
                        <FormControl>
                          <Input placeholder="Cusco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Región *</FormLabel>
                        <FormControl>
                          <Input placeholder="Cusco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Aventura">Aventura</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                            <SelectItem value="Relajación">Relajación</SelectItem>
                            <SelectItem value="Naturaleza">Naturaleza</SelectItem>
                            <SelectItem value="Trekking">Trekking</SelectItem>
                            <SelectItem value="Panoramico">Panorámico</SelectItem>
                            <SelectItem value="Transporte Turistico">Transporte Turístico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dificultad *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona dificultad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Facil">Fácil</SelectItem>
                            <SelectItem value="Moderado">Moderado</SelectItem>
                            <SelectItem value="Difícil">Difícil</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Paquete *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basico">Básico</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration.es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (Español) *</FormLabel>
                        <FormControl>
                          <Input placeholder="2 días y 1 noche" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (Inglés)</FormLabel>
                        <FormControl>
                          <Input placeholder="2 days and 1 night" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="300"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Original</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="350"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reviews"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reseñas *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tour Destacado</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Marcar como tour destacado en la página principal
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Selección de Transportes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Opciones de Transporte *
                </CardTitle>
                <CardDescription>
                  Selecciona los transportes disponibles para este paquete{" "}
                  {packageType && (
                    <span className="font-medium">({packageType === "Premium" ? "Premium" : "Básico"})</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingTransports ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Cargando transportes...</span>
                  </div>
                ) : filteredTransports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay transportes disponibles para el tipo de paquete seleccionado.</p>
                    <p className="text-sm">
                      Selecciona un tipo de paquete o{" "}
                      <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/dashboard/transport")}>
                        crea nuevos transportes
                      </Button>
                    </p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="transportOptionIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredTransports.map((transport) => {
                            const isSelected = field.value?.includes(transport._id) || false

                            return (
                              <Card
                                key={transport._id}
                                className={`w-full transition-all hover:shadow-md ${
                                  isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <FormControl>
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || []
                                          const newValue = checked
                                            ? [...currentValue, transport._id]
                                            : currentValue.filter((id) => id !== transport._id)
                                          field.onChange(newValue)
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{transport.vehicle}</h4>
                                        {transport.type === "Premium" && <Crown className="h-4 w-4 text-yellow-500" />}
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {transport.services.map((service, index) => (
                                          <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                                          >
                                            {service}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Highlights *
                </CardTitle>
                <CardDescription>Puntos destacados del tour (mínimo 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {highlightFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`highlights.${index}.es`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Highlight {index + 1} (Español) *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Machu Picchu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`highlights.${index}.en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Highlight {index + 1} (Inglés)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Machu Picchu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {highlightFields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeHighlight(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendHighlight({ es: "", en: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Highlight
                </Button>
              </CardContent>
            </Card>

            {/* Itinerario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Itinerario *
                </CardTitle>
                <CardDescription>Programa detallado día por día (mínimo 1 día)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {itineraryFields.map((dayField, dayIndex) => (
                  <Card key={dayField.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Día {dayIndex + 1}</CardTitle>
                        {itineraryFields.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeItinerary(dayIndex)}>
                            <Minus className="h-4 w-4" />
                            Eliminar Día
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Título y descripción del día */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`itinerary.${dayIndex}.title.es`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título del día (Español) *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: Llegada a Cusco" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`itinerary.${dayIndex}.title.en`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título del día (Inglés)</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Arrival in Cusco" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`itinerary.${dayIndex}.description.es`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción (Español) *</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descripción detallada del día..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`itinerary.${dayIndex}.description.en`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción (Inglés)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Detailed day description..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* ✅ Actividades multilingües */}
                      <div>
                        <Label className="text-sm font-medium">Actividades *</Label>
                        <div className="space-y-4 mt-2">
                          {form.watch(`itinerary.${dayIndex}.activities`).map((_, activityIndex) => (
                            <Card key={activityIndex} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium">Actividad {activityIndex + 1}</h4>
                                {form.watch(`itinerary.${dayIndex}.activities`).length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeActivityFromDay(dayIndex, activityIndex)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.activities.${activityIndex}.es`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Actividad (Español) *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ej: Visita a Sacsayhuamán" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.activities.${activityIndex}.en`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Actividad (Inglés)</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Visit to Sacsayhuamán" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </Card>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => addActivityToDay(dayIndex)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Actividad
                          </Button>
                        </div>
                      </div>

                      {/* Rutas */}
                      <div>
                        <Label className="text-sm font-medium">Puntos de Ruta *</Label>
                        <div className="space-y-4 mt-2">
                          {form.watch(`itinerary.${dayIndex}.route`).map((_, routeIndex) => (
                            <Card key={routeIndex} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium">Punto {routeIndex + 1}</h4>
                                {form.watch(`itinerary.${dayIndex}.route`).length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeRouteFromDay(dayIndex, routeIndex)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.route.${routeIndex}.location.es`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ubicación (Español) *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ej: Plaza de Armas" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.route.${routeIndex}.location.en`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ubicación (Inglés)</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Ex: Main Square" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.route.${routeIndex}.description.es`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Descripción (Español)</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Descripción del punto..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`itinerary.${dayIndex}.route.${routeIndex}.description.en`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Descripción (Inglés)</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder="Point description..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </Card>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => addRouteToDay(dayIndex)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Punto de Ruta
                          </Button>
                        </div>
                      </div>

                      {/* Alojamiento */}
                      <FormField
                        control={form.control}
                        name={`itinerary.${dayIndex}.accommodation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alojamiento</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Hotel San Agustín Plaza" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addItineraryDay} className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Día
                </Button>
              </CardContent>
            </Card>

            {/* Incluye */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Qué Incluye *
                </CardTitle>
                <CardDescription>Servicios y elementos incluidos en el tour (mínimo 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {includesFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`includes.${index}.es`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incluye {index + 1} (Español) *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Transporte turístico" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`includes.${index}.en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incluye {index + 1} (Inglés)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Tourist transport" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {includesFields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeIncludes(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendIncludes({ es: "", en: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item Incluido
                </Button>
              </CardContent>
            </Card>

            {/* No Incluye */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Qué No Incluye *
                </CardTitle>
                <CardDescription>Servicios y elementos NO incluidos en el tour (mínimo 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notIncludesFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`notIncludes.${index}.es`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No Incluye {index + 1} (Español) *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Almuerzos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`notIncludes.${index}.en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No Incluye {index + 1} (Inglés)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Lunches" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {notIncludesFields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeNotIncludes(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendNotIncludes({ es: "", en: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item No Incluido
                </Button>
              </CardContent>
            </Card>

            {/* Qué Traer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Backpack className="h-5 w-5" />
                  Qué Traer *
                </CardTitle>
                <CardDescription>Items que el cliente debe traer (mínimo 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {toBringFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`toBring.${index}.es`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Traer {index + 1} (Español) *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Ropa abrigadora" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`toBring.${index}.en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Traer {index + 1} (Inglés)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Warm clothing" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {toBringFields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeToBring(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendToBring({ es: "", en: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item a Traer
                </Button>
              </CardContent>
            </Card>

            {/* Condiciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Condiciones del Tour *
                </CardTitle>
                <CardDescription>Términos y condiciones del tour (mínimo 1)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditionsFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.es`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condición {index + 1} (Español) *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Mínimo 2 personas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condición {index + 1} (Inglés)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Minimum 2 people" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {conditionsFields.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeConditions(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendConditions({ es: "", en: "" })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Condición
                </Button>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Tour Completo
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SidebarInset>
  )
}
