import { api } from "@/lib/axiosInstance"
import type { TransportOption, PackageType } from "@/types/tour"

interface TransportResponse {
  success: boolean
  message: string
  data: TransportOption[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateTransportDto {
  type: PackageType
  vehicle: string
  services: string[]
  imageUrl?: string
  imageId?: string
}

export interface UpdateTransportDto {
  type?: PackageType
  vehicle?: string
  services?: string[]
  imageUrl?: string
  imageId?: string
}

// Datos mock para fallback durante desarrollo
const mockTransportsData: TransportOption[] = [
  {
    _id: "685abac224654a2b186c0e13",
    type: "Premium",
    vehicle: "Toyota Runner",
    services: ["Aire Acondicionado", "WiFi", "Asientos Cómodos"],
    imageUrl: "/placeholder.svg?height=200&width=300&text=Toyota+Runner",
    imageId: "mock-toyota-runner",
    createdAt: "2025-06-24T14:48:34.057Z",
    updatedAt: "2025-06-24T14:48:34.057Z",
  },
  {
    _id: "685abc97bf63385f7004c534",
    type: "Basico",
    vehicle: "Vans Sprinter",
    services: ["Aire Acondicionado", "WiFi", "Asientos Reclinables"],
    imageUrl: "/placeholder.svg?height=200&width=300&text=Vans+Sprinter",
    imageId: "mock-vans-sprinter",
    createdAt: "2025-06-24T14:56:23.071Z",
    updatedAt: "2025-06-24T14:56:23.071Z",
  },
]

// API para manejar transportes
export const transportApi = {
  // GET /transport - Obtener todos los transportes con paginación
  getAll: async (page = 1, limit = 10): Promise<TransportResponse> => {
    try {
      const response = await api.get(`/transport?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn("API endpoint for transports not available, using fallback data:", error)
      // Fallback data when API is not available
      console.info("Using fallback data for transports")
      // Mock transports data for development
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTransports = mockTransportsData.slice(startIndex, endIndex)

      return {
        success: true,
        message: "Transportes obtenidos exitosamente (datos de desarrollo)",
        data: paginatedTransports,
        meta: {
          total: mockTransportsData.length,
          page,
          limit,
          totalPages: Math.ceil(mockTransportsData.length / limit),
        },
      }
    }
  },

  // GET /transport/:id - Obtener un transporte por ID
  getById: async (id: string): Promise<TransportOption> => {
    try {
      const response = await api.get(`/transport/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for transport ${id} not available, using fallback data:`, error)
      // Fallback data when API is not available
      console.info(`Using fallback data for transport ${id}`)
      // Try to find the transport in mock data first
      const mockTransport = mockTransportsData.find((transport) => transport._id === id)
      if (mockTransport) {
        return mockTransport
      }
      // Return a generic mock transport with the requested ID
      return {
        _id: id,
        type: "Basico",
        vehicle: "Transporte Genérico",
        services: ["Servicio básico"],
        imageUrl: "/placeholder.svg?height=200&width=300&text=Transporte",
        imageId: "mock-transport",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2025-06-24T00:00:00Z",
      }
    }
  },

  // POST /transport - Crear un nuevo transporte
  create: async (data: CreateTransportDto): Promise<TransportOption> => {
    try {
      const response = await api.post("/transport", data)
      return response.data.data || response.data
    } catch (error) {
      console.warn("API endpoint for creating transport not available, using fallback:", error)
      // Fallback behavior for development
      const newTransport: TransportOption = {
        _id: `mock-${Date.now()}`,
        type: data.type,
        vehicle: data.vehicle,
        services: data.services,
        imageUrl: data.imageUrl || "",
        imageId: data.imageId || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockTransportsData.push(newTransport)
      return newTransport
    }
  },

  // PATCH /transport/:id - Actualizar un transporte
  update: async (id: string, data: UpdateTransportDto): Promise<TransportOption> => {
    try {
      const response = await api.patch(`/transport/${id}`, data)
      return response.data.data || response.data
    } catch (error) {
      console.warn(`API endpoint for updating transport ${id} not available, using fallback:`, error)
      // Fallback behavior for development
      const index = mockTransportsData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockTransportsData[index] = {
          ...mockTransportsData[index],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        return mockTransportsData[index]
      }
      throw new Error(`Transport with ID ${id} not found`)
    }
  },

  // DELETE /transport/:id - Eliminar un transporte
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/transport/${id}`)
      return response.data
    } catch (error) {
      console.warn(`API endpoint for deleting transport ${id} not available, using fallback:`, error)
      // Fallback behavior for development
      const index = mockTransportsData.findIndex((t) => t._id === id)
      if (index !== -1) {
        mockTransportsData.splice(index, 1)
        return { success: true, message: "Transporte eliminado exitosamente (desarrollo)" }
      }
      throw new Error(`Transport with ID ${id} not found`)
    }
  },
}
