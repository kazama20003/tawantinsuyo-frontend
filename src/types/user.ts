export type UserRole = "admin" | "user"

export type AuthProvider = "local" | "google" | "facebook"
// User interfaces
export interface User {
  _id: string
  fullName: string
  email: string
  password: string
  role: "user" | "admin"
  authProvider: "local" | "google"
  phone?: string
  country?: string
  createdAt: string
  updatedAt: string
  __v: number
}

// Order Tour interface (populated tour in orders)
export interface OrderTour {
  _id: string
  title: string
  subtitle: string
  imageUrl: string
  imageId: string
  price: number
  originalPrice: number
  duration: string
  rating: number
  reviews: number
  location: string
  region: string
  category: string
  difficulty: string
  packageType: string
  highlights: string[]
  featured: boolean
  transportOptionIds: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities: string[]
    meals: string[]
    accommodation: string
    route: Array<{
      location: string
      description: string
      imageUrl: string
      _id: string
    }>
    _id: string
  }>
  includes: string[]
  notIncludes: string[]
  toBring: string[]
  conditions: string[]
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}

// Order Item interface
export interface OrderItem {
  tour: OrderTour
  startDate: string
  people: number
  notes: string
  pricePerPerson: number
  total: number
  _id: string
}

// Order Customer interface
export interface OrderCustomer {
  fullName: string
  email: string
  phone: string
  nationality: string
  _id: string
}

// Order interface
export interface Order {
  _id: string
  items: OrderItem[]
  customer: OrderCustomer
  totalPrice: number
  status: "created" | "confirmed" | "cancelled" | "completed"
  paymentMethod: string
  notes: string
  appliedOffer: string | null
  user: string
  createdAt: string
  updatedAt: string
  __v: number
}

// User Profile Response interface
export interface UserProfileResponse {
  message: string
  data: {
    user: User
    orders: Order[]
  }
}

// Update User DTO
export interface UpdateUserDto {
  fullName?: string
  email?: string
  phone?: string
  country?: string
  password?: string
  role?: UserRole
  
}

// User stats interface
export interface UserStats {
  totalOrders: number
  uniqueTours: number
  totalSpent: number
  favoriteDestination: string
}
export interface CreateUserDto {
  fullName: string
  email: string
  password?: string
  role?: UserRole
  authProvider?: AuthProvider
  phone?: string
  country?: string
}