"use client"

import { Button } from "@/components/ui/button"
import { Clock, Star, MapPin, Users, Check, Camera, ArrowLeft, Heart, ChevronDown, Loader2, AlertCircle, Phone, Mail, MessageCircle, Shield, X, ChevronLeft, ChevronRight, Navigation, Award, Route, Utensils, Bed, Mountain, Eye, Calendar, Plus, Minus, ShoppingCart, XCircle, Backpack, FileText, Car, Crown, Info, CheckCircle2, Share2, Download, Globe, Thermometer, Sunrise, Sunset, Wind } from 'lucide-react'
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
import RelatedToursSection from "@/components/related-tours-section"


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
    <div className="min-h-screen bg-gray-50">

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
              {/* Close Button - Moved to bottom right */}
              <button
                onClick={closeGallery}
                className="absolute bottom-6 right-6 z-10 w-14 h-14 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
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

      {/* Main content wrapper with padding-top */}
      <div className="pt-64"> {/* Adjusted padding-top for header height */}
        {/* Breadcrumb */}
        <div className="bg-gray-50"> {/* Consistent background, removed border-b */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href={getLocalizedLink("/")} className="hover:text-blue-600 transition-colors">
                🏠 {t("home")}
              </Link>
              <span>/</span>
              <Link href={getLocalizedLink("/tours")} className="hover:text-blue-600 transition-colors">
                🎯 {t("tours")}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">{getTranslatedText(tour.title, currentLocale)}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section - Compact */}
        <section className="bg-gray-50"> {/* Consistent background */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-8">
                {/* Title and Badges */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      📍 {tour.region}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(tour.category)}`}>
                      {tour.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(tour.difficulty)}`}>
                      <Mountain className="w-3 h-3 inline mr-1" />
                      {tour.difficulty}
                    </span>
                    {tour.featured && (
                      <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full">
                        ⭐ {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                    {getTranslatedText(tour.title, currentLocale)}
                  </h1>

                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {getTranslatedText(tour.subtitle, currentLocale)}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">{currentLocale === "es" ? "Ubicación" : "Location"}</div>
                        <div className="font-bold text-gray-900">{tour.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t("duration")}</div>
                        <div className="font-bold text-gray-900">{getTranslatedText(tour.duration, currentLocale)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <div>
                        <div className="text-sm text-gray-500">{t("rating")}</div>
                        <div className="font-bold text-gray-900">
                          {tour.rating}/5 ({tour.reviews})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Users className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">{t("people")}</div>
                        <div className="font-bold text-gray-900">2-15</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => openImageGallery(tour.imageUrl || "")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      📸 {allImages.length} {currentLocale === "es" ? "fotos" : "photos"}
                    </Button>
                    <Button
                      onClick={toggleFavorite}
                      variant="outline"
                      className={`flex items-center gap-2 ${isFavorite ? "bg-red-50 text-red-600 border-red-200" : ""}`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                      {currentLocale === "es" ? "Favorito" : "Favorite"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      {currentLocale === "es" ? "Compartir" : "Share"}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Main Image */}
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8 group cursor-pointer">
                  <Image
                    src={tour.imageUrl || "/placeholder.svg?height=500&width=800&text=Tour+Image"}
                    alt={getTranslatedText(tour.title, currentLocale)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    onClick={() => openImageGallery(tour.imageUrl || "")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <Eye className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
                      <h3 className="font-bold text-lg mb-2">{getTranslatedText(tour.title, currentLocale)}</h3>
                      <div className="flex items-center gap-4 text-sm">
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
                  </div>
                </div>

                {/* Image Gallery Thumbnails */}
                {allImages.length > 1 && (
                  <div className="mb-8">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {allImages.slice(1, 6).map((image, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                          onClick={() => openImageGallery(image.url)}
                        >
                          <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" sizes="96px" />
                        </div>
                      ))}
                      {allImages.length > 6 && (
                        <div
                          className="relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer bg-gray-900 flex items-center justify-center text-white font-bold flex-shrink-0"
                          onClick={() => openImageGallery(allImages[6].url)}
                        >
                          +{allImages.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar - Booking Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  {/* Price Section */}
                  <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl font-black text-blue-600">S/{tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">S/{tour.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{t("perPerson")}</p>
                    {tour.originalPrice && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold inline-block">
                        💰 {currentLocale === "es" ? "Ahorra" : "Save"} S/{tour.originalPrice - tour.price}!
                      </div>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {t("duration")}
                      </span>
                      <span className="font-bold">{getTranslatedText(tour.duration, currentLocale)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        {t("people")}
                      </span>
                      <span className="font-bold">2-15 {currentLocale === "es" ? "personas" : "people"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {t("rating")}
                      </span>
                      <span className="font-bold">
                        {tour.rating}/5 ({tour.reviews} {currentLocale === "es" ? "reseñas" : "reviews"})
                      </span>
                    </div>
                  </div>

                  {/* Main Booking Button */}
                  <Button
                    onClick={openBookingModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl mb-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    🎯 {t("bookNow")}
                  </Button>

                  {/* Contact Options */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <Button
                      onClick={handleWhatsAppContact}
                      className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 hover:text-green-700 rounded-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 hover:text-purple-700 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Shield className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <div className="text-green-700 font-bold">100% {currentLocale === "es" ? "Seguro" : "Safe"}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Check className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      <div className="text-blue-700 font-bold">
                        {currentLocale === "es" ? "Cancelación Gratuita" : "Free Cancellation"}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Award className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                      <div className="text-purple-700 font-bold">24/7 {currentLocale === "es" ? "Soporte" : "Support"}</div>
                    </div>
                  </div>

                  {/* Weather Info */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      {currentLocale === "es" ? "Clima Recomendado" : "Weather Info"}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Sunrise className="w-4 h-4 text-orange-400" />
                        <span>15°C - 25°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-blue-400" />
                        <span>{currentLocale === "es" ? "Viento suave" : "Light wind"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="mt-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6" />
                    {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                  </h3>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">
                    {currentLocale === "es"
                      ? "Nuestro equipo está disponible 24/7 para ayudarte"
                      : "Our team is available 24/7 to help you"}
                  </p>
                  <Button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 rounded-xl"
                  >
                    💬 {currentLocale === "es" ? "Contactar ahora" : "Contact Now"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs - Sticky */}
        <div className="sticky top-0 z-40 bg-gray-50"> {/* Consistent background, removed border-b and shadow-sm */}
          <div className="max-w-7xl mx-auto">
            <div className="overflow-x-auto scrollbar-hide">
              <nav className="flex w-full min-w-max md:min-w-0">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2 py-4 px-4 md:px-6 whitespace-nowrap transition-all duration-300 flex-1 justify-center min-w-0 text-sm
                      ${
                        activeSection === tab.id
                          ? "border-b-4 border-blue-600 text-blue-600 bg-blue-50 font-bold"
                          : "border-b-4 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <tab.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Overview Section */}
                {activeSection === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Hero Description */}
                    <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <Mountain className="w-6 h-6 text-white" />
                            </div>
                            {currentLocale === "es" ? "Descubre la Aventura" : "Discover the Adventure"}
                          </h2>
                          <p className="text-xl leading-relaxed text-white/90 mb-6">
                            {getTranslatedText(tour.subtitle, currentLocale)}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl font-bold">{tour.rating}/5</div>
                              <div className="text-sm text-white/80">⭐ Rating</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl font-bold">{tour.reviews}</div>
                              <div className="text-sm text-white/80">👥 {currentLocale === "es" ? "Reseñas" : "Reviews"}</div>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                              src={tour.imageUrl || "/placeholder.svg?height=300&width=500"}
                              alt={getTranslatedText(tour.title, currentLocale)}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                            <Camera className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience Highlights */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-2xl font-black text-gray-900 mb-8 text-center">
                        {currentLocale === "es" ? "🌟 Experiencias Únicas que Vivirás" : "🌟 Unique Experiences You'll Live"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tour.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="group relative bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100"
                          >
                            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-bold text-gray-900 text-lg mb-3">
                                {getTranslatedText(highlight, currentLocale)}
                              </h4>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {currentLocale === "es" 
                                  ? "Una experiencia inolvidable que te conectará con la naturaleza y la cultura local."
                                  : "An unforgettable experience that will connect you with nature and local culture."}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {currentLocale === "es" ? "Incluido" : "Included"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                {tour.rating}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tour Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Destino" : "Destination"}</h4>
                        <p className="text-gray-600 font-medium">{tour.location}</p>
                        <p className="text-sm text-gray-500 mt-1">{tour.region}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Duración" : "Duration"}</h4>
                        <p className="text-gray-600 font-medium">{getTranslatedText(tour.duration, currentLocale)}</p>
                        <p className="text-sm text-gray-500 mt-1">{currentLocale === "es" ? "Completo" : "Full experience"}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Grupo" : "Group Size"}</h4>
                        <p className="text-gray-600 font-medium">2-15 {currentLocale === "es" ? "personas" : "people"}</p>
                        <p className="text-sm text-gray-500 mt-1">{currentLocale === "es" ? "Íntimo" : "Intimate"}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mountain className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Dificultad" : "Difficulty"}</h4>
                        <p className="text-gray-600 font-medium">{tour.difficulty}</p>
                        <p className="text-sm text-gray-500 mt-1">{currentLocale === "es" ? "Para todos" : "For everyone"}</p>
                      </div>
                    </div>

                    {/* What Makes This Special */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-2xl font-black text-gray-900 mb-8 text-center">
                        {currentLocale === "es" ? "🎯 ¿Qué Hace Especial Este Tour?" : "🎯 What Makes This Tour Special?"}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-2">
                                {currentLocale === "es" ? "Guías Expertos Locales" : "Expert Local Guides"}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {currentLocale === "es" 
                                  ? "Nuestros guías certificados conocen cada rincón y te contarán historias fascinantes que no encontrarás en ningún libro."
                                  : "Our certified guides know every corner and will tell you fascinating stories you won't find in any book."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-2">
                                {currentLocale === "es" ? "Seguridad Garantizada" : "Guaranteed Safety"}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {currentLocale === "es" 
                                  ? "Todos nuestros tours incluyen seguro completo y seguimos los más altos estándares de seguridad."
                                  : "All our tours include comprehensive insurance and follow the highest safety standards."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-2">
                                {currentLocale === "es" ? "Momentos Inolvidables" : "Unforgettable Moments"}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {currentLocale === "es" 
                                  ? "Captura los mejores momentos con paisajes espectaculares y experiencias únicas que recordarás toda la vida."
                                  : "Capture the best moments with spectacular landscapes and unique experiences you'll remember forever."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                              src={tour.imageUrl || "/placeholder.svg?height=400&width=400"}
                              alt="Tour experience"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h4 className="font-bold text-xl mb-2">{getTranslatedText(tour.title, currentLocale)}</h4>
                            <p className="text-white/90">
                              {currentLocale === "es" ? "Una experiencia que cambiará tu perspectiva" : "An experience that will change your perspective"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Itinerary Section - Enhanced */}
                {activeSection === "itinerary" && tour.itinerary && tour.itinerary.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Itinerary Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white">
                      <div className="text-center">
                        <h2 className="text-3xl font-black mb-4">
                          {currentLocale === "es" ? "🗺️ Tu Aventura Paso a Paso" : "🗺️ Your Adventure Step by Step"}
                        </h2>
                        <p className="text-xl text-white/90 mb-6">
                          {currentLocale === "es" 
                            ? "Descubre cada momento de esta experiencia única, desde el amanecer hasta el atardecer"
                            : "Discover every moment of this unique experience, from sunrise to sunset"}
                        </p>
                        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <Sunrise className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">06:00 AM</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <Clock className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">{getTranslatedText(tour.duration, currentLocale)}</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <Sunset className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm">04:00 PM</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <div className="space-y-8">
                        {tour.itinerary.map((day, dayIndex) => (
                          <div key={day.day} className="relative">
                            {/* Timeline Line */}
                            {dayIndex < tour.itinerary!.length - 1 && (
                              <div className="absolute left-8 top-20 w-1 h-full bg-gradient-to-b from-blue-400 to-green-400 rounded-full"></div>
                            )}
                            
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                              <button
                                onClick={() => toggleDay(day.day)}
                                className="w-full p-8 text-left flex items-center gap-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group"
                              >
                                <div className="relative z-10">
                                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {day.day}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {t("day")} {day.day}: {getTranslatedText(day.title, currentLocale)}
                                    </h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                      {currentLocale === "es" ? "DÍA COMPLETO" : "FULL DAY"}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                    {getTranslatedText(day.description, currentLocale)}
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-3">
                                    {day.activities && (
                                      <span className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium">
                                        <Check className="w-4 h-4" />
                                        {day.activities.length} {currentLocale === "es" ? "actividades" : "activities"}
                                      </span>
                                    )}
                                    {day.route && (
                                      <span className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-medium">
                                        <Navigation className="w-4 h-4" />
                                        {day.route.length} {currentLocale === "es" ? "paradas" : "stops"}
                                      </span>
                                    )}
                                    {day.meals && day.meals.length > 0 && (
                                      <span className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full text-sm font-medium">
                                        <Utensils className="w-4 h-4" />
                                        {day.meals.length} {currentLocale === "es" ? "comidas" : "meals"}
                                      </span>
                                    )}
                                    {day.accommodation && (
                                      <span className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-full text-sm font-medium">
                                        <Bed className="w-4 h-4" />
                                        {currentLocale === "es" ? "Alojamiento" : "Accommodation"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <ChevronDown
                                  className={`w-8 h-8 text-gray-400 transition-transform duration-300 group-hover:text-blue-600 flex-shrink-0 ${
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
                                    className="bg-white border-t border-gray-100"
                                  >
                                    <div className="p-8 space-y-8">
                                      {/* Day Image with Info Overlay */}
                                      {day.imageUrl && (
                                        <div className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-xl">
                                          <Image
                                            src={day.imageUrl || "/placeholder.svg"}
                                            alt={`${t("day")} ${day.day}: ${getTranslatedText(day.title, currentLocale)}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            onClick={() => openImageGallery(day.imageUrl!)}
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                          <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <h4 className="text-2xl font-bold mb-3">
                                              {t("day")} {day.day} - {getTranslatedText(day.title, currentLocale)}
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                                <Clock className="w-5 h-5 mx-auto mb-1" />
                                                <div className="text-sm">06:00 AM</div>
                                              </div>
                                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                                <MapPin className="w-5 h-5 mx-auto mb-1" />
                                                <div className="text-sm">{day.route?.length || 0} {currentLocale === "es" ? "lugares" : "places"}</div>
                                              </div>
                                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                                <Camera className="w-5 h-5 mx-auto mb-1" />
                                                <div className="text-sm">{currentLocale === "es" ? "Fotos" : "Photos"}</div>
                                              </div>
                                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                                <Eye className="w-5 h-5 mx-auto mb-1" />
                                                <div className="text-sm">{currentLocale === "es" ? "Ver más" : "View"}</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Activities Timeline */}
                                        {day.activities && day.activities.length > 0 && (
                                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                                            <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-white" />
                                              </div>
                                              {currentLocale === "es" ? "Cronograma del Día" : "Day Schedule"}
                                            </h4>
                                            <div className="space-y-4">
                                              {day.activities.map((activity, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-start gap-4 p-4 bg-white/80 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                                                >
                                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {String(idx + 1).padStart(2, '0')}
                                                  </div>
                                                  <div className="flex-1">
                                                    <p className="text-gray-800 font-medium leading-relaxed">
                                                      {getTranslatedText(activity, currentLocale)}
                                                    </p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Route Map */}
                                        {day.route && day.route.length > 0 && (
                                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                                            <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                                              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                                <Route className="w-5 h-5 text-white" />
                                              </div>
                                              {currentLocale === "es" ? "Lugares que Visitarás" : "Places You'll Visit"}
                                            </h4>
                                            <div className="space-y-4">
                                              {day.route.map((point, idx) => (
                                                <div key={idx} className="relative">
                                                  <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-4">
                                                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                                        {idx + 1}
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <h5 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                                                          <MapPin className="w-4 h-4 text-green-600" />
                                                          {getTranslatedText(point.location, currentLocale)}
                                                        </h5>
                                                        {point.description && (
                                                          <p className="text-gray-600 leading-relaxed mb-3">
                                                            {getTranslatedText(point.description, currentLocale)}
                                                          </p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                          <Camera className="w-4 h-4" />
                                                          <span>{currentLocale === "es" ? "Parada fotográfica" : "Photo stop"}</span>
                                                        </div>
                                                      </div>
                                                      {point.imageUrl && (
                                                        <div
                                                          className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
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
                                                  </div>
                                                  {idx < day.route!.length - 1 && (
                                                    <div className="flex justify-center py-2">
                                                      <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Additional Day Info */}
                                      {(day.meals && day.meals.length > 0) || day.accommodation && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Meals */}
                                          {day.meals && day.meals.length > 0 && (
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                                              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                                                <Utensils className="w-6 h-6 text-orange-600" />
                                                {currentLocale === "es" ? "Comidas Incluidas" : "Included Meals"}
                                              </h5>
                                              <div className="space-y-3">
                                                {day.meals.map((meal, idx) => (
                                                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                                      <Utensils className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{meal}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Accommodation */}
                                          {day.accommodation && (
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                                                <Bed className="w-6 h-6 text-purple-600" />
                                                {currentLocale === "es" ? "Alojamiento" : "Accommodation"}
                                              </h5>
                                              <div className="p-4 bg-white/80 rounded-lg">
                                                <p className="text-gray-700 leading-relaxed font-medium">
                                                  {day.accommodation}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* What's Included Section - Enhanced */}
                {activeSection === "includes" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white text-center">
                      <h2 className="text-3xl font-black mb-4">
                        {currentLocale === "es" ? "✅ Todo Incluido en Tu Aventura" : "✅ Everything Included in Your Adventure"}
                      </h2>
                      <p className="text-xl text-white/90">
                        {currentLocale === "es" 
                          ? "Disfruta sin preocupaciones, nosotros nos encargamos de todo"
                          : "Enjoy worry-free, we take care of everything"}
                      </p>
                    </div>

                    {/* Included Items */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      {tour.includes && tour.includes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {tour.includes.map((item: string | TranslatedText, idx: number) => (
                            <div
                              key={idx}
                              className="group flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-gray-900 font-bold text-lg mb-2">
                                  {getTranslatedText(item, currentLocale)}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {currentLocale === "es" 
                                    ? "Incluido en el precio del tour, sin costos adicionales"
                                    : "Included in the tour price, no additional costs"}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="font-medium">{currentLocale === "es" ? "INCLUIDO" : "INCLUDED"}</span>
                                </div>
                              </div>
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
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">
                          {currentLocale === "es" ? "💰 Valor Excepcional" : "💰 Exceptional Value"}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {currentLocale === "es" 
                            ? "Comparado con reservar por separado, ahorras más del 40%"
                            : "Compared to booking separately, you save more than 40%"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Sin Sorpresas" : "No Surprises"}</h4>
                          <p className="text-gray-600 text-sm">
                            {currentLocale === "es" ? "Precio fijo, sin costos ocultos" : "Fixed price, no hidden costs"}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Calidad Premium" : "Premium Quality"}</h4>
                          <p className="text-gray-600 text-sm">
                            {currentLocale === "es" ? "Los mejores servicios incluidos" : "The best services included"}
                          </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{currentLocale === "es" ? "Experiencia Completa" : "Complete Experience"}</h4>
                          <p className="text-gray-600 text-sm">
                            {currentLocale === "es" ? "Todo lo necesario para disfrutar" : "Everything needed to enjoy"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* What's NOT Included Section - Enhanced */}
                {activeSection === "excludes" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-white text-center">
                      <h2 className="text-3xl font-black mb-4">
                        {currentLocale === "es" ? "❌ Gastos Adicionales a Considerar" : "❌ Additional Expenses to Consider"}
                      </h2>
                      <p className="text-xl text-white/90">
                        {currentLocale === "es" 
                          ? "Planifica tu presupuesto con total transparencia"
                          : "Plan your budget with complete transparency"}
                      </p>
                    </div>

                    {/* Not Included Items */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      {tour.notIncludes && tour.notIncludes.length > 0 ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tour.notIncludes.map((item: string | TranslatedText, idx: number) => (
                              <div
                                key={idx}
                                className="group flex items-start gap-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                              >
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                  <X className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-gray-900 font-bold text-lg mb-2">
                                    {getTranslatedText(item, currentLocale)}
                                  </h4>
                                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    {currentLocale === "es" 
                                      ? "Costo adicional que debes considerar en tu presupuesto"
                                      : "Additional cost you should consider in your budget"}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-red-600">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="font-medium">{currentLocale === "es" ? "COSTO EXTRA" : "EXTRA COST"}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Budget Helper */}
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Info className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">
                                  {currentLocale === "es" ? "💡 Consejo de Presupuesto" : "💡 Budget Tip"}
                                </h4>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                  {currentLocale === "es" 
                                    ? "Te recomendamos llevar entre S/50-100 adicionales para gastos personales y entradas opcionales."
                                    : "We recommend bringing an additional S/50-100 for personal expenses and optional entries."}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                  <div className="bg-white/80 rounded-lg p-3 text-center">
                                    <div className="font-bold text-gray-900">S/20-30</div>
                                    <div className="text-gray-600">{currentLocale === "es" ? "Comidas" : "Meals"}</div>
                                  </div>
                                  <div className="bg-white/80 rounded-lg p-3 text-center">
                                    <div className="font-bold text-gray-900">S/15-25</div>
                                    <div className="text-gray-600">{currentLocale === "es" ? "Entradas" : "Entries"}</div>
                                  </div>
                                  <div className="bg-white/80 rounded-lg p-3 text-center">
                                    <div className="font-bold text-gray-900">S/10-20</div>
                                    <div className="text-gray-600">{currentLocale === "es" ? "Souvenirs" : "Souvenirs"}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                    </div>
                  </motion.div>
                )}

                {/* What to Bring Section - Enhanced */}
                {activeSection === "bring" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center">
                      <h2 className="text-3xl font-black mb-4">
                        {currentLocale === "es" ? "🎒 Lista de Equipaje Esencial" : "🎒 Essential Packing List"}
                      </h2>
                      <p className="text-xl text-white/90">
                        {currentLocale === "es" 
                          ? "Prepárate para la aventura con estos elementos indispensables"
                          : "Get ready for adventure with these essential items"}
                      </p>
                    </div>

                    {/* Packing Categories */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      {tour.toBring && tour.toBring.length > 0 ? (
                        <div className="space-y-8">
                          {/* Essential Items */}
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Backpack className="w-5 h-5 text-white" />
                              </div>
                              {currentLocale === "es" ? "Elementos Esenciales" : "Essential Items"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {tour.toBring.map((item: string | TranslatedText, idx: number) => (
                                <div
                                  key={idx}
                                  className="group flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Check className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-gray-900 font-bold mb-2">
                                      {getTranslatedText(item, currentLocale)}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-purple-600">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span className="font-medium">{currentLocale === "es" ? "RECOMENDADO" : "RECOMMENDED"}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Packing Tips */}
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Info className="w-5 h-5 text-white" />
                              </div>
                              {currentLocale === "es" ? "💡 Consejos de Equipaje" : "💡 Packing Tips"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Thermometer className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 mb-1">
                                      {currentLocale === "es" ? "Clima Variable" : "Variable Weather"}
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                      {currentLocale === "es" 
                                        ? "Las temperaturas pueden variar entre 5°C y 25°C durante el día"
                                        : "Temperatures can vary between 5°C and 25°C during the day"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sunrise className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 mb-1">
                                      {currentLocale === "es" ? "Salida Temprana" : "Early Departure"}
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                      {currentLocale === "es" 
                                        ? "Prepara tu equipaje la noche anterior para una salida sin estrés"
                                        : "Pack your gear the night before for a stress-free departure"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Camera className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 mb-1">
                                      {currentLocale === "es" ? "Fotografía" : "Photography"}
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                      {currentLocale === "es" 
                                        ? "Trae baterías extra y tarjetas de memoria adicionales"
                                        : "Bring extra batteries and additional memory cards"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 mb-1">
                                      {currentLocale === "es" ? "Comodidad" : "Comfort"}
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                      {currentLocale === "es" 
                                        ? "Usa ropa cómoda y zapatos con buen agarre"
                                        : "Wear comfortable clothes and shoes with good grip"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Weather Forecast */}
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                              </div>
                              {currentLocale === "es" ? "🌤️ Condiciones Climáticas" : "🌤️ Weather Conditions"}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="bg-white/80 rounded-xl p-4 text-center">
                                <Sunrise className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                <div className="font-bold text-gray-900">06:00 - 12:00</div>
                                <div className="text-sm text-gray-600">5°C - 15°C</div>
                                <div className="text-xs text-gray-500 mt-1">{currentLocale === "es" ? "Fresco" : "Cool"}</div>
                              </div>
                              <div className="bg-white/80 rounded-xl p-4 text-center">
                                <div className="w-8 h-8 mx-auto mb-2 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                                </div>
                                <div className="font-bold text-gray-900">12:00 - 16:00</div>
                                <div className="text-sm text-gray-600">15°C - 25°C</div>
                                <div className="text-xs text-gray-500 mt-1">{currentLocale === "es" ? "Cálido" : "Warm"}</div>
                              </div>
                              <div className="bg-white/80 rounded-xl p-4 text-center">
                                <Sunset className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                <div className="font-bold text-gray-900">16:00 - 18:00</div>
                                <div className="text-sm text-gray-600">10°C - 20°C</div>
                                <div className="text-xs text-gray-500 mt-1">{currentLocale === "es" ? "Templado" : "Mild"}</div>
                              </div>
                            </div>
                          </div>
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
                    </div>
                  </motion.div>
                )}

                {/* Conditions Section - Enhanced */}
                {activeSection === "conditions" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center">
                      <h2 className="text-3xl font-black mb-4">
                        {currentLocale === "es" ? "📋 Términos y Condiciones" : "📋 Terms and Conditions"}
                      </h2>
                      <p className="text-xl text-white/90">
                        {currentLocale === "es" 
                          ? "Información importante para una experiencia sin contratiempos"
                          : "Important information for a smooth experience"}
                      </p>
                    </div>

                    {/* Conditions */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      {tour.conditions && tour.conditions.length > 0 ? (
                        <div className="space-y-8">
                          {/* Main Conditions */}
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              {currentLocale === "es" ? "Condiciones Principales" : "Main Conditions"}
                            </h3>
                            <div className="space-y-4">
                              {tour.conditions.map((condition: string | TranslatedText, idx: number) => (
                                <div
                                  key={idx}
                                  className="group flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-gray-800 font-medium leading-relaxed text-lg">
                                      {getTranslatedText(condition, currentLocale)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Policy Categories */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cancellation Policy */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <X className="w-4 h-4 text-white" />
                                </div>
                                {currentLocale === "es" ? "Política de Cancelación" : "Cancellation Policy"}
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "Cancelación gratuita hasta 24h antes" : "Free cancellation up to 24h before"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "50% de reembolso 12-24h antes" : "50% refund 12-24h before"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <X className="w-4 h-4 text-red-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "Sin reembolso menos de 12h" : "No refund less than 12h"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Safety Policy */}
                            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                {currentLocale === "es" ? "Política de Seguridad" : "Safety Policy"}
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "Seguro de accidentes incluido" : "Accident insurance included"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "Guías certificados en primeros auxilios" : "First aid certified guides"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-gray-700">
                                    {currentLocale === "es" ? "Equipos de seguridad disponibles" : "Safety equipment available"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Important Notes */}
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                            <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-white" />
                              </div>
                              {currentLocale === "es" ? "⚠️ Notas Importantes" : "⚠️ Important Notes"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">
                                    {currentLocale === "es" 
                                      ? "Los horarios pueden variar según condiciones climáticas"
                                      : "Schedules may vary according to weather conditions"}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">
                                    {currentLocale === "es" 
                                      ? "Se requiere un mínimo de 2 personas para confirmar el tour"
                                      : "Minimum of 2 people required to confirm the tour"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">
                                    {currentLocale === "es" 
                                      ? "Menores de edad deben ir acompañados de un adulto"
                                      : "Minors must be accompanied by an adult"}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">
                                    {currentLocale === "es" 
                                      ? "Recomendado para personas en buena condición física"
                                      : "Recommended for people in good physical condition"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                    </div>
                  </motion.div>
                )}

                {/* Transport Options Section - Enhanced */}
                {activeSection === "transport" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-600 to-blue-600 rounded-3xl p-8 text-white text-center">
                      <h2 className="text-3xl font-black mb-4">
                        {currentLocale === "es" ? "🚗 Opciones de Transporte Premium" : "🚗 Premium Transport Options"}
                      </h2>
                      <p className="text-xl text-white/90">
                        {currentLocale === "es" 
                          ? "Viaja con comodidad y seguridad en nuestros vehículos especializados"
                          : "Travel in comfort and safety in our specialized vehicles"}
                      </p>
                    </div>

                    {/* Transport Options */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      {tour.transportOptionIds && tour.transportOptionIds.length > 0 ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {tour.transportOptionIds.map((transport: TransportOption, idx: number) => (
                              <div
                                key={idx}
                                className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                              >
                                {/* Transport Header */}
                                <div className="flex items-center gap-4 mb-6">
                                  <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Car className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-xl mb-2">
                                      {transport.vehicle || "Transporte Turístico"}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                                          transport.type === "Premium"
                                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {transport.type === "Premium" && <Crown className="w-3 h-3 inline mr-1" />}
                                        {transport.type || "Básico"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Transport Image */}
                                {transport.imageUrl && (
                                  <div className="relative h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
                                    <Image
                                      src={transport.imageUrl || "/placeholder.svg?height=200&width=400"}
                                      alt={transport.vehicle || "Transport"}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                                        <p className="text-gray-900 font-bold text-sm">
                                          {transport.vehicle || "Vehículo Turístico"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Services */}
                                {transport.services && transport.services.length > 0 && (
                                  <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                      <Check className="w-5 h-5 text-green-600" />
                                      {currentLocale === "es" ? "Servicios Incluidos:" : "Included Services:"}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                      {transport.services.map((service: string, serviceIdx: number) => (
                                        <div
                                          key={serviceIdx}
                                          className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-blue-100"
                                        >
                                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-gray-700 font-medium">{service}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Transport Features */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                  <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-white/80 rounded-lg">
                                      <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                      <div className="text-sm font-bold text-gray-900">2-15</div>
                                      <div className="text-xs text-gray-600">{currentLocale === "es" ? "Pasajeros" : "Passengers"}</div>
                                    </div>
                                    <div className="p-3 bg-white/80 rounded-lg">
                                      <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                      <div className="text-sm font-bold text-gray-900">100%</div>
                                      <div className="text-xs text-gray-600">{currentLocale === "es" ? "Seguro" : "Safe"}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Transport Benefits */}
                          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
                            <h4 className="font-bold text-gray-900 text-xl mb-6 text-center">
                              {currentLocale === "es" ? "🌟 Beneficios de Nuestro Transporte" : "🌟 Our Transport Benefits"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="text-center p-4 bg-white/80 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h5 className="font-bold text-gray-900 mb-2">
                                  {currentLocale === "es" ? "Seguridad Total" : "Total Safety"}
                                </h5>
                                <p className="text-gray-600 text-sm">
                                  {currentLocale === "es" 
                                    ? "Vehículos con mantenimiento regular y conductores certificados"
                                    : "Vehicles with regular maintenance and certified drivers"}
                                </p>
                              </div>
                              <div className="text-center p-4 bg-white/80 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Award className="w-6 h-6 text-white" />
                                </div>
                                <h5 className="font-bold text-gray-900 mb-2">
                                  {currentLocale === "es" ? "Comodidad Premium" : "Premium Comfort"}
                                </h5>
                                <p className="text-gray-600 text-sm">
                                  {currentLocale === "es" 
                                    ? "Asientos ergonómicos y aire acondicionado para tu comodidad"
                                    : "Ergonomic seats and air conditioning for your comfort"}
                                </p>
                              </div>
                              <div className="text-center p-4 bg-white/80 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h5 className="font-bold text-gray-900 mb-2">
                                  {currentLocale === "es" ? "Puntualidad" : "Punctuality"}
                                </h5>
                                <p className="text-gray-600 text-sm">
                                  {currentLocale === "es" 
                                    ? "Recojo puntual desde tu hotel o punto de encuentro"
                                    : "Punctual pickup from your hotel or meeting point"}
                                </p>
                              </div>
                            </div>
                          </div>
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
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Sidebar - Enhanced */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Quick Facts */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" />
                      {currentLocale === "es" ? "Datos Rápidos" : "Quick Facts"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">{currentLocale === "es" ? "Región" : "Region"}</span>
                        <span className="font-bold text-gray-900">{tour.region}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">{currentLocale === "es" ? "Categoría" : "Category"}</span>
                        <span className="font-bold text-gray-900">{tour.category}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">{currentLocale === "es" ? "Dificultad" : "Difficulty"}</span>
                        <span className="font-bold text-gray-900">{tour.difficulty}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 text-sm">{currentLocale === "es" ? "Tipo" : "Package"}</span>
                        <span className="font-bold text-gray-900">{tour.packageType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Summary */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      {currentLocale === "es" ? "Reseñas" : "Reviews"}
                    </h3>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-black text-gray-900 mb-2">{tour.rating}/5</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(tour.rating) ? "text-yellow-500 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {tour.reviews} {currentLocale === "es" ? "reseñas" : "reviews"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-3">{stars}</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{
                                width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : stars === 2 ? 2 : 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {stars === 5 ? "70%" : stars === 4 ? "20%" : stars === 3 ? "8%" : stars === 2 ? "2%" : "0%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Policies */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      {currentLocale === "es" ? "Seguridad y Políticas" : "Safety & Policies"}
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {currentLocale === "es" ? "Cancelación gratuita" : "Free cancellation"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-medium">
                          {currentLocale === "es" ? "Seguro incluido" : "Insurance included"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700 font-medium">
                          {currentLocale === "es" ? "Guía certificado" : "Certified guide"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                    </h3>
                    <p className="text-white/90 mb-4 text-sm leading-relaxed">
                      {currentLocale === "es"
                        ? "Nuestro equipo está disponible 24/7 para resolver todas tus dudas"
                        : "Our team is available 24/7 to answer all your questions"}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <Button
                        onClick={handleWhatsAppContact}
                        className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleWhatsAppContact}
                      className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 rounded-xl"
                    >
                      💬 {currentLocale === "es" ? "Contactar ahora" : "Contact Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
        <RelatedToursSection></RelatedToursSection>
      </div>
      
    </div>
    
  )
}
