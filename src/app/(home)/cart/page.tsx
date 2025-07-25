"use client"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingCart,
  Calendar,
  Users,
  MessageCircle,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Award,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import { getTranslation, type Locale } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Header from "@/components/header"

// Types for cart data based on API response
interface CartTour {
  _id: string
  title: {
    es?: string
    en?: string
  }
  imageUrl: string
  price: number
  slug: string
}

interface CartItem {
  tour: CartTour
  startDate: string
  people: number
  notes?: string
  pricePerPerson: number
  total: number
  _id: string
}

interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  isOrdered: boolean
  createdAt: string
  updatedAt: string
}

interface CartResponse {
  message: string
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  data: Cart[]
}

// Helper function to get translated text
const getTranslatedText = (text: string | { es?: string; en?: string } | undefined, locale: Locale): string => {
  if (!text) return ""
  if (typeof text === "string") {
    return text
  }
  if (text && typeof text === "object") {
    return text[locale] || text.es || text.en || ""
  }
  return ""
}

export default function CartPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  // Get current locale from pathname - More robust detection
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Add useEffect to debug locale detection
  useEffect(() => {
    console.log("Current pathname:", pathname)
    console.log("Detected locale:", currentLocale)
  }, [pathname, currentLocale])

  // Memoize translation helper
  const t = useMemo(
    () => (key: keyof typeof import("@/lib/i18n").translations.es) => getTranslation(currentLocale, key),
    [currentLocale],
  )

  // Get localized link - Enhanced version
  const getLocalizedLink = useCallback(
    (path: string): string => {
      // Remove any existing language prefix from path
      const cleanPath = path.replace(/^\/en/, "").replace(/^\/es/, "") || "/"

      if (currentLocale === "en") {
        return cleanPath === "/" ? "/en" : `/en${cleanPath}`
      }
      return cleanPath === "/" ? "/" : cleanPath
    },
    [currentLocale],
  )

  // Fetch cart data with language support
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Add language parameter to API call
      const langParam = currentLocale === "en" ? "?lang=en" : ""
      const response = await api.get<CartResponse>(`/cart${langParam}`)

      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setCart(response.data.data[0]) // Get the first cart
      } else {
        setCart(null) // Empty cart
      }
    } catch (err: unknown) {
      console.error("Error fetching cart:", err)
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        setError(axiosError.response?.data?.message || t("error"))
      } else {
        setError(t("error"))
      }
    } finally {
      setLoading(false)
    }
  }, [t, currentLocale])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Update item quantity - Fixed API endpoint
  const updateItemQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (!cart || newQuantity < 1 || newQuantity > 15) return

      setUpdatingItems((prev) => new Set(prev).add(itemId))

      try {
        const item = cart.items.find((item) => item._id === itemId)
        if (!item) return

        const updateData = {
          people: newQuantity,
          total: newQuantity * item.pricePerPerson,
        }

        // Fixed API endpoint - using item._id instead of tour._id
        await api.patch(`/cart/items/${itemId}`, updateData)

        // Update local state
        setCart((prevCart) => {
          if (!prevCart) return null

          const updatedItems = prevCart.items.map((cartItem) => {
            if (cartItem._id === itemId) {
              return {
                ...cartItem,
                people: newQuantity,
                total: newQuantity * cartItem.pricePerPerson,
              }
            }
            return cartItem
          })

          const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0)

          return {
            ...prevCart,
            items: updatedItems,
            totalPrice: newTotalPrice,
          }
        })

        toast.success(currentLocale === "es" ? "Cantidad actualizada exitosamente" : "Quantity updated successfully")
      } catch (error: unknown) {
        console.error("Error updating quantity:", error)
        toast.error(currentLocale === "es" ? "Error al actualizar la cantidad" : "Error updating quantity")
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }
    },
    [cart, currentLocale],
  )

  // Remove item from cart - Fixed API endpoint
  const removeItem = useCallback(
    async (itemId: string) => {
      if (!cart) return

      setUpdatingItems((prev) => new Set(prev).add(itemId))

      try {
        // Fixed API endpoint - using item._id instead of tour._id
        await api.delete(`/cart/items/${itemId}`)

        // Update local state
        setCart((prevCart) => {
          if (!prevCart) return null

          const updatedItems = prevCart.items.filter((item) => item._id !== itemId)
          const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0)

          return {
            ...prevCart,
            items: updatedItems,
            totalPrice: newTotalPrice,
          }
        })

        toast.success(currentLocale === "es" ? "Tour eliminado del carrito" : "Tour removed from cart")
      } catch (error: unknown) {
        console.error("Error removing item:", error)
        toast.error(currentLocale === "es" ? "Error al eliminar el tour" : "Error removing tour")
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }
    },
    [cart, currentLocale],
  )

  // Handle WhatsApp contact with all cart items
  const handleWhatsAppContact = useCallback(() => {
    if (!cart || !cart.items || cart.items.length === 0) return

    let message = `¡Hola! Me interesa reservar los siguientes tours:\n\n`

    cart.items.forEach((item, index) => {
      const tourTitle = getTranslatedText(item.tour.title, currentLocale)
      const startDate = new Date(item.startDate).toLocaleDateString("es-PE")

      message += `${index + 1}. ${tourTitle}\n`
      message += `   📅 Fecha: ${startDate}\n`
      message += `   👥 Personas: ${item.people}\n`
      message += `   💰 Precio: S/${item.total}\n`
      if (item.notes) {
        message += `   📝 Notas: ${item.notes}\n`
      }
      message += `\n`
    })

    message += `💰 TOTAL: S/${cart.totalPrice}\n\n`
    message += `¿Podrían ayudarme con la reserva?\n\nGracias!`

    const whatsappUrl = `https://wa.me/51913876154?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }, [cart, currentLocale])

  // Format date
  const formatDate = useCallback(
    (dateString: string) => {
      return new Date(dateString).toLocaleDateString(currentLocale === "es" ? "es-PE" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    },
    [currentLocale],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="pt-48 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentLocale === "es" ? "Cargando carrito..." : "Loading cart..."}
            </h2>
            <p className="text-gray-600">
              {currentLocale === "es" ? "Por favor espera un momento" : "Please wait a moment"}
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="pt-48 pb-16 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentLocale === "es" ? "Error al cargar el carrito" : "Error loading cart"}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  // Try to go back, but if no history, go to tours page
                  if (window.history.length > 1) {
                    router.back()
                  } else {
                    router.push(getLocalizedLink("/tours"))
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentLocale === "es" ? "Volver" : "Go Back"}
              </Button>
              <Button onClick={fetchCart} className="bg-blue-600 hover:bg-blue-700 text-white">
                {currentLocale === "es" ? "Reintentar" : "Retry"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="pt-48 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentLocale === "es" ? "Tu carrito está vacío" : "Your cart is empty"}
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                {currentLocale === "es"
                  ? "¡Explora nuestros increíbles tours y comienza tu aventura!"
                  : "Explore our amazing tours and start your adventure!"}
              </p>
              <Link href={getLocalizedLink("/tours")}>
                <Button
                  onClick={() => router.push(getLocalizedLink("/tours"))}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full"
                >
                  {currentLocale === "es" ? "Explorar Tours" : "Explore Tours"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => {
                  // Try to go back, but if no history, go to tours page
                  if (window.history.length > 1) {
                    router.back()
                  } else {
                    router.push(getLocalizedLink("/tours"))
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentLocale === "es" ? "Volver" : "Back"}
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentLocale === "es" ? "Mi Carrito" : "My Cart"}
                </h1>
                <p className="text-gray-600">
                  {cart?.items?.length || 0}{" "}
                  {(cart?.items?.length || 0) === 1
                    ? currentLocale === "es"
                      ? "tour"
                      : "tour"
                    : currentLocale === "es"
                      ? "tours"
                      : "tours"}{" "}
                  {currentLocale === "es" ? "en tu carrito" : "in your cart"}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {(cart?.items || []).map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Tour Image */}
                      <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.tour.imageUrl || "/placeholder.svg"}
                          alt={getTranslatedText(item.tour.title, currentLocale)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 192px"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            S/{item.pricePerPerson}
                          </div>
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {getTranslatedText(item.tour.title, currentLocale)}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(item.startDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {item.people}{" "}
                                {item.people === 1
                                  ? currentLocale === "es"
                                    ? "persona"
                                    : "person"
                                  : currentLocale === "es"
                                    ? "personas"
                                    : "people"}
                              </span>
                            </div>
                            {item.notes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-700">
                                  <strong>{currentLocale === "es" ? "Notas:" : "Notes:"}</strong> {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => removeItem(item._id)}
                            disabled={updatingItems.has(item._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            {updatingItems.has(item._id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                              {currentLocale === "es" ? "Personas:" : "People:"}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => updateItemQuantity(item._id, item.people - 1)}
                                disabled={item.people <= 1 || updatingItems.has(item._id)}
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {updatingItems.has(item._id) ? (
                                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                ) : (
                                  item.people
                                )}
                              </span>
                              <Button
                                onClick={() => updateItemQuantity(item._id, item.people + 1)}
                                disabled={item.people >= 15 || updatingItems.has(item._id)}
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">S/{item.total}</div>
                            <div className="text-sm text-gray-500">
                              S/{item.pricePerPerson} x {item.people}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {currentLocale === "es" ? "Resumen del Pedido" : "Order Summary"}
                </h2>

                {/* Items Summary */}
                <div className="space-y-3 mb-6">
                  {(cart?.items || []).map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {getTranslatedText(item.tour.title, currentLocale)} x{item.people}
                      </span>
                      <span className="font-semibold">S/{item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">S/{cart?.totalPrice || 0}</span>
                  </div>
                </div>

                {/* WhatsApp Contact Button */}
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {currentLocale === "es" ? "Reservar por WhatsApp" : "Book via WhatsApp"}
                </Button>

                {/* Trust Indicators */}
                <div className="space-y-3 text-center text-xs text-gray-600">
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium">100% {currentLocale === "es" ? "Seguro" : "Secure"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">
                      {currentLocale === "es" ? "Cancelación Gratuita" : "Free Cancellation"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">24/7 {currentLocale === "es" ? "Soporte" : "Support"}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {currentLocale === "es"
                      ? "Nuestro equipo está disponible 24/7 para ayudarte"
                      : "Our team is available 24/7 to help you"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>+51 913 876 154</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
