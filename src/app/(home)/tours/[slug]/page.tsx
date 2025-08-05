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
  Eye,
  Calendar,
  Plus,
  Minus,
  ShoppingCart,
  XCircle,
  Backpack,
  FileText,
  Car,
  Crown,
  Info,
  CheckCircle2,
  Share2,
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

  // Section visibility states
  const [activeSection, setActiveSection] = useState("overview")

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("loading")}</h2>
          <p className="text-gray-600 text-lg">
            {currentLocale === "es" ? "Cargando información del tour..." : "Loading tour information..."}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32">
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("tourNotFound")}</h2>
          <p className="text-gray-600 mb-8 text-lg">{error || t("tourNotFound")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

  // Define navigation tabs
  const navigationTabs = [
    { id: "overview", label: currentLocale === "es" ? "Resumen" : "Overview", icon: Info },
    { id: "itinerary", label: currentLocale === "es" ? "Itinerario" : "Itinerary", icon: Route },
    { id: "includes", label: currentLocale === "es" ? "Incluye" : "Includes", icon: CheckCircle2 },
    { id: "excludes", label: currentLocale === "es" ? "No Incluye" : "Excludes", icon: XCircle },
    { id: "bring", label: currentLocale === "es" ? "Qué Traer" : "What to Bring", icon: Backpack },
    { id: "conditions", label: currentLocale === "es" ? "Condiciones" : "Conditions", icon: FileText },
    { id: "transport", label: currentLocale === "es" ? "Transporte" : "Transport", icon: Car },
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentLocale === "es" ? "🎯 Reservar Tour" : "🎯 Book Tour"}
                </h3>
                <button onClick={closeBookingModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Tour Info */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">{getTranslatedText(tour.title, currentLocale)}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {tour.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    {getTranslatedText(tour.duration, currentLocale)}
                  </span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  📅 {currentLocale === "es" ? "Fecha de inicio" : "Start Date"}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* People Count */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  👥 {currentLocale === "es" ? "Número de personas" : "Number of People"}
                </label>
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                  <button
                    onClick={decrementPeople}
                    disabled={peopleCount <= 1}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 px-6">
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
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  📝 {currentLocale === "es" ? "Notas adicionales (opcional)" : "Additional Notes (optional)"}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    currentLocale === "es"
                      ? "Ej: Asientos juntos, dieta especial, etc."
                      : "E.g: Seats together, special diet, etc."
                  }
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                  rows={3}
                />
              </div>

              {/* Price Summary */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/90 text-lg">
                    S/{tour.price} x {peopleCount}{" "}
                    {peopleCount === 1
                      ? currentLocale === "es"
                        ? "persona"
                        : "person"
                      : currentLocale === "es"
                        ? "personas"
                        : "people"}
                  </span>
                  <span className="font-bold text-xl">S/{totalPrice}</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl">💰 Total:</span>
                    <span className="font-bold text-3xl">S/{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={closeBookingModal}
                  variant="outline"
                  className="flex-1 py-4 text-lg rounded-2xl bg-transparent"
                >
                  {currentLocale === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedDate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-4 text-lg rounded-2xl"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {currentLocale === "es" ? "Agregando..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
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
            className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-2 sm:p-4"
          >
            <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeGallery}
                className="absolute top-6 right-6 z-10 w-14 h-14 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
              >
                <X className="w-7 h-7 text-white" />
              </button>

              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-6 z-10 w-14 h-14 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
                  >
                    <ChevronLeft className="w-7 h-7 text-white" />
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-6 z-10 w-14 h-14 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
                  >
                    <ChevronRight className="w-7 h-7 text-white" />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <Image
                  src={allImages[currentImageIndex].url || "/placeholder.svg"}
                  alt={allImages[currentImageIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>

              {/* Image Info */}
              <div className="absolute bottom-16 left-4 right-4 text-center">
                <p className="text-white text-base bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2 max-w-md mx-auto">
                  {allImages[currentImageIndex].alt}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Background Image */}
      <section className="relative w-full">
        <div className="relative min-h-screen flex items-end">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70"></div>
          </div>

          {/* Content Overlay - Positioned at bottom with proper spacing for header */}
          <div className="relative z-10 w-full pb-8 sm:pb-12 md:pb-16 pt-72 sm:pt-80 md:pt-88 lg:pt-96 xl:pt-104">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-white/90 mb-6">
                <Link href={getLocalizedLink("/")} className="hover:text-white transition-colors">
                  🏠 {t("home")}
                </Link>
                <span>/</span>
                <Link href={getLocalizedLink("/tours")} className="hover:text-white transition-colors">
                  🎯 {t("tours")}
                </Link>
                <span>/</span>
                <span className="text-white font-medium truncate">{getTranslatedText(tour.title, currentLocale)}</span>
              </nav>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-end">
                {/* Left Content */}
                <div className="xl:col-span-3 text-white">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="text-sm font-bold uppercase tracking-wide bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                      📍 {tour.region}
                    </span>
                    <span className={`text-sm font-bold px-4 py-2 rounded-full ${getCategoryColor(tour.category)}`}>
                      {tour.category}
                    </span>
                    <span className={`text-sm font-bold px-4 py-2 rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                      <Mountain className="w-4 h-4 inline mr-1" />
                      {tour.difficulty}
                    </span>
                    {tour.featured && (
                      <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full">
                        ⭐ {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight mb-6 drop-shadow-lg">
                    {getTranslatedText(tour.title, currentLocale)}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow-md">
                    {getTranslatedText(tour.subtitle, currentLocale)}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                      <div className="text-sm font-bold">{tour.location}</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-green-300" />
                      <div className="text-sm font-bold">{getTranslatedText(tour.duration, currentLocale)}</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <Star className="w-6 h-6 mx-auto mb-2 text-yellow-300 fill-current" />
                      <div className="text-sm font-bold">{tour.rating}/5</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <Users className="w-6 h-6 mx-auto mb-2 text-purple-300" />
                      <div className="text-sm font-bold">2-15</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button
                      onClick={openBookingModal}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-5 text-xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border-4 border-white/30"
                    >
                      🎯 {t("bookNow")} - S/{tour.price}
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => openImageGallery(tour.imageUrl || "")}
                        className="border-2 border-white/40 text-white hover:bg-white/20 px-6 py-4 rounded-full backdrop-blur-sm bg-white/10"
                      >
                        <Camera className="w-5 h-5 mr-2" />📸 {allImages.length}
                      </Button>
                      <Button
                        onClick={toggleFavorite}
                        className={`border-2 border-white/40 hover:bg-white/20 px-6 py-4 rounded-full backdrop-blur-sm ${
                          isFavorite ? "bg-red-500 text-white border-red-500" : "text-white bg-white/10"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        onClick={handleWhatsAppContact}
                        className="border-2 border-green-400 text-white hover:bg-green-500 px-6 py-4 rounded-full backdrop-blur-sm bg-green-500/20"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />💬
                      </Button>
                      <Button className="border-2 border-white/40 text-white hover:bg-white/20 px-6 py-4 rounded-full backdrop-blur-sm bg-white/10">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Content - Price Display Only */}
                <div className="xl:col-span-2 bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                  {/* Price Section */}
                  <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
                    <div className="flex items-baseline justify-center gap-2 mb-3">
                      <span className="text-4xl font-black text-blue-600">S/{tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">S/{tour.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 text-lg">{t("perPerson")}</p>
                    {tour.originalPrice && (
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold inline-block">
                        💰 {currentLocale === "es" ? "Ahorra" : "Save"} S/{tour.originalPrice - tour.price}!
                      </div>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        {t("duration")}
                      </span>
                      <span className="font-bold">{getTranslatedText(tour.duration, currentLocale)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        {t("people")}
                      </span>
                      <span className="font-bold">2-15 {currentLocale === "es" ? "personas" : "people"}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        {t("rating")}
                      </span>
                      <span className="font-bold">
                        {tour.rating}/5 ({tour.reviews} {currentLocale === "es" ? "reseñas" : "reviews"})
                      </span>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <Button
                      onClick={handleWhatsAppContact}
                      className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 hover:text-green-700 rounded-xl"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                    <Button className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 rounded-xl">
                      <Phone className="w-6 h-6" />
                    </Button>
                    <Button className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 hover:text-purple-700 rounded-xl">
                      <Mail className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <Shield className="w-5 h-5 mx-auto mb-2 text-green-600" />
                      <div className="text-green-700 font-bold">100% {currentLocale === "es" ? "Seguro" : "Safe"}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Check className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                      <div className="text-blue-700 font-bold">
                        {currentLocale === "es" ? "Cancelación Gratuita" : "Free Cancellation"}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <Award className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                      <div className="text-purple-700 font-bold">
                        24/7 {currentLocale === "es" ? "Soporte" : "Support"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="flex w-full min-w-max md:min-w-0">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap transition-all duration-300 flex-1 justify-center min-w-0 text-sm sm:text-base
                    ${
                      activeSection === tab.id
                        ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50 font-bold"
                        : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              {/* Overview Section */}
              {activeSection === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "¿Por qué elegir este tour?" : "Why Choose This Tour?"}
                  </h2>
                  <div className="space-y-8 sm:space-y-12">
                    {tour.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-6 p-8 sm:p-10 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium text-lg leading-relaxed">
                          {getTranslatedText(highlight, currentLocale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Itinerary Section */}
              {activeSection === "itinerary" && tour.itinerary && tour.itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <Route className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "Itinerario Detallado" : "Detailed Itinerary"}
                  </h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, dayIndex) => (
                      <div key={day.day} className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-6 sm:p-8 md:p-10 text-left bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-green-50 transition-all duration-300 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-6 sm:gap-8 flex-1">
                            <div className="relative">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg">
                                {day.day}
                              </div>
                              {dayIndex < tour.itinerary!.length - 1 && (
                                <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-1 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-green-400"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {t("day")} {day.day}: {getTranslatedText(day.title, currentLocale)}
                              </h3>
                              <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-6">
                                {getTranslatedText(day.description, currentLocale)}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                                {day.activities && (
                                  <span className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
                                    <Check className="w-4 h-4" />
                                    {day.activities.length} {currentLocale === "es" ? "actividades" : "activities"}
                                  </span>
                                )}
                                {day.route && (
                                  <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-full">
                                    <Navigation className="w-4 h-4" />
                                    {day.route.length} {currentLocale === "es" ? "paradas" : "stops"}
                                  </span>
                                )}
                                {day.meals && (
                                  <span className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-full">
                                    <Utensils className="w-4 h-4" />
                                    {day.meals.length}
                                  </span>
                                )}
                                {day.accommodation && (
                                  <span className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-full">
                                    <Bed className="w-4 h-4" />
                                    {currentLocale === "es" ? "Alojamiento" : "Hotel"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-8 h-8 sm:w-10 sm:h-10 text-gray-400 transition-transform duration-300 group-hover:text-blue-600 flex-shrink-0 ${
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
                              <div className="p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10">
                                {/* Day Image */}
                                {day.imageUrl && (
                                  <div
                                    className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
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
                                    <div className="absolute bottom-6 left-6 right-6">
                                      <p className="text-white font-bold text-lg sm:text-xl bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-3">
                                        {t("day")} {day.day} - {getTranslatedText(day.title, currentLocale)}
                                      </p>
                                    </div>
                                    <div className="absolute top-6 right-6">
                                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                        <Eye className="w-6 h-6 text-gray-700" />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-12 sm:space-y-16">
                                  {/* Activities */}
                                  {day.activities && day.activities.length > 0 && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 sm:p-8 md:p-10 border border-blue-200">
                                      <h4 className="font-bold text-gray-900 text-xl sm:text-2xl mb-8 sm:mb-10 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                          <Check className="w-6 h-6 text-white" />
                                        </div>
                                        {t("activities")}
                                      </h4>
                                      <div className="space-y-6 sm:space-y-8">
                                        {day.activities.map((activity, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start gap-4 sm:gap-6 text-gray-700 p-6 sm:p-8 bg-white/80 rounded-2xl shadow-sm border border-blue-100"
                                          >
                                            <span className="w-4 h-4 bg-blue-500 rounded-full mt-3 flex-shrink-0"></span>
                                            <span className="leading-relaxed text-base sm:text-lg md:text-xl font-medium text-gray-800">
                                              {getTranslatedText(activity, currentLocale)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Route Map */}
                                  {day.route && day.route.length > 0 && (
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 sm:p-8 md:p-10 border border-green-200">
                                      <h4 className="font-bold text-gray-900 text-xl sm:text-2xl mb-8 sm:mb-10 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                          <Route className="w-6 h-6 text-white" />
                                        </div>
                                        {currentLocale === "es" ? "Ruta del Día" : "Day Route"}
                                      </h4>
                                      <div className="space-y-8 sm:space-y-10">
                                        {day.route.map((point, idx) => (
                                          <div key={idx} className="relative">
                                            <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 sm:p-8 hover:shadow-md transition-shadow">
                                              <div className="flex flex-col sm:flex-row items-start gap-6">
                                                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                                                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
                                                    {idx + 1}
                                                  </div>
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-4">
                                                  <h5 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">
                                                    📍 {getTranslatedText(point.location, currentLocale)}
                                                  </h5>
                                                  {point.description && (
                                                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg md:text-xl">
                                                      {getTranslatedText(point.description, currentLocale)}
                                                    </p>
                                                  )}
                                                </div>
                                                {point.imageUrl && (
                                                  <div
                                                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
                                                    onClick={() => openImageGallery(point.imageUrl!)}
                                                  >
                                                    <Image
                                                      src={point.imageUrl || "/placeholder.svg"}
                                                      alt={getTranslatedText(point.location, currentLocale)}
                                                      width={128}
                                                      height={128}
                                                      className="object-cover w-full h-full hover:scale-110 transition-transform"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            {idx < day.route!.length - 1 && (
                                              <div className="flex justify-center py-4">
                                                <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                  {/* Meals */}
                                  {day.meals && day.meals.length > 0 && (
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 border border-orange-200">
                                      <h5 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg sm:text-xl">
                                        <Utensils className="w-6 h-6 text-orange-600" />
                                        {currentLocale === "es" ? "Comidas" : "Meals"}
                                      </h5>
                                      <ul className="space-y-3">
                                        {day.meals.map((meal, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-center gap-3 text-gray-700 text-base sm:text-lg"
                                          >
                                            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                            {meal}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Accommodation */}
                                  {day.accommodation && (
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 sm:p-8 border border-purple-200">
                                      <h5 className="font-bold text-gray-900 mb-6 flex items-center gap-3 text-lg sm:text-xl">
                                        <Bed className="w-6 h-6 text-purple-600" />
                                        {currentLocale === "es" ? "Alojamiento" : "Accommodation"}
                                      </h5>
                                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
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

              {/* What's Included Section */}
              {activeSection === "includes" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "✅ ¿Qué incluye?" : "✅ What's Included?"}
                  </h2>
                  {tour.includes && tour.includes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {tour.includes.map((item: string | TranslatedText, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium text-base sm:text-lg">
                            {getTranslatedText(item, currentLocale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-medium">
                        {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* What's NOT Included Section */}
              {activeSection === "excludes" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "❌ ¿Qué NO incluye?" : "❌ What's NOT Included?"}
                  </h2>
                  {tour.notIncludes && tour.notIncludes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {tour.notIncludes.map((item: string | TranslatedText, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <X className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium text-base sm:text-lg">
                            {getTranslatedText(item, currentLocale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-medium">
                        {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* What to Bring Section */}
              {activeSection === "bring" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Backpack className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "🎒 ¿Qué traer?" : "🎒 What to Bring?"}
                  </h2>
                  {tour.toBring && tour.toBring.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {tour.toBring.map((item: string | TranslatedText, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Backpack className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium text-base sm:text-lg">
                            {getTranslatedText(item, currentLocale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Backpack className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-medium">
                        {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Conditions Section */}
              {activeSection === "conditions" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "📋 Condiciones del Tour" : "📋 Tour Conditions"}
                  </h2>
                  {tour.conditions && tour.conditions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                      {tour.conditions.map((condition: string | TranslatedText, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white font-bold text-sm">{idx + 1}</span>
                          </div>
                          <span className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
                            {getTranslatedText(condition, currentLocale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-medium">
                        {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Transport Options Section */}
              {activeSection === "transport" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100"
                >
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    {currentLocale === "es" ? "🚗 Opciones de Transporte" : "🚗 Transport Options"}
                  </h2>
                  {tour.transportOptionIds && tour.transportOptionIds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {tour.transportOptionIds.map((transport: TransportOption, idx: number) => (
                        <div
                          key={idx}
                          className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full flex items-center justify-center">
                              <Car className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-xl">
                                {transport.vehicle || "Transporte Turístico"}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                                    transport.type === "Premium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {transport.type === "Premium" && <Crown className="w-3 h-3 inline mr-1" />}
                                  {transport.type || "Básico"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {transport.services && transport.services.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-700">
                                {currentLocale === "es" ? "Servicios incluidos:" : "Included services:"}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {transport.services.map((service: string, serviceIdx: number) => (
                                  <span
                                    key={serviceIdx}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Car className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-xl font-medium">
                        {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Sidebar - Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100">
                <div className="text-center mb-8 sm:mb-10 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
                  <div className="text-4xl sm:text-5xl font-black text-blue-600 mb-3">S/{tour.price}</div>
                  <p className="text-gray-600 text-lg sm:text-xl">{t("perPerson")}</p>
                  {tour.originalPrice && (
                    <div className="mt-4">
                      <span className="text-xl text-gray-500 line-through">S/{tour.originalPrice}</span>
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold inline-block ml-3">
                        -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={openBookingModal}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 sm:py-5 text-lg sm:text-xl rounded-2xl mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all"
                >
                  🎯 {t("bookNow")}
                </Button>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  <Button
                    onClick={handleWhatsAppContact}
                    className="p-4 sm:p-5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 hover:text-green-700 rounded-xl"
                  >
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </Button>
                  <Button className="p-4 sm:p-5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 rounded-xl">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
                  </Button>
                  <Button className="p-4 sm:p-5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 hover:text-purple-700 rounded-xl">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-5 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-base">100% {currentLocale === "es" ? "Seguro" : "Safe"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Check className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-base">
                      {currentLocale === "es" ? "Cancelación Gratuita" : "Free Cancellation"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <Award className="w-6 h-6 text-purple-600" />
                    <span className="font-medium text-base">24/7 {currentLocale === "es" ? "Soporte" : "Support"}</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 sm:mt-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-4">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                  {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                </h3>
                <p className="text-white/90 mb-6 sm:mb-8 text-lg sm:text-xl leading-relaxed">
                  {currentLocale === "es"
                    ? "Nuestro equipo de expertos está disponible 24/7 para ayudarte a planificar tu aventura perfecta"
                    : "Our expert team is available 24/7 to help you plan your perfect adventure"}
                </p>
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 sm:py-5 text-lg sm:text-xl rounded-2xl shadow-lg"
                >
                  💬 {currentLocale === "es" ? "Contactar ahora" : "Contact Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
