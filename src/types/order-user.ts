// Actualizado para coincidir EXACTAMENTE con el backend DTO
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

export interface CreateOrderDto {
  items: OrderItemDto[]
  customer: CustomerInfoDto
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
}

// Response types
export interface OrderResponse {
  _id: string
  items: OrderItemDto[]
  customer: CustomerInfoDto
  totalPrice: number
  paymentMethod?: string
  notes?: string
  discountCodeUsed?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface OrdersApiResponse {
  success: boolean
  data: OrderResponse[]
  message?: string
}
