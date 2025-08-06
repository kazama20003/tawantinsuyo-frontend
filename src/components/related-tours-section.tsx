"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Clock, ArrowRight, Loader2, Heart, MapPin, Users, Calendar, Camera, Award, Compass } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { api } from "@/lib/axiosInstance" // Assuming this path is correct
import type { Tour } from "@/types/tour" // Assuming this path and interface are correct
import { motion, AnimatePresence } from "framer-motion"

export default function RelatedToursSection() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3) // State for the number of items per view
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale = pathname.startsWith("/en") ? "en" : "es"

  // Fetch related tours with language parameter
  useEffect(() => {
    const fetchRelatedTours = async () => {
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
        console.error("Error fetching related tours:", err)
        setError(
          currentLocale === "en"
            ? "Error loading related tours"
            : "Error al cargar los tours relacionados",
        )
        setTours([])
      } finally {
        setLoading(false)
      }
    }
    fetchRelatedTours()
  }, [currentLocale])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
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
        title: "Tours que también te pueden interesar",
        subtitle: "Descubre otras experiencias increíbles que hemos seleccionado para ti.",
        loading: "Cargando tours relacionados...",
        tryAgain: "Intentar de nuevo",
        noTours: "No hay tours relacionados disponibles en este momento.",
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
        originalPrice: "Precio original",
        discount: "Descuento",
      },
      en: {
        title: "Tours you might also like",
        subtitle: "Discover other incredible experiences we've selected for you.",
        loading: "Loading related tours...",
        tryAgain: "Try again",
        noTours: "No related tours available at the moment.",
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
        originalPrice: "Original price",
        discount: "Discount",
      },
    }
    return texts[currentLocale]?.[key] || texts.es[key] || key
  }

  // Helper function to get tour data (assuming API returns localized strings based on lang param)
  const getTourDisplayData = (tour: Tour) => {
    return {
      title: tour.title,
      subtitle: tour.subtitle,
      duration: tour.duration,
      highlights: tour.highlights || [], // highlights is string[]
    }
  }

  if (loading) {
    return (
      <section id="related-tours-section" className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16 md:py-20">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 animate-spin text-blue-600" />
            <span className="ml-3 md:ml-4 text-lg md:text-xl lg:text-2xl font-medium text-gray-600">
              {getLocalizedText("loading")}
            </span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="related-tours-section" className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 md:py-20">
            <p className="text-lg md:text-xl lg:text-2xl text-red-600 mb-4 md:mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
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
      <section id="related-tours-section" className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 md:py-20">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600">{getLocalizedText("noTours")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="related-tours-section" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 md:mb-16 lg:mb-20 gap-6 md:gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-gray-900 leading-tight">
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
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {getLocalizedText("subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Cards Container */}
        <div className="relative mb-8 md:mb-12 lg:mb-16">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-600 ease-out gap-4 md:gap-6 lg:gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {tours.map((tour, index) => {
                const tourDisplayData = getTourDisplayData(tour)
                const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price
                const discountPercentage = hasDiscount
                  ? Math.round(((tour.originalPrice! - tour.price) / tour.originalPrice!) * 100)
                  : 0
                return (
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
                            ? "calc(50% - 12px)"
                            : "calc(33.333% - 18px)",
                    }}
                    onMouseEnter={() => itemsPerView !== 1 && setHoveredCard(tour._id)} // Only hover on desktop
                    onMouseLeave={() => itemsPerView !== 1 && setHoveredCard(null)} // Only hover on desktop
                  >
                    <motion.div
                      onClick={() => {
                        window.location.href = `${currentLocale === "en" ? "/en" : ""}/tours/${tour.slug}`
                      }}
                      className="relative h-[480px] sm:h-[520px] md:h-[560px] lg:h-[600px] xl:h-[620px] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Background Image */}
                      <div className="relative h-full overflow-hidden">
                        <Image
                          src={tour.imageUrl || "/placeholder.svg?height=620&width=400&text=Tour+Image"}
                          alt={tourDisplayData.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                      </div>

                      {/* Top Section - Badges and Favorite */}
                      <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-between items-start z-20">
                        <div className="flex flex-col gap-2">
                          {tour.featured && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg"
                            >
                              ⭐ {getLocalizedText("featured")}
                            </motion.div>
                          )}
                          {hasDiscount && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg"
                            >
                              -{discountPercentage}%
                            </motion.div>
                          )}
                          <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 md:px-4 py-2 rounded-full shadow-lg">
                            <div className="flex flex-col items-center">
                              <span className="text-base md:text-lg font-bold">S/{tour.price}</span>
                              {hasDiscount && (
                                <span className="text-xs text-gray-500 line-through">S/{tour.originalPrice}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(tour._id)
                          }}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            favorites.has(tour._id)
                              ? "bg-red-500 text-white"
                              : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                          }`}
                        >
                          <Heart className={`w-5 h-5 md:w-6 md:h-6 ${favorites.has(tour._id) ? "fill-current" : ""}`} />
                        </motion.button>
                      </div>

                      {/* Content Overlay - Yellow Section */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-t-2xl md:rounded-t-3xl overflow-hidden shadow-2xl"
                        initial={{ height: itemsPerView === 1 ? "240px" : "140px" }}
                        animate={{
                          height:
                            itemsPerView === 1 // If mobile, fixed generous height
                              ? "240px" // Fixed height for mobile that always shows buttons
                              : hoveredCard === tour._id // If desktop, use hover
                                ? "420px"
                                : "140px",
                        }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="p-4 md:p-6 lg:p-8 h-full">
                          {/* Main content always visible */}
                          <div className="mb-4">
                            <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight line-clamp-2">
                              {tourDisplayData.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-700 flex-shrink-0" />
                                <span className="text-sm md:text-base font-semibold text-gray-700 truncate">
                                  {tour.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 ml-2">
                                <Star className="w-4 h-4 md:w-5 md:h-5 text-gray-700 fill-current" />
                                <span className="text-sm md:text-base font-bold text-gray-700">{tour.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons - ALWAYS VISIBLE */}
                          <div className="mb-4">
                            <div className="flex gap-2 md:gap-3">
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
                                  className="w-full bg-blue-600 text-white px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg"
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
                                  className="w-full bg-gray-900 text-white px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 md:gap-2 shadow-lg"
                                >
                                  {getLocalizedText("book")}
                                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </motion.button>
                              </Link>
                            </div>
                          </div>

                          {/* Expandable content - Only on desktop with hover or always on mobile */}
                          <AnimatePresence>
                            {(hoveredCard === tour._id || itemsPerView === 1) && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 md:space-y-3 overflow-y-auto"
                                style={{ maxHeight: itemsPerView === 1 ? "200px" : "180px" }}
                              >
                                {/* Tour details grid */}
                                <div className="grid grid-cols-2 gap-1.5 md:gap-2 text-xs md:text-sm">
                                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-700">
                                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{tourDisplayData.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-700">
                                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{getLocalizedText("maxPeople")}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-700">
                                    <Award className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">
                                      {tour.reviews} {getLocalizedText("reviews")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-700">
                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="font-medium truncate">{getLocalizedText("allYear")}</span>
                                  </div>
                                </div>

                                {/* Tour highlights */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-700">
                                    <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="truncate">{getLocalizedText("photosIncluded")}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-700">
                                    <Compass className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                    <span className="truncate">{getLocalizedText("certifiedGuide")}</span>
                                  </div>
                                </div>

                                {/* Tour data highlights */}
                                {tourDisplayData.highlights.length > 0 && (
                                  <div className="space-y-1">
                                    <h4 className="text-xs md:text-sm font-bold text-gray-800">Highlights:</h4>
                                    <div className="space-y-0.5">
                                      {tourDisplayData.highlights.slice(0, 2).map((highlight, idx) => (
                                        <div key={idx} className="text-xs md:text-sm text-gray-700">
                                          • {highlight}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Price information */}
                                <div className="pt-2 border-t border-gray-700/20">
                                  <div className="text-xs md:text-sm text-gray-700">
                                    <span className="font-bold text-base md:text-lg">
                                      {getLocalizedText("from")} S/{tour.price}
                                    </span>
                                    <span className="block text-xs opacity-80">{getLocalizedText("perPerson")}</span>
                                    {hasDiscount && (
                                      <span className="block text-xs text-red-600 font-medium">
                                        {getLocalizedText("originalPrice")}: S/{tour.originalPrice}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Pagination Dots */}
          <div className="flex gap-2 md:gap-3 order-2 sm:order-1">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
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
          <div className="flex gap-3 md:gap-4 order-1 sm:order-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
              }`}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollRight}
              disabled={currentIndex >= maxIndex}
              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                currentIndex >= maxIndex
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
              }`}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
            </motion.button>
          </div>
        </div>

        {/* More Tours Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 md:mt-16 lg:mt-20"
        >
          <Link href={`${currentLocale === "en" ? "/en" : ""}/tours`}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 text-base md:text-lg lg:text-xl rounded-full transition-all duration-300 hover:shadow-xl">
                {getLocalizedText("viewAllTours")}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
