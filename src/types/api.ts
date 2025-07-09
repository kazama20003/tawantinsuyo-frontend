// Tipos para manejo de errores de API
export interface ApiError {
  response?: {
    data?: {
      message?: string
      statusCode?: number
    }
    status?: number
  }
  message?: string
}

export interface AuthResponse {
  access_token: string
  user: {
    _id: string
    fullName: string
    email: string
    role: string
    authProvider: string
    phone?: string
    country?: string
    createdAt: string
  }
}

export interface GoogleAuthResponse {
  url: string
}
