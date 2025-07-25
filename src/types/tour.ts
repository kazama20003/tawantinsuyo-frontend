// Actualizado para coincidir EXACTAMENTE con el nuevo backend DTO
export type PackageType = "Basico" | "Premium"
export type Difficulty = "Facil" | "Moderado" | "Difícil" // Sin tilde en "Facil"
export type TourCategory =
  | "Aventura"
  | "Cultural"
  | "Relajación"
  | "Naturaleza"
  | "Trekking"
  | "Panoramico"
  | "Transporte Turistico"

// Interface for translated text
export interface TranslatedText {
  es?: string
  en?: string
}

export interface RoutePoint {
  _id?: string // Añadido para compatibilidad con MongoDB
  location: TranslatedText
  description?: TranslatedText
  imageId?: string
  imageUrl?: string
}

export interface ItineraryDay {
  _id?: string // Añadido para compatibilidad con MongoDB
  day: number
  title: TranslatedText
  description: TranslatedText
  activities: TranslatedText[] // ✅ Ahora multilingüe
  meals?: string[]
  accommodation?: string
  imageId?: string
  imageUrl?: string
  route: RoutePoint[]
}

// Interfaz para el transporte completo (cuando se obtiene poblado)
export interface TransportOption {
  _id: string
  type: PackageType
  vehicle: string
  services: string[]
  imageUrl: string
  imageId?: string
  createdAt: string
  updatedAt: string
}

export interface Tour {
  _id: string
  title: string
  subtitle: string
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights: string[]
  featured?: boolean
  transportOptionIds: TransportOption[] // Poblado con datos completos
  itinerary?: ItineraryDay[]
  includes?: string[]
  notIncludes?: string[]
  toBring?: string[]
  conditions?: string[]
  slug: string
  createdAt: string
  updatedAt: string
}

// DTO para crear tours (con campos traducibles)
export interface CreateTourDto {
  title: TranslatedText
  subtitle: TranslatedText
  imageUrl: string
  imageId?: string
  price: number
  originalPrice?: number
  duration: TranslatedText
  rating: number
  reviews: number
  location: string
  region: string
  category: TourCategory
  difficulty: Difficulty
  packageType: PackageType
  highlights: TranslatedText[]
  featured?: boolean
  transportOptionIds?: string[] // Solo IDs para crear
  itinerary: ItineraryDay[]
  includes?: TranslatedText[]
  notIncludes?: TranslatedText[]
  toBring?: TranslatedText[]
  conditions?: TranslatedText[]
  slug: string // El backend lo requiere
}

// DTO para actualizar tours (igual que CreateTourDto)
export type UpdateTourDto = CreateTourDto

// Tipo para el formulario interno (incluye transportes seleccionados)
export interface TourFormData extends Omit<CreateTourDto, "transportOptionIds"> {
  selectedTransports: TransportOption[] // Para mostrar en el formulario
  transportOptionIds?: string[] // Para enviar al backend
}

// Filtros para tours
export interface FilterTourDto {
  category?: TourCategory
  difficulty?: Difficulty
  packageType?: PackageType
  region?: string
  location?: string
}
