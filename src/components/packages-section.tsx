"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Clock, Users, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/axiosInstance"
import type { Tour } from "@/types/tour"

export default function PackagesSection() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Fetch top tours
  useEffect(() => {
    const fetchTopTours = async () => {
      try {
        setLoading(true)
        const response = await api.get("/tours/top")
        // Validar estructura de respuesta
        let toursData = response.data
        if (toursData && typeof toursData === "object" && !Array.isArray(toursData)) {
          if (toursData.data && Array.isArray(toursData.data)) {
            toursData = toursData.data
          } else if (toursData.tours && Array.isArray(toursData.tours)) {
            toursData = toursData.tours
          }
        }
        // Asegurar que tenemos un array
        if (!Array.isArray(toursData)) {
          console.warn("API response is not an array:", toursData)
          setTours([])
        } else {
          setTours(toursData)
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching top tours:", err)
        setError("Error al cargar los tours populares")
        setTours([]) // Asegurar que tours sea un array vacío en caso de error
      } finally {
        setLoading(false)
      }
    }

    fetchTopTours()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "facil":
        return "bg-green-100 text-green-700 border-green-300"
      case "moderado":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "difícil":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "aventura":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "cultural":
        return "bg-purple-100 text-purple-700 border-purple-300"
      case "relajación":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "naturaleza":
        return "bg-green-100 text-green-700 border-green-300"
      case "trekking":
        return "bg-red-100 text-red-700 border-red-300"
      case "panoramico":
        return "bg-cyan-100 text-cyan-700 border-cyan-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight">
              TOURS POPULARES
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <span className="ml-4 text-xl font-medium text-gray-600">Cargando tours...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight">
              TOURS POPULARES
            </h2>
          </div>
          <div className="text-center py-20">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 text-white hover:bg-blue-700">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (tours.length === 0) {
    return (
      <section id="packages-section" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight">
              TOURS POPULARES
            </h2>
          </div>
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No hay tours disponibles en este momento.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="packages-section" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight">
            TOURS POPULARES
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Descubre los destinos más solicitados por nuestros viajeros
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className={`absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 shadow-lg ${
              currentIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-blue-600 hover:text-white hover:border-blue-600"
            }`}
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={scrollRight}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 shadow-lg ${
              currentIndex >= maxIndex
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-blue-600 hover:text-white hover:border-blue-600"
            }`}
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden mx-6 md:mx-10">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className={`flex-shrink-0 px-2 md:px-4 ${
                    itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : "w-1/3"
                  }`}
                >
                  <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] group h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <Image
                        src={tour.imageUrl || "/placeholder.svg?height=400&width=600&text=Tour+Image"}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay gradiente para mejor legibilidad */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                      {/* Featured Badge - Posición mejorada */}
                      {tour.featured && (
                        <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-lg font-bold text-xs shadow-lg">
                          DESTACADO
                        </div>
                      )}

                      {/* Price Badge - Rediseñado */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-200 shadow-lg">
                          <div className="flex items-center gap-1">
                            <span className="text-lg md:text-xl font-black text-blue-600">S/{tour.price}</span>
                            {tour.originalPrice && tour.originalPrice > tour.price && (
                              <span className="text-xs text-gray-500 line-through">S/{tour.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rating y Location - Posición mejorada */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-xs">{tour.rating}</span>
                          <span className="text-white/80 text-xs">({tour.reviews})</span>
                        </div>
                        <div className="bg-blue-600/90 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-white font-medium text-xs">{truncateText(tour.location, 12)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Flex grow para altura uniforme */}
                    <div className="p-4 md:p-5 flex-grow flex flex-col">
                      {/* Title - Altura fija */}
                      <h3 className="text-lg md:text-xl font-black text-black mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight h-12 md:h-14 overflow-hidden">
                        {truncateText(tour.title, 50)}
                      </h3>

                      {/* Subtitle - Altura fija */}
                      {tour.subtitle && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-3 h-10 overflow-hidden">
                          {truncateText(tour.subtitle, 80)}
                        </p>
                      )}

                      {/* Tour Info - Compacto */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span className="text-blue-600 font-medium text-xs">{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                          <Users className="w-3 h-3 text-green-600" />
                          <span className="text-green-600 font-medium text-xs">{tour.packageType}</span>
                        </div>
                      </div>

                      {/* Category and Difficulty - Mejorado */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        <div
                          className={`px-2 py-1 rounded-lg border text-xs font-bold ${getCategoryColor(tour.category)}`}
                        >
                          {truncateText(tour.category, 10)}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg border text-xs font-bold ${getDifficultyColor(tour.difficulty)}`}
                        >
                          {tour.difficulty}
                        </div>
                      </div>

                      {/* Highlights Preview - Compacto */}
                      {tour.highlights && tour.highlights.length > 0 && (
                        <div className="mb-4 flex-grow">
                          <h4 className="font-bold text-xs text-gray-700 mb-2">Destacados:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {tour.highlights.slice(0, 2).map((highlight, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-blue-600 mt-0.5 text-xs">•</span>
                                <span className="line-clamp-1">{truncateText(highlight, 40)}</span>
                              </li>
                            ))}
                            {tour.highlights.length > 2 && (
                              <li className="text-blue-600 font-medium text-xs">
                                +{tour.highlights.length - 2} más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Action Button - Siempre al final */}
                      <div className="mt-auto">
                        <Link href={`/tours/${tour.slug}`}>
                          <Button className="w-full bg-transparent text-black border-2 border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group/btn font-bold py-2 md:py-3 text-sm rounded-lg">
                            <span className="flex items-center justify-center gap-2">
                              VER DETALLES
                              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        {tours.length > itemsPerView && (
          <div className="flex justify-center mt-8 md:mt-12 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 border-blue-600" : "bg-white hover:bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* More Tours Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link href="/tours">
            <Button className="bg-black text-white hover:bg-blue-600 font-black px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-full border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl">
              VER TODOS LOS TOURS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
