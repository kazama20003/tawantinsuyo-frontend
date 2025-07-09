"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Star, ChevronDown, Search, Filter, ArrowRight, MapPin, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { api } from "@/lib/axiosInstance"
import type { Tour, TourCategory, Difficulty, PackageType, FilterTourDto } from "@/types/tour"
import { useRouter } from "next/navigation"

const tourCategories = [
  { id: "all", name: "Todos los Tours", count: 0 },
  { id: "Aventura", name: "Aventura", count: 0 },
  { id: "Cultural", name: "Cultural", count: 0 },
  { id: "Relajación", name: "Relajación", count: 0 },
  { id: "Naturaleza", name: "Naturaleza", count: 0 },
  { id: "Trekking", name: "Trekking", count: 0 },
  { id: "Panoramico", name: "Panorámico", count: 0 },
  { id: "Transporte Turistico", name: "Transporte Turístico", count: 0 },
]

const difficultyLevels = [
  { id: "all", name: "Todos los niveles", icon: "🔵" },
  { id: "Facil", name: "Fácil", icon: "🟢" },
  { id: "Moderado", name: "Moderado", icon: "🟡" },
  { id: "Difícil", name: "Difícil", icon: "🔴" },
]

const packageTypes = [
  { id: "all", name: "Todos los paquetes" },
  { id: "Basico", name: "Básico" },
  { id: "Premium", name: "Premium" },
]

const regions = [
  { id: "all", name: "Todas las regiones" },
  { id: "Cusco", name: "Cusco" },
  { id: "Arequipa", name: "Arequipa" },
  { id: "Lima", name: "Lima" },
  { id: "Puno", name: "Puno" },
  { id: "Ica", name: "Ica" },
  { id: "Amazonas", name: "Amazonas" },
]

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedPackageType, setSelectedPackageType] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch tours from API
  const fetchTours = async (filters?: FilterTourDto) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.category) params.append("category", filters.category)
      if (filters?.difficulty) params.append("difficulty", filters.difficulty)
      if (filters?.packageType) params.append("packageType", filters.packageType)
      if (filters?.region) params.append("region", filters.region)
      if (filters?.location) params.append("location", filters.location)

      const queryString = params.toString()
      const url = queryString ? `/tours?${queryString}` : "/tours"

      const response = await api.get(url)

      // Validar que la respuesta sea un array
      let toursData = response.data

      // Si la respuesta tiene una estructura anidada, extraer el array
      if (toursData && typeof toursData === "object" && !Array.isArray(toursData)) {
        // Intentar diferentes estructuras comunes de respuesta
        if (Array.isArray(toursData.data)) {
          toursData = toursData.data
        } else if (Array.isArray(toursData.tours)) {
          toursData = toursData.tours
        } else if (Array.isArray(toursData.results)) {
          toursData = toursData.results
        } else {
          console.warn("Estructura de respuesta inesperada:", toursData)
          toursData = []
        }
      }

      // Asegurar que sea un array
      if (!Array.isArray(toursData)) {
        console.warn("La respuesta no es un array:", toursData)
        toursData = []
      }

      console.log("Tours cargados:", toursData.length, toursData)
      setTours(toursData)
      setFilteredTours(toursData)
    } catch (err) {
      console.error("Error fetching tours:", err)
      setError("Error al cargar los tours. Por favor, intenta de nuevo.")
      // Asegurar que los arrays estén vacíos en caso de error
      setTours([])
      setFilteredTours([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchTours()
  }, [])

  // Apply filters
  useEffect(() => {
    // Asegurar que tours sea un array antes de filtrar
    if (!Array.isArray(tours)) {
      console.warn("tours no es un array:", tours)
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
    let filtered = [...tours] // Crear una copia del array

    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.region?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter((tour) => tour.category === filters.category)
    }
    if (filters.difficulty) {
      filtered = filtered.filter((tour) => tour.difficulty === filters.difficulty)
    }
    if (filters.packageType) {
      filtered = filtered.filter((tour) => tour.packageType === filters.packageType)
    }
    if (filters.region) {
      filtered = filtered.filter((tour) => tour.region === filters.region)
    }

    setFilteredTours(filtered)
  }, [selectedCategory, selectedDifficulty, selectedPackageType, selectedRegion, searchTerm, tours])

  const getCategoryColor = (category: TourCategory) => {
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
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Cargando Tours...</h2>
          <p className="text-gray-600">Estamos preparando las mejores experiencias para ti</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => fetchTours()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header with Filters */}
      <section className="bg-blue-600 border-4 border-black rounded-b-3xl mt-4 md:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">TODAS LAS CATEGORÍAS</option>
                  {tourCategories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">TODOS LOS NIVELES</option>
                  {difficultyLevels.slice(1).map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.icon} {level.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedPackageType}
                  onChange={(e) => setSelectedPackageType(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">TODOS LOS PAQUETES</option>
                  {packageTypes.slice(1).map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">TODAS LAS REGIONES</option>
                  {regions.slice(1).map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:border-white focus:ring-2 focus:ring-white/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl md:text-2xl font-black text-white">TOURS PERÚ</h1>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-blue-600 border-2 border-black font-bold px-3 py-2 rounded-lg text-sm"
              >
                <Filter className="w-4 h-4 mr-1" />
                FILTROS
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Buscar tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="bg-white rounded-2xl border-2 border-black p-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">CATEGORÍA</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todas</option>
                    {tourCategories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">DIFICULTAD</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    {difficultyLevels.slice(1).map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">PAQUETE</label>
                  <select
                    value={selectedPackageType}
                    onChange={(e) => setSelectedPackageType(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    {packageTypes.slice(1).map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">REGIÓN</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todas</option>
                    {regions.slice(1).map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-black">{filteredTours.length}</span> de{" "}
            <span className="font-bold text-black">{tours.length}</span> tours
          </p>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <span>Ordenar por:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-black">
              <option>Popularidad</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {Array.isArray(filteredTours) &&
            filteredTours.map((tour) => (
              <div
                key={tour._id}
                className="bg-white rounded-3xl border-3 border-black overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 group relative cursor-pointer"
                onClick={() => router.push(`/tours/${tour.slug}`)}
              >
                {/* Image Section */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <Image
                    src={tour.imageUrl || "/placeholder.svg?height=400&width=600&text=Tour+Image"}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div
                      className={`px-3 py-1 rounded-xl font-black text-xs border-2 border-white shadow-lg backdrop-blur-sm ${getCategoryColor(tour.category)}`}
                    >
                      {tour.category.toUpperCase()}
                    </div>
                    {tour.packageType === "Premium" && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-xl font-black text-xs border-2 border-white shadow-lg">
                        ✨ PREMIUM
                      </div>
                    )}
                    {tour.featured && (
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-xl font-black text-xs border-2 border-white shadow-lg animate-pulse">
                        🔥 DESTACADO
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 border-2 border-white shadow-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-black text-sm">{tour.rating}</span>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-black shadow-xl">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-600">S/{tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">S/{tour.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">por persona</div>
                  </div>
                </div>

                {/* Content Section - Simplificado */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-600">{tour.region}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{tour.location}</span>
                    </div>
                    <h3 className="text-xl font-black text-black mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{tour.subtitle}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{tour.duration}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(tour.difficulty)}`}>
                      {tour.difficulty}
                    </div>
                  </div>

                  {/* Top Highlights - Solo 2 */}
                  <div className="mb-6">
                    <div className="space-y-2">
                      {tour.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-700 line-clamp-1">{highlight}</span>
                        </div>
                      ))}
                      {tour.highlights.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{tour.highlights.length - 2} más incluidos
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/tours/${tour.slug}`)
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-xl border-2 border-blue-800 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/tours/${tour.slug}#booking`)
                      }}
                      variant="outline"
                      className="px-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 text-sm rounded-xl transition-all duration-300 bg-transparent"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* No Results - También mejorada */}
        {Array.isArray(filteredTours) && filteredTours.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-300">
              <Search className="w-20 h-20 text-blue-400" />
            </div>
            <h3 className="text-3xl font-black text-black mb-4">No encontramos tours</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Intenta ajustar tus filtros o términos de búsqueda para encontrar la aventura perfecta
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedDifficulty("all")
                  setSelectedPackageType("all")
                  setSelectedRegion("all")
                  setSearchTerm("")
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-2xl border-2 border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Limpiar Filtros
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 text-lg rounded-2xl transition-all duration-300 bg-transparent"
              >
                Ver Todos los Tours
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
