// Tipos para las ofertas
export interface ApplicableTour {
  _id: string
  title: string
  price: number
  slug: string
}

export interface Offer {
  _id: string
  title: string
  description?: string
  discountPercentage: number
  startDate: string
  endDate: string
  applicableTours: ApplicableTour[]
  isActive: boolean
  discountCode?: string
  createdAt: string
  updatedAt: string
}

// DTO para crear ofertas (actualizado)
export interface CreateOfferDto {
  title: string
  description?: string
  discountPercentage: number
  startDate: string
  endDate: string
  applicableTours: string[] // Solo IDs para crear
  isActive?: boolean
  discountCode?: string
}

// DTO para actualizar ofertas
export type UpdateOfferDto = Partial<CreateOfferDto>

// Respuesta paginada del API
export interface OffersResponse {
  message: string
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: Offer[]
}

// Parámetros de consulta
export interface OffersQueryParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

// Tour simple para selección
export interface TourOption {
  _id: string
  title: string
}
