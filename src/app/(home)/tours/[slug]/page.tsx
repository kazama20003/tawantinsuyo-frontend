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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-blue-50">
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

      {/* CONTENIDO PRINCIPAL - SIN ESPACIOS SUPERIORES */}
      <div className="w-full">
        {/* Breadcrumb - PEGADO DIRECTAMENTE AL HEADER */}
        <section className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <nav className="flex items-center gap-2 md:gap-3 text-sm md:text-base mb-2 md:mb-3 overflow-x-auto">
              <Link
                href={getLocalizedLink("/")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-base md:text-lg">🏠</span>
                <span className="hidden sm:inline">{t("home")}</span>
              </Link>
              <span className="text-gray-400 text-sm md:text-base">/</span>
              <Link
                href={getLocalizedLink("/tours")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-base md:text-lg">🗺️</span>
                <span className="hidden sm:inline">{t("tours")}</span>
              </Link>
              <span className="text-gray-400 text-sm md:text-base">/</span>
              <span className="text-gray-600 font-medium truncate text-sm md:text-base max-w-xs md:max-w-md lg:max-w-lg">
                {tour.title}
              </span>
            </nav>

            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2 bg-blue-50 px-2 md:px-3 py-1 md:py-2 rounded-full border border-blue-200">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {tour.region}, {tour.location}
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-green-50 px-2 md:px-3 py-1 md:py-2 rounded-full border border-green-200">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-yellow-50 px-2 md:px-3 py-1 md:py-2 rounded-full border border-yellow-200">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-600 fill-current flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {tour.rating} ({tour.reviews})
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-purple-50 px-2 md:px-3 py-1 md:py-2 rounded-full border border-purple-200">
                <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{t("flexibleDates")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - SIN ESPACIO SUPERIOR */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
            {/* Title Section */}
            <div className="text-center mb-6 md:mb-8 lg:mb-12">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
                <span className="text-xs md:text-sm font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-3 md:px-4 py-1 md:py-2 rounded-full border border-blue-200">
                  {tour.region}
                </span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-xs md:text-sm text-gray-600 bg-gray-50 px-3 md:px-4 py-1 md:py-2 rounded-full border border-gray-200">
                  📍 {tour.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-black leading-tight mb-4 md:mb-6 px-4">
                {tour.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto px-4">
                {tour.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
              {/* Left - Images */}
              <div className="lg:col-span-2">
                <div
                  className="relative h-80 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-black group cursor-pointer"
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
                  <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 border border-black md:border-2 shadow-lg">
                      <div className="flex items-center gap-2 text-sm md:text-base font-bold text-black">
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                        <span>
                          {allImages.length} {t("photos")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-16 md:top-24 left-4 md:left-6 flex flex-wrap gap-2 md:gap-3 max-w-[70%] md:max-w-[60%]">
                    <div
                      className={`px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg backdrop-blur-sm ${getCategoryColor(tour.category)}`}
                    >
                      {tour.category.toUpperCase()}
                    </div>
                    <div
                      className={`px-3 md:px-4 py-1 md:py-2 rounded-md md:rounded-lg font-bold text-xs md:text-sm border border-white shadow-lg backdrop-blur-sm ${getDifficultyColor(tour.difficulty)}`}
                    >
                      {tour.difficulty}
                    </div>
                    {tour.packageType === "Premium" && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg">
                        ✨ PREMIUM
                      </div>
                    )}
                    {tour.featured && (
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-xs md:text-sm border border-white md:border-2 shadow-lg">
                        🔥 {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 flex gap-2 md:gap-3">
                    <button className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full border border-black md:border-2 shadow-lg flex items-center justify-center hover:bg-white transition-colors group/share">
                      <Share2 className="w-4 h-4 md:w-5 md:h-5 text-black group-hover/share:scale-110 transition-transform" />
                    </button>
                    <button className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full border border-black md:border-2 shadow-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors group/heart">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-black group-hover/heart:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 border border-black md:border-2 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
                          <div>
                            <div className="font-black text-black text-base md:text-lg">{tour.rating}</div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {tour.reviews} {t("reviews")}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 border border-black md:border-2 shadow-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                          <div>
                            <div className="font-bold text-sm md:text-base">{tour.location}</div>
                            <div className="text-xs md:text-sm text-blue-200">{tour.region}</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-600 text-white rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 border border-black md:border-2 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 md:w-5 md:h-5" />
                          <div>
                            <div className="font-bold text-sm md:text-base">{tour.duration}</div>
                            <div className="text-xs md:text-sm text-green-200">{t("duration")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="mt-6 md:mt-8 lg:mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-6 md:p-8 lg:p-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                    <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </span>
                    {t("whyChooseThisTour")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {tour.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-xl border border-gray-200 md:border-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium text-sm md:text-base lg:text-lg">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Booking Card */}
              <div id="booking-section" className="lg:col-span-1">
                <div className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-6 md:p-8 shadow-xl lg:sticky lg:top-8">
                  {/* Price Section */}
                  <div className="text-center mb-6 md:mb-8 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl border border-gray-200 md:border-2">
                    <div className="flex items-baseline justify-center gap-3 md:gap-4 mb-3">
                      <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-600">
                        S/{tour.price}
                      </span>
                      {tour.originalPrice && (
                        <span className="text-xl md:text-2xl text-gray-500 line-through">S/{tour.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-base md:text-lg text-gray-600 mb-3">{t("perPerson")}</p>
                    {tour.originalPrice && (
                      <div className="bg-green-100 text-green-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold inline-block border border-green-300">
                        💰 {t("saveAmount")} S/{tour.originalPrice - tour.price}!
                      </div>
                    )}

                    {/* Flexible Dates Info */}
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <CalendarDays className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-purple-700 text-base">{t("flexibleDates")}</span>
                        </div>
                        <p className="text-sm text-purple-600 text-center mb-1">{t("availableAllYear")}</p>
                        <p className="text-sm text-purple-600 text-center">{t("bookAnyTime")}</p>
                      </div>
                    </div>

                    {/* Tourist Info */}
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Globe className="w-4 h-4" />
                          <span>{t("foreignTouristsWelcome")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <Plane className="w-4 h-4" />
                          <span>{t("nationalsWelcome")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-base md:text-lg">{t("duration")}</div>
                        <div className="text-gray-600 text-sm md:text-base">{tour.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Mountain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-base md:text-lg">{t("difficulty")}</div>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(tour.difficulty)}`}
                        >
                          {tour.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-base md:text-lg">{t("groupSize")}</div>
                        <div className="text-gray-600 text-sm md:text-base">2-15 {t("people")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Transport Selection */}
                  {tour.transportOptionIds && tour.transportOptionIds.length > 0 && (
                    <div className="mb-6 md:mb-8">
                      <h4 className="font-bold text-black mb-4 flex items-center gap-2 text-base md:text-lg">
                        🚐 {t("transportOptions")}
                      </h4>
                      <div className="space-y-3">
                        {tour.transportOptionIds.map((transport) => (
                          <button
                            key={transport._id}
                            onClick={() => setSelectedTransport(transport)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                              selectedTransport?._id === transport._id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-black text-base md:text-lg">{transport.vehicle}</div>
                                <div className="text-sm md:text-base text-gray-600">{transport.type}</div>
                              </div>
                              <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                {selectedTransport?._id === transport._id && (
                                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Buttons */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleBooking}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black py-4 md:py-6 text-base md:text-lg lg:text-xl rounded-xl md:rounded-2xl border-2 border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      🎯 {t("bookNow")}
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                    </Button>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                        title={t("whatsapp")}
                      >
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                        title={t("call")}
                      >
                        <Phone className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center bg-transparent"
                        title={t("email")}
                      >
                        <Mail className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                      <div className="p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xl md:text-2xl font-black text-green-600">✓</div>
                        <div className="text-xs md:text-sm text-gray-600">{t("freeCancellation")}</div>
                      </div>
                      <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xl md:text-2xl font-black text-blue-600">24/7</div>
                        <div className="text-xs md:text-sm text-gray-600">{t("supportIncluded")}</div>
                      </div>
                      <div className="p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-xl md:text-2xl font-black text-yellow-600">
                          <Shield className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">{t("secure100")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
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
                      className={`flex-1 min-w-0 px-4 md:px-6 py-4 md:py-6 font-bold text-sm sm:text-base md:text-lg transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-black hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <span className="mr-2 md:mr-3">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8 lg:p-12">
                  {activeTab === "overview" && (
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                          <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </span>
                          {t("tourDescription")}
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 md:border-2">
                          <p className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl mb-4 md:mb-6">
                            {tour.subtitle}
                          </p>
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg">
                            {t("thisExperienceWillTake")} {tour.region}.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-blue-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-200 md:border-2">
                          <h4 className="font-black text-black mb-4 md:mb-6 flex items-center gap-2 text-base md:text-lg">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            {t("generalInformation")}
                          </h4>
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-600 text-sm md:text-base">{t("duration")}:</span>
                              <span className="font-bold text-black text-sm md:text-base">{tour.duration}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-600 text-sm md:text-base">{t("difficulty")}:</span>
                              <span
                                className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold ${getDifficultyColor(tour.difficulty)}`}
                              >
                                {tour.difficulty}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-600 text-sm md:text-base">{t("category")}:</span>
                              <span className="font-bold text-black text-sm md:text-base">{tour.category}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-600 text-sm md:text-base">{t("region")}:</span>
                              <span className="font-bold text-black text-sm md:text-base">{tour.region}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-green-200 md:border-2">
                          <h4 className="font-black text-black mb-4 md:mb-6 flex items-center gap-2 text-base md:text-lg">
                            <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            {t("groupSize")}
                          </h4>
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                              <span className="text-gray-600 text-sm md:text-base">{t("groupSize")}:</span>
                              <span className="font-bold text-black text-sm md:text-base">2-15 {t("people")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "itinerary" && (
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                          <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Route className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </span>
                          {t("dayByDay")} - {t("timeline")}
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 md:border-2">
                          {tour.itinerary && tour.itinerary.length > 0 ? (
                            <div className="relative">
                              {/* Timeline Line */}
                              <div className="absolute left-6 md:left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 hidden sm:block"></div>

                              {tour.itinerary.map((day) => (
                                <div key={day.day} className="relative mb-8 md:mb-12 last:mb-0">
                                  {/* Day Header with Timeline Dot */}
                                  <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                                    {/* Timeline Dot */}
                                    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                      <span className="text-white font-black text-sm md:text-lg">{day.day}</span>
                                    </div>

                                    {/* Day Title */}
                                    <div className="flex-1">
                                      <h4 className="font-black text-black text-lg md:text-xl lg:text-2xl mb-2">
                                        {t("day")} {day.day}: {day.title}
                                      </h4>
                                      <p className="text-gray-600 text-sm md:text-base lg:text-lg">{day.description}</p>
                                    </div>

                                    {/* Expand Button */}
                                    <button
                                      onClick={() => toggleDay(day.day)}
                                      className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 border-gray-300 shadow-lg flex items-center justify-center hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                                    >
                                      {expandedDay === day.day ? (
                                        <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Expanded Content */}
                                  {expandedDay === day.day && (
                                    <div className="ml-12 md:ml-16 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                      {/* Activities */}
                                      {day.activities && day.activities.length > 0 && (
                                        <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-blue-200 shadow-sm">
                                          <h5 className="font-bold text-black text-base md:text-lg mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                              <Check className="w-3 h-3 text-white" />
                                            </span>
                                            {t("activities")}
                                          </h5>
                                          <ul className="space-y-3">
                                            {day.activities.map((activity, idx) => (
                                              <li
                                                key={idx}
                                                className="flex items-start gap-3 text-gray-700 text-sm md:text-base lg:text-lg"
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
                                        <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-green-200 shadow-sm">
                                          <h5 className="font-bold text-black text-base md:text-lg mb-6 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                              <MapPin className="w-3 h-3 text-white" />
                                            </span>
                                            {t("route")} - {currentLocale === "es" ? "Mapa del Recorrido" : "Route Map"}
                                          </h5>
                                          <div className="relative">
                                            {/* Route Timeline */}
                                            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-400 to-blue-400"></div>

                                            {day.route.map((point, idx) => (
                                              <div key={idx} className="relative flex items-start gap-6 mb-6 last:mb-0">
                                                {/* Route Point */}
                                                <div className="relative z-10 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                                  <span className="text-white font-bold text-sm">{idx + 1}</span>
                                                </div>

                                                {/* Point Info */}
                                                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                  <h6 className="font-bold text-black text-sm md:text-base lg:text-lg mb-2">
                                                    📍 {point.location}
                                                  </h6>
                                                  {point.description && (
                                                    <p className="text-gray-600 text-xs md:text-sm lg:text-base mb-3">
                                                      {point.description}
                                                    </p>
                                                  )}
                                                  {point.imageUrl && (
                                                    <div
                                                      className="relative h-24 md:h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
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
                                        <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-orange-200 shadow-sm">
                                          <h5 className="font-bold text-black text-base md:text-lg mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                                              <span className="text-white text-sm">🍽️</span>
                                            </span>
                                            {t("meals")}
                                          </h5>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {day.meals.map((meal, idx) => (
                                              <div
                                                key={idx}
                                                className="bg-orange-50 rounded-lg p-3 border border-orange-200"
                                              >
                                                <span className="text-orange-700 font-medium text-sm md:text-base">
                                                  {meal}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Accommodation */}
                                      {day.accommodation && (
                                        <div className="bg-white rounded-xl p-6 md:p-8 border-2 border-purple-200 shadow-sm">
                                          <h5 className="font-bold text-black text-base md:text-lg mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                              <span className="text-white text-sm">🏨</span>
                                            </span>
                                            {t("accommodation")}
                                          </h5>
                                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <p className="text-purple-700 font-medium text-sm md:text-base lg:text-lg">
                                              {day.accommodation}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Day Image */}
                                      {day.imageUrl && (
                                        <div
                                          className="relative h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-gray-200"
                                          onClick={() => openImageGallery(day.imageUrl!)}
                                        >
                                          <Image
                                            src={day.imageUrl || "/placeholder.svg"}
                                            alt={`${t("day")} ${day.day}: ${day.title}`}
                                            fill
                                            className="object-cover"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                          <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-white font-bold text-sm md:text-base bg-black bg-opacity-50 rounded px-3 py-2">
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
                            <div className="text-center py-16 text-gray-500">
                              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Route className="w-10 h-10 text-gray-400" />
                              </div>
                              <p className="text-xl font-medium mb-3">
                                {currentLocale === "es" ? "Itinerario no disponible" : "Itinerary not available"}
                              </p>
                              <p className="text-base">
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
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                          <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </span>
                          {currentLocale === "es" ? "¿Qué incluye?" : "What's Included?"}
                        </h3>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 md:border-2">
                          {tour.includes && tour.includes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              {tour.includes.map((item: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                  </div>
                                  <span className="text-gray-700 font-medium text-sm md:text-base lg:text-lg">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-lg font-medium">
                                {currentLocale === "es" ? "Información no disponible" : "Information not available"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* What's NOT Included */}
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                          <span className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </span>
                          {currentLocale === "es" ? "¿Qué NO incluye?" : "What's NOT Included?"}
                        </h3>
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 md:border-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {[
                              currentLocale === "es" ? "Gastos personales" : "Personal expenses",
                              currentLocale === "es" ? "Propinas" : "Tips",
                              currentLocale === "es" ? "Bebidas alcohólicas" : "Alcoholic beverages",
                              currentLocale === "es" ? "Seguro de viaje" : "Travel insurance",
                            ].map((item: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-4 md:p-6 bg-white rounded-xl border border-red-200 shadow-sm"
                              >
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium text-sm md:text-base lg:text-lg">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "transport" && (
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                          <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Route className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </span>
                          {t("transportOptions")}
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 md:border-2">
                          {tour.transportOptionIds && tour.transportOptionIds.length > 0 ? (
                            <div className="space-y-6 md:space-y-8">
                              {tour.transportOptionIds.map((transport) => (
                                <div
                                  key={transport._id}
                                  className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl md:text-2xl">🚐</span>
                                      </div>
                                      <div>
                                        <h4 className="font-black text-black text-lg md:text-xl lg:text-2xl">
                                          {transport.vehicle}
                                        </h4>
                                        <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                                          {currentLocale === "es" ? "Tipo" : "Type"}: {transport.type}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="font-bold text-black text-sm md:text-base">
                                          {currentLocale === "es" ? "Capacidad" : "Capacity"}
                                        </span>
                                      </div>
                                      <p className="text-blue-700 font-medium text-sm md:text-base">
                                        {currentLocale === "es" ? "Hasta 15 pasajeros" : "Up to 15 passengers"}
                                      </p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span className="font-bold text-black text-sm md:text-base">
                                          {currentLocale === "es" ? "Seguridad" : "Safety"}
                                        </span>
                                      </div>
                                      <p className="text-green-700 font-medium text-sm md:text-base">
                                        {currentLocale === "es" ? "Totalmente asegurado" : "Fully insured"}
                                      </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Award className="w-5 h-5 text-purple-600" />
                                        <span className="font-bold text-black text-sm md:text-base">
                                          {currentLocale === "es" ? "Comodidad" : "Comfort"}
                                        </span>
                                      </div>
                                      <p className="text-purple-700 font-medium text-sm md:text-base">
                                        {currentLocale === "es" ? "Aire acondicionado" : "Air conditioning"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-16 text-gray-500">
                              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Route className="w-10 h-10 text-gray-400" />
                              </div>
                              <p className="text-xl font-medium mb-3">
                                {currentLocale === "es" ? "Transporte no especificado" : "Transport not specified"}
                              </p>
                              <p className="text-base">
                                {currentLocale === "es"
                                  ? "Los detalles del transporte se proporcionarán al momento de la reserva"
                                  : "Transport details will be provided upon booking"}
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

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 md:space-y-8">
                {/* Trust & Safety */}
                <div className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-6 md:p-8 shadow-xl">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black text-black mb-6 md:mb-8 flex items-center gap-3">
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    {currentLocale === "es" ? "Seguridad Primero" : "Safety First"}
                  </h3>
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-sm md:text-base">
                          {currentLocale === "es" ? "Guías Certificados" : "Certified Guides"}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {currentLocale === "es" ? "Experiencia profesional" : "Professional experience"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-sm md:text-base">
                          {currentLocale === "es" ? "Seguro incluido" : "Insurance Included"}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {currentLocale === "es" ? "Cobertura completa" : "Full coverage"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-black text-sm md:text-base">
                          {currentLocale === "es" ? "Garantía de calidad" : "Quality Guarantee"}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {currentLocale === "es" ? "Satisfacción garantizada" : "Satisfaction guaranteed"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl md:rounded-3xl border-2 md:border-4 border-black p-6 md:p-8 text-white shadow-xl">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-black mb-6 md:mb-8 flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
                    {currentLocale === "es" ? "¿Necesitas ayuda?" : "Need Help?"}
                  </h3>
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-bold text-sm md:text-base">
                          {currentLocale === "es" ? "Soporte WhatsApp" : "WhatsApp Support"}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm mb-4 text-white/90">
                        {currentLocale === "es" ? "Respuesta instantánea" : "Instant response"}
                      </p>
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 rounded-lg text-sm md:text-base">
                        {currentLocale === "es" ? "Chatear ahora" : "Chat Now"}
                      </Button>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="font-bold text-sm md:text-base">
                          {currentLocale === "es" ? "Llámanos" : "Call Us"}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm mb-4 text-white/90">
                        {currentLocale === "es" ? "Disponible 24/7" : "Available 24/7"}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-2 md:py-3 rounded-lg text-sm md:text-base bg-transparent"
                      >
                        {currentLocale === "es" ? "Llamar ahora" : "Call Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
