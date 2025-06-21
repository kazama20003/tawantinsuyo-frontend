"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Star,
  Mountain,
  ChevronDown,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Camera,
  Utensils,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

const itineraryCategories = [
  { id: "all", name: "Todos los Itinerarios", count: 12 },
  { id: "classic", name: "Clásicos", count: 4 },
  { id: "adventure", name: "Aventura", count: 3 },
  { id: "luxury", name: "Lujo", count: 2 },
  { id: "cultural", name: "Cultural", count: 2 },
  { id: "family", name: "Familiar", count: 1 },
]

const durations = [
  { id: "all", name: "Cualquier duración" },
  { id: "short", name: "3-5 días" },
  { id: "medium", name: "6-10 días" },
  { id: "long", name: "11+ días" },
]

const itineraries = [
  {
    id: 1,
    title: "PERÚ CLÁSICO COMPLETO",
    subtitle: "Lima, Cusco, Machu Picchu & Arequipa",
    category: "classic",
    duration: "12 días / 11 noches",
    durationDays: 12,
    price: 1899,
    originalPrice: 2399,
    rating: 4.9,
    reviews: 847,
    level: "Moderado",
    groupSize: "2-16 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: true,
    destinations: ["Lima", "Cusco", "Machu Picchu", "Valle Sagrado", "Arequipa", "Colca"],
    highlights: [
      "Vuelo sobre Líneas de Nazca",
      "Tren panorámico a Machu Picchu",
      "Vuelo del cóndor en Colca",
      "City tours en Lima y Cusco",
    ],
    includes: ["Vuelos domésticos", "Hoteles 4*", "Todas las comidas", "Guía experto", "Entradas"],
    dayByDay: [
      { day: 1, title: "Llegada a Lima", description: "City tour y cena de bienvenida" },
      { day: 2, title: "Lima - Cusco", description: "Vuelo y tour por Cusco" },
      { day: 3, title: "Valle Sagrado", description: "Pisac, Ollantaytambo y mercados" },
      { day: 4, title: "Machu Picchu", description: "Tren panorámico y tour guiado" },
      { day: 5, title: "Cusco libre", description: "Día libre para explorar" },
      { day: 6, title: "Cusco - Arequipa", description: "Vuelo y city tour" },
    ],
  },
  {
    id: 2,
    title: "AVENTURA INCA TRAIL",
    subtitle: "Trekking clásico a Machu Picchu",
    category: "adventure",
    duration: "8 días / 7 noches",
    durationDays: 8,
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 623,
    level: "Desafiante",
    groupSize: "4-12 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: false,
    destinations: ["Cusco", "Valle Sagrado", "Camino Inca", "Machu Picchu"],
    highlights: [
      "Trekking por senderos originales",
      "Camping bajo las estrellas",
      "Puerta del Sol amanecer",
      "Sitios arqueológicos únicos",
    ],
    includes: ["Camping completo", "Porteadores", "Chef de montaña", "Permisos especiales"],
    dayByDay: [
      { day: 1, title: "Llegada Cusco", description: "Aclimatación y briefing" },
      { day: 2, title: "Cusco - Wayllabamba", description: "Inicio del trekking" },
      { day: 3, title: "Paso Mujer Muerta", description: "Punto más alto del camino" },
      { day: 4, title: "Wiñay Wayna", description: "Sitios arqueológicos" },
      { day: 5, title: "Machu Picchu", description: "Amanecer en la ciudadela" },
    ],
  },
  {
    id: 3,
    title: "LUJO EN LOS ANDES",
    subtitle: "Experiencia premium todo incluido",
    category: "luxury",
    duration: "10 días / 9 noches",
    durationDays: 10,
    price: 3499,
    originalPrice: 4299,
    rating: 5.0,
    reviews: 234,
    level: "Fácil",
    groupSize: "2-8 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: true,
    destinations: ["Lima", "Cusco", "Valle Sagrado", "Machu Picchu", "Arequipa"],
    highlights: [
      "Hoteles 5* exclusivos",
      "Tren de lujo Hiram Bingham",
      "Chef privado disponible",
      "Experiencias VIP únicas",
    ],
    includes: ["Hoteles 5*", "Vuelos privados", "Mayordomo personal", "Spa incluido"],
    dayByDay: [
      { day: 1, title: "Lima VIP", description: "Hotel Belmond + cena gourmet" },
      { day: 2, title: "Vuelo privado", description: "Lima a Cusco en jet privado" },
      { day: 3, title: "Valle Sagrado Luxury", description: "Hotel Tambo del Inka" },
      { day: 4, title: "Tren Hiram Bingham", description: "Experiencia de lujo a Machu Picchu" },
    ],
  },
  {
    id: 4,
    title: "AMAZONAS PROFUNDO",
    subtitle: "Expedición a la selva peruana",
    category: "adventure",
    duration: "7 días / 6 noches",
    durationDays: 7,
    price: 1299,
    originalPrice: 1699,
    rating: 4.7,
    reviews: 456,
    level: "Moderado",
    groupSize: "2-12 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: false,
    destinations: ["Lima", "Iquitos", "Río Amazonas", "Reserva Pacaya Samiria"],
    highlights: [
      "Lodge ecológico flotante",
      "Avistamiento de delfines rosados",
      "Comunidades nativas",
      "Pesca de pirañas",
    ],
    includes: ["Lodge ecológico", "Todas las excursiones", "Guía naturalista", "Comidas típicas"],
    dayByDay: [
      { day: 1, title: "Lima - Iquitos", description: "Vuelo y llegada al lodge" },
      { day: 2, title: "Río Amazonas", description: "Navegación y vida silvestre" },
      { day: 3, title: "Comunidad nativa", description: "Intercambio cultural" },
      { day: 4, title: "Pacaya Samiria", description: "Reserva nacional" },
    ],
  },
  {
    id: 5,
    title: "NORTE MISTERIOSO",
    subtitle: "Chachapoyas y Kuélap",
    category: "cultural",
    duration: "9 días / 8 noches",
    durationDays: 9,
    price: 1599,
    originalPrice: 1999,
    rating: 4.6,
    reviews: 189,
    level: "Moderado",
    groupSize: "2-14 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: false,
    destinations: ["Lima", "Chachapoyas", "Kuélap", "Gocta", "Leymebamba"],
    highlights: ["Fortaleza de Kuélap", "Cataratas de Gocta", "Sarcófagos de Karajía", "Museo de Leymebamba"],
    includes: ["Hoteles boutique", "Transporte 4x4", "Guía arqueólogo", "Cable car Kuélap"],
    dayByDay: [
      { day: 1, title: "Lima - Chachapoyas", description: "Vuelo y llegada" },
      { day: 2, title: "Kuélap", description: "Fortaleza en las nubes" },
      { day: 3, title: "Cataratas Gocta", description: "Trekking a las cataratas" },
      { day: 4, title: "Karajía", description: "Sarcófagos misteriosos" },
    ],
  },
  {
    id: 6,
    title: "FAMILIA AVENTURERA",
    subtitle: "Perfecto para niños y padres",
    category: "family",
    duration: "6 días / 5 noches",
    durationDays: 6,
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 312,
    level: "Fácil",
    groupSize: "Familias 2-20 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: true,
    destinations: ["Lima", "Cusco", "Valle Sagrado", "Machu Picchu"],
    highlights: ["Actividades para niños", "Hoteles family-friendly", "Tren panorámico", "Talleres de cerámica"],
    includes: ["Hoteles familiares", "Actividades kids", "Comidas adaptadas", "Guía especializado"],
    dayByDay: [
      { day: 1, title: "Lima familiar", description: "Parque de las Aguas + Circuito Mágico" },
      { day: 2, title: "Cusco kids", description: "Plaza de Armas y mercado San Pedro" },
      { day: 3, title: "Valle Sagrado", description: "Pisac y talleres de cerámica" },
      { day: 4, title: "Machu Picchu", description: "Tren panorámico familiar" },
    ],
  },
  {
    id: 7,
    title: "SUR IMPERIAL",
    subtitle: "Arequipa, Colca y Titicaca",
    category: "classic",
    duration: "8 días / 7 noches",
    durationDays: 8,
    price: 1199,
    originalPrice: 1499,
    rating: 4.7,
    reviews: 567,
    level: "Moderado",
    groupSize: "2-16 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: false,
    destinations: ["Arequipa", "Colca", "Puno", "Lago Titicaca", "Islas flotantes"],
    highlights: ["Ciudad Blanca de Arequipa", "Vuelo del cóndor", "Lago Titicaca navegable", "Islas flotantes Uros"],
    includes: ["Hoteles 4*", "Todas las excursiones", "Guía local", "Transporte privado"],
    dayByDay: [
      { day: 1, title: "Llegada Arequipa", description: "City tour ciudad blanca" },
      { day: 2, title: "Arequipa - Colca", description: "Viaje al cañón" },
      { day: 3, title: "Cruz del Cóndor", description: "Vuelo del cóndor" },
      { day: 4, title: "Colca - Puno", description: "Viaje al Titicaca" },
    ],
  },
  {
    id: 8,
    title: "COSTA Y CULTURA",
    subtitle: "Lima, Paracas, Nazca e Ica",
    category: "cultural",
    duration: "5 días / 4 noches",
    durationDays: 5,
    price: 699,
    originalPrice: 899,
    rating: 4.5,
    reviews: 423,
    level: "Fácil",
    groupSize: "2-20 personas",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    isPopular: false,
    destinations: ["Lima", "Paracas", "Islas Ballestas", "Nazca", "Ica", "Huacachina"],
    highlights: ["Líneas de Nazca sobrevuelo", "Islas Ballestas", "Oasis de Huacachina", "Bodegas de Pisco"],
    includes: ["Hoteles 3-4*", "Vuelo Nazca", "Todas las excursiones", "Degustación pisco"],
    dayByDay: [
      { day: 1, title: "Lima histórica", description: "Centro histórico y Barranco" },
      { day: 2, title: "Lima - Paracas", description: "Viaje a la costa" },
      { day: 3, title: "Islas Ballestas", description: "Galápagos peruanos" },
      { day: 4, title: "Nazca", description: "Sobrevuelo líneas misteriosas" },
    ],
  },
]

export default function ItinerariesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItineraries, setFilteredItineraries] = useState(itineraries)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedItinerary, setExpandedItinerary] = useState<number | null>(null)

  // Filter itineraries based on selected criteria
  useEffect(() => {
    let filtered = itineraries

    if (selectedCategory !== "all") {
      filtered = filtered.filter((itinerary) => itinerary.category === selectedCategory)
    }

    if (selectedDuration !== "all") {
      filtered = filtered.filter((itinerary) => {
        switch (selectedDuration) {
          case "short":
            return itinerary.durationDays <= 5
          case "medium":
            return itinerary.durationDays >= 6 && itinerary.durationDays <= 10
          case "long":
            return itinerary.durationDays >= 11
          default:
            return true
        }
      })
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (itinerary) =>
          itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itinerary.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itinerary.destinations.some((dest) => dest.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredItineraries(filtered)
  }, [selectedCategory, selectedDuration, searchTerm])

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

  const getCategoryName = (category: string) => {
    const categoryMap = {
      classic: "CLÁSICO",
      adventure: "AVENTURA",
      luxury: "LUJO",
      cultural: "CULTURAL",
      family: "FAMILIAR",
    }
    return categoryMap[category as keyof typeof categoryMap] || category.toUpperCase()
  }

  const toggleExpanded = (id: number) => {
    setExpandedItinerary(expandedItinerary === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header with Filters */}
      <section className="bg-blue-600 border-4 border-black rounded-b-3xl mt-4 md:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="text-center mb-8">
              <h1 className="text-[3rem] md:text-[4rem] font-black text-white leading-none tracking-tight mb-4">
                ITINERARIOS
                <br />
                <span className="text-yellow-400">PERSONALIZADOS</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto">
                Descubre nuestros itinerarios cuidadosamente diseñados para cada tipo de viajero
              </p>
            </div>

            {/* Desktop Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  >
                    <option value="all">TODOS LOS ESTILOS</option>
                    {itineraryCategories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name.toUpperCase()} ({category.count})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="appearance-none bg-white border-2 border-black rounded-lg px-4 py-3 pr-10 font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  >
                    {durations.map((duration) => (
                      <option key={duration.id} value={duration.id}>
                        {duration.name.toUpperCase()}
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
                  placeholder="Buscar destinos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:border-white focus:ring-2 focus:ring-white/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight mb-2">
                ITINERARIOS
                <br />
                <span className="text-yellow-400">PERSONALIZADOS</span>
              </h1>
              <p className="text-sm text-blue-100">Encuentra tu aventura perfecta</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-blue-600 border-2 border-black font-bold px-4 py-2 rounded-lg text-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                FILTROS
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Buscar destinos..."
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
                  <label className="block text-sm font-bold text-black mb-2">ESTILO DE VIAJE</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    {itineraryCategories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">DURACIÓN</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    {durations.map((duration) => (
                      <option key={duration.id} value={duration.id}>
                        {duration.name}
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
            Mostrando <span className="font-bold text-black">{filteredItineraries.length}</span> de{" "}
            <span className="font-bold text-black">{itineraries.length}</span> itinerarios
          </p>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <span>Ordenar por:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-black">
              <option>Popularidad</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Duración</option>
            </select>
          </div>
        </div>
      </section>

      {/* Itineraries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          {filteredItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Image Section */}
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <Image
                    src={itinerary.image || "/placeholder.svg"}
                    alt={itinerary.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-xs border-2 border-white">
                      {getCategoryName(itinerary.category)}
                    </div>
                    {itinerary.isPopular && (
                      <div className="bg-pink-500 text-white px-3 py-1 rounded-lg font-bold text-xs border-2 border-white">
                        POPULAR
                      </div>
                    )}
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-black">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-blue-600">${itinerary.price}</span>
                      <span className="text-sm text-gray-500 line-through">${itinerary.originalPrice}</span>
                    </div>
                    <div className="text-xs text-gray-600">por persona</div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-2 p-6 md:p-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {itinerary.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">{itinerary.subtitle}</p>

                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{itinerary.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="w-4 h-4 text-gray-500" />
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border ${getLevelColor(itinerary.level)}`}
                          >
                            {itinerary.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{itinerary.groupSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold text-black">{itinerary.rating}</span>
                          <span className="text-gray-600">({itinerary.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      DESTINOS INCLUIDOS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.destinations.map((destination, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {destination}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      HIGHLIGHTS PRINCIPALES
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {itinerary.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Includes */}
                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-blue-600" />
                      INCLUYE
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {itinerary.includes.map((include, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{include}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day by Day - Expandable */}
                  <div className="mb-6">
                    <button
                      onClick={() => toggleExpanded(itinerary.id)}
                      className="flex items-center gap-2 font-bold text-black mb-3 hover:text-blue-600 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      ITINERARIO DÍA A DÍA
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expandedItinerary === itinerary.id ? "rotate-180" : ""}`}
                      />
                    </button>

                    {expandedItinerary === itinerary.id && (
                      <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                        <div className="space-y-3">
                          {itinerary.dayByDay.map((day, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">{day.day}</span>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-black text-sm">{day.title}</h5>
                                <p className="text-xs text-gray-600">{day.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105">
                      RESERVAR AHORA
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 rounded-lg transition-all duration-300"
                    >
                      MÁS DETALLES
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredItineraries.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-105">
              CARGAR MÁS ITINERARIOS
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredItineraries.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-black mb-4">No se encontraron itinerarios</h3>
            <p className="text-gray-600 mb-6">Intenta ajustar tus filtros o términos de búsqueda</p>
            <Button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedDuration("all")
                setSearchTerm("")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              LIMPIAR FILTROS
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white border-4 border-black rounded-3xl mx-4 sm:mx-6 lg:mx-8 mb-8 md:mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="text-[2.5rem] md:text-[4rem] font-black leading-none tracking-tight mb-6">
            ¿NO ENCUENTRAS LO QUE
            <br />
            <span className="text-blue-400">BUSCAS?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Creamos itinerarios personalizados según tus intereses, tiempo y presupuesto
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-blue-600 transition-all duration-300 hover:scale-105">
              CREAR ITINERARIO PERSONALIZADO
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              HABLAR CON EXPERTO
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Consulta gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Respuesta en 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Sin compromiso</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
