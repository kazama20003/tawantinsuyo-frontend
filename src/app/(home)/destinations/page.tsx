"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, MessageCircle, Mountain, Heart, Phone, Award, Loader2, Star, Users, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Locale } from "@/lib/i18n"
import Header from "@/components/header"

// Types for National Tours
interface NationalTour {
  id: string
  name: { es: string; en: string }
  description: { es: string; en: string }
  duration: { es: string; en: string }
  difficulty: { es: string; en: string }
  highlights: { es: string[]; en: string[] }
  image: string
  category: string
  featured: boolean
  rating: number
  reviews: number
  destination: string
}

// National Tours data
const nationalTours: NationalTour[] = [
  {
    id: "cusco-machu-picchu",
    name: {
      es: "Cusco & Machu Picchu",
      en: "Cusco & Machu Picchu",
    },
    description: {
      es: "Descubre la antigua capital del Imperio Inca y la ciudadela sagrada de Machu Picchu, una de las 7 maravillas del mundo moderno.",
      en: "Discover the ancient capital of the Inca Empire and the sacred citadel of Machu Picchu, one of the 7 wonders of the modern world.",
    },
    duration: { es: "4-7 días", en: "4-7 days" },
    difficulty: { es: "Moderado", en: "Moderate" },
    highlights: {
      es: ["Machu Picchu", "Valle Sagrado", "Sacsayhuamán", "Mercado San Pedro", "Tren panorámico"],
      en: ["Machu Picchu", "Sacred Valley", "Sacsayhuaman", "San Pedro Market", "Panoramic train"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413366/e6_yxi7v3.jpg",
    category: "cultural",
    featured: true,
    rating: 4.9,
    reviews: 2847,
    destination: "Cusco",
  },
  {
    id: "puno-titicaca",
    name: {
      es: "Puno & Lago Titicaca",
      en: "Puno & Lake Titicaca",
    },
    description: {
      es: "Explora el lago navegable más alto del mundo y conoce las fascinantes islas flotantes de los Uros y la cultura viva de Taquile.",
      en: "Explore the world's highest navigable lake and discover the fascinating floating islands of the Uros and the living culture of Taquile.",
    },
    duration: { es: "2-3 días", en: "2-3 days" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: ["Islas flotantes Uros", "Isla Taquile", "Lago Titicaca", "Cultura ancestral", "Textilería tradicional"],
      en: ["Uros floating islands", "Taquile Island", "Lake Titicaca", "Ancestral culture", "Traditional textiles"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413387/titicaca-lake_wxdbqv.jpg",
    category: "cultural",
    featured: true,
    rating: 4.7,
    reviews: 1523,
    destination: "Puno",
  },
  {
    id: "nazca-lines",
    name: {
      es: "Líneas de Nazca",
      en: "Nazca Lines",
    },
    description: {
      es: "Sobrevuela las misteriosas líneas de Nazca y descubre los geoglifos más enigmáticos del mundo desde una perspectiva única.",
      en: "Fly over the mysterious Nazca Lines and discover the world's most enigmatic geoglyphs from a unique perspective.",
    },
    duration: { es: "1-2 días", en: "1-2 days" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: [
        "Vuelo sobre las líneas",
        "Geoglifos milenarios",
        "Museo Nazca",
        "Acueductos de Cantalloc",
        "Cementerio Chauchilla",
      ],
      en: [
        "Flight over the lines",
        "Millenary geoglyphs",
        "Nazca Museum",
        "Cantalloc Aqueducts",
        "Chauchilla Cemetery",
      ],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413415/web-1920x1080-lineas-de-nazca_ifkkhu.jpg",
    category: "adventure",
    featured: true,
    rating: 4.6,
    reviews: 987,
    destination: "Nazca",
  },
  {
    id: "tacna-tours",
    name: {
      es: "Tours en Tacna",
      en: "Tacna Tours",
    },
    description: {
      es: "Conoce la heroica ciudad de Tacna, sus monumentos históricos, el desierto de la Yarada y la cultura fronteriza única.",
      en: "Discover the heroic city of Tacna, its historical monuments, the Yarada desert and the unique border culture.",
    },
    duration: { es: "1-2 días", en: "1-2 days" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: ["Arco Parabólico", "Casa Zela", "Desierto La Yarada", "Museo Ferroviario", "Paseo Cívico"],
      en: ["Parabolic Arch", "Zela House", "La Yarada Desert", "Railway Museum", "Civic Walk"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413442/Catedral_Nuestra_Se_C3_B1ora_del_Rosario_de_Tacna_c1o240.jpg",
    category: "cultural",
    featured: false,
    rating: 4.4,
    reviews: 456,
    destination: "Tacna",
  },
  {
    id: "lima-city-tour",
    name: {
      es: "Lima Colonial & Moderna",
      en: "Colonial & Modern Lima",
    },
    description: {
      es: "Recorre la capital gastronómica de Sudamérica, desde su centro histórico colonial hasta los modernos distritos de Miraflores y Barranco.",
      en: "Tour the gastronomic capital of South America, from its colonial historic center to the modern districts of Miraflores and Barranco.",
    },
    duration: { es: "1 día", en: "1 day" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: ["Centro Histórico", "Miraflores", "Barranco", "Gastronomía peruana", "Museos coloniales"],
      en: ["Historic Center", "Miraflores", "Barranco", "Peruvian gastronomy", "Colonial museums"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413464/plaza-de-armas-lima-desktop_i7rfvo.jpg",
    category: "cultural",
    featured: false,
    rating: 4.5,
    reviews: 1234,
    destination: "Lima",
  },
  {
    id: "iquitos-amazon",
    name: {
      es: "Iquitos & Amazonía",
      en: "Iquitos & Amazon",
    },
    description: {
      es: "Adéntrate en la selva amazónica peruana desde Iquitos, navega por el río Amazonas y descubre la biodiversidad más rica del planeta.",
      en: "Enter the Peruvian Amazon rainforest from Iquitos, navigate the Amazon River and discover the planet's richest biodiversity.",
    },
    duration: { es: "3-5 días", en: "3-5 days" },
    difficulty: { es: "Moderado", en: "Moderate" },
    highlights: {
      es: ["Río Amazonas", "Comunidades nativas", "Fauna amazónica", "Mercado Belén", "Lodge en la selva"],
      en: ["Amazon River", "Native communities", "Amazon wildlife", "Belen Market", "Jungle lodge"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1754413471/1200px-Iquitos-2012-plaza_vhj7z7.jpg",
    category: "nature",
    featured: true,
    rating: 4.8,
    reviews: 756,
    destination: "Iquitos",
  },
]

export default function DestinationsPage() {
  const pathname = usePathname()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Get translated text helper
  const getTranslatedText = useCallback(
    (text: { es: string; en: string }): string => {
      return text[currentLocale] || text.es
    },
    [currentLocale],
  )

  // Handle WhatsApp contact
  const handleWhatsAppContact = useCallback((tourName: string) => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el tour "${tourName}"

        Solicito más información personalizada sobre:
        - Disponibilidad de fechas
        - Detalles del itinerario
        - Opciones de hospedaje
        - Formas de pago

        ¡Gracias!`,
    )
    const whatsappUrl = `https://wa.me/51913876154?text=${message}`
    window.open(whatsappUrl, "_blank")
  }, [])

  // Handle email contact
  const handleEmailContact = useCallback((tourName: string) => {
    const subject = encodeURIComponent(`Consulta sobre ${tourName}`)
    const body = encodeURIComponent(
      `Estimado equipo de Tawantinsuyo Peru,

        Me interesa el tour "${tourName}".

        Solicito información sobre:
        - Disponibilidad de fechas
        - Itinerario detallado
        - Opciones de hospedaje
        - Formas de pago
        - Descuentos grupales

        Quedo atento a su respuesta.

        Saludos cordiales.`,
    )
    const emailUrl = `mailto:tawantinsuyoaqp@gmail.com?subject=${subject}&body=${body}`
    window.open(emailUrl, "_blank")
  }, [])

  // Filter tours by category
  const filteredTours = useMemo(() => {
    if (selectedCategory === "all") return nationalTours
    return nationalTours.filter((tour) => tour.category === selectedCategory)
  }, [selectedCategory])

  // Categories for filtering
  const categories = [
    { id: "all", name: { es: "Todos", en: "All" } },
    { id: "cultural", name: { es: "Cultural", en: "Cultural" } },
    { id: "adventure", name: { es: "Aventura", en: "Adventure" } },
    { id: "nature", name: { es: "Naturaleza", en: "Nature" } },
  ]

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getTranslatedHighlights = useCallback(
    (highlights: { es: string[]; en: string[] }): string[] => {
      return highlights[currentLocale] || highlights.es
    },
    [currentLocale],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-48 sm:pt-56 pb-16 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentLocale === "es" ? "Cargando tours..." : "Loading tours..."}
            </h2>
            <p className="text-gray-600">
              {currentLocale === "es" ? "Preparando los mejores tours nacionales" : "Preparing the best national tours"}
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-48 sm:pt-56 md:pt-64 lg:pt-72 xl:pt-80 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 md:mb-16 lg:mb-20 gap-6 md:gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">
                  {currentLocale === "es" ? "DESCUBRE" : "DISCOVER"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-4">
                {currentLocale === "es" ? "TOURS" : "TOURS"}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight">
                {currentLocale === "es" ? "NACIONALES" : "NATIONAL"}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:max-w-lg xl:max-w-xl"
            >
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                {currentLocale === "es"
                  ? "Explora los destinos más increíbles del Perú con nuestros tours especializados. Desde Machu Picchu hasta el Amazonas, vive experiencias únicas e inolvidables."
                  : "Explore Peru's most incredible destinations with our specialized tours. From Machu Picchu to the Amazon, live unique and unforgettable experiences."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() =>
                      handleWhatsAppContact(
                        currentLocale === "es"
                          ? "Tours Nacionales - Consulta General"
                          : "National Tours - General Inquiry",
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {currentLocale === "es" ? "PLANIFICA TU VIAJE" : "PLAN YOUR TRIP"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() =>
                      handleEmailContact(
                        currentLocale === "es"
                          ? "Tours Nacionales - Consulta General"
                          : "National Tours - General Inquiry",
                      )
                    }
                    variant="outline"
                    className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-4 text-lg rounded-2xl transition-all duration-300 flex items-center gap-2 bg-transparent"
                  >
                    <Mail className="w-5 h-5" />
                    {currentLocale === "es" ? "ENVIAR EMAIL" : "SEND EMAIL"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 md:mb-16"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-2xl border-4 font-black text-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-900 border-black hover:bg-gray-100"
                  }`}
                >
                  {getTranslatedText(category.name)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-16 md:mb-20">
            <AnimatePresence>
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border-4 border-black shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={tour.image || "/placeholder.svg"}
                        alt={getTranslatedText(tour.name)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          {tour.featured && (
                            <Badge className="bg-pink-400 text-white border-2 border-white font-black">
                              ⭐ {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                            </Badge>
                          )}
                          <Badge className="bg-blue-600 text-white border-2 border-white font-black">
                            {getTranslatedText(tour.difficulty)}
                          </Badge>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-white transition-all"
                        >
                          <Heart className="w-6 h-6 text-gray-700" />
                        </motion.button>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full border-2 border-white">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-bold text-gray-900">{getTranslatedText(tour.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                          {getTranslatedText(tour.name)}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-700">{tour.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-bold">{tour.destination}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">{tour.reviews} reviews</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                        {getTranslatedText(tour.description)}
                      </p>

                      {/* Highlights */}
                      <div className="mb-6">
                        <h4 className="font-black text-gray-900 mb-2 text-sm uppercase">
                          {currentLocale === "es" ? "DESTACADOS:" : "HIGHLIGHTS:"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getTranslatedHighlights(tour.highlights)
                            .slice(0, 3)
                            .map((highlight: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-bold border border-gray-300"
                              >
                                {highlight}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleWhatsAppContact(getTranslatedText(tour.name))}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl border-4 border-green-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleEmailContact(getTranslatedText(tour.name))}
                              variant="outline"
                              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-black py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </Button>
                          </motion.div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 font-bold">
                            {currentLocale === "es"
                              ? "Reserva ahora y vive una experiencia única"
                              : "Book now and live a unique experience"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Peru Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 mb-4">
                  <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                  <span className="text-lg md:text-xl font-bold text-blue-600 uppercase tracking-wide">
                    {currentLocale === "es" ? "MAPA" : "MAP"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  {currentLocale === "es" ? "DESTINOS EN PERÚ" : "DESTINATIONS IN PERU"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {currentLocale === "es"
                    ? "Descubre la ubicación de cada destino y planifica tu ruta perfecta por todo el Perú."
                    : "Discover the location of each destination and plan your perfect route throughout Peru."}
                </p>
              </div>

              {/* Interactive Map Placeholder */}
              <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl border-4 border-gray-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {currentLocale === "es" ? "MAPA INTERACTIVO" : "INTERACTIVE MAP"}
                    </h3>
                    <p className="text-gray-600 font-bold">
                      {currentLocale === "es"
                        ? "Próximamente: Mapa interactivo con todos los destinos"
                        : "Coming soon: Interactive map with all destinations"}
                    </p>
                  </div>
                </div>

                {/* Map Points */}
                {nationalTours.slice(0, 6).map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="absolute"
                    style={{
                      left: `${15 + index * 15}%`,
                      top: `${25 + (index % 3) * 25}%`,
                    }}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Why Choose Our Tours Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">
                  {currentLocale === "es" ? "¿POR QUÉ?" : "WHY?"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                {currentLocale === "es" ? "ELEGIR NUESTROS TOURS" : "CHOOSE OUR TOURS"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: currentLocale === "es" ? "EXPERIENCIA GARANTIZADA" : "GUARANTEED EXPERIENCE",
                  description:
                    currentLocale === "es"
                      ? "Más de 10 años creando experiencias únicas"
                      : "Over 10 years creating unique experiences",
                },
                {
                  icon: Users,
                  title: currentLocale === "es" ? "GUÍAS EXPERTOS" : "EXPERT GUIDES",
                  description:
                    currentLocale === "es"
                      ? "Guías locales certificados y apasionados"
                      : "Certified and passionate local guides",
                },
                {
                  icon: Heart,
                  title: currentLocale === "es" ? "ATENCIÓN PERSONALIZADA" : "PERSONALIZED ATTENTION",
                  description:
                    currentLocale === "es"
                      ? "Servicio 24/7 y atención a medida"
                      : "24/7 service and customized attention",
                },
                {
                  icon: Mountain,
                  title: currentLocale === "es" ? "DESTINOS ÚNICOS" : "UNIQUE DESTINATIONS",
                  description:
                    currentLocale === "es"
                      ? "Acceso a lugares especiales y exclusivos"
                      : "Access to special and exclusive places",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 bg-white rounded-3xl border-4 border-black flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <feature.icon className="w-10 h-10 text-blue-600" />
                  </motion.div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center bg-blue-600 rounded-3xl border-4 border-black p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
              {currentLocale === "es" ? "¿LISTO PARA LA AVENTURA?" : "READY FOR ADVENTURE?"}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {currentLocale === "es"
                ? "Contáctanos y diseñemos juntos tu experiencia perfecta en Perú"
                : "Contact us and let's design your perfect Peru experience together"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() =>
                    handleWhatsAppContact(
                      currentLocale === "es"
                        ? "Tours Nacionales - Consulta General"
                        : "National Tours - General Inquiry",
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  {currentLocale === "es" ? "ESCRIBENOS POR WHATSAPP" : "MESSAGE US ON WHATSAPP"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() =>
                    handleEmailContact(
                      currentLocale === "es"
                        ? "Tours Nacionales - Consulta General"
                        : "National Tours - General Inquiry",
                    )
                  }
                  className="bg-white text-blue-600 hover:bg-gray-100 font-black px-8 py-4 text-lg rounded-2xl border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  <Mail className="w-6 h-6" />
                  {currentLocale === "es" ? "ENVIAR EMAIL" : "SEND EMAIL"}
                </Button>
              </motion.div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/90">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span className="font-black">+51 913 876 154</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="font-black">tawantinsuyoaqp@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
