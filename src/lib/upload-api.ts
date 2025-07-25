import { api } from "@/lib/axiosInstance"
import { AxiosError } from "axios"

interface UploadResponse {
  url: string
  publicId: string
}

interface DeleteResponse {
  success: boolean
  message: string
}

interface ApiError {
  message: string
  statusCode?: number
  error?: string
}

export const uploadApi = {
  // Subir imagen
  uploadImage: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error uploading image:", error)
      // Manejo de errores tipado
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiError | undefined
        if (errorData?.message) {
          throw new Error(errorData.message)
        } else if (error.response?.status === 400) {
          throw new Error("Formato de archivo inválido o tamaño excedido.")
        } else if (error.response?.status === 401) {
          throw new Error("No tienes permisos para subir imágenes.")
        } else {
          throw new Error("Error al subir la imagen.")
        }
      }
      throw new Error("No se pudo subir la imagen. Intenta nuevamente.")
    }
  },

  // Eliminar imagen
  deleteImage: async (imageId: string): Promise<DeleteResponse> => {
    try {
      if (!imageId || imageId.trim() === "") {
        throw new Error("ID de imagen inválido")
      }
      const response = await api.delete(`/uploads/${imageId}`)
      return response.data
    } catch (error) {
      console.error("Error deleting image:", error)
      // Manejo de errores tipado
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiError | undefined
        if (error.response?.status === 404) {
          // Si la imagen no existe, considerarlo como éxito
          console.warn(`Imagen ${imageId} no encontrada, posiblemente ya eliminada`)
          return { success: true, message: "Imagen no encontrada (posiblemente ya eliminada)" }
        } else if (error.response?.status === 500) {
          // Error del servidor - no lanzar error para evitar interrumpir el flujo
          console.warn(`Error del servidor al eliminar imagen ${imageId}:`, errorData?.message)
          return { success: false, message: "Error del servidor al eliminar imagen" }
        } else if (errorData?.message) {
          throw new Error(errorData.message)
        } else if (error.response?.status === 401) {
          throw new Error("No tienes permisos para eliminar imágenes.")
        } else {
          throw new Error("Error al eliminar la imagen.")
        }
      }
      throw new Error("No se pudo eliminar la imagen. Intenta nuevamente.")
    }
  },
}
