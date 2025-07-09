import { api } from "./axiosInstance"
import type {
  Offer,
  CreateOfferDto,
  UpdateOfferDto,
  OffersResponse,
  OffersQueryParams,
  TourOption,
} from "@/types/offer"

export const offersApi = {
  // Obtener todas las ofertas con paginación
  getOffers: async (params: OffersQueryParams = {}): Promise<OffersResponse> => {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())
    if (params.search) searchParams.append("search", params.search)
    if (params.isActive !== undefined) searchParams.append("isActive", params.isActive.toString())

    const response = await api.get(`/offers?${searchParams.toString()}`)
    return response.data
  },

  // Obtener una oferta por ID
  getOfferById: async (id: string): Promise<{ data: Offer }> => {
    const response = await api.get(`/offers/${id}`)
    return response.data
  },

  // Obtener tours para selección (solo ID y título)
  getToursForSelection: async (): Promise<TourOption[]> => {
    const response = await api.get("/tours/ids/title")
    return response.data
  },

  // Crear nueva oferta
  createOffer: async (offerData: CreateOfferDto): Promise<{ data: Offer }> => {
    const response = await api.post("/offers", offerData)
    return response.data
  },

  // Actualizar oferta
  updateOffer: async (id: string, offerData: UpdateOfferDto): Promise<{ data: Offer }> => {
    const response = await api.patch(`/offers/${id}`, offerData)
    return response.data
  },

  // Eliminar oferta
  deleteOffer: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/offers/${id}`)
    return response.data
  },

  // Activar/desactivar oferta (usando PATCH estándar)
  toggleOfferStatus: async (id: string, currentStatus: boolean): Promise<{ data: Offer }> => {
    const response = await api.patch(`/offers/${id}`, {
      isActive: !currentStatus,
    })
    return response.data
  },
}
