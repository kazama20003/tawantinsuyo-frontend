import type { Tour } from "./tour"

// Cart item with populated tour details
export interface CartItem {
  _id: string
  tour: Tour // Populated tour object
  startDate: string // Fecha de inicio en formato ISO
  people: number // Número de personas
  pricePerPerson: number // Precio por persona
  total: number // Total del item
  notes?: string // Notas adicionales
}

// Cart interface
export interface Cart {
  _id: string
  user?: string // ID del usuario (opcional para carritos de invitados)
  items: CartItem[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

// DTO para crear un carrito
export interface CreateCartDto {
  items: Array<{
    tour: string
    startDate: string
    people: number
    pricePerPerson: number
    total: number
    notes?: string
  }>
  totalPrice: number
}

// DTO para actualizar un carrito
export interface UpdateCartDto {
  items?: Array<{
    tour: string
    startDate: string
    people: number
    pricePerPerson: number
    total: number
    notes?: string
  }>
  totalPrice?: number
}

// DTO para agregar un item al carrito
export interface AddToCartDto {
  tour: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

// DTO para actualizar un item específico del carrito
export interface UpdateCartItemDto {
  startDate?: string // Fecha de inicio en formato ISO (opcional)
  people?: number // Número de personas (opcional)
  notes?: string // Notas adicionales (opcional)
}

// Respuesta del API para el carrito - CORREGIDA
export interface CartResponse {
  success: boolean
  data: Cart // Contains the actual cart with items, _id, totalPrice, etc.
  message?: string
}

// Respuesta del API para operaciones del carrito
export interface CartOperationResponse {
  success: boolean
  message: string
  data?: Cart
}
