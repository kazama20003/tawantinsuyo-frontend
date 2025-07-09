"use client"

import { Button } from "@/components/ui/button"
import {
  Clock,
  Star,
  Mountain,
  MapPin,
  Users,
  Calendar,
  Check,
  Camera,
  ArrowRight,
  ArrowLeft,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Award,
  Globe,
  Plane,
  Route,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import type { Tour, TourCategory, Difficulty, TransportOption } from "@/types/tour"
import { getTranslation, type Locale } from "@/lib/i18n"

interface ImageData {
  url: string
  alt: string
  type: string
}

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  imageUrl?: string
  route?: Array<{
    location: string
    description?: string
    imageUrl?: string
  }>
  meals?: string[]
  accommodation?: string
}

export default function TourDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const slug = params.slug as string
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allImages, setAllImages] = useState<ImageData[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

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

  // Fetch tour details
  const fetchTour = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/tours/slug/${slug}`)
      let tourData = response.data

      // Validar estructura de respuesta
      if (tourData && typeof tourData === "object" && !Array.isArray(tourData)) {
        if (tourData.data) {
          tourData = tourData.data
        } else if (tourData.tour) {
          tourData = tourData.tour
        }
      }

      if (!tourData || !tourData._id) {
        setError(t("error"))
        return
      }

      console.log("Tour cargado:", tourData)
      setTour(tourData)

      // Collect all images for gallery
      const images: ImageData[] = []

      // Main image
      if (tourData.imageUrl) {
        images.push({ url: tourData.imageUrl, alt: tourData.title, type: "main" })
      }

      // Itinerary images
      if (tourData.itinerary) {
        tourData.itinerary.forEach((day: ItineraryDay) => {
          if (day.imageUrl) {
            images.push({ url: day.imageUrl, alt: `${t("day")} ${day.day}: ${day.title}`, type: "day" })
          }
          if (day.route) {
            day.route.forEach((point: { imageUrl?: string; location: string }) => {
              if (point.imageUrl) {
                images.push({ url: point.imageUrl, alt: point.location, type: "route" })
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
  }, [slug, t])

  useEffect(() => {
    fetchTour()
  }, [fetchTour])

  // Scroll to booking section if hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#booking") {
      setTimeout(() => {
        const bookingElement = document.getElementById("booking-section")
        if (bookingElement) {
          bookingElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 1000)
    }
  }, [])

  const getCategoryColor = useCallback((category: TourCategory): string => {
    const colors = {
      Aventura: "bg-red-100 text-red-700 border-red-300",
      Cultural: "bg-purple-100 text-purple-700 border-purple-300",
      Relajación: "bg-green-100 text-green-700 border-green-300",
      Naturaleza: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Trekking: "bg-orange-100 text-orange-700 border-orange-300",
      Panoramico: "bg-blue-100 text-blue-700 border-blue-300",
      "Transporte Turistico": "bg-gray-100 text-gray-700 border-gray-300",
    }
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-300"
  }, [])

  const getDifficultyColor = useCallback((difficulty: Difficulty): string => {
    switch (difficulty) {
      case "Facil":
        return "bg-green-100 text-green-700 border-green-300"
      case "Moderado":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "Difícil":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }, [])

  const toggleDay = useCallback(
    (dayNumber: number): void => {
      setExpandedDay(expandedDay === dayNumber ? null : dayNumber)
    },
    [expandedDay],
  )

  const handleBooking = useCallback((): void => {
    // Handle booking logic here
    console.log("Booking initiated")
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-32 sm:pt-40 md:pt-48 lg:pt-52">
        <div className="text-center p-4">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{t("loading")}</h2>
          <p className="text-sm md:text-base text-gray-600">{t("preparingInformation")}</p>
        </div>
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center pt-32 sm:pt-40 md:pt-48 lg:pt-52 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{t("tourNotFound")}</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">{error || t("tourNotFoundDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("goBack")}
            </Button>
            <Link href={getLocalizedLink("/tours")}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base">
                {t("viewAllTours")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 pt-32 sm:pt-40 md:pt-48 lg:pt-52">
      {/* Image Gallery Modal */}
      {isGalleryOpen && allImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <X className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-2 sm:left-4 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-2 sm:right-4 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={allImages[currentImageIndex].url || "/placeholder.svg"}
                alt={allImages[currentImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb - Optimizado */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 md:py-4">
          <nav className="flex items-center gap-1 md:gap-2 text-xs md:text-sm mb-2 md:mb-3 overflow-x-auto">
            <Link
              href={getLocalizedLink("/")}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span className="text-sm md:text-base">🏠</span>
              <span className="hidden sm:inline">{t("home")}</span>
            </Link>
            <span className="text-gray-400 text-xs md:text-sm">/</span>
            <Link
              href={getLocalizedLink("/tours")}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span className="text-sm md:text-base">🗺️</span>
              <span className="hidden sm:inline">{t("tours")}</span>
            </Link>
            <span className="text-gray-400 text-xs md:text-sm">/</span>
            <span className="text-gray-600 font-medium truncate text-xs md:text-sm">{tour.title}</span>
          </nav>
          {/* Quick Info Bar - Mejorado para móvil */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2 bg-blue-50 px-2 md:px-3 py-1 rounded-full border border-blue-200">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                {tour.region}, {tour.location}
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-green-50 px-2 md:px-3 py-1 rounded-full border border-green-200">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-yellow-50 px-2 md:px-3 py-1 rounded-full border border-yellow-200">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-600 fill-current flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                {tour.rating} ({tour.reviews})
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-purple-50 px-2 md:px-3 py-1 rounded-full border border-purple-200">
              <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{t("flexibleDates")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Optimizado */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
          {/* Title Section - Mejorado para móvil */}
          <div className="text-center mb-4 md:mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
              <span className="text-xs md:text-sm font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 md:px-3 py-1 rounded-full border border-blue-200">
                {tour.region}
              </span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="text-xs md:text-sm text-gray-600 bg-gray-50 px-2 md:px-3 py-1 rounded-full border border-gray-200">
                📍 {tour.location}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-black leading-tight mb-3 md:mb-4 px-2">
              {tour.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto px-2">
              {tour.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Left - Images */}
            <div className="lg:col-span-2">
              <div
                className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-black group cursor-pointer"
                onClick={() =>
                  openImageGallery(tour.imageUrl || "/placeholder.svg?height=500&width=800&text=Tour+Image")
                }
              >
                <Image
                  src={tour.imageUrl || "/placeholder.svg?height=500&width=800&text=Tour+Image"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {/* Gallery Indicator */}
                <div className="absolute top-3 md:top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-2 border border-black md:border-2 shadow-lg">
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold text-black">
                      <Camera className="w-3 h-3 md:w-4 md:h-4" />
                      <span>
                        {allImages.length} {t("photos")}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Top Badges - Optimizado para móvil */}
                <div className="absolute top-12 md:top-20 left-3 md:left-6 flex flex-wrap gap-2 md:gap-3 max-w-[70%] md:max-w-[60%]">
                  <div
                    className={`px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg backdrop-blur-sm ${getCategoryColor(tour.category)}`}
                  >
                    {tour.category.toUpperCase()}
                  </div>
                  <div
                    className={`px-2 md:px-3 py-1 rounded-md md:rounded-lg font-bold text-xs border border-white shadow-lg backdrop-blur-sm ${getDifficultyColor(tour.difficulty)}`}
                  >
                    {tour.difficulty}
                  </div>
                  {tour.packageType === "Premium" && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg">
                      ✨ PREMIUM
                    </div>
                  )}
                  {tour.featured && (
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg">
                      🔥 {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                    </div>
                  )}
                </div>
                {/* Actions - Optimizado para móvil */}
                <div className="absolute top-3 md:top-6 right-3 md:right-6 flex gap-2 md:gap-3">
                  <button className="w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full border border-black md:border-2 shadow-lg flex items-center justify-center hover:bg-white transition-colors group/share">
                    <Share2 className="w-3 h-3 md:w-5 md:h-5 text-black group-hover/share:scale-110 transition-transform" />
                  </button>
                  <button className="w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full border border-black md:border-2 shadow-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors group/heart">
                    <Heart className="w-3 h-3 md:w-5 md:h-5 text-black group-hover/heart:text-red-500 transition-colors" />
                  </button>
                </div>
                {/* Bottom Info - Optimizado para móvil */}
                <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border border-black md:border-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                        <div>
                          <div className="font-black text-black text-sm md:text-lg">{tour.rating}</div>
                          <div className="text-xs text-gray-600">
                            {tour.reviews} {t("reviews")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border border-black md:border-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <div>
                          <div className="font-bold text-xs md:text-sm">{tour.location}</div>
                          <div className="text-xs text-blue-200">{tour.region}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-600 text-white rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 border border-black md:border-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <div>
                          <div className="font-bold text-xs md:text-sm">{tour.duration}</div>
                          <div className="text-xs text-green-200">{t("duration")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Highlights Section - Optimizado para móvil */}
              <div className="mt-4 md:mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-4 md:p-6 lg:p-8">
                <h3 className="text-lg md:text-2xl font-black text-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                  <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-5 md:h-5 text-white" />
                  </span>
                  {t("whyChooseThisTour")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-xl border border-gray-200 md:border-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm md:text-base">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right - Booking Card - Optimizado */}
            <div id="booking-section" className="lg:col-span-1">
              <div className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-4 md:p-6 lg:p-8 shadow-xl lg:sticky lg:top-8">
                {/* Price Section */}
                <div className="text-center mb-4 md:mb-6 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl border border-gray-200 md:border-2">
                  <div className="flex items-baseline justify-center gap-2 md:gap-3 mb-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-blue-600">
                      S/{tour.price}
                    </span>
                    {tour.originalPrice && (
                      <span className="text-lg md:text-xl text-gray-500 line-through">S/{tour.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mb-2">{t("perPerson")}</p>
                  {tour.originalPrice && (
                    <div className="bg-green-100 text-green-700 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold inline-block border border-green-300">
                      💰 {t("saveAmount")} S/{tour.originalPrice - tour.price}!
                    </div>
                  )}
                  {/* Flexible Dates Info */}
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-700 text-sm">{t("flexibleDates")}</span>
                      </div>
                      <p className="text-xs text-purple-600 text-center">{t("availableAllYear")}</p>
                      <p className="text-xs text-purple-600 text-center">{t("bookAnyTime")}</p>
                    </div>
                  </div>
                  {/* Tourist Info */}
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Globe className="w-3 h-3" />
                        <span>{t("foreignTouristsWelcome")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Plane className="w-3 h-3" />
                        <span>{t("nationalsWelcome")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Quick Info */}
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm md:text-base">{t("duration")}</div>
                      <div className="text-gray-600 text-xs md:text-sm">{tour.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Mountain className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm md:text-base">{t("difficulty")}</div>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(tour.difficulty)}`}
                      >
                        {tour.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm md:text-base">{t("groupSize")}</div>
                      <div className="text-gray-600 text-xs md:text-sm">2-15 {t("people")}</div>
                    </div>
                  </div>
                </div>
                {/* Transport Selection */}
                {tour.transportOptionIds && tour.transportOptionIds.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <h4 className="font-bold text-black mb-3 flex items-center gap-2 text-sm md:text-base">
                      🚐 {t("transportOptions")}
                    </h4>
                    <div className="space-y-2">
                      {tour.transportOptionIds.map((transport) => (
                        <button
                          key={transport._id}
                          onClick={() => setSelectedTransport(transport)}
                          className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                            selectedTransport?._id === transport._id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-black text-sm md:text-base">{transport.vehicle}</div>
                              <div className="text-xs md:text-sm text-gray-600">{transport.type}</div>
                            </div>
                            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                              {selectedTransport?._id === transport._id && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Booking Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-3 md:py-4 text-sm md:text-lg rounded-xl md:rounded-2xl border-2 border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    🎯 {t("bookNow")}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                      title={t("whatsapp")}
                    >
                      <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                      title={t("call")}
                    >
                      <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                      title={t("email")}
                    >
                      <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </div>
                {/* Trust Indicators */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
                    <div className="p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-lg md:text-xl font-black text-green-600">✓</div>
                      <div className="text-xs text-gray-600">{t("freeCancellation")}</div>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-lg md:text-xl font-black text-blue-600">24/7</div>
                      <div className="text-xs text-gray-600">{t("supportIncluded")}</div>
                    </div>
                    <div className="p-2 md:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-lg md:text-xl font-black text-yellow-600">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto" />
                      </div>
                      <div className="text-xs text-gray-600">{t("secure100")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Optimizado */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-black overflow-hidden shadow-xl">
              {/* Tab Headers */}
              <div className="flex border-b-2 border-black bg-gray-50 overflow-x-auto">
                {[
                  { id: "overview", label: currentLocale === "es" ? "Resumen" : "Overview", icon: "📋" },
                  { id: "itinerary", label: currentLocale === "es" ? "Itinerario" : "Itinerary", icon: "🗺️" },
                  { id: "includes", label: currentLocale === "es" ? "Incluye" : "Includes", icon: "✅" },
                  { id: "transport", label: currentLocale === "es" ? "Transporte" : "Transport", icon: "🚐" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 px-3 md:px-4 py-3 md:py-4 font-bold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-black hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="mr-1 md:mr-2">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
              {/* Tab Content */}
              <div className="p-4 md:p-6 lg:p-8">
                {activeTab === "overview" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-black mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                        <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 md:w-5 md:h-5 text-white" />
                        </span>
                        {t("tourDescription")}
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 md:border-2">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-lg mb-3 md:mb-4">{tour.subtitle}</p>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {t("thisExperienceWillTake")} {tour.region}.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200 md:border-2">
                        <h4 className="font-black text-black mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                          {t("generalInformation")}
                        </h4>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600 text-sm md:text-base">{t("duration")}:</span>
                            <span className="font-bold text-black text-sm md:text-base">{tour.duration}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600 text-sm md:text-base">{t("difficulty")}:</span>
                            <span
                              className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(tour.difficulty)}`}
                            >
                              {tour.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600 text-sm md:text-base">{t("category")}:</span>
                            <span className="font-bold text-black text-sm md:text-base">{tour.category}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600 text-sm md:text-base">{t("region")}:</span>
                            <span className="font-bold text-black text-sm md:text-base">{tour.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-200 md:border-2">
                        <h4 className="font-black text-black mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                          <Users className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                          {t("groupSize")}
                        </h4>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                            <span className="text-gray-600 text-sm md:text-base">{t("groupSize")}:</span>
                            <span className="font-bold text-black text-sm md:text-base">2-15 {t("people")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "itinerary" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-black mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                        <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Route className="w-3 h-3 md:w-5 md:h-5 text-white" />
                        </span>
                        {t("dayByDay")} - {t("timeline")}
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 md:border-2">
                        {tour.itinerary && tour.itinerary.length > 0 ? (
                          <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 md:left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 hidden sm:block"></div>

                            {tour.itinerary.map((day) => (
                              <div key={day.day} className="relative mb-6 md:mb-8 last:mb-0">
                                {/* Day Header with Timeline Dot */}
                                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                  {/* Timeline Dot */}
                                  <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 md:border-4 border-white">
                                    <span className="text-white font-black text-xs md:text-sm">{day.day}</span>
                                  </div>

                                  {/* Day Title */}
                                  <div className="flex-1">
                                    <h4 className="font-black text-black text-base md:text-xl mb-1">
                                      {t("day")} {day.day}: {day.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm md:text-base">{day.description}</p>
                                  </div>

                                  {/* Expand Button */}
                                  <button
                                    onClick={() => toggleDay(day.day)}
                                    className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-2 border-gray-300 shadow-lg flex items-center justify-center hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                                  >
                                    {expandedDay === day.day ? (
                                      <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                                    )}
                                  </button>
                                </div>

                                {/* Expanded Content */}
                                {expandedDay === day.day && (
                                  <div className="ml-8 md:ml-12 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    {/* Activities */}
                                    {day.activities && day.activities.length > 0 && (
                                      <div className="bg-white rounded-xl p-4 md:p-6 border-2 border-blue-200 shadow-sm">
                                        <h5 className="font-bold text-black text-sm md:text-base mb-3 flex items-center gap-2">
                                          <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                          </span>
                                          {t("activities")}
                                        </h5>
                                        <ul className="space-y-2">
                                          {day.activities.map((activity, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-gray-700 text-sm md:text-base"
                                            >
                                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                              {activity}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Route Map */}
                                    {day.route && day.route.length > 0 && (
                                      <div className="bg-white rounded-xl p-4 md:p-6 border-2 border-green-200 shadow-sm">
                                        <h5 className="font-bold text-black text-sm md:text-base mb-4 flex items-center gap-2">
                                          <span className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                            <MapPin className="w-3 h-3 text-white" />
                                          </span>
                                          {t("route")} - {currentLocale === "es" ? "Mapa del Recorrido" : "Route Map"}
                                        </h5>
                                        <div className="relative">
                                          {/* Route Timeline */}
                                          <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-400 to-blue-400"></div>

                                          {day.route.map((point, idx) => (
                                            <div key={idx} className="relative flex items-start gap-4 mb-4 last:mb-0">
                                              {/* Route Point */}
                                              <div className="relative z-10 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                                <span className="text-white font-bold text-xs">{idx + 1}</span>
                                              </div>

                                              {/* Point Info */}
                                              <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <h6 className="font-bold text-black text-sm md:text-base mb-1">
                                                  📍 {point.location}
                                                </h6>
                                                {point.description && (
                                                  <p className="text-gray-600 text-xs md:text-sm">
                                                    {point.description}
                                                  </p>
                                                )}
                                                {point.imageUrl && (
                                                  <div
                                                    className="mt-2 relative h-20 md:h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => openImageGallery(point.imageUrl!)}
                                                  >
                                                    <Image
                                                      src={point.imageUrl || "/placeholder.svg"}
                                                      alt={point.location}
                                                      fill
                                                      className="object-cover"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Meals */}
                                    {day.meals && day.meals.length > 0 && (
                                      <div className="bg-white rounded-xl p-4 md:p-6 border-2 border-orange-200 shadow-sm">
                                        <h5 className="font-bold text-black text-sm md:text-base mb-3 flex items-center gap-2">
                                          <span className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">🍽️</span>
                                          </span>
                                          {t("meals")}
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                          {day.meals.map((meal, idx) => (
                                            <div
                                              key={idx}
                                              className="bg-orange-50 rounded-lg p-2 border border-orange-200"
                                            >
                                              <span className="text-orange-700 font-medium text-sm">{meal}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Accommodation */}
                                    {day.accommodation && (
                                      <div className="bg-white rounded-xl p-4 md:p-6 border-2 border-purple-200 shadow-sm">
                                        <h5 className="font-bold text-black text-sm md:text-base mb-3 flex items-center gap-2">
                                          <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">🏨</span>
                                          </span>
                                          {t("accommodation")}
                                        </h5>
                                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                          <p className="text-purple-700 font-medium text-sm md:text-base">
                                            {day.accommodation}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Day Image */}
                                    {day.imageUrl && (
                                      <div
                                        className="relative h-32 md:h-48 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-gray-200"
                                        onClick={() => openImageGallery(day.imageUrl!)}
                                      >
                                        <Image
                                          src={day.imageUrl || "/placeholder.svg"}
                                          alt={`${t("day")} ${day.day}: ${day.title}`}
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 right-2">
                                          <p className="text-white font-bold text-xs md:text-sm bg-black bg-opacity-50 rounded px-2 py-1">
                                            {t("day")} {day.day} - {day.title}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Route className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">
                              {currentLocale === "es" ? "Itinerario no disponible" : "Itinerary not available"}
                            </p>
                            <p className="text-sm">
                              {currentLocale === "es"
                                ? "El itinerario detallado se proporcionará al momento de la reserva"
                                : "Detailed itinerary will be provided upon booking"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "includes" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-black mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                        <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 md:w-5 md:h-5 text-white" />
                        </span>
                        {t("includes")}
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 md:border-2">
                        {tour.includes && tour.includes.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {tour.includes.map((include, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                              >
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm md:text-base">{include}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Check className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">
                              {currentLocale === "es" ? "Inclusiones no disponibles" : "Inclusions not available"}
                            </p>
                            <p className="text-sm">
                              {currentLocale === "es"
                                ? "La información detallada se proporcionará al momento de la reserva"
                                : "Detailed information will be provided upon booking"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "transport" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-lg md:text-2xl font-black text-black mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                        <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Plane className="w-3 h-3 md:w-5 md:h-5 text-white" />
                        </span>
                        {t("transport")}
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 md:border-2">
                        {tour.transportOptionIds && tour.transportOptionIds.length > 0 ? (
                          <div className="space-y-4">
                            {tour.transportOptionIds.map((transport, idx) => (
                              <div
                                key={transport._id}
                                className="bg-white rounded-xl p-4 md:p-6 border-2 border-gray-200 shadow-sm"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-black text-sm md:text-base">
                                      🚐 {transport.vehicle}
                                    </h4>
                                    <p className="text-gray-600 text-xs md:text-sm">{transport.type}</p>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <p className="text-gray-600 text-sm md:text-base">
                                    {currentLocale === "es"
                                      ? "Transporte cómodo y seguro para tu tour. Incluye recojo desde tu hotel y traslados durante todo el recorrido."
                                      : "Comfortable and safe transport for your tour. Includes pickup from your hotel and transfers throughout the journey."}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Plane className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">
                              {currentLocale === "es" ? "Transporte no especificado" : "Transport not specified"}
                            </p>
                            <p className="text-sm">
                              {currentLocale === "es"
                                ? "Los detalles del transporte se coordinarán al momento de la reserva"
                                : "Transport details will be coordinated upon booking"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
