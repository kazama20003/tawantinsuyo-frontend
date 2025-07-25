"use client"

import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
  Loader2,
  Heart,
  MapPin,
  Users,
  Calendar,
  Camera,
  Award,
  Compass,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import type { Tour } from "@/types/tour"
import { motion, AnimatePresence } from "framer-motion"

export default function PackagesSection() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale = pathname.startsWith("/en") ? "en" : "es"

  // Fetch top tours with language parameter
  useEffect(() => {
    const fetchTopTours = async () => {
      try {
        setLoading(true)
        // Add language parameter to the API call
        const langParam = currentLocale === "en" ? "?lang=en" : ""
        const response = await api.get(`/tours/top${langParam}`)
        let toursData = response.data

        if (toursData && typeof toursData === "object" && !Array.isArray(toursData)) {
          if (toursData.data && Array.isArray(toursData.data)) {
            toursData = toursData.data
          } else if (toursData.tours && Array.isArray(toursData.tours)) {
            toursData = toursData.tours
          }
        }

        if (!Array.isArray(toursData)) {
          console.warn("API response is not an array:", toursData)
          setTours([])
        } else {
          setTours(toursData)
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching top tours:", err)
        setError(currentLocale === "en" ? "Error loading popular tours" : "Error al cargar los tours populares")
        setTours([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopTours()
  }, [currentLocale])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1200) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, tours.length - itemsPerView)

  const scrollToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }

  const scrollLeft = () => {
    scrollToIndex(currentIndex - 1)
  }

  const scrollRight = () => {
    scrollToIndex(currentIndex + 1)
  }

  const toggleFavorite = (tourId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId)
    } else {
      newFavorites.add(tourId)
    }
    setFavorites(newFavorites)
  }

  // Get localized text based on current language
  const getLocalizedText = (key: string): string => {
    const texts: Record<string, Record<string, string>> = {
      es: {
        title: "Más que una visita",
        subtitle: "Hay muchas razones para elegir Perú, pero aquí están algunas de las más esenciales",
        loading: "Cargando tours...",
        tryAgain: "Intentar de nuevo",
        noTours: "No hay tours disponibles en este momento.",
        featured: "DESTACADO",
        maxPeople: "Máx. 15 personas",
        reviews: "reseñas",
        allYear: "Todo el año",
        photosIncluded: "Fotografías profesionales incluidas",
        certifiedGuide: "Guía turístico certificado",
        from: "Desde",
        perPerson: "por persona",
        explore: "Explorar",
        details: "Detalles",
        book: "Reservar",
        viewAllTours: "Ver todos los tours",
      },
      en: {
        title: "More than a visit",
        subtitle: "There are many reasons to choose Peru, but here are some of the most essential",
        loading: "Loading tours...",
        tryAgain: "Try again",
        noTours: "No tours available at the moment.",
        featured: "FEATURED",
        maxPeople: "Max. 15 people",
        reviews: "reviews",
        allYear: "All year",
        photosIncluded: "Professional photos included",
        certifiedGuide: "Certified tour guide",
        from: "From",
        perPerson: "per person",
        explore: "Explore",
        details: "Details",
        book: "Book Now",
        viewAllTours: "View all tours",
      },
    }
    return texts[currentLocale]?.[key] || texts.es[key] || key
  }

  if (loading) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-600" />
            <span className="ml-4 text-xl md:text-2xl font-medium text-gray-600">{getLocalizedText("loading")}</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl md:text-2xl text-red-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg"
            >
              {getLocalizedText("tryAgain")}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (tours.length === 0) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl md:text-2xl text-gray-600">{getLocalizedText("noTours")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="packages-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 md:mb-20 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 leading-tight">
              {getLocalizedText("title")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:max-w-lg xl:max-w-xl"
          >
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{getLocalizedText("subtitle")}</p>
          </motion.div>
        </div>

        {/* Cards Container */}
        <div className="relative mb-12 md:mb-16">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-600 ease-out gap-6 md:gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {tours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex-shrink-0"
                  style={{
                    width:
                      itemsPerView === 1
                        ? "calc(100% - 0px)"
                        : itemsPerView === 2
                          ? "calc(50% - 16px)"
                          : "calc(33.333% - 22px)",
                  }}
                  onMouseEnter={() => setHoveredCard(tour._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    onClick={() => {
                      window.location.href = `${currentLocale === "en" ? "/en" : ""}/tours/${tour.slug}`
                    }}
                    className="relative h-[500px] md:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background Image */}
                    <div className="relative h-full overflow-hidden">
                      <Image
                        src={tour.imageUrl || "/placeholder.svg?height=620&width=400&text=Tour+Image"}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                    </div>

                    {/* Top Section - Badges and Favorite */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                      <div className="flex flex-col gap-2">
                        {tour.featured && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                          >
                            ⭐ {getLocalizedText("featured")}
                          </motion.div>
                        )}
                        <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                          S/{tour.price}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(tour._id)
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                          favorites.has(tour._id)
                            ? "bg-red-500 text-white"
                            : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${favorites.has(tour._id) ? "fill-current" : ""}`} />
                      </motion.button>
                    </div>

                    {/* Content Overlay - Yellow Section with Fixed Button Visibility */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-t-3xl overflow-hidden shadow-2xl"
                      initial={{ height: "160px" }}
                      animate={{
                        height: hoveredCard === tour._id ? "450px" : "160px",
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="p-6 md:p-8 h-full flex flex-col">
                        {/* Always visible content */}
                        <div className="flex-shrink-0">
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                            {tour.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-gray-700" />
                              <span className="text-base font-semibold text-gray-700 truncate">{tour.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-gray-700 fill-current" />
                              <span className="text-base font-bold text-gray-700">{tour.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable content with guaranteed button space */}
                        <AnimatePresence>
                          {hoveredCard === tour._id && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                              className="flex-1 mt-6 flex flex-col"
                            >
                              {/* Scrollable content area */}
                              <div className="flex-1 space-y-3">
                                {/* Tour details grid */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{tour.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{getLocalizedText("maxPeople")}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Award className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">
                                      {tour.reviews} {getLocalizedText("reviews")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{getLocalizedText("allYear")}</span>
                                  </div>
                                </div>

                                {/* Tour highlights */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Camera className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{getLocalizedText("photosIncluded")}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Compass className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{getLocalizedText("certifiedGuide")}</span>
                                  </div>
                                </div>

                                {/* Price info */}
                                <div className="pt-1 border-t border-gray-700/20">
                                  <div className="text-sm text-gray-700">
                                    <span className="font-bold text-lg">
                                      {getLocalizedText("from")} S/{tour.price}
                                    </span>
                                    <span className="block text-xs opacity-80">{getLocalizedText("perPerson")}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Fixed buttons section - always visible */}
                              <div className="flex-shrink-0 pt-4 mt-auto">
                                <div className="flex gap-3">
                                  <Link
                                    href={`${currentLocale === "en" ? "/en" : ""}/tours/${tour.slug}`}
                                    className="flex-1"
                                  >
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                      }}
                                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                      {getLocalizedText("details")}
                                    </motion.button>
                                  </Link>
                                  <Link
                                    href={`${currentLocale === "en" ? "/en" : ""}/tours/${tour.slug}?action=book`}
                                    className="flex-1"
                                  >
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                      }}
                                      className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                    >
                                      {getLocalizedText("book")}
                                      <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Pagination Dots */}
          <div className="flex gap-3 order-2 sm:order-1">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(index)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-600 scale-125"
                    : index === 0
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <div className="flex gap-4 order-1 sm:order-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
              }`}
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollRight}
              disabled={currentIndex >= maxIndex}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentIndex >= maxIndex
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
              }`}
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
          </div>
        </div>

        {/* More Tours Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 md:mt-20"
        >
          <Link href={`${currentLocale === "en" ? "/en" : ""}/tours`}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-10 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-full transition-all duration-300 hover:shadow-xl">
                {getLocalizedText("viewAllTours")}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
