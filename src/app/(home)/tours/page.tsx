"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Star,
  ChevronDown,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Loader2,
  Heart,
  Users,
  Calendar,
  Camera,
  Award,
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/axiosInstance"
import type { Tour, TourCategory, Difficulty, PackageType, FilterTourDto } from "@/types/tour"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const getLocalizedValue = (value: unknown): string => {
  if (!value) return ""

  // If it's already a string, return it
  if (typeof value === "string") return value

  // If it's an object with language keys, extract the appropriate one
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>
    if (obj.es && typeof obj.es === "string") return obj.es
    if (obj.en && typeof obj.en === "string") return obj.en
    // If it has any string property, return the first one
    const firstStringValue = Object.values(obj).find((v) => typeof v === "string")
    if (firstStringValue) return String(firstStringValue)
  }

  // Fallback to string conversion
  return String(value)
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale = pathname.startsWith("/en") ? "en" : "es"
  const isSpanish = currentLocale === "es"

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedPackageType, setSelectedPackageType] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [toursPerPage] = useState(9)

  // Static data with proper localization
  const tourCategories = [
    { id: "all", name: isSpanish ? "Todos los Tours" : "All Tours", count: 0 },
    { id: "Aventura", name: isSpanish ? "Aventura" : "Adventure", count: 0 },
    { id: "Cultural", name: isSpanish ? "Cultural" : "Cultural", count: 0 },
    { id: "Relajación", name: isSpanish ? "Relajación" : "Relaxation", count: 0 },
    { id: "Naturaleza", name: isSpanish ? "Naturaleza" : "Nature", count: 0 },
    { id: "Trekking", name: isSpanish ? "Trekking" : "Trekking", count: 0 },
    { id: "Panoramico", name: isSpanish ? "Panorámico" : "Scenic", count: 0 },
    { id: "Transporte Turistico", name: isSpanish ? "Transporte Turístico" : "Tourist Transport", count: 0 },
  ]

  const difficultyLevels = [
    { id: "all", name: isSpanish ? "Todos los niveles" : "All levels", icon: "🔵" },
    { id: "Facil", name: isSpanish ? "Fácil" : "Easy", icon: "🟢" },
    { id: "Moderado", name: isSpanish ? "Moderado" : "Moderate", icon: "🟡" },
    { id: "Difícil", name: isSpanish ? "Difícil" : "Difficult", icon: "🔴" },
  ]

  const packageTypes = [
    { id: "all", name: isSpanish ? "Todos los paquetes" : "All packages" },
    { id: "Basico", name: isSpanish ? "Básico" : "Basic" },
    { id: "Premium", name: isSpanish ? "Premium" : "Premium" },
  ]

  const regions = [
    { id: "all", name: isSpanish ? "Todas las regiones" : "All regions" },
    { id: "Cusco", name: "Cusco" },
    { id: "Arequipa", name: "Arequipa" },
    { id: "Lima", name: "Lima" },
    { id: "Puno", name: "Puno" },
    { id: "Ica", name: "Ica" },
    { id: "Amazonas", name: "Amazonas" },
  ]

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

  // Fetch tours from API with language support
  const fetchTours = useCallback(
    async (filters?: FilterTourDto) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()

        // Add language parameter
        const langParam = currentLocale === "en" ? "en" : "es"
        params.append("lang", langParam)

        // Add filters
        if (filters?.category) params.append("category", filters.category)
        if (filters?.difficulty) params.append("difficulty", filters.difficulty)
        if (filters?.packageType) params.append("packageType", filters.packageType)
        if (filters?.region) params.append("region", filters.region)
        if (filters?.location) params.append("location", filters.location)

        const queryString = params.toString()
        const url = `/tours?${queryString}`

        const response = await api.get(url)

        // Validate response structure
        let toursData = response.data

        if (toursData && typeof toursData === "object" && !Array.isArray(toursData)) {
          if (Array.isArray(toursData.data)) {
            toursData = toursData.data
          } else if (Array.isArray(toursData.tours)) {
            toursData = toursData.tours
          } else if (Array.isArray(toursData.results)) {
            toursData = toursData.results
          } else {
            console.warn("Unexpected response structure:", toursData)
            toursData = []
          }
        }

        if (!Array.isArray(toursData)) {
          console.warn("Response is not an array:", toursData)
          toursData = []
        }

        console.log("Tours loaded:", toursData.length, toursData)
        setTours(toursData)
        setFilteredTours(toursData)
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError(isSpanish ? "Error al cargar los tours" : "Error loading tours")
        setTours([])
        setFilteredTours([])
      } finally {
        setLoading(false)
      }
    },
    [currentLocale, isSpanish],
  )

  // Initial load
  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  // Apply filters
  useEffect(() => {
    if (!Array.isArray(tours)) {
      console.warn("tours is not an array:", tours)
      setFilteredTours([])
      return
    }

    const filters: FilterTourDto = {}
    if (selectedCategory !== "all") {
      filters.category = selectedCategory as TourCategory
    }
    if (selectedDifficulty !== "all") {
      filters.difficulty = selectedDifficulty as Difficulty
    }
    if (selectedPackageType !== "all") {
      filters.packageType = selectedPackageType as PackageType
    }
    if (selectedRegion !== "all") {
      filters.region = selectedRegion
    }

    // Apply search term locally for better UX
    let filtered = [...tours]

    if (searchTerm) {
      const getLocalizedValueWithLocale = (value: unknown, locale: string): string => {
        if (!value) return ""
        if (typeof value === "string") return value
        if (typeof value === "object" && value !== null) {
          const obj = value as Record<string, unknown>
          if (obj[locale] && typeof obj[locale] === "string") return String(obj[locale])
          if (obj.es && typeof obj.es === "string") return String(obj.es)
          if (obj.en && typeof obj.en === "string") return String(obj.en)
          const firstStringValue = Object.values(obj).find((v) => typeof v === "string")
          if (firstStringValue) return String(firstStringValue)
        }
        return String(value)
      }

      filtered = filtered.filter((tour) => {
        const title = getLocalizedValueWithLocale(tour.title, currentLocale).toLowerCase()
        const subtitle = getLocalizedValueWithLocale(tour.subtitle, currentLocale).toLowerCase()
        const location = getLocalizedValueWithLocale(tour.location, currentLocale).toLowerCase()
        const region = getLocalizedValueWithLocale(tour.region, currentLocale).toLowerCase()
        const searchLower = searchTerm.toLowerCase()

        return (
          title.includes(searchLower) ||
          subtitle.includes(searchLower) ||
          location.includes(searchLower) ||
          region.includes(searchLower)
        )
      })
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter((tour) => getLocalizedValue(tour.category) === filters.category)
    }
    if (filters.difficulty) {
      filtered = filtered.filter((tour) => getLocalizedValue(tour.difficulty) === filters.difficulty)
    }
    if (filters.packageType) {
      filtered = filtered.filter((tour) => getLocalizedValue(tour.packageType) === filters.packageType)
    }
    if (filters.region) {
      filtered = filtered.filter((tour) => getLocalizedValue(tour.region) === filters.region)
    }

    setFilteredTours(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [selectedCategory, selectedDifficulty, selectedPackageType, selectedRegion, searchTerm, tours, currentLocale])

  const toggleFavorite = useCallback((tourId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(tourId)) {
        newFavorites.delete(tourId)
      } else {
        newFavorites.add(tourId)
      }
      return newFavorites
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedPackageType("all")
    setSelectedRegion("all")
    setSearchTerm("")
    setShowFilters(false)
  }, [])

  // Pagination logic
  const indexOfLastTour = currentPage * toursPerPage
  const indexOfFirstTour = indexOfLastTour - toursPerPage
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour)
  const totalPages = Math.ceil(filteredTours.length / toursPerPage)

  const paginate = useCallback((pageNumber: number) => setCurrentPage(pageNumber), [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isSpanish ? "Cargando..." : "Loading..."}</h2>
          <p className="text-gray-600">{isSpanish ? "Cargando tours..." : "Loading tours..."}</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isSpanish ? "Error" : "Error"}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => fetchTours()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            {isSpanish ? "Intentar de nuevo" : "Try again"}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section with Filters */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {isSpanish ? "Descubre Perú" : "Discover Peru"}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {isSpanish
                ? "Explora los destinos más increíbles con nuestros tours especializados"
                : "Explore the most incredible destinations with our specialized tours"}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder={isSpanish ? "Buscar tours..." : "Search tours..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl focus:ring-4 focus:ring-white/30"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </motion.div>

          {/* Filter Toggle for Mobile */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-bold px-6 py-3 rounded-xl"
            >
              <Filter className="w-5 h-5 mr-2" />
              {isSpanish ? "Filtros" : "Filters"}
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {(showFilters || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isSpanish ? "Categoría" : "Category"}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        {tourCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isSpanish ? "Dificultad" : "Difficulty"}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.icon} {level.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Package Type Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isSpanish ? "Paquete" : "Package"}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPackageType}
                        onChange={(e) => setSelectedPackageType(e.target.value)}
                        className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        {packageTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {isSpanish ? "Región" : "Region"}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-6 py-2 rounded-xl bg-transparent"
                  >
                    {isSpanish ? "Limpiar Filtros" : "Clear Filters"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-gray-600 text-lg">
              {isSpanish ? "Mostrando" : "Showing"}{" "}
              <span className="font-bold text-blue-600">{currentTours.length}</span> {isSpanish ? "de" : "of"}{" "}
              <span className="font-bold text-blue-600">{filteredTours.length}</span> {isSpanish ? "tours" : "tours"}
            </p>
            {currentPage > 1 && (
              <p className="text-sm text-gray-500">
                {isSpanish ? "Página" : "Page"} {currentPage} {isSpanish ? "de" : "of"} {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Tours Grid - Using getLocalizedValue for ALL tour properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {currentTours.map((tour, index) => {
            // Extract all localized values safely
            const tourTitle = getLocalizedValue(tour.title)
            const tourLocation = getLocalizedValue(tour.location)
            const tourDuration = getLocalizedValue(tour.duration)
            const tourRating = tour.rating || "5.0"
            const tourReviews = tour.reviews || "0"
            const tourPrice = tour.price || "0"
            const tourSlug = tour.slug || ""
            const tourImageUrl = tour.imageUrl || "/placeholder.svg?height=620&width=400&text=Tour+Image"
            const tourFeatured = tour.featured || false

            return (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex-shrink-0"
                onMouseEnter={() => setHoveredCard(tour._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  onClick={() => {
                    router.push(`${getLocalizedLink("/tours")}/${tourSlug}`)
                  }}
                  className="relative h-[500px] md:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden group cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Image */}
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src={tourImageUrl || "/placeholder.svg"}
                      alt={tourTitle}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                  </div>

                  {/* Top Section - Badges and Favorite */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                    <div className="flex flex-col gap-2">
                      {tourFeatured && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        >
                          ⭐ {isSpanish ? "DESTACADO" : "FEATURED"}
                        </motion.div>
                      )}
                      <div className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                        S/{tourPrice}
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

                  {/* Content Overlay - Yellow Section with Animation */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-t-3xl overflow-hidden shadow-2xl"
                    initial={{ height: "140px" }}
                    animate={{
                      height: hoveredCard === tour._id ? "320px" : "140px",
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="p-6 md:p-8 h-full flex flex-col">
                      {/* Always visible content */}
                      <div className="flex-shrink-0">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                          {tourTitle}
                        </h3>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-700" />
                            <span className="text-base font-semibold text-gray-700">{tourLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-gray-700 fill-current" />
                            <span className="text-base font-bold text-gray-700">{tourRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable content with enhanced information */}
                      <AnimatePresence>
                        {hoveredCard === tour._id && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex-1 mt-4 space-y-4"
                          >
                            {/* Tour details grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{tourDuration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{isSpanish ? "Máx. 15 personas" : "Max. 15 people"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Award className="w-4 h-4" />
                                <span className="font-medium">
                                  {tourReviews} {isSpanish ? "reseñas" : "reviews"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{isSpanish ? "Todo el año" : "All year"}</span>
                              </div>
                            </div>

                            {/* Tour highlights */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Camera className="w-4 h-4" />
                                <span>
                                  {isSpanish ? "Fotografías profesionales incluidas" : "Professional photos included"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Compass className="w-4 h-4" />
                                <span>{isSpanish ? "Guía turístico certificado" : "Certified tour guide"}</span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-between pt-3">
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold">
                                  {isSpanish ? "Desde" : "From"} S/{tourPrice}
                                </span>
                                <span className="block text-xs">{isSpanish ? "por persona" : "per person"}</span>
                              </div>

                              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                                <Link href={`${getLocalizedLink("/tours")}/${tourSlug}`}>
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                  >
                                    {isSpanish ? "Detalles" : "Details"}
                                  </motion.button>
                                </Link>

                                <Link href={`${getLocalizedLink("/tours")}/${tourSlug}?action=book`}>
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    className="bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-lg"
                                  >
                                    {isSpanish ? "Reservar" : "Book"}
                                    <ArrowRight className="w-3 h-3" />
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
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
            {/* Page Info */}
            <div className="text-gray-600 text-sm">
              {isSpanish ? "Página" : "Page"} {currentPage} {isSpanish ? "de" : "of"} {totalPages}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>

              {/* Next Button */}
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Results per page info */}
            <div className="text-gray-600 text-sm">
              {indexOfFirstTour + 1}-{Math.min(indexOfLastTour, filteredTours.length)} {isSpanish ? "de" : "of"}{" "}
              {filteredTours.length}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredTours.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-300">
              <Search className="w-16 h-16 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {isSpanish ? "No encontramos tours" : "No tours found"}
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {isSpanish
                ? "Intenta ajustar tus filtros o términos de búsqueda para encontrar la aventura perfecta"
                : "Try adjusting your filters or search terms to find the perfect adventure"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={clearAllFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSpanish ? "Limpiar Filtros" : "Clear Filters"}
              </Button>
              <Link href={getLocalizedLink("/tours")}>
                <Button
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 text-lg rounded-2xl transition-all duration-300 bg-transparent"
                >
                  {isSpanish ? "Ver Todos los Tours" : "View All Tours"}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}
