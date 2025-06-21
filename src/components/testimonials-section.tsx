"use client"

import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

const testimonials = [
  {
    id: 1,
    name: "María González",
    country: "España",
    rating: 5,
    comment:
      "¡Increíble experiencia en Machu Picchu! Los guías fueron excepcionales y la organización perfecta. Definitivamente recomiendo Tawantinsuyo Peru Tours.",
    tour: "Machu Picchu Clásico",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: "Diciembre 2024",
  },
  {
    id: 2,
    name: "John Smith",
    country: "Estados Unidos",
    rating: 5,
    comment:
      "Amazing journey through the Amazon! The wildlife, the lodge, everything was beyond our expectations. Professional service from start to finish.",
    tour: "Amazonas Peruano",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: "Noviembre 2024",
  },
  {
    id: 3,
    name: "Sophie Dubois",
    country: "Francia",
    rating: 5,
    comment:
      "Le Chemin de l'Inca était absolument magique! L'équipe était très professionnelle et les paysages à couper le souffle. Merci pour cette aventure inoubliable!",
    tour: "Camino Inca Tradicional",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    date: "Octubre 2024",
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    country: "México",
    rating: 5,
    comment:
      "El Cañón del Colca superó todas mis expectativas. Ver volar a los cóndores fue espectacular. El servicio de primera calidad en todo momento.",
    tour: "Cañón del Colca",
    image: "/placeholder.svg?height=80&width=80&text=CM",
    date: "Septiembre 2024",
  },
  {
    id: 5,
    name: "Emma Wilson",
    country: "Reino Unido",
    rating: 5,
    comment:
      "Lake Titicaca was absolutely stunning! The floating islands experience was unique and our guide was incredibly knowledgeable about local culture.",
    tour: "Lago Titicaca Místico",
    image: "/placeholder.svg?height=80&width=80&text=EW",
    date: "Agosto 2024",
  },
  {
    id: 6,
    name: "Roberto Silva",
    country: "Brasil",
    rating: 5,
    comment:
      "As Linhas de Nazca foram fascinantes! O voo foi seguro e a experiência em Huacachina inesquecível. Organização impecável do início ao fim.",
    tour: "Huacachina y Nazca",
    image: "/placeholder.svg?height=80&width=80&text=RS",
    date: "Julio 2024",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

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

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerView))
    }, 5000)

    return () => clearInterval(interval)
  }, [itemsPerView])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 md:py-24 bg-white border-4 border-black rounded-3xl my-8 md:my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">TESTIMONIOS</span>
          </div>
          <h2 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight mb-4">
            LO QUE DICEN NUESTROS
          </h2>
          <h3 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-black text-blue-600 leading-none tracking-tight">
            VIAJEROS
          </h3>
        </div>

        {/* Testimonials Grid */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 px-3 md:px-4 ${
                  itemsPerView === 1 ? "w-full" : itemsPerView === 2 ? "w-1/2" : "w-1/3"
                }`}
              >
                <div className="bg-blue-50 rounded-3xl border-2 border-black p-6 md:p-8 h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">{renderStars(testimonial.rating)}</div>

                  {/* Comment */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 min-h-[4rem] md:min-h-[5rem]">
                    {testimonial.comment}
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-black text-lg">{testimonial.name}</h4>
                      <p className="text-blue-600 font-medium text-sm">{testimonial.country}</p>
                      <p className="text-gray-500 text-xs">
                        {testimonial.tour} • {testimonial.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 md:mt-12 gap-2">
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black transition-all duration-300 ${
                index === currentIndex ? "bg-blue-600 border-blue-600" : "bg-white hover:bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">10,000+</div>
            <div className="text-sm md:text-base font-medium text-gray-600">Viajeros Felices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">4.9★</div>
            <div className="text-sm md:text-base font-medium text-gray-600">Rating Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">15+</div>
            <div className="text-sm md:text-base font-medium text-gray-600">Años Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">50+</div>
            <div className="text-sm md:text-base font-medium text-gray-600">Tours Disponibles</div>
          </div>
        </div>
      </div>
    </section>
  )
}
