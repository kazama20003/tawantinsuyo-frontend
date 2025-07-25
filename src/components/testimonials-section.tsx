"use client"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n"

const testimonials = [
  {
    id: 1,
    name: "María González",
    country: { es: "España", en: "Spain" },
    rating: 5,
    comment: {
      es: "¡Increíble experiencia en Machu Picchu! Los guías fueron excepcionales y la organización perfecta. Definitivamente recomiendo Tawantinsuyo Peru Tours.",
      en: "Incredible experience at Machu Picchu! The guides were exceptional and the organization perfect. I definitely recommend Tawantinsuyo Peru Tours.",
    },
    tour: { es: "Machu Picchu Clásico", en: "Classic Machu Picchu" },
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: { es: "Diciembre 2024", en: "December 2024" },
  },
  {
    id: 2,
    name: "John Smith",
    country: { es: "Estados Unidos", en: "United States" },
    rating: 5,
    comment: {
      es: "¡Increíble viaje por el Amazonas! La vida silvestre, el lodge, todo superó nuestras expectativas. Servicio profesional de principio a fin.",
      en: "Amazing journey through the Amazon! The wildlife, the lodge, everything was beyond our expectations. Professional service from start to finish.",
    },
    tour: { es: "Amazonas Peruano", en: "Peruvian Amazon" },
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: { es: "Noviembre 2024", en: "November 2024" },
  },
  {
    id: 3,
    name: "Sophie Dubois",
    country: { es: "Francia", en: "France" },
    rating: 5,
    comment: {
      es: "¡El Camino Inca fue absolutamente mágico! El equipo fue muy profesional y los paisajes impresionantes. ¡Gracias por esta aventura inolvidable!",
      en: "The Inca Trail was absolutely magical! The team was very professional and the landscapes breathtaking. Thank you for this unforgettable adventure!",
    },
    tour: { es: "Camino Inca Tradicional", en: "Traditional Inca Trail" },
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: { es: "Octubre 2024", en: "October 2024" },
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    country: { es: "México", en: "Mexico" },
    rating: 5,
    comment: {
      es: "El Cañón del Colca superó todas mis expectativas. Ver volar a los cóndores fue espectacular. El servicio de primera calidad en todo momento.",
      en: "Colca Canyon exceeded all my expectations. Seeing the condors fly was spectacular. First-class service at all times.",
    },
    tour: { es: "Cañón del Colca", en: "Colca Canyon" },
    image: "/placeholder.svg?height=80&width=80&text=CM",
    date: { es: "Septiembre 2024", en: "September 2024" },
  },
  {
    id: 5,
    name: "Emma Wilson",
    country: { es: "Reino Unido", en: "United Kingdom" },
    rating: 5,
    comment: {
      es: "¡El Lago Titicaca fue absolutamente impresionante! La experiencia de las islas flotantes fue única y nuestro guía increíblemente conocedor de la cultura local.",
      en: "Lake Titicaca was absolutely stunning! The floating islands experience was unique and our guide was incredibly knowledgeable about local culture.",
    },
    tour: { es: "Lago Titicaca Místico", en: "Mystical Lake Titicaca" },
    image: "/placeholder.svg?height=80&width=80&text=EW",
    date: { es: "Agosto 2024", en: "August 2024" },
  },
  {
    id: 6,
    name: "Roberto Silva",
    country: { es: "Brasil", en: "Brazil" },
    rating: 5,
    comment: {
      es: "¡Las Líneas de Nazca fueron fascinantes! El vuelo fue seguro y la experiencia en Huacachina inolvidable. Organización impecable de principio a fin.",
      en: "The Nazca Lines were fascinating! The flight was safe and the Huacachina experience unforgettable. Impeccable organization from start to finish.",
    },
    tour: { es: "Huacachina y Nazca", en: "Huacachina and Nazca" },
    image: "/placeholder.svg?height=80&width=80&text=RS",
    date: { es: "Julio 2024", en: "July 2024" },
  },
]

export default function TestimonialsSection() {
  const pathname = usePathname()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

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

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerView))
    }, 5000)
    return () => clearInterval(interval)
  }, [itemsPerView])

  const maxIndex = Math.max(0, Math.ceil(testimonials.length / itemsPerView) - 1)

  const scrollToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }

  const scrollLeft = () => {
    scrollToIndex(currentIndex - 1)
  }

  const scrollRight = () => {
    scrollToIndex(currentIndex + 1)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-5 h-5 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getTranslatedText = (text: { es: string; en: string }) => {
    return text[currentLocale] || text.es
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
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
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
              <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">
                {currentLocale === "es" ? "TESTIMONIOS" : "TESTIMONIALS"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-4">
              {currentLocale === "es" ? "LO QUE DICEN" : "WHAT OUR"}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight">
              {currentLocale === "es" ? "NUESTROS VIAJEROS" : "TRAVELERS SAY"}
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:max-w-lg xl:max-w-xl"
          >
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {currentLocale === "es"
                ? "Más de 10,000 viajeros han confiado en nosotros para crear sus mejores recuerdos en Perú."
                : "Over 10,000 travelers have trusted us to create their best memories in Peru."}
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="relative mb-12 md:mb-16">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-600 ease-out gap-6 md:gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
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
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl border-4 border-black p-6 md:p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform duration-300">
                        <Quote className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">{renderStars(testimonial.rating)}</div>

                    {/* Comment */}
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8 font-medium min-h-[6rem] md:min-h-[7rem]">
                      {getTranslatedText(testimonial.comment)}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-4 pt-6 border-t-4 border-gray-100">
                      <div className="relative">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full border-4 border-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-blue-600 font-bold text-sm">{getTranslatedText(testimonial.country)}</p>
                        <p className="text-gray-500 text-xs font-bold">
                          {getTranslatedText(testimonial.tour)} • {getTranslatedText(testimonial.date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
          {/* Pagination Dots */}
          <div className="flex gap-3 order-2 sm:order-1">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(index)}
                className={`w-4 h-4 rounded-full border-2 border-black transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 scale-125" : "bg-white hover:bg-gray-200"
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
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-black flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-blue-600 hover:text-white hover:shadow-lg"
              }`}
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollRight}
              disabled={currentIndex >= maxIndex}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-black flex items-center justify-center transition-all duration-300 ${
                currentIndex >= maxIndex
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-blue-600 hover:text-white hover:shadow-lg"
              }`}
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { number: "10,000+", label: currentLocale === "es" ? "VIAJEROS FELICES" : "HAPPY TRAVELERS" },
            { number: "4.9★", label: currentLocale === "es" ? "RATING PROMEDIO" : "AVERAGE RATING" },
            { number: "15+", label: currentLocale === "es" ? "AÑOS EXPERIENCIA" : "YEARS EXPERIENCE" },
            { number: "50+", label: currentLocale === "es" ? "TOURS DISPONIBLES" : "AVAILABLE TOURS" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-white rounded-3xl border-4 border-black p-6 shadow-lg"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 mb-2">{stat.number}</div>
              <div className="text-sm md:text-base font-black text-gray-900">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
