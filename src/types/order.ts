// Interfaces base
export interface Customer {
  fullName: string
  email: string
  phone?: string
  nationality?: string
}

// Interfaz para manejar objetos de localización
export interface LocalizedField {
  es?: string
  en?: string
}

// Función helper para extraer texto de campos localizados
export const getLocalizedText = (field: string | LocalizedField | undefined, defaultText = "N/A"): string => {
  if (!field) return defaultText
  if (typeof field === "string") return field
  if (typeof field === "object" && field.es) return field.es
  if (typeof field === "object" && field.en) return field.en
  return defaultText
}

export interface TourInOrder {
  _id: string
  title: string | LocalizedField
  imageUrl?: string
  price: number
}

export interface OrderItem {
  _id: string
  tour: TourInOrder
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

// Estructura que viene del backend
export interface BackendOrder {
  _id: string
  items: OrderItem[]
  customer: Customer
  totalPrice: number
  status: "created" | "confirmed" | "cancelled" | "completed"
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: {
    _id: string
    fullName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

// Estructura normalizada para el frontend (compatible con el código existente)
export interface Order {
  _id: string
  tour?: {
    _id: string
    title: string
    subtitle?: string
    imageUrl?: string
    price: number
    duration: string
    region: string
  }
  customer?: Customer
  user?: {
    _id: string
    fullName: string
  }
  startDate: string
  people: number
  totalPrice: number
  status: "created" | "confirmed" | "cancelled" | "completed"
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  createdAt: string
  updatedAt: string
  // Campos adicionales para manejar múltiples items
  items?: OrderItem[]
}

export interface OrdersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface OrdersResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  message?: string
}

// DTOs para crear órdenes (siguiendo la estructura del backend)
export interface OrderItemDto {
  tour: string // MongoDB ObjectId
  startDate: string // ISO Date string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

export interface CustomerInfoDto {
  fullName: string
  email: string
  phone?: string
  nationality?: string
}

export interface CreateMultiOrderDto {
  items: OrderItemDto[]
  customer: CustomerInfoDto
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
}

// DTO simplificado para compatibilidad con el código existente
export interface CreateOrderDto {
  tour: string
  customer: Customer
  startDate: string
  people: number
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
}

export interface UpdateOrderDto {
  items?: OrderItemDto[]
  customer?: CustomerInfoDto
  totalPrice?: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  user?: string
}

export interface TourSelectionOption {
  _id: string
  title: string
  price: number
  duration: string
  region: string
}

export interface UserOption {
  _id: string
  fullName: string
}
