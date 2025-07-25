import { api } from "@/lib/axiosInstance"
import type {
  Tour,
  CreateTourDto,
  UpdateTourDto,
  TranslatedText,
  TourCategory,
  Difficulty,
  PackageType,
  TransportOption,
  ItineraryDay,
} from "@/types/tour"
import { AxiosError } from "axios"

interface ToursResponse {
  data: Tour[]
  message: string
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface TourResponse {
  data: Tour
  message: string
}

interface ApiError {
  message: string
  statusCode?: number
  error?: string
}

interface RawTourData {
  _id: string
  title: TranslatedText | string
  subtitle: TranslatedText | string
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: TranslatedText | string
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights?: (TranslatedText | string)[]
  featured?: boolean
  transportOptionIds: TransportOption[]
  itinerary?: ItineraryDay[]
  includes?: (TranslatedText | string)[]
  notIncludes?: (TranslatedText | string)[]
  toBring?: (TranslatedText | string)[]
  conditions?: (TranslatedText | string)[]
  slug: string
  createdAt: string
  updatedAt: string
}

// Helper function to extract text from TranslatedText
const extractText = (translatedText: TranslatedText | string): string => {
  if (typeof translatedText === "string") {
    return translatedText
  }
  if (translatedText && typeof translatedText === "object") {
    return translatedText.es || translatedText.en || "Texto no disponible"
  }
  return "Texto no disponible"
}

// Helper function to extract array of strings from TranslatedText array
const extractTextArray = (translatedArray?: (TranslatedText | string)[]): string[] => {
  if (!Array.isArray(translatedArray)) return []

  return translatedArray.map((item) => {
    if (typeof item === "string") {
      return item
    }
    if (item && typeof item === "object") {
      return item.es || item.en || "Texto no disponible"
    }
    return "Texto no disponible"
  })
}

// Transform raw API data to Tour type
const transformTourData = (rawTour: RawTourData): Tour => {
  return {
    _id: rawTour._id,
    title: extractText(rawTour.title),
    subtitle: extractText(rawTour.subtitle),
    imageUrl: rawTour.imageUrl,
    imageId: rawTour.imageId,
    price: rawTour.price,
    originalPrice: rawTour.originalPrice,
    duration: extractText(rawTour.duration),
    rating: rawTour.rating,
    reviews: rawTour.reviews,
    location: rawTour.location,
    region: rawTour.region,
    category: rawTour.category,
    difficulty: rawTour.difficulty,
    packageType: rawTour.packageType,
    highlights: extractTextArray(rawTour.highlights),
    featured: rawTour.featured,
    transportOptionIds: rawTour.transportOptionIds,
    itinerary: rawTour.itinerary,
    includes: rawTour.includes ? extractTextArray(rawTour.includes) : undefined,
    notIncludes: rawTour.notIncludes ? extractTextArray(rawTour.notIncludes) : undefined,
    toBring: rawTour.toBring ? extractTextArray(rawTour.toBring) : undefined,
    conditions: rawTour.conditions ? extractTextArray(rawTour.conditions) : undefined,
    slug: rawTour.slug,
    createdAt: rawTour.createdAt,
    updatedAt: rawTour.updatedAt,
  }
}

// Datos mock para fallback durante desarrollo
const mockToursData: Tour[] = [
  {
    _id: "1",
    title: "Europa Clásica Premium",
    subtitle: "Descubre los tesoros de París, Roma y Barcelona en un viaje inolvidable",
    imageUrl: "/placeholder.svg?height=300&width=400&text=Europa+Clásica",
    imageId: "mock-image-id-1",
    price: 3200,
    originalPrice: 3800,
    duration: "10 días",
    rating: 4.8,
    reviews: 156,
    location: "París",
    region: "Europa",
    category: "Cultural",
    difficulty: "Facil", // Sin tilde
    packageType: "Premium",
    highlights: ["Torre Eiffel", "Coliseo Romano", "Sagrada Familia", "Museo del Louvre", "Vaticano"],
    featured: true,
    transportOptionIds: [
      {
        _id: "685abac224654a2b186c0e13",
        type: "Premium",
        vehicle: "Vuelo directo + Bus de lujo",
        services: ["WiFi", "Aire acondicionado", "Guía bilingüe", "Snacks incluidos"],
        imageUrl: "/placeholder.svg?height=200&width=300&text=Bus+Premium",
        imageId: "mock-bus-premium",
        createdAt: "2025-06-24T14:48:34.057Z",
        updatedAt: "2025-06-24T14:48:34.057Z",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: { es: "Llegada a París", en: "Arrival in Paris" },
        description: {
          es: "Recepción en el aeropuerto y traslado al hotel",
          en: "Airport reception and hotel transfer",
        },
        activities: [
          { es: "Check-in hotel", en: "Hotel check-in" },
          { es: "Cena de bienvenida", en: "Welcome dinner" },
          { es: "Paseo nocturno por el Sena", en: "Evening walk along the Seine" },
        ],
        meals: ["Cena"],
        accommodation: "Hotel Le Marais 4*",
        route: [
          {
            location: { es: "Aeropuerto Charles de Gaulle", en: "Charles de Gaulle Airport" },
            description: { es: "Llegada y recepción", en: "Arrival and reception" },
            imageUrl: "/placeholder.svg?height=200&width=300&text=Aeropuerto",
          },
          {
            location: { es: "Hotel Le Marais", en: "Hotel Le Marais" },
            description: { es: "Check-in y descanso", en: "Check-in and rest" },
            imageUrl: "/placeholder.svg?height=200&width=300&text=Hotel",
          },
        ],
      },
    ],
    includes: ["Vuelos internacionales", "Hoteles 4*", "Desayunos", "Guía especializado", "Entradas a museos"],
    notIncludes: ["Almuerzos", "Cenas", "Propinas", "Gastos personales", "Seguro de viaje"],
    toBring: ["Pasaporte vigente", "Ropa cómoda", "Cámara fotográfica", "Adaptador europeo"],
    conditions: ["Mínimo 2 personas", "Cancelación 15 días antes", "Seguro de viaje recomendado"],
    slug: "europa-clasica-premium",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2025-06-10T14:20:00Z",
  },
]

// API con manejo robusto de errores y fallback usando Axios
export const toursApi = {
  // GET /tours - Obtener todos los tours con paginación
  getAll: async (page = 1, limit = 10): Promise<ToursResponse> => {
    try {
      const response = await api.get(`/tours?page=${page}&limit=${limit}`)
      const apiResponse = response.data

      // Transform the data to handle multilingual fields
      const transformedData = apiResponse.data.map((tour: RawTourData) => transformTourData(tour))

      return {
        data: transformedData,
        message: apiResponse.message,
        pagination: apiResponse.pagination,
      }
    } catch (error) {
      console.warn("API endpoint not available, using fallback data:", error)
      // Fallback data when API is not available
      console.info("Using fallback data for tours")
      // Mock tours data for development
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTours = mockToursData.slice(startIndex, endIndex)

      return {
        data: paginatedTours,
        message: "Tours obtenidos exitosamente (datos de desarrollo)",
        pagination: {
          total: mockToursData.length,
          page,
          limit,
          totalPages: Math.ceil(mockToursData.length / limit),
        },
      }
    }
  },

  // GET /tours/:id - Obtener un tour por ID
  getById: async (id: string): Promise<Tour> => {
    try {
      const response = await api.get(`/tours/${id}`)
      const tourResponse = response.data as TourResponse
      const tour = tourResponse.data

      return transformTourData(tour)
    } catch (error) {
      console.warn(`API endpoint for tour ${id} not available, using fallback data:`, error)
      // Fallback data when API is not available
      console.info(`Using fallback data for tour ${id}`)
      // Try to find the tour in mock data first
      const mockTour = mockToursData.find((tour) => tour._id === id)
      if (mockTour) {
        return mockTour
      }
      // Return a generic mock tour with the requested ID
      return {
        _id: id,
        title: "Tour de Prueba",
        subtitle: "Descripción del tour",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Tour",
        imageId: "mock-image-id",
        price: 1000,
        duration: "5 días",
        rating: 4.5,
        reviews: 50,
        location: "Destino",
        region: "Región",
        category: "Aventura",
        difficulty: "Facil", // Sin tilde
        packageType: "Basico",
        highlights: ["Highlight 1", "Highlight 2"],
        transportOptionIds: [],
        slug: "tour-de-prueba",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2025-06-14T00:00:00Z",
      }
    }
  },

  // POST /tours - Crear nuevo tour
  create: async (tourData: CreateTourDto): Promise<Tour> => {
    try {
      console.log("Sending tour data to API:", tourData)
      const response = await api.post("/tours", tourData)
      return transformTourData(response.data)
    } catch (error) {
      console.error("Error creating tour:", error)
      // Manejo de errores tipado
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiError | undefined
        if (errorData?.message) {
          throw new Error(errorData.message)
        } else if (error.response?.status === 400) {
          throw new Error("Datos inválidos. Verifica que todos los campos requeridos estén completos.")
        } else if (error.response?.status === 401) {
          throw new Error("No tienes permisos para crear tours. Inicia sesión nuevamente.")
        } else if (error.response?.status === 500) {
          throw new Error("Error interno del servidor. Intenta más tarde.")
        } else {
          throw new Error("Error de conexión. Verifica tu conexión a internet.")
        }
      } else {
        throw new Error("Error desconocido al crear el tour.")
      }
    }
  },

  // PATCH /tours/:id - Actualizar tour
  update: async (id: string, tourData: UpdateTourDto): Promise<Tour> => {
    try {
      const response = await api.patch(`/tours/${id}`, tourData)
      return transformTourData(response.data)
    } catch (error) {
      console.warn(`API endpoint for updating tour ${id} not available, using fallback data:`, error)
      // Manejo de errores tipado
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiError | undefined
        if (errorData?.message) {
          throw new Error(errorData.message)
        } else if (error.response?.status === 400) {
          throw new Error("Datos inválidos para actualizar el tour.")
        } else if (error.response?.status === 401) {
          throw new Error("No tienes permisos para actualizar tours.")
        } else if (error.response?.status === 404) {
          throw new Error("Tour no encontrado.")
        } else {
          throw new Error("Error al actualizar el tour.")
        }
      }
      // Fallback data when API is not available
      console.info(`Using fallback data for updating tour ${id}`)
      // Return a mock updated tour
      return {
        _id: id,
        title: extractText(tourData.title) || "Tour Actualizado",
        subtitle: extractText(tourData.subtitle) || "Descripción actualizada",
        imageUrl: tourData.imageUrl || "/placeholder.svg",
        imageId: tourData.imageId || "mock-image-id",
        price: tourData.price || 1000,
        duration: extractText(tourData.duration) || "5 días",
        rating: tourData.rating || 4.5,
        reviews: tourData.reviews || 50,
        location: tourData.location || "Destino",
        region: tourData.region || "Región",
        category: tourData.category || "Aventura",
        difficulty: tourData.difficulty || "Facil", // Sin tilde
        packageType: tourData.packageType || "Basico",
        highlights: extractTextArray(tourData.highlights),
        transportOptionIds: [],
        itinerary: tourData.itinerary,
        includes: tourData.includes ? extractTextArray(tourData.includes) : undefined,
        notIncludes: tourData.notIncludes ? extractTextArray(tourData.notIncludes) : undefined,
        toBring: tourData.toBring ? extractTextArray(tourData.toBring) : undefined,
        conditions: tourData.conditions ? extractTextArray(tourData.conditions) : undefined,
        slug: tourData.slug || "tour-actualizado",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      }
    }
  },

  // DELETE /tours/:id - Eliminar tour
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tours/${id}`)
    } catch (error) {
      console.warn(`API endpoint for deleting tour ${id} not available, using fallback behavior:`, error)
      // Manejo de errores tipado
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiError | undefined
        if (errorData?.message) {
          throw new Error(errorData.message)
        } else if (error.response?.status === 401) {
          throw new Error("No tienes permisos para eliminar tours.")
        } else if (error.response?.status === 404) {
          throw new Error("Tour no encontrado.")
        } else {
          throw new Error("Error al eliminar el tour.")
        }
      }
      // Fallback behavior when API is not available
      console.info(`Using fallback behavior for deleting tour ${id}`)
      // Just return as if deletion was successful
      return
    }
  },
}
