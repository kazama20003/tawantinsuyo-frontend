"use client"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Star,
  MapPin,
  Users,
  Check,
  Camera,
  ArrowLeft,
  Heart,
  ChevronDown,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Award,
  Route,
  Utensils,
  Bed,
  Mountain,
  Share2,
  Eye,
  Calendar,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import type {
  Tour,
  TourCategory,
  Difficulty,
  TransportOption,
  TranslatedText,
  ItineraryDay,
  RoutePoint,
} from "@/types/tour"
import { getTranslation, type Locale } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Header from "@/components/header"

interface ImageData {
  url: string
  alt: string
  type: string
}

// Helper function to get translated text
const getTranslatedText = (text: string | TranslatedText, locale: Locale): string => {
  if (typeof text === "string") {
    return text
  }
  if (text && typeof text === "object") {
    return text[locale] || text.es || text.en || ""
  }
  return ""
}

// Interface for cart item
interface CartItemDto {
  tour: string
  startDate: string
  people: number
  pricePerPerson: number
  total: number
  notes?: string
}

interface CreateCartDto {
  items: CartItemDto[]
  totalPrice: number
}

export default function TourDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const slug = params.slug as string
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [, setSelectedTransport] = useState<TransportOption | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allImages, setAllImages] = useState<ImageData[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Booking modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [peopleCount, setPeopleCount] = useState(2)
  const [notes, setNotes] = useState("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Memoize translation helper to prevent re-renders
  const t = useMemo(
    () => (key: keyof typeof import("@/lib/i18n").translations.es) => getTranslation(currentLocale, key),
    [currentLocale],
  )

  // Get localized link
  const getLocalizedLink = useCallback(
    (path: string): string => {
      if (currentLocale === "en") {
        return `/en${path}`
      }
      return path
    },
    [currentLocale],
  )

  // Fetch tour details with language parameter
  const fetchTour = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Add language parameter to the API call
      const langParam = currentLocale === "en" ? "?lang=en" : ""
      const response = await api.get(`/tours/slug/${slug}${langParam}`)
      let tourData = response.data

      // Validate response structure
      if (tourData && typeof tourData === "object" && !Array.isArray(tourData)) {
        if (tourData.data) {
          tourData = tourData.data
        } else if (tourData.tour) {
          tourData = tourData.tour
        }
      }

      if (!tourData || !tourData._id) {
        setError(t("tourNotFound"))
        return
      }

      console.log("Tour loaded:", tourData)
      setTour(tourData)

      // Collect all images for gallery
      const images: ImageData[] = []

      // Main image
      if (tourData.imageUrl) {
        images.push({ url: tourData.imageUrl, alt: getTranslatedText(tourData.title, currentLocale), type: "main" })
      }

      // Itinerary images
      if (tourData.itinerary) {
        tourData.itinerary.forEach((day: ItineraryDay) => {
          if (day.imageUrl) {
            images.push({
              url: day.imageUrl,
              alt: `${t("day")} ${day.day}: ${getTranslatedText(day.title, currentLocale)}`,
              type: "day",
            })
          }
          if (day.route) {
            day.route.forEach((point: RoutePoint) => {
              if (point.imageUrl) {
                images.push({
                  url: point.imageUrl,
                  alt: getTranslatedText(point.location, currentLocale),
                  type: "route",
                })
              }
            })
          }
        })
      }

      setAllImages(images)

      // Set default transport if available
      if (tourData.transportOptionIds && tourData.transportOptionIds.length > 0) {
        setSelectedTransport(tourData.transportOptionIds[0])
      }
    } catch (err: unknown) {
      console.error("Error fetching tour:", err)
      setError(t("error"))
    } finally {
      setLoading(false)
    }
  }, [slug, t, currentLocale])

  useEffect(() => {
    fetchTour()
  }, [fetchTour])

  // Set minimum date to today
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split("T")[0])
  }, [])

  const getCategoryColor = useCallback((category: TourCategory): string => {
    const colors = {
      Aventura: "bg-red-500 text-white",
      Cultural: "bg-purple-500 text-white",
      Relajación: "bg-green-500 text-white",
      Naturaleza: "bg-emerald-500 text-white",
      Trekking: "bg-orange-500 text-white",
      Panoramico: "bg-blue-500 text-white",
      "Transporte Turistico": "bg-gray-500 text-white",
    }
    return colors[category] || "bg-gray-500 text-white"
  }, [])

  const getDifficultyColor = useCallback((difficulty: Difficulty): string => {
    switch (difficulty) {
      case "Facil":
        return "bg-green-500 text-white"
      case "Moderado":
        return "bg-yellow-500 text-white"
      case "Difícil":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }, [])

  const toggleDay = useCallback(
    (dayNumber: number): void => {
      setExpandedDay(expandedDay === dayNumber ? null : dayNumber)
    },
    [expandedDay],
  )

  const openImageGallery = useCallback(
    (imageUrl: string): void => {
      const imageIndex = allImages.findIndex((img) => img.url === imageUrl)
      setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0)
      setIsGalleryOpen(true)
    },
    [allImages],
  )

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false)
  }, [])

  const navigateImage = useCallback(
    (direction: "prev" | "next"): void => {
      if (allImages.length === 0) return
      let newIndex = currentImageIndex
      if (direction === "prev") {
        newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1
      } else {
        newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0
      }
      setCurrentImageIndex(newIndex)
    },
    [allImages, currentImageIndex],
  )

  const toggleFavorite = useCallback(() => {
    setIsFavorite(!isFavorite)
  }, [isFavorite])

  // Handle booking modal
  const openBookingModal = useCallback(() => {
    setIsBookingModalOpen(true)
  }, [])

  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false)
    setNotes("")
  }, [])

  // Handle people count
  const incrementPeople = useCallback(() => {
    setPeopleCount((prev) => Math.min(prev + 1, 15))
  }, [])

  const decrementPeople = useCallback(() => {
    setPeopleCount((prev) => Math.max(prev - 1, 1))
  }, [])

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!tour) return 0
    return tour.price * peopleCount
  }, [tour, peopleCount])

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!tour || !selectedDate) {
      toast.error(currentLocale === "es" ? "Por favor completa todos los campos" : "Please complete all fields")
      return
    }

    setIsAddingToCart(true)

    try {
      const cartData: CreateCartDto = {
        items: [
          {
            tour: tour._id,
            startDate: new Date(selectedDate).toISOString(),
            people: peopleCount,
            pricePerPerson: tour.price,
            total: totalPrice,
            notes: notes.trim() || undefined,
          },
        ],
        totalPrice: totalPrice,
      }

      await api.post("/cart", cartData)

      toast.success(
        currentLocale === "es" ? "¡Tour agregado al carrito exitosamente!" : "Tour added to cart successfully!",
      )

      closeBookingModal()

      // Redirect to cart page
      setTimeout(() => {
        router.push(getLocalizedLink("/cart"))
      }, 1000)
    } catch (error: unknown) {
      console.error("Error adding to cart:", error)
      toast.error(
        currentLocale === "es"
          ? "Error al agregar al carrito. Inténtalo de nuevo."
          : "Error adding to cart. Please try again.",
      )
    } finally {
      setIsAddingToCart(false)
    }
  }, [tour, selectedDate, peopleCount, totalPrice, notes, currentLocale, closeBookingModal, router, getLocalizedLink])

  // Handle WhatsApp contact
  const handleWhatsAppContact = useCallback(() => {
    if (!tour) return

    const message = encodeURIComponent(
      `¡Hola! Me interesa el tour "${getTranslatedText(tour.title, currentLocale)}" 
      
📍 Destino: ${tour.location}
⏰ Duración: ${getTranslatedText(tour.duration, currentLocale)}
💰 Precio: S/${tour.price} por persona
⭐ Rating: ${tour.rating}/5

¿Podrían darme más información y ayudarme con la reserva?

Gracias!`,
    )

    const whatsappUrl = `https://wa.me/51913876154?text=${message}`
    window.open(whatsappUrl, "_blank")
  }, [tour, currentLocale])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("loading")}</h2>
          <p className="text-gray-600">{t("loading")}</p>
        </motion.div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("tourNotFound")}</h2>
          <p className="text-gray-600 mb-6">{error || t("tourNotFound")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("goBack")}
            </Button>
            <Link href={getLocalizedLink("/tours")}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t("tours")}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentLocale === "es" ? "Reservar Tour" : "Book Tour"}
                </h3>
                <button onClick={closeBookingModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Tour Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslatedText(tour.title, currentLocale)}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tour.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getTranslatedText(tour.duration, currentLocale)}
                  </span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === "es" ? "Fecha de inicio" : "Start Date"}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* People Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === "es" ? "Número de personas" : "Number of People"}
                </label>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <button
                    onClick={decrementPeople}
                    disabled={peopleCount <= 1}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 px-4">
                    {peopleCount}{" "}
                    {peopleCount === 1
                      ? currentLocale === "es"
                        ? "persona"
                        : "person"
                      : currentLocale === "es"
                        ? "personas"
                        : "people"}
                  </span>
                  <button
                    onClick={incrementPeople}
                    disabled={peopleCount >= 15}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLocale === "es" ? "Notas adicionales (opcional)" : "Additional Notes (optional)"}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    currentLocale === "es"
                      ? "Ej: Asientos juntos, dieta especial, etc."
                      : "E.g: Seats together, special diet, etc."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    S/{tour.price} x {peopleCount}{" "}
                    {peopleCount === 1
                      ? currentLocale === "es"
                        ? "persona"
                        : "person"
                      : currentLocale === "es"
                        ? "personas"
                        : "people"}
                  </span>
                  <span className="font-semibold">S/{totalPrice}</span>
                </div>
                <div className="border-t border-blue-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl text-blue-600">S/{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={closeBookingModal} variant="outline" className="flex-1 bg-transparent">
                  {currentLocale === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedDate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {currentLocale === "es" ? "Agregando..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {currentLocale === "es" ? "Agregar al Carrito" : "Add to Cart"}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeGallery}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                <Image
                  src={allImages[currentImageIndex].url || "/placeholder.svg"}
                  alt={allImages[currentImageIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>

              {/* Image Info */}
              <div className="absolute bottom-12 sm:bottom-16 left-4 right-4 text-center">
                <p className="text-white text-sm sm:text-base bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2 max-w-md mx-auto">
                  {allImages[currentImageIndex].alt}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Background Image - Full Width Mobile Responsive */}
      <section className="relative min-h-screen w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={tour.imageUrl || "/placeholder.svg?height=1080&width=1920&text=Tour+Image"}
            alt={getTranslatedText(tour.title, currentLocale)}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"></div>
        </div>

        {/* Content Overlay - Mobile First Design */}
        <div className="relative z-10 min-h-screen flex flex-col pt-48 sm:pt-56 pb-8 sm:pb-16">
          {/* Breadcrumb - Mobile Optimized */}
          <div className="mb-4 sm:mb-8">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/90 mb-4 overflow-x-auto">
                <Link
                  href={getLocalizedLink("/")}
                  className="hover:text-white transition-colors flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap"
                >
                  <span>🏠</span>
                  <span className="hidden sm:inline">{t("home")}</span>
                </Link>
                <span className="text-white/60">/</span>
                <Link
                  href={getLocalizedLink("/tours")}
                  className="hover:text-white transition-colors flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap"
                >
                  <span>🗺️</span>
                  <span className="hidden sm:inline">{t("tours")}</span>
                </Link>
                <span className="text-white/60">/</span>
                <span className="text-white font-medium truncate max-w-[120px] sm:max-w-xs bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                  {getTranslatedText(tour.title, currentLocale)}
                </span>
              </nav>
            </div>
          </div>

          {/* Main Content - Mobile First Grid */}
          <div className="flex-1 flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white order-2 lg:order-1"
                >
                  {/* Badges - Mobile Responsive */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <span className="text-xs font-bold uppercase tracking-wide bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                      📍 {tour.region}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full ${getCategoryColor(tour.category)}`}
                    >
                      {tour.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full ${getDifficultyColor(tour.difficulty)}`}
                    >
                      <Mountain className="w-3 h-3 inline mr-1" />
                      {tour.difficulty}
                    </span>
                    {tour.featured && (
                      <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                        ⭐ {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                      </span>
                    )}
                  </div>

                  {/* Title - Mobile Responsive */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 drop-shadow-lg">
                    {getTranslatedText(tour.title, currentLocale)}
                  </h1>

                  {/* Subtitle - Mobile Responsive */}
                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl drop-shadow-md">
                    {getTranslatedText(tour.subtitle, currentLocale)}
                  </p>

                  {/* Quick Stats - Mobile Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-300" />
                      <div className="text-xs sm:text-sm font-medium">{tour.location}</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-green-300" />
                      <div className="text-xs sm:text-sm font-medium">
                        {getTranslatedText(tour.duration, currentLocale)}
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-yellow-300 fill-current" />
                      <div className="text-xs sm:text-sm font-medium">{tour.rating}/5</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-purple-300" />
                      <div className="text-xs sm:text-sm font-medium">2-15</div>
                    </div>
                  </div>

                  {/* Actions - Mobile Responsive */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <Button
                      onClick={openBookingModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      {t("bookNow")} - S/{tour.price}
                    </Button>
                    <div className="flex gap-3 sm:gap-4">
                      <Button
                        onClick={() => openImageGallery(tour.imageUrl || "")}
                        className="border-2 border-white/40 text-white hover:bg-white/20 px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-sm bg-white/10 flex-1 sm:flex-none"
                      >
                        <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="hidden sm:inline">
                          {allImages.length} {t("photos")}
                        </span>
                        <span className="sm:hidden">{allImages.length}</span>
                      </Button>
                      <Button
                        onClick={toggleFavorite}
                        className={`border-2 border-white/40 hover:bg-white/20 px-4 py-3 sm:py-4 rounded-full backdrop-blur-sm ${
                          isFavorite ? "bg-red-500 text-white border-red-500" : "text-white bg-white/10"
                        }`}
                      >
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        onClick={handleWhatsAppContact}
                        className="border-2 border-green-400 text-white hover:bg-green-500 px-4 py-3 sm:py-4 rounded-full backdrop-blur-sm bg-green-500/20"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      <Button className="border-2 border-white/40 text-white hover:bg-white/20 px-4 py-3 sm:py-4 rounded-full backdrop-blur-sm bg-white/10">
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Right Content - Enhanced Booking Card - Mobile First */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 order-1 lg:order-2"
                >
                  {/* Price Section - Mobile Optimized */}
                  <div className="text-center mb-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl sm:text-4xl font-black text-blue-600">S/{tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-lg sm:text-xl text-gray-500 line-through">S/{tour.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 text-sm sm:text-base">{t("perPerson")}</p>
                    {tour.originalPrice && (
                      <div className="bg-green-100 text-green-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold inline-block">
                        💰 Ahorra S/{tour.originalPrice - tour.price}!
                      </div>
                    )}
                  </div>

                  {/* Quick Info - Mobile Optimized */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                        <Clock className="w-4 h-4" />
                        {t("duration")}
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {getTranslatedText(tour.duration, currentLocale)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                        <Users className="w-4 h-4" />
                        {t("people")}
                      </span>
                      <span className="font-semibold text-sm sm:text-base">2-15 {t("people")}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                        <Star className="w-4 h-4" />
                        {t("rating")}
                      </span>
                      <span className="font-semibold text-sm sm:text-base">
                        {tour.rating}/5 ({tour.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Booking Button - Mobile Optimized */}
                  <Button
                    onClick={openBookingModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 text-base sm:text-lg rounded-xl mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    🎯 {t("bookNow")}
                  </Button>

                  {/* Contact Options - Mobile Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Button
                      onClick={handleWhatsAppContact}
                      className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    <Button className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    <Button className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 hover:text-purple-700">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </div>

                  {/* Trust Indicators - Mobile Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs">
                    <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-green-600" />
                      <div className="text-green-700 font-medium">100% Seguro</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-blue-700 font-medium">Cancelación Gratuita</div>
                    </div>
                    <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-purple-700 font-medium">24/7</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator - Mobile Responsive */}
          <div className="text-center px-4">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-white/70"
            >
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
              <p className="text-xs sm:text-sm mt-2">
                {currentLocale === "es" ? "Desliza para más" : "Scroll for more"}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Full Width Mobile Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Content - Mobile First */}
            <div className="lg:col-span-2 space-y-12 sm:space-y-16">
              {/* Why Choose This Tour - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
              >
                <div className="text-center mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {currentLocale === "es" ? "¿Por qué elegir este tour?" : "Why Choose This Tour?"}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {currentLocale === "es"
                      ? "Descubre las características únicas que hacen de esta experiencia algo inolvidable"
                      : "Discover the unique features that make this experience unforgettable"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {tour.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
                        {getTranslatedText(highlight, currentLocale)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Itinerary - Mobile First Design */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
                >
                  <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {currentLocale === "es" ? "Itinerario Detallado" : "Detailed Itinerary"}
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg">
                      {currentLocale === "es"
                        ? "Explora cada día de tu aventura con rutas detalladas"
                        : "Explore each day of your adventure with detailed routes"}
                    </p>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {tour.itinerary.map((day, dayIndex) => (
                      <div
                        key={day.day}
                        className="border-2 border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm"
                      >
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-4 sm:p-6 lg:p-8 text-left bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1 min-w-0">
                            {/* Day Number with Timeline - Mobile Responsive */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl shadow-lg">
                                {day.day}
                              </div>
                              {/* Timeline connector - Hidden on mobile */}
                              {dayIndex < tour.itinerary!.length - 1 && (
                                <div className="absolute top-12 sm:top-14 lg:top-16 left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-green-400 hidden sm:block"></div>
                              )}
                            </div>
                            {/* Day Content - Mobile Responsive */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                                {t("day")} {day.day}: {getTranslatedText(day.title, currentLocale)}
                              </h3>
                              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-2 sm:mb-4">
                                {getTranslatedText(day.description, currentLocale)}
                              </p>
                              {/* Quick stats - Mobile Grid */}
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
                                {day.activities && (
                                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {day.activities.length} {currentLocale === "es" ? "actividades" : "activities"}
                                  </span>
                                )}
                                {day.route && (
                                  <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {day.route.length} {currentLocale === "es" ? "paradas" : "stops"}
                                  </span>
                                )}
                                {day.meals && (
                                  <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                    <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {day.meals.length}
                                  </span>
                                )}
                                {day.accommodation && (
                                  <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                    <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">
                                      {currentLocale === "es" ? "Alojamiento" : "Hotel"}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-6 h-6 sm:w-8 sm:h-8 text-gray-400 transition-transform duration-300 group-hover:text-blue-600 flex-shrink-0 ${
                              expandedDay === day.day ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedDay === day.day && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white"
                            >
                              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                                {/* Day Image - Mobile Optimized */}
                                {day.imageUrl && (
                                  <div
                                    className="relative h-48 sm:h-56 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                                    onClick={() => openImageGallery(day.imageUrl!)}
                                  >
                                    <Image
                                      src={day.imageUrl || "/placeholder.svg"}
                                      alt={`${t("day")} ${day.day}: ${getTranslatedText(day.title, currentLocale)}`}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                                      <p className="text-white font-bold text-sm sm:text-base lg:text-lg bg-black/50 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2">
                                        {t("day")} {day.day} - {getTranslatedText(day.title, currentLocale)}
                                      </p>
                                    </div>
                                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                  {/* Activities - Mobile First */}
                                  {day.activities && day.activities.length > 0 && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                                      <h4 className="font-bold text-gray-900 text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        {t("activities")}
                                      </h4>
                                      <ul className="space-y-2 sm:space-y-3">
                                        {day.activities.map((activity, idx) => (
                                          <li key={idx} className="flex items-start gap-2 sm:gap-3 text-gray-700">
                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                            <span className="leading-relaxed text-sm sm:text-base">
                                              {getTranslatedText(activity, currentLocale)}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Route Map - Mobile Optimized */}
                                  {day.route && day.route.length > 0 && (
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
                                      <h4 className="font-bold text-gray-900 text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                                          <Route className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        {currentLocale === "es" ? "Ruta del Día" : "Day Route"}
                                      </h4>
                                      <div className="space-y-3 sm:space-y-4">
                                        {day.route.map((point, idx) => (
                                          <div key={idx} className="relative">
                                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm border border-green-200">
                                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0">
                                                {idx + 1}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h5 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">
                                                  📍 {getTranslatedText(point.location, currentLocale)}
                                                </h5>
                                                {point.description && (
                                                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                                                    {getTranslatedText(point.description, currentLocale)}
                                                  </p>
                                                )}
                                              </div>
                                              {point.imageUrl && (
                                                <div
                                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
                                                  onClick={() => openImageGallery(point.imageUrl!)}
                                                >
                                                  <Image
                                                    src={point.imageUrl || "/placeholder.svg"}
                                                    alt={getTranslatedText(point.location, currentLocale)}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full hover:scale-110 transition-transform"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                            {/* Route connector - Hidden on mobile */}
                                            {idx < day.route!.length - 1 && (
                                              <div className="absolute left-7 sm:left-9 top-16 sm:top-20 w-0.5 h-4 sm:h-6 bg-gradient-to-b from-green-400 to-blue-400 hidden sm:block"></div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Additional Info - Mobile Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                  {/* Meals */}
                                  {day.meals && day.meals.length > 0 && (
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-orange-200">
                                      <h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                                        {currentLocale === "es" ? "Comidas" : "Meals"}
                                      </h5>
                                      <ul className="space-y-1 sm:space-y-2">
                                        {day.meals.map((meal, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-center gap-2 text-gray-700 text-sm sm:text-base"
                                          >
                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></span>
                                            {meal}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Accommodation */}
                                  {day.accommodation && (
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
                                      <h5 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                        {currentLocale === "es" ? "Alojamiento" : "Accommodation"}
                                      </h5>
                                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                        {day.accommodation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* What's Included - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
              >
                <div className="text-center mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {currentLocale === "es" ? "¿Qué incluye?" : "What's Included?"}
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    {currentLocale === "es"
                      ? "Todo lo que necesitas para una experiencia completa"
                      : "Everything you need for a complete experience"}
                  </p>
                </div>
                {tour.includes && tour.includes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {tour.includes.map((item: string | TranslatedText, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">
                          {getTranslatedText(item, currentLocale)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-gray-500">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-base sm:text-lg font-medium">
                      {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar - Mobile Optimized */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              {/* Sticky Booking Card - Mobile First */}
              <div className="lg:sticky lg:top-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
                <div className="text-center mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl">
                  <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">S/{tour.price}</div>
                  <p className="text-gray-600 text-base sm:text-lg">{t("perPerson")}</p>
                  {tour.originalPrice && (
                    <div className="mt-3">
                      <span className="text-base sm:text-lg text-gray-500 line-through">S/{tour.originalPrice}</span>
                      <div className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold inline-block ml-2">
                        -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={openBookingModal}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 text-base sm:text-lg rounded-xl mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all"
                >
                  🎯 {t("bookNow")}
                </Button>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <Button
                    onClick={handleWhatsAppContact}
                    className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  <Button className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                  <Button className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 hover:text-purple-700">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>
                <div className="space-y-3 sm:space-y-4 text-center text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="font-medium">100% Seguro</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="font-medium">Cancelación Gratuita</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-2 sm:p-3 bg-purple-50 rounded-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <span className="font-medium">24/7 {t("contact")}</span>
                  </div>
                </div>
              </div>

              {/* Help Section - Mobile Optimized */}
              <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                </h3>
                <p className="text-white/90 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  {currentLocale === "es"
                    ? "Nuestro equipo de expertos está disponible 24/7 para ayudarte a planificar tu aventura perfecta"
                    : "Our expert team is available 24/7 to help you plan your perfect adventure"}
                </p>
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg"
                >
                  {currentLocale === "es" ? "Contactar ahora" : "Contact Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
