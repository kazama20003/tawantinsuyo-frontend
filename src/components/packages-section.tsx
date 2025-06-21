"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Clock, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

const packages = [
  {
    id: 1,
    title: "MACHU PICCHU CLÁSICO",
    description:
      "Descubre la ciudadela perdida de los Incas en una experiencia única que incluye tren panorámico y guía especializado.",
    price: 299,
    originalPrice: 399,
    duration: "4 días",
    groupSize: "2-15 personas",
    rating: 4.9,
    reviews: 1247,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528959/vista-del-misti-en-todo_o5pegh.jpg",
    isNew: true,
    difficulty: "Moderado",
  },
  {
    id: 2,
    title: "CAMINO INCA TRADICIONAL",
    description:
      "Trekking por senderos ancestrales hasta Machu Picchu. Una aventura con camping y porteadores incluidos.",
    price: 599,
    originalPrice: 799,
    duration: "5 días",
    groupSize: "4-12 personas",
    rating: 4.8,
    reviews: 892,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528992/caminoinca-4dias_tjdnns.jpg",
    isNew: false,
    difficulty: "Desafiante",
  },
  {
    id: 3,
    title: "AMAZONAS PERUANO",
    description:
      "Expedición a la selva tropical con avistamiento de delfines rosados y comunidades nativas en lodge ecológico.",
    price: 449,
    originalPrice: 599,
    duration: "6 días",
    groupSize: "2-10 personas",
    rating: 4.7,
    reviews: 634,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528992/caminoinca-4dias_tjdnns.jpg",
    isNew: false,
    difficulty: "Fácil",
  },
  {
    id: 4,
    title: "CAÑÓN DEL COLCA",
    description:
      "Observa el vuelo del cóndor y disfruta de aguas termales en uno de los cañones más profundos del mundo.",
    price: 379,
    originalPrice: 479,
    duration: "4 días",
    groupSize: "2-16 personas",
    rating: 4.6,
    reviews: 456,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528992/caminoinca-4dias_tjdnns.jpg",
    isNew: true,
    difficulty: "Moderado",
  },
  {
    id: 5,
    title: "LAGO TITICACA MÍSTICO",
    description: "Navega por el lago navegable más alto del mundo y conoce las islas flotantes de los Uros.",
    price: 259,
    originalPrice: 329,
    duration: "3 días",
    groupSize: "2-20 personas",
    rating: 4.5,
    reviews: 723,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528992/caminoinca-4dias_tjdnns.jpg",
    isNew: false,
    difficulty: "Fácil",
  },
  {
    id: 6,
    title: "HUACACHINA Y NAZCA",
    description: "Vuela sobre las misteriosas líneas de Nazca y practica sandboarding en el oasis de Huacachina.",
    price: 329,
    originalPrice: 429,
    duration: "3 días",
    groupSize: "2-12 personas",
    rating: 4.4,
    reviews: 567,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750528959/vista-del-misti-en-todo_o5pegh.jpg",
    isNew: false,
    difficulty: "Fácil",
  },
]

export default function PackagesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const carouselRef = useRef<HTMLDivElement>(null)

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

  const maxIndex = Math.max(0, packages.length - itemsPerView)

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
    <section id="packages-section" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Simplificado */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight">
            PAQUETES RECIENTES
          </h2>
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
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`flex-shrink-0 px-2 md:px-4 ${
                    itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : "w-1/3"
                  }`}
                >
                  <div className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                    {/* Image Section - Más alto */}
                    <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden">
                      <Image
                        src={pkg.image || "/placeholder.svg"}
                        alt={pkg.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* NEW Badge */}
                      {pkg.isNew && (
                        <div className="absolute top-4 right-4 bg-pink-400 text-white px-3 py-1 rounded-full font-bold text-xs border-2 border-white shadow-lg">
                          NUEVO
                        </div>
                      )}

                      {/* Price Overlay */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-black">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl md:text-3xl font-black text-blue-600">${pkg.price}</span>
                            <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating Overlay */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-sm">{pkg.rating}</span>
                          <span className="text-white/80 text-xs">({pkg.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Expandido */}
                    <div className="p-4 md:p-6 lg:p-8">
                      {/* Title */}
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-3 md:mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {pkg.title}
                      </h3>

                      {/* Description - Mejorada */}
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6 min-h-[3rem] md:min-h-[4rem]">
                        {pkg.description}
                      </p>

                      {/* Package Info - Mejor espaciado */}
                      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600 font-medium text-sm">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium text-sm">{pkg.groupSize}</span>
                        </div>
                        <div
                          className={`px-3 py-2 rounded-full border text-sm font-bold ${getDifficultyColor(pkg.difficulty)}`}
                        >
                          {pkg.difficulty}
                        </div>
                      </div>

                      {/* Action Button - Mejorado para móvil */}
                      <Button className="w-full bg-transparent text-black border-2 border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group/btn font-bold py-3 md:py-4 text-sm md:text-base">
                        <span className="flex items-center justify-center gap-2">
                          VER DETALLES
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
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

        {/* More Packages Button */}
        <div className="text-center mt-12 md:mt-16">
          <Button className="bg-black text-white hover:bg-blue-600 font-black px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-full border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl">
            MÁS PAQUETES
          </Button>
        </div>
      </div>
    </section>
  )
}
