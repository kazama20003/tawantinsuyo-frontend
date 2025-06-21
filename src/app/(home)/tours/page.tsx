"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Star, Mountain, ChevronDown, Search, Filter, ArrowRight, Thermometer } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

const tourCategories = [
  { id: "all", name: "Todos los Tours", count: 24 },
  { id: "adventure", name: "Aventura", count: 8 },
  { id: "cultural", name: "Cultural", count: 6 },
  { id: "trekking", name: "Trekking", count: 5 },
  { id: "luxury", name: "Lujo", count: 3 },
  { id: "family", name: "Familiar", count: 2 },
]

const activityLevels = [
  { id: "easy", name: "Fácil", icon: "🟢" },
  { id: "moderate", name: "Moderado", icon: "🟡" },
  { id: "challenging", name: "Desafiante", icon: "🔴" },
  { id: "extreme", name: "Extremo", icon: "⚫" },
]

const travelStyles = [
  { id: "group", name: "Grupo Pequeño" },
  { id: "private", name: "Privado" },
  { id: "family", name: "Familiar" },
  { id: "solo", name: "Solo Travel" },
]

const tours = [
  {
    id: 1,
    title: "MACHU PICCHU CLÁSICO",
    category: "CULTURAL, TREKKING",
    categoryColor: "pink",
    description:
      "Descubre la ciudadela perdida de los Incas en una experiencia única con tren panorámico y guía especializado.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "4 días",
    level: "Moderado",
    co2: "12.5kg CO2e por día",
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviews: 1247,
    isPopular: true,
    isPeru: true,
    highlights: ["Tren panorámico", "Guía experto", "Amanecer en Machu Picchu"],
  },
  {
    id: 2,
    title: "CAMINO INCA TRADICIONAL",
    category: "AVENTURA, TREKKING",
    categoryColor: "blue",
    description: "Trekking épico por senderos ancestrales hasta Machu Picchu con camping y porteadores incluidos.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "5 días",
    level: "Desafiante",
    co2: "8.2kg CO2e por día",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 892,
    isPopular: false,
    isPeru: true,
    highlights: ["Senderos originales", "Camping", "Puerta del Sol"],
  },
  {
    id: 3,
    title: "AMAZONAS PERUANO",
    category: "AVENTURA, NATURALEZA",
    categoryColor: "green",
    description: "Expedición a la selva tropical con avistamiento de delfines rosados y comunidades nativas.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "6 días",
    level: "Fácil",
    co2: "15.8kg CO2e por día",
    price: 449,
    originalPrice: 599,
    rating: 4.7,
    reviews: 634,
    isPopular: true,
    isPeru: true,
    highlights: ["Lodge ecológico", "Delfines rosados", "Comunidades nativas"],
  },
  {
    id: 4,
    title: "CAÑÓN DEL COLCA",
    category: "AVENTURA, CULTURAL",
    categoryColor: "orange",
    description:
      "Observa el vuelo del cóndor y disfruta de aguas termales en uno de los cañones más profundos del mundo.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "4 días",
    level: "Moderado",
    co2: "11.3kg CO2e por día",
    price: 379,
    originalPrice: 479,
    rating: 4.6,
    reviews: 456,
    isPopular: false,
    isPeru: true,
    highlights: ["Vuelo del cóndor", "Aguas termales", "Pueblos coloniales"],
  },
  {
    id: 5,
    title: "LAGO TITICACA MÍSTICO",
    category: "CULTURAL, FAMILIAR",
    categoryColor: "purple",
    description: "Navega por el lago navegable más alto del mundo y conoce las islas flotantes de los Uros.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "3 días",
    level: "Fácil",
    co2: "9.7kg CO2e por día",
    price: 259,
    originalPrice: 329,
    rating: 4.5,
    reviews: 723,
    isPopular: false,
    isPeru: true,
    highlights: ["Islas flotantes", "Cultura Uros", "Lago sagrado"],
  },
  {
    id: 6,
    title: "HUACACHINA Y NAZCA",
    category: "AVENTURA, MISTERIO",
    categoryColor: "yellow",
    description: "Vuela sobre las misteriosas líneas de Nazca y practica sandboarding en el oasis de Huacachina.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "3 días",
    level: "Fácil",
    co2: "18.4kg CO2e por día",
    price: 329,
    originalPrice: 429,
    rating: 4.4,
    reviews: 567,
    isPopular: true,
    isPeru: true,
    highlights: ["Vuelo sobre Nazca", "Sandboarding", "Oasis natural"],
  },
  {
    id: 7,
    title: "CUSCO IMPERIAL",
    category: "CULTURAL, HISTÓRICO",
    categoryColor: "red",
    description: "Explora la antigua capital del Imperio Inca y sus impresionantes sitios arqueológicos cercanos.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "4 días",
    level: "Fácil",
    co2: "7.9kg CO2e por día",
    price: 199,
    originalPrice: 259,
    rating: 4.6,
    reviews: 834,
    isPopular: false,
    isPeru: true,
    highlights: ["Valle Sagrado", "Sacsayhuamán", "Mercado San Pedro"],
  },
  {
    id: 8,
    title: "CHACHAPOYAS MISTERIOSO",
    category: "AVENTURA, ARQUEOLOGÍA",
    categoryColor: "teal",
    description: "Descubre la cultura Chachapoya y las impresionantes cataratas de Gocta en el norte de Perú.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "5 días",
    level: "Moderado",
    co2: "13.2kg CO2e por día",
    price: 399,
    originalPrice: 519,
    rating: 4.3,
    reviews: 234,
    isPopular: false,
    isPeru: true,
    highlights: ["Kuélap", "Cataratas de Gocta", "Sarcófagos de Karajía"],
  },
  {
    id: 9,
    title: "PARACAS Y BALLESTAS",
    category: "NATURALEZA, FAMILIAR",
    categoryColor: "cyan",
    description: "Observa lobos marinos, pingüinos y aves en las Islas Ballestas, el Galápagos peruano.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "2 días",
    level: "Fácil",
    co2: "14.6kg CO2e por día",
    price: 149,
    originalPrice: 199,
    rating: 4.4,
    reviews: 445,
    isPopular: false,
    isPeru: true,
    highlights: ["Islas Ballestas", "Reserva Nacional", "Vida marina"],
  },
]

export default function ToursPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTours, setFilteredTours] = useState(tours)
  const [showFilters, setShowFilters] = useState(false)

  // Filter tours based on selected criteria
  useEffect(() => {
    let filtered = tours

    if (selectedCategory !== "all") {
      filtered = filtered.filter((tour) => tour.category.toLowerCase().includes(selectedCategory))
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((tour) => tour.level.toLowerCase().includes(selectedLevel))
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTours(filtered)
  }, [selectedCategory, selectedLevel, selectedStyle, searchTerm])

  const getCategoryColor = (color: string) => {
    const colors = {
      pink: "bg-pink-100 text-pink-700 border-pink-300",
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      green: "bg-green-100 text-green-700 border-green-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      red: "bg-red-100 text-red-700 border-red-300",
      teal: "bg-teal-100 text-teal-700 border-teal-300",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-300",
    }
    return colors[color as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-700 border-green-300"
      case "moderado":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "desafiante":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header with Filters - Ajustado para no superponerse */}
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
                  <option value="all">TIPOS DE AVENTURA</option>
                  {tourCategories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name.toUpperCase()} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">NIVELES DE ACTIVIDAD</option>
                  {activityLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.icon} {level.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="all">ESTILOS DE VIAJE</option>
                  {travelStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              </div>

              <div className="bg-white border-2 border-black rounded-lg px-4 py-3 font-bold text-black flex items-center gap-2">
                <span className="text-blue-600">🇵🇪</span>
                VIAJERO PERÚ
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
                  <label className="block text-sm font-bold text-black mb-2">TIPO DE AVENTURA</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    {tourCategories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">NIVEL DE ACTIVIDAD</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    {activityLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
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
              <option>Duración</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
            >
              {/* Image */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {tour.isPeru && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 border-2 border-black flex items-center gap-2">
                      <span className="text-blue-600">🇵🇪</span>
                      <span className="font-bold text-black text-sm">VIAJERO PERÚ</span>
                    </div>
                  )}
                </div>

                {tour.isPopular && (
                  <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-lg font-bold text-sm border-2 border-black">
                    POPULAR
                  </div>
                )}

                {/* Price Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-black">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-600">${tour.price}</span>
                    <span className="text-sm text-gray-500 line-through">${tour.originalPrice}</span>
                  </div>
                  <div className="text-xs text-gray-600">por persona</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(tour.categoryColor)}`}
                  >
                    {tour.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-black mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  {tour.title}
                </h3>

                {/* Tour Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mountain className="w-4 h-4 text-gray-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getLevelColor(tour.level)}`}>
                      {tour.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-xs">{tour.co2}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">{tour.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-black">{tour.rating}</span>
                  </div>
                  <span className="text-gray-600 text-sm">({tour.reviews} reviews)</span>
                </div>

                {/* CTA */}
                <Button className="w-full bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold py-3 rounded-lg group/btn">
                  <span className="flex items-center justify-center gap-2">
                    Ver tour
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredTours.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-105">
              CARGAR MÁS TOURS
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredTours.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-black mb-4">No se encontraron tours</h3>
            <p className="text-gray-600 mb-6">Intenta ajustar tus filtros o términos de búsqueda</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedLevel("all")
                setSelectedStyle("all")
                setSearchTerm("")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              LIMPIAR FILTROS
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
