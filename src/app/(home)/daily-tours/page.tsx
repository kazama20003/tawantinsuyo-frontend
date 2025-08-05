"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Camera, MessageCircle, Mail, Phone, Star, Users, ArrowRight, Heart, Calendar } from "lucide-react"
import Image from "next/image"
import { useCallback } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { Locale } from "@/lib/i18n"
import Header from "@/components/header"

// Define types for daily tours
interface DailyTour {
  id: string
  name: { es: string; en: string }
  description: { es: string; en: string }
  image: string
  times: string[]
  priceRange: { es: string; en: string }
  highlights: { es: string[]; en: string[] }
  category: string
  duration: { es: string; en: string }
  difficulty: { es: string; en: string }
  rating: number
  reviews: number
}

// Daily Tours data
const dailyTours: DailyTour[] = [
  {
    id: "rafting-rio-chili",
    name: { es: "Rafting Río Chili", en: "Chili River Rafting" },
    description: {
      es: "Aventura de rafting en el río Chili, cerca de Arequipa, con rápidos emocionantes y paisajes volcánicos únicos.",
      en: "Rafting adventure on the Chili River, near Arequipa, with exciting rapids and unique volcanic landscapes.",
    },
    image: "/rafting-rio-chili.png",
    times: ["8:00 AM", "11:00 AM"],
    priceRange: { es: "S/ 70 - S/ 90", en: "S/ 70 - S/ 90" },
    highlights: {
      es: ["Rápidos emocionantes", "Paisajes volcánicos", "Guías certificados", "Equipo de seguridad incluido"],
      en: ["Exciting rapids", "Volcanic landscapes", "Certified guides", "Safety equipment included"],
    },
    category: "adventure",
    duration: { es: "3-4 horas", en: "3-4 hours" },
    difficulty: { es: "Moderado", en: "Moderate" },
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "cuatrimotos",
    name: { es: "Cuatrimotos ATV", en: "ATV Tours" },
    description: {
      es: "Recorrido en cuatrimotos por paisajes desérticos y rurales, una experiencia llena de adrenalina y vistas panorámicas.",
      en: "ATV tour through desert and rural landscapes, an adrenaline-filled experience with panoramic views.",
    },
    image: "/atv-tour.png",
    times: ["8:00 AM", "11:00 AM", "2:00 PM"],
    priceRange: { es: "S/ 95 - S/ 115", en: "S/ 95 - S/ 115" },
    highlights: {
      es: ["Aventura off-road", "Vistas panorámicas", "Instrucción completa", "Diversión garantizada"],
      en: ["Off-road adventure", "Panoramic views", "Full instruction", "Guaranteed fun"],
    },
    category: "adventure",
    duration: { es: "2-3 horas", en: "2-3 hours" },
    difficulty: { es: "Fácil", en: "Easy" },
    rating: 4.7,
    reviews: 203,
  },
  {
    id: "ruta-del-sillar",
    name: { es: "Ruta del Sillar", en: "Sillar Route" },
    description: {
      es: "Explora las canteras de sillar y el arte de los talladores de piedra, un viaje cultural por la arquitectura de Arequipa.",
      en: "Explore the sillar quarries and the art of stone carvers, a cultural journey through Arequipa's architecture.",
    },
    image: "/sillar-route.png",
    times: ["9:00 AM", "2:00 PM"],
    priceRange: { es: "S/ 40 - S/ 60", en: "S/ 40 - S/ 60" },
    highlights: {
      es: ["Canteras de Añashuayco", "Tallado en sillar", "Arte rupestre", "Paisajes únicos"],
      en: ["Añashuayco quarries", "Sillar carving", "Rock art", "Unique landscapes"],
    },
    category: "cultural",
    duration: { es: "4-5 horas", en: "4-5 hours" },
    difficulty: { es: "Fácil", en: "Easy" },
    rating: 4.6,
    reviews: 89,
  },
]

export default function DailyToursPage() {
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Helper function to get translated text
  const getTranslatedText = useCallback(
    (text: { es: string; en: string }): string => {
      return text[currentLocale] || text.es
    },
    [currentLocale],
  )

  // Helper function to get translated array
  const getTranslatedArray = useCallback(
    (text: { es: string[]; en: string[] }): string[] => {
      return text[currentLocale] || text.es
    },
    [currentLocale],
  )

  // Handle WhatsApp contact
  const handleWhatsAppContact = useCallback((tourName: string, times: string[], priceRange: string) => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el tour "${tourName}".

📅 Horarios disponibles: ${times.join(", ")}
💰 Precio: ${priceRange}

Me gustaría obtener más información y reservar.
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

Me gustaría obtener más información sobre este tour.

Quedo atento a su respuesta.

Saludos cordiales.`,
    )
    const emailUrl = `mailto:tawantinsuyoaqp@gmail.com?subject=${subject}&body=${body}`
    window.open(emailUrl, "_blank")
  }, [])

  const getCategoryColor = useCallback((category: string): string => {
    const colors = {
      adventure: "bg-red-500 text-white",
      cultural: "bg-purple-500 text-white",
      nature: "bg-green-500 text-white",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500 text-white"
  }, [])

  const getDifficultyColor = useCallback((difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
      case "easy":
        return "bg-green-100 text-green-700 border-green-300"
      case "moderado":
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "difícil":
      case "difficult":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Add proper padding to avoid header overlap */}
      <div className="pt-48 sm:pt-56 md:pt-64 lg:pt-72 xl:pt-80 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 md:mb-16 lg:mb-20"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
              <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">
                {currentLocale === "es" ? "DESCUBRE" : "DISCOVER"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-4">
              {currentLocale === "es" ? "SALIDAS" : "DAILY"}
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight mb-8">
              {currentLocale === "es" ? "DIARIAS" : "DEPARTURES"}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              {currentLocale === "es"
                ? "Explora nuestras emocionantes salidas diarias, perfectas para una aventura rápida y memorable en Arequipa."
                : "Explore our exciting daily departures, perfect for a quick and memorable adventure in Arequipa."}
            </p>

            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() =>
                    handleWhatsAppContact(
                      currentLocale === "es"
                        ? "Salidas Diarias - Consulta General"
                        : "Daily Departures - General Inquiry",
                      [],
                      "",
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {currentLocale === "es" ? "CONSULTAR AHORA" : "INQUIRE NOW"}
                </Button>
              </motion.div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="font-bold">+51 913 876 154</span>
              </div>
            </div>
          </motion.div>

          {/* Daily Tours Grid */}
          <div className="space-y-8 mb-16 md:mb-20">
            <AnimatePresence>
              {dailyTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border-4 border-black shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Image Section */}
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <Image
                          src={tour.image || "/placeholder.svg"}
                          alt={getTranslatedText(tour.name)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <Badge
                              className={`font-black text-xs border-2 border-white ${getCategoryColor(tour.category)}`}
                            >
                              {tour.category.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`text-xs font-bold border ${getDifficultyColor(getTranslatedText(tour.difficulty))}`}
                            >
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

                        {/* Price Overlay */}
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-white">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black text-blue-600">
                                {getTranslatedText(tour.priceRange)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {currentLocale === "es" ? "por persona" : "per person"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="lg:col-span-2 p-6 md:p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-black text-black mb-2 group-hover:text-blue-600 transition-colors duration-300">
                              {getTranslatedText(tour.name)}
                            </h3>
                            <p className="text-lg text-gray-600 mb-4">{getTranslatedText(tour.description)}</p>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-4 text-sm mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">{getTranslatedText(tour.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  2-15 {currentLocale === "es" ? "personas" : "people"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-bold text-black">{tour.rating}</span>
                                <span className="text-gray-600">({tour.reviews})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Times */}
                        <div className="mb-6">
                          <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {currentLocale === "es" ? "HORARIOS DE SALIDA" : "DEPARTURE TIMES"}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {tour.times.map((time, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-200"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-6">
                          <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-blue-600" />
                            {currentLocale === "es" ? "DESTACADOS" : "HIGHLIGHTS"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getTranslatedArray(tour.highlights).map((highlight: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-sm text-gray-700">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button
                              onClick={() =>
                                handleWhatsAppContact(
                                  getTranslatedText(tour.name),
                                  tour.times,
                                  getTranslatedText(tour.priceRange),
                                )
                              }
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl border-4 border-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-5 h-5" />
                              {currentLocale === "es" ? "COMPRAR POR WHATSAPP" : "BUY VIA WHATSAPP"}
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleEmailContact(getTranslatedText(tour.name))}
                              variant="outline"
                              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-black px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2"
                            >
                              <Mail className="w-5 h-5" />
                              {currentLocale === "es" ? "MÁS INFO" : "MORE INFO"}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
                ? "Contáctanos y reserva tu experiencia perfecta en Arequipa"
                : "Contact us and book your perfect experience in Arequipa"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() =>
                    handleWhatsAppContact(
                      currentLocale === "es"
                        ? "Salidas Diarias - Consulta General"
                        : "Daily Departures - General Inquiry",
                      [],
                      "",
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
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
                        ? "Salidas Diarias - Consulta General"
                        : "Daily Departures - General Inquiry",
                    )
                  }
                  className="bg-white text-blue-600 hover:bg-gray-100 font-black px-8 py-4 text-lg rounded-full border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
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
