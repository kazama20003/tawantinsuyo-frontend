import { api } from "@/lib/axiosInstance"
import { getLocalizedText } from "@/types/order"
import type {
  Order,
  BackendOrder,
  CreateOrderDto,
  CreateMultiOrderDto,
  UpdateOrderDto,
  OrdersQueryParams,
  OrdersResponse,
  TourSelectionOption,
  UserOption,
  LocalizedField,
} from "@/types/order"

// Función para convertir BackendOrder a Order (normalizada para el frontend)
const normalizeOrder = (backendOrder: BackendOrder): Order => {
  // Verificar que items existe y tiene al menos un elemento
  if (!backendOrder.items || backendOrder.items.length === 0) {
    console.warn("Order has no items:", backendOrder._id)
    return {
      _id: backendOrder._id,
      tour: undefined,
      customer: backendOrder.customer,
      user: backendOrder.user,
      startDate: "",
      people: 0,
      totalPrice: backendOrder.totalPrice,
      status: backendOrder.status,
      paymentMethod: backendOrder.paymentMethod,
      notes: backendOrder.notes,
      discountCodeUsed: backendOrder.discountCodeUsed,
      createdAt: backendOrder.createdAt,
      updatedAt: backendOrder.updatedAt,
      items: [],
    }
  }

  // Tomar el primer item como referencia para compatibilidad
  const firstItem = backendOrder.items[0]

  return {
    _id: backendOrder._id,
    // Crear un tour normalizado del primer item
    tour: firstItem?.tour
      ? {
          _id: firstItem.tour._id,
          title: getLocalizedText(firstItem.tour.title, "Tour no disponible"),
          subtitle: "", // Agregar subtitle vacío por defecto
          imageUrl: firstItem.tour.imageUrl,
          price: firstItem.tour.price,
          duration: "N/A", // No viene en la respuesta del backend
          region: "N/A", // No viene en la respuesta del backend
        }
      : undefined,
    customer: backendOrder.customer,
    user: backendOrder.user,
    // Datos del primer item para compatibilidad
    startDate: firstItem?.startDate || "",
    people: firstItem?.people || 0,
    totalPrice: backendOrder.totalPrice,
    status: backendOrder.status,
    paymentMethod: backendOrder.paymentMethod,
    notes: backendOrder.notes,
    discountCodeUsed: backendOrder.discountCodeUsed,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
    // Mantener los items originales para funcionalidad avanzada
    items: backendOrder.items.map((item) => ({
      ...item,
      tour: {
        ...item.tour,
        title: getLocalizedText(item.tour.title, "Tour no disponible"),
      },
    })),
  }
}

export const getOrders = async (params?: OrdersQueryParams): Promise<OrdersResponse> => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.search) queryParams.append("search", params.search)
    if (params?.status) queryParams.append("status", params.status)

    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    console.log("Fetching orders from:", url)

    const response = await api.get(url)
    console.log("Raw API Response:", response.data)

    if (!response.data) {
      throw new Error("Respuesta vacía del servidor")
    }

    // Manejar la estructura de respuesta del backend
    let ordersData: BackendOrder[]
    let meta: OrdersResponse["meta"]

    if (response.data.data && Array.isArray(response.data.data)) {
      ordersData = response.data.data
      // Usar pagination en lugar de meta
      const pagination = response.data.pagination || {}
      meta = {
        total: pagination.total || ordersData.length,
        page: pagination.page || params?.page || 1,
        limit: pagination.limit || params?.limit || 50,
        totalPages: pagination.totalPages || 1,
      }
    } else if (Array.isArray(response.data)) {
      ordersData = response.data
      meta = {
        total: ordersData.length,
        page: params?.page || 1,
        limit: params?.limit || 50,
        totalPages: 1,
      }
    } else {
      throw new Error("Estructura de respuesta no reconocida")
    }

    console.log("Processing", ordersData.length, "orders")

    // Normalizar las órdenes para el frontend
    const normalizedOrders = ordersData.map(normalizeOrder)

    console.log("Normalized orders:", normalizedOrders.length)

    return {
      data: normalizedOrders,
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
    // Convertir CreateOrderDto a CreateMultiOrderDto para el backend
    const multiOrderData: CreateMultiOrderDto = {
      items: [
        {
          tour: orderData.tour,
          startDate: orderData.startDate,
          people: orderData.people,
          pricePerPerson: orderData.totalPrice / orderData.people,
          total: orderData.totalPrice,
          notes: orderData.notes || "",
        },
      ],
      customer: orderData.customer,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes,
      discountCodeUsed: orderData.discountCodeUsed,
    }

    console.log("Sending order data:", multiOrderData)
    const response = await api.post("/orders", multiOrderData)
    console.log("Order creation response:", response.data)

    return normalizeOrder(response.data)
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Error al crear la orden")
  }
}

export const updateOrder = async (orderId: string, orderData: UpdateOrderDto): Promise<Order> => {
  try {
    console.log("Updating order with PATCH:", orderId, orderData)
    const response = await api.patch(`/orders/${orderId}`, orderData)
    console.log("Order update response:", response.data)
    return normalizeOrder(response.data)
  } catch (error) {
    console.error("Error updating order:", error)
    throw new Error("Error al actualizar la orden")
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

export const getToursForSelection = async (): Promise<TourSelectionOption[]> => {
  try {
    const response = await api.get("/tours")
    let toursData: unknown[] = []

    if (Array.isArray(response.data)) {
      toursData = response.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      toursData = response.data.data
    }

    return toursData.map((tour: unknown) => {
      const tourObj = tour as Record<string, unknown>
      return {
        _id: tourObj._id as string,
        title: getLocalizedText(tourObj.title as string | LocalizedField, "Tour sin título"),
        price: (tourObj.price as number) || 0,
        duration: getLocalizedText(tourObj.duration as string | LocalizedField, "N/A"),
        region: getLocalizedText(tourObj.region as string | LocalizedField, "N/A"),
      }
    })
  } catch (error) {
    console.error("Error getting tours for selection:", error)
    throw new Error("Error al obtener los tours")
  }
}

export const getUsers = async (): Promise<UserOption[]> => {
  try {
    const response = await api.get("/users/names")
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map((user: Record<string, unknown>) => ({
        _id: user._id as string,
        fullName: user.fullName as string,
      }))
    }
    return []
  } catch (error) {
    console.error("Error getting users:", error)
    throw new Error("Error al obtener los usuarios")
  }
}
