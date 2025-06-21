"use client"

import { Button } from "@/components/ui/button"
import {
  Clock,
  Star,
  Mountain,
  TelescopeIcon as Binoculars,
  Thermometer,
  Calendar,
  ArrowRight,
  Play,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

const destinations = [
  {
    id: 1,
    name: "Cañón del Colca",
    subtitle: "El vuelo del cóndor",
    description:
      "Uno de los cañones más profundos del mundo, hogar del majestuoso cóndor andino y paisajes que te quitarán el aliento.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "2-4 días",
    difficulty: "Moderado",
    highlights: ["Vuelo del cóndor", "Aguas termales", "Pueblos coloniales", "Terrazas incas"],
    bestTime: "Abril - Octubre",
    altitude: "3,191m - 4,910m",
    temperature: "5°C - 20°C",
  },
  {
    id: 2,
    name: "Arequipa",
    subtitle: "La ciudad blanca",
    description:
      "Patrimonio de la Humanidad por UNESCO, famosa por su arquitectura colonial de sillar blanco y su gastronomía excepcional.",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    duration: "1-3 días",
    difficulty: "Fácil",
    highlights: ["Centro histórico", "Monasterio Santa Catalina", "Gastronomía", "Volcán Misti"],
    bestTime: "Todo el año",
    altitude: "2,335m",
    temperature: "10°C - 25°C",
  },
]

const tours = [
  {
    id: 1,
    name: "Colca Canyon Express",
    duration: "2 días / 1 noche",
    price: 189,
    originalPrice: 249,
    rating: 4.8,
    reviews: 324,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    highlights: ["Cruz del Cóndor", "Aguas termales", "Pueblos tradicionales"],
    includes: ["Transporte", "Guía", "1 noche hotel", "Desayunos"],
  },
  {
    id: 2,
    name: "Colca Canyon Trekking",
    duration: "3 días / 2 noches",
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviews: 187,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    highlights: ["Trekking al cañón", "Oasis de Sangalle", "Pueblos remotos"],
    includes: ["Guía especializado", "Camping", "Todas las comidas", "Mulas de carga"],
  },
  {
    id: 3,
    name: "Arequipa City Tour",
    duration: "1 día",
    price: 89,
    originalPrice: 119,
    rating: 4.7,
    reviews: 456,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    highlights: ["Centro histórico", "Monasterio", "Mercados locales"],
    includes: ["Guía local", "Entradas", "Transporte", "Almuerzo típico"],
  },
  {
    id: 4,
    name: "Ruta Completa Arequipa-Colca",
    duration: "4 días / 3 noches",
    price: 449,
    originalPrice: 599,
    rating: 4.9,
    reviews: 234,
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg",
    highlights: ["Arequipa + Colca", "Experiencia completa", "Hoteles premium"],
    includes: ["Todo incluido", "Guía experto", "Hoteles 4*", "Todas las comidas"],
  },
]

const itinerary = [
  {
    day: 1,
    title: "Llegada a Arequipa",
    description: "City tour por el centro histórico y Monasterio de Santa Catalina",
    activities: ["Recojo del aeropuerto", "Check-in hotel", "City tour", "Cena de bienvenida"],
    accommodation: "Hotel 4* centro histórico",
  },
  {
    day: 2,
    title: "Arequipa - Colca",
    description: "Viaje hacia el Cañón del Colca con paradas en pueblos tradicionales",
    activities: ["Desayuno", "Viaje a Colca", "Vicuñas en Pampa Cañahuas", "Aguas termales"],
    accommodation: "Lodge en Colca",
  },
  {
    day: 3,
    title: "Cruz del Cóndor",
    description: "Observación del vuelo del cóndor y exploración del cañón",
    activities: ["Amanecer en Cruz del Cóndor", "Vuelo del cóndor", "Pueblos coloniales", "Terrazas incas"],
    accommodation: "Lodge en Colca",
  },
  {
    day: 4,
    title: "Retorno a Arequipa",
    description: "Última exploración y regreso a la ciudad blanca",
    activities: ["Desayuno", "Mercado local", "Viaje de retorno", "Traslado aeropuerto"],
    accommodation: "No incluido",
  },
]

export default function DestinationsPage() {
  const [, setCurrentTour] = useState(0)
  const [, ] = useState(0)

  const nextTour = () => {
    setCurrentTour((prev) => (prev + 1) % tours.length)
  }


  // Auto-rotate tours
  useEffect(() => {
    const interval = setInterval(nextTour, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section with Map */}
      <section className="relative bg-white border-4 border-black border-t-0 rounded-b-3xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-lg font-bold text-pink-400 uppercase tracking-wide">DESTINOS</span>
              </div>

              <h1 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight mb-6">
                AREQUIPA &
                <br />
                <span className="text-blue-600">CAÑÓN DEL COLCA</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Descubre la majestuosidad del sur de Perú, donde la arquitectura colonial se encuentra con paisajes
                andinos espectaculares y el vuelo del cóndor te dejará sin aliento.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-black">
                    <Mountain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-black">2,335m - 4,910m</div>
                  <div className="text-xs text-gray-600">Altitud</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-black">
                    <Thermometer className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-black">5°C - 25°C</div>
                  <div className="text-xs text-gray-600">Temperatura</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-black">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-black">Todo el año</div>
                  <div className="text-xs text-gray-600">Mejor época</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-black">
                    <Binoculars className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-black">Cóndores</div>
                  <div className="text-xs text-gray-600">Avistamiento</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-105">
                  VER TOURS DISPONIBLES
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-gray-50 font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  VER VIDEO
                </Button>
              </div>
            </div>

            {/* Right - Route Map */}
            <div className="relative">
              <div className="bg-gray-100 rounded-3xl border-4 border-black p-6 md:p-8 h-[500px] md:h-[600px] relative overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>

                {/* Route Points */}
                <div className="relative h-full">
                  {/* Arequipa */}
                  <div className="absolute bottom-20 left-16 group cursor-pointer">
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg border-2 border-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-bold text-sm">Arequipa</div>
                      <div className="text-xs text-gray-600">Ciudad Blanca</div>
                    </div>
                  </div>

                  {/* Colca Canyon */}
                  <div className="absolute top-20 right-20 group cursor-pointer">
                    <div className="w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg border-2 border-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-bold text-sm">Cañón del Colca</div>
                      <div className="text-xs text-gray-600">Cruz del Cóndor</div>
                    </div>
                  </div>

                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M 80 480 Q 200 300 400 120"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeDasharray="10,5"
                      fill="none"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Distance Info */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-3 rounded-xl border-2 border-black shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-600">165km</div>
                      <div className="text-sm text-gray-600">3.5 horas</div>
                    </div>
                  </div>

                  {/* Compass */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full border-2 border-black flex items-center justify-center">
                    <div className="text-xs font-bold">N</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Detail */}
      <section className="py-16 md:py-24 bg-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              NUESTROS DESTINOS
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada destino cuenta una historia única, desde la elegancia colonial hasta la grandeza natural
            </p>
          </div>

          <div className="space-y-16">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-black group">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="text-2xl md:text-3xl font-black">{destination.name}</div>
                      <div className="text-lg opacity-90">{destination.subtitle}</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <h3 className="text-3xl md:text-4xl font-black text-black mb-4">{destination.name}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">{destination.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                      <Clock className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="font-bold text-black">{destination.duration}</div>
                      <div className="text-sm text-gray-600">Duración</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                      <Mountain className="w-6 h-6 text-green-600 mb-2" />
                      <div className="font-bold text-black">{destination.difficulty}</div>
                      <div className="text-sm text-gray-600">Dificultad</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                      <Thermometer className="w-6 h-6 text-yellow-600 mb-2" />
                      <div className="font-bold text-black">{destination.altitude}</div>
                      <div className="text-sm text-gray-600">Altitud</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-3">Destacados:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {destination.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full border-2 border-black transition-all duration-300 hover:scale-105">
                    EXPLORAR TOURS
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Carousel */}
      <section className="py-16 md:py-24 bg-gray-50 border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              TOURS DISPONIBLES
            </h2>
            <p className="text-lg text-gray-600">Elige la experiencia perfecta para tu aventura</p>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
              >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1 border-2 border-black">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-blue-600">${tour.price}</span>
                      <span className="text-sm text-gray-500 line-through">${tour.originalPrice}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-bold text-sm">{tour.rating}</span>
                    <span className="text-white/80 text-xs">({tour.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-black text-black mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {tour.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{tour.duration}</span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1 mb-4">
                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-xs text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-transparent text-black border-2 border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 font-bold py-2">
                    VER DETALLES
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-16 md:py-24 bg-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              ITINERARIO SUGERIDO
            </h2>
            <p className="text-lg text-gray-600">Ruta completa Arequipa - Cañón del Colca (4 días)</p>
          </div>

          <div className="space-y-8">
            {itinerary.map((day, index) => (
              <div key={day.day} className="relative">
                {/* Timeline Line */}
                {index < itinerary.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-blue-200 -z-10"></div>
                )}

                <div className="flex gap-6">
                  {/* Day Number */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-black">{day.day}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-blue-50 rounded-2xl border-2 border-blue-200 p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-black text-black mb-2">{day.title}</h3>
                    <p className="text-gray-700 mb-4">{day.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Activities */}
                      <div>
                        <h4 className="font-bold text-black mb-3">Actividades:</h4>
                        <div className="space-y-2">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-sm text-gray-700">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accommodation */}
                      <div>
                        <h4 className="font-bold text-black mb-3">Alojamiento:</h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-700">{day.accommodation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[2.5rem] md:text-[4rem] font-black leading-none tracking-tight mb-6">
            ¿LISTO PARA LA
            <br />
            <span className="text-blue-400">AVENTURA?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Reserva ahora y vive una experiencia inolvidable en el sur de Perú con guías expertos y servicios de primera
            calidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-blue-600 transition-all duration-300 hover:scale-105">
              RESERVAR AHORA
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              SOLICITAR INFORMACIÓN
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Cancelación gratuita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Mejor precio garantizado</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
