import { api } from "./axiosInstance"
import type {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrdersQueryParams,
  OrdersResponse,
  TourSelectionOption,
  UserOption,
  OrderResponse,
  TourComplete,
} from "@/types/order"

// Función para obtener detalles completos del tour
export const getTourById = async (tourId: string): Promise<TourComplete> => {
  try {
    const response = await api.get(`/tours/${tourId}`)

    if (response.data && response.data.data) {
      return response.data.data
    }

    throw new Error("Tour no encontrado")
  } catch (error) {
    console.error("Error getting tour by id:", error)
    throw new Error("Error al obtener el tour")
  }
}

// Función para convertir respuesta del backend a Order
const convertOrderResponse = async (orderResponse: OrderResponse): Promise<Order> => {
  console.log("Converting order:", orderResponse._id, orderResponse)

  // Manejar el tour
  let tour: TourComplete
  if (typeof orderResponse.tour === "string") {
    // Si tour es un string (ID), obtener información completa
    try {
      tour = await getTourById(orderResponse.tour)
    } catch {
      // Si falla, crear un objeto tour básico
      tour = {
        _id: orderResponse.tour,
        title: "Tour no disponible",
        price: 0,
        duration: "N/A",
        region: "N/A",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  } else {
    // Si tour es un objeto completo
    tour = orderResponse.tour as TourComplete
  }

  // Manejar el usuario
  let user: Order["user"] = undefined
  if (orderResponse.user) {
    if (typeof orderResponse.user === "string") {
      user = {
        _id: orderResponse.user,
        fullName: "Usuario no disponible",
        email: "",
      }
    } else {
      user = orderResponse.user as UserOption
    }
  }

  return {
    _id: orderResponse._id,
    tour,
    customer: orderResponse.customer,
    startDate: orderResponse.startDate,
    people: orderResponse.people,
    totalPrice: orderResponse.totalPrice,
    status: orderResponse.status as Order["status"],
    paymentMethod: orderResponse.paymentMethod,
    notes: orderResponse.notes,
    discountCodeUsed: orderResponse.discountCodeUsed,
    user,
    createdAt: orderResponse.createdAt,
    updatedAt: orderResponse.updatedAt,
  }
}

// Función para detectar si la respuesta son tours en lugar de órdenes
const detectToursResponse = (data: unknown[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false

  const firstItem = data[0] as Record<string, unknown>

  // Verificar si tiene propiedades típicas de tours
  const hasTourProps = "title" in firstItem && "subtitle" in firstItem && "duration" in firstItem
  const hasOrderProps = "customer" in firstItem && "totalPrice" in firstItem

  return hasTourProps && !hasOrderProps
}

export const getOrders = async (params?: OrdersQueryParams): Promise<OrdersResponse> => {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.search) queryParams.append("search", params.search)
    if (params?.status) queryParams.append("status", params.status)
    if (params?.startDate) queryParams.append("startDate", params.startDate)
    if (params?.endDate) queryParams.append("endDate", params.endDate)

    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    console.log("Fetching orders from:", url)

    const response = await api.get(url)
    console.log("Raw API Response:", response.data)

    // Verificar si la respuesta es válida
    if (!response.data) {
      throw new Error("Respuesta vacía del servidor")
    }

    // Manejar diferentes estructuras de respuesta
    let ordersData: OrderResponse[]
    let meta: OrdersResponse["meta"]

    if (Array.isArray(response.data)) {
      // Respuesta directa como array
      ordersData = response.data
      meta = {
        total: ordersData.length,
        page: params?.page || 1,
        limit: params?.limit || 50,
        totalPages: 1,
      }
    } else if (response.data.data && Array.isArray(response.data.data)) {
      // Respuesta con estructura { data: [], meta: {} }
      ordersData = response.data.data
      meta = response.data.meta || {
        total: ordersData.length,
        page: params?.page || 1,
        limit: params?.limit || 50,
        totalPages: 1,
      }
    } else {
      throw new Error("Estructura de respuesta no reconocida")
    }

    // Detectar si el servidor devolvió tours en lugar de órdenes
    if (detectToursResponse(ordersData)) {
      throw new Error("El servidor devolvió tours en lugar de órdenes. Verificar endpoint /orders")
    }

    console.log("Processing", ordersData.length, "orders")

    // Convertir cada orden (ahora con async)
    const convertedOrders = await Promise.all(
      ordersData.map((orderResponse: OrderResponse) => convertOrderResponse(orderResponse)),
    )

    console.log("Converted orders:", convertedOrders.length)

    return {
      data: convertedOrders,
      meta,
    }
  } catch (error) {
    console.error("Error in getOrders:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error("Error desconocido al obtener las órdenes")
  }
}

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
  try {
    const response = await api.post("/orders", orderData)
    return convertOrderResponse(response.data)
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Error al crear la orden")
  }
}

export const updateOrder = async (orderId: string, orderData: UpdateOrderDto): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${orderId}`, orderData)
    return convertOrderResponse(response.data)
  } catch (error) {
    console.error("Error updating order:", error)
    throw new Error("Error al actualizar la orden")
  }
}

export const updateOrderStatus = async (orderId: string, status: Order["status"]): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status })
    return convertOrderResponse(response.data)
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Error al actualizar el estado de la orden")
  }
}

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await api.delete(`/orders/${orderId}`)
  } catch (error) {
    console.error("Error deleting order:", error)
    throw new Error("Error al eliminar la orden")
  }
}

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`)
    return convertOrderResponse(response.data)
  } catch (error) {
    console.error("Error getting order by id:", error)
    throw new Error("Error al obtener la orden")
  }
}

// Funciones auxiliares para formularios
export const getToursForSelection = async (): Promise<TourSelectionOption[]> => {
  try {
    const response = await api.get("/tours")

    if (Array.isArray(response.data)) {
      return response.data.map((tour: TourComplete) => ({
        _id: tour._id,
        title: tour.title,
        price: tour.price,
        duration: tour.duration,
        region: tour.region,
      }))
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map((tour: TourComplete) => ({
        _id: tour._id,
        title: tour.title,
        price: tour.price,
        duration: tour.duration,
        region: tour.region,
      }))
    }

    return []
  } catch (error) {
    console.error("Error getting tours for selection:", error)
    throw new Error("Error al obtener los tours")
  }
}

export const getUsers = async (): Promise<UserOption[]> => {
  try {
    const response = await api.get("/users/names")

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map((user: { _id: string; fullName: string }) => ({
        _id: user._id,
        fullName: user.fullName,
        email: "", // No viene en esta respuesta
      }))
    }

    return []
  } catch (error) {
    console.error("Error getting users:", error)
    throw new Error("Error al obtener los usuarios")
  }
}
