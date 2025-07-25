"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, MessageCircle, Mountain, Camera, Compass, Heart, Phone, Award, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {  type Locale } from "@/lib/i18n"
import Header from "@/components/header"

// Types for Arequipa destinations
interface ArequipaDestination {
  id: string
  name: { es: string; en: string }
  description: { es: string; en: string }
  duration: { es: string; en: string }
  difficulty: { es: string; en: string }
  highlights: { es: string[]; en: string[] }
  image: string
  category: string
  featured: boolean
  coordinates: { lat: number; lng: number }
}

// Arequipa destinations data
const arequipaDestinations: ArequipaDestination[] = [
  {
    id: "colca-canyon",
    name: {
      es: "Cañón del Colca",
      en: "Colca Canyon",
    },
    description: {
      es: "Uno de los cañones más profundos del mundo, hogar de los majestuosos cóndores andinos y pueblos tradicionales.",
      en: "One of the world's deepest canyons, home to majestic Andean condors and traditional villages.",
    },
    duration: { es: "2-3 días", en: "2-3 days" },
    difficulty: { es: "Moderado", en: "Moderate" },
    highlights: {
      es: [
        "Vuelo de los cóndores",
        "Pueblos tradicionales",
        "Aguas termales",
        "Terrazas preincaicas",
        "Mirador Cruz del Cóndor",
      ],
      en: ["Condor flight", "Traditional villages", "Hot springs", "Pre-Inca terraces", "Cruz del Condor viewpoint"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/colca-canyon-condor-flight_abc123.webp",
    category: "adventure",
    featured: true,
    coordinates: { lat: -15.6, lng: -71.9 },
  },
  {
    id: "misti-volcano",
    name: {
      es: "Volcán Misti",
      en: "Misti Volcano",
    },
    description: {
      es: "El volcán símbolo de Arequipa, perfecto cono volcánico que domina el horizonte de la Ciudad Blanca.",
      en: "Arequipa's symbol volcano, a perfect volcanic cone that dominates the White City's horizon.",
    },
    duration: { es: "2 días", en: "2 days" },
    difficulty: { es: "Desafiante", en: "Challenging" },
    highlights: {
      es: [
        "Ascenso al cráter",
        "Vista panorámica de Arequipa",
        "Camping de altura",
        "Flora y fauna andina",
        "Experiencia única",
      ],
      en: [
        "Crater ascent",
        "Panoramic view of Arequipa",
        "High altitude camping",
        "Andean flora and fauna",
        "Unique experience",
      ],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/misti-volcano-arequipa_def456.webp",
    category: "adventure",
    featured: true,
    coordinates: { lat: -16.294, lng: -71.409 },
  },
  {
    id: "arequipa-city",
    name: {
      es: "Centro Histórico de Arequipa",
      en: "Arequipa Historic Center",
    },
    description: {
      es: "Patrimonio Mundial de la UNESCO, conocida como la Ciudad Blanca por su arquitectura colonial en sillar volcánico.",
      en: "UNESCO World Heritage Site, known as the White City for its colonial architecture in volcanic sillar stone.",
    },
    duration: { es: "1 día", en: "1 day" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: [
        "Monasterio de Santa Catalina",
        "Plaza de Armas",
        "Catedral de Arequipa",
        "Barrio de San Lázaro",
        "Museos coloniales",
      ],
      en: [
        "Santa Catalina Monastery",
        "Main Square",
        "Arequipa Cathedral",
        "San Lazaro Neighborhood",
        "Colonial museums",
      ],
    },
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp",
    category: "cultural",
    featured: true,
    coordinates: { lat: -16.409, lng: -71.537 },
  },
  {
    id: "salinas-aguada-blanca",
    name: {
      es: "Reserva Salinas y Aguada Blanca",
      en: "Salinas and Aguada Blanca Reserve",
    },
    description: {
      es: "Reserva nacional con paisajes altiplánicos, vicuñas, flamencos y lagunas de sal en el camino al Colca.",
      en: "National reserve with altiplano landscapes, vicuñas, flamingos and salt lagoons on the way to Colca.",
    },
    duration: { es: "Medio día", en: "Half day" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: [
        "Vicuñas en libertad",
        "Flamencos rosados",
        "Paisajes altiplánicos",
        "Lagunas de sal",
        "Fotografía de naturaleza",
      ],
      en: ["Wild vicuñas", "Pink flamingos", "Altiplano landscapes", "Salt lagoons", "Nature photography"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/salinas-aguada-blanca-vicunas_ghi789.webp",
    category: "nature",
    featured: false,
    coordinates: { lat: -15.7, lng: -71.1 },
  },
  {
    id: "cotahuasi-canyon",
    name: {
      es: "Cañón de Cotahuasi",
      en: "Cotahuasi Canyon",
    },
    description: {
      es: "El cañón más profundo del mundo, destino perfecto para aventureros que buscan experiencias únicas y remotas.",
      en: "The world's deepest canyon, perfect destination for adventurers seeking unique and remote experiences.",
    },
    duration: { es: "3-4 días", en: "3-4 days" },
    difficulty: { es: "Desafiante", en: "Challenging" },
    highlights: {
      es: [
        "Cañón más profundo del mundo",
        "Catarata de Sipia",
        "Pueblos ancestrales",
        "Trekking extremo",
        "Paisajes vírgenes",
      ],
      en: ["World's deepest canyon", "Sipia Waterfall", "Ancestral villages", "Extreme trekking", "Virgin landscapes"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/cotahuasi-canyon-waterfall_jkl012.webp",
    category: "adventure",
    featured: false,
    coordinates: { lat: -15.2, lng: -72.9 },
  },
  {
    id: "petroglyphs-toro-muerto",
    name: {
      es: "Petroglifos de Toro Muerto",
      en: "Toro Muerto Petroglyphs",
    },
    description: {
      es: "La mayor concentración de petroglifos del mundo, con más de 5,000 grabados rupestres de culturas preincaicas.",
      en: "The world's largest concentration of petroglyphs, with over 5,000 pre-Inca rock carvings.",
    },
    duration: { es: "Medio día", en: "Half day" },
    difficulty: { es: "Fácil", en: "Easy" },
    highlights: {
      es: [
        "5,000+ petroglifos",
        "Arte rupestre milenario",
        "Culturas preincaicas",
        "Paisaje desértico",
        "Arqueología viviente",
      ],
      en: ["5,000+ petroglyphs", "Millenary rock art", "Pre-Inca cultures", "Desert landscape", "Living archaeology"],
    },
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/toro-muerto-petroglyphs_mno345.webp",
    category: "cultural",
    featured: false,
    coordinates: { lat: -16.2, lng: -72.4 },
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
  const handleWhatsAppContact = useCallback((destinationName: string) => {
    const message = `¡Hola! Me interesa el tour a ${destinationName}. ¿Podrían darme más información personalizada?`
    const whatsappUrl = `https://wa.me/51984123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }, [])

  // Filter destinations by category
  const filteredDestinations = useMemo(() => {
    if (selectedCategory === "all") return arequipaDestinations
    return arequipaDestinations.filter((dest) => dest.category === selectedCategory)
  }, [selectedCategory])

  // Categories for filtering
  const categories = [
    { id: "all", name: { es: "Todos", en: "All" } },
    { id: "adventure", name: { es: "Aventura", en: "Adventure" } },
    { id: "cultural", name: { es: "Cultural", en: "Cultural" } },
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
              {currentLocale === "es" ? "Cargando destinos..." : "Loading destinations..."}
            </h2>
            <p className="text-gray-600">
              {currentLocale === "es"
                ? "Preparando los mejores destinos de Arequipa"
                : "Preparing the best destinations in Arequipa"}
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-32 sm:pt-40 md:pt-48 pb-16">
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
                {currentLocale === "es" ? "AREQUIPA" : "AREQUIPA"}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight">
                {currentLocale === "es" ? "LA CIUDAD BLANCA" : "THE WHITE CITY"}
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
                  ? "Explora la majestuosa Arequipa, Patrimonio Mundial de la UNESCO, con sus volcanes imponentes, cañones profundos y arquitectura colonial única construida en sillar volcánico blanco."
                  : "Explore majestic Arequipa, a UNESCO World Heritage Site, with its imposing volcanoes, deep canyons and unique colonial architecture built from white volcanic sillar stone."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handleWhatsAppContact("Arequipa")}
                    className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {currentLocale === "es" ? "PLANIFICA TU VIAJE" : "PLAN YOUR TRIP"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-4 text-lg rounded-2xl transition-all duration-300 flex items-center gap-2 bg-transparent"
                  >
                    <Phone className="w-5 h-5" />
                    +51 984 123 456
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

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-16 md:mb-20">
            <AnimatePresence>
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
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
                        src={destination.image || "/placeholder.svg"}
                        alt={getTranslatedText(destination.name)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          {destination.featured && (
                            <Badge className="bg-pink-400 text-white border-2 border-white font-black">
                              ⭐ {currentLocale === "es" ? "DESTACADO" : "FEATURED"}
                            </Badge>
                          )}
                          <Badge className="bg-blue-600 text-white border-2 border-white font-black">
                            {getTranslatedText(destination.difficulty)}
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
                            <span className="text-sm font-bold text-gray-900">
                              {getTranslatedText(destination.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-tight">
                        {getTranslatedText(destination.name)}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                        {getTranslatedText(destination.description)}
                      </p>

                      {/* Highlights */}
                      <div className="mb-6">
                        <h4 className="font-black text-gray-900 mb-2 text-sm uppercase">
                          {currentLocale === "es" ? "DESTACADOS:" : "HIGHLIGHTS:"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getTranslatedHighlights(destination.highlights)
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
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => handleWhatsAppContact(getTranslatedText(destination.name))}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl border-4 border-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-5 h-5" />
                            {currentLocale === "es" ? "ATENCIÓN PERSONALIZADA" : "PERSONALIZED ATTENTION"}
                          </Button>
                        </motion.div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 font-bold">
                            {currentLocale === "es"
                              ? "Contáctanos para una experiencia única y personalizada"
                              : "Contact us for a unique and personalized experience"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Arequipa Map Section */}
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
                  {currentLocale === "es" ? "DESTINOS EN AREQUIPA" : "DESTINATIONS IN AREQUIPA"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {currentLocale === "es"
                    ? "Descubre la ubicación de cada destino y planifica tu ruta perfecta por la región de Arequipa."
                    : "Discover the location of each destination and plan your perfect route through the Arequipa region."}
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
                {arequipaDestinations.slice(0, 4).map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="absolute"
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + (index % 2) * 30}%`,
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

          {/* Why Choose Arequipa Section */}
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
                {currentLocale === "es" ? "ELEGIR AREQUIPA" : "CHOOSE AREQUIPA"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Mountain,
                  title: currentLocale === "es" ? "VOLCANES MAJESTUOSOS" : "MAJESTIC VOLCANOES",
                  description:
                    currentLocale === "es"
                      ? "Misti, Chachani y Pichu Pichu rodean la ciudad"
                      : "Misti, Chachani and Pichu Pichu surround the city",
                },
                {
                  icon: Award,
                  title: currentLocale === "es" ? "PATRIMONIO UNESCO" : "UNESCO HERITAGE",
                  description:
                    currentLocale === "es"
                      ? "Centro histórico reconocido mundialmente"
                      : "Globally recognized historic center",
                },
                {
                  icon: Camera,
                  title: currentLocale === "es" ? "ARQUITECTURA ÚNICA" : "UNIQUE ARCHITECTURE",
                  description:
                    currentLocale === "es"
                      ? "Construcciones en sillar volcánico blanco"
                      : "White volcanic sillar stone constructions",
                },
                {
                  icon: Compass,
                  title: currentLocale === "es" ? "AVENTURAS ÉPICAS" : "EPIC ADVENTURES",
                  description:
                    currentLocale === "es"
                      ? "Cañones profundos y paisajes únicos"
                      : "Deep canyons and unique landscapes",
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
                ? "Contáctanos y diseñemos juntos tu experiencia perfecta en Arequipa"
                : "Contact us and let's design your perfect Arequipa experience together"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleWhatsAppContact("Arequipa - Consulta General")}
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  {currentLocale === "es" ? "ESCRIBENOS POR WHATSAPP" : "MESSAGE US ON WHATSAPP"}
                </Button>
              </motion.div>
              <div className="flex items-center gap-2 text-white/90">
                <Phone className="w-5 h-5" />
                <span className="font-black">+51 984 123 456</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
