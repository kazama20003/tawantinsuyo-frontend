import { api } from "@/lib/axiosInstance"
import type { User, CreateUserDto, UpdateUserDto } from "@/types/user"

interface UsersResponse {
  data: User[]
  message: string
  pagination?: {
    currentPage: number
    totalPages: number
    totalUsers: number
    limit: number
  }
}

export const usersApi = {
  // GET /users - Obtener todos los usuarios con paginación
  getAll: async (page = 1, limit = 10): Promise<UsersResponse> => {
    try {
      const response = await api.get(`/users?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error("Error in usersApi.getAll:", error)
      throw error
    }
  },

  // GET /users/:id - Obtener un usuario por ID
  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error("Error in usersApi.getById:", error)
      throw error
    }
  },

  // POST /users - Crear nuevo usuario
  create: async (userData: CreateUserDto): Promise<User> => {
    try {
      const response = await api.post("/users", userData)
      return response.data
    } catch (error) {
      console.error("Error in usersApi.create:", error)
      throw error
    }
  },

  // PATCH /users/:id - Actualizar usuario
  update: async (id: string, userData: UpdateUserDto): Promise<User> => {
    try {
      const response = await api.patch(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      console.error("Error in usersApi.update:", error)
      throw error
    }
  },

  // DELETE /users/:id - Eliminar usuario
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`)
    } catch (error) {
      console.error("Error in usersApi.delete:", error)
      throw error
    }
  },
}
