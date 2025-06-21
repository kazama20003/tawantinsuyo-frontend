"use client"

import { Button } from "@/components/ui/button"
import {
  Award,
  Users,
  MapPin,
  Calendar,
  Star,
  Shield,
  Heart,
  Globe,
  Leaf,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const awards = [
  {
    year: "2024",
    title: "Mejor Agencia de Turismo Sostenible",
    organization: "MINCETUR Perú",
    description: "Reconocimiento por prácticas de turismo responsable",
    icon: "🏆",
  },
  {
    year: "2023",
    title: "Excellence in Tourism Award",
    organization: "World Travel Awards",
    description: "Mejor operador turístico de Sudamérica",
    icon: "🌟",
  },
  {
    year: "2023",
    title: "Certificación Carbono Neutral",
    organization: "Green Tourism Chile",
    description: "Primera agencia peruana con certificación ambiental",
    icon: "🌱",
  },
  {
    year: "2022",
    title: "Top 10 Tour Operators",
    organization: "TripAdvisor Travelers' Choice",
    description: "Entre las 10 mejores agencias de Latinoamérica",
    icon: "⭐",
  },
]

const team = [
  {
    name: "Carlos Mendoza",
    position: "CEO & Fundador",
    experience: "15+ años",
    specialty: "Turismo Sostenible",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Guía certificado con pasión por mostrar la verdadera esencia del Perú.",
  },
  {
    name: "Ana Quispe",
    position: "Directora de Operaciones",
    experience: "12+ años",
    specialty: "Logística de Tours",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Experta en planificación de itinerarios y experiencias personalizadas.",
  },
  {
    name: "Miguel Torres",
    position: "Jefe de Guías",
    experience: "10+ años",
    specialty: "Historia Inca",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Historiador especializado en cultura precolombina y tradiciones andinas.",
  },
  {
    name: "Sofia Ramirez",
    position: "Coordinadora Internacional",
    experience: "8+ años",
    specialty: "Atención al Cliente",
    image: "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Políglota especializada en turismo internacional y experiencias VIP.",
  },
]

const values = [
  {
    icon: Leaf,
    title: "SOSTENIBILIDAD",
    description: "Protegemos el patrimonio natural y cultural del Perú para futuras generaciones.",
    color: "green",
  },
  {
    icon: Heart,
    title: "PASIÓN",
    description: "Amamos lo que hacemos y esa pasión se refleja en cada experiencia que creamos.",
    color: "red",
  },
  {
    icon: Shield,
    title: "SEGURIDAD",
    description: "Tu seguridad es nuestra prioridad, con protocolos certificados internacionalmente.",
    color: "blue",
  },
  {
    icon: Users,
    title: "COMUNIDAD",
    description: "Trabajamos con comunidades locales para generar impacto positivo y auténtico.",
    color: "purple",
  },
]

const stats = [
  { number: "15+", label: "Años de Experiencia", icon: Calendar },
  { number: "25,000+", label: "Viajeros Felices", icon: Users },
  { number: "150+", label: "Destinos Únicos", icon: MapPin },
  { number: "4.9★", label: "Rating Promedio", icon: Star },
  { number: "50+", label: "Guías Certificados", icon: Award },
  { number: "12", label: "Países Atendidos", icon: Globe },
]

const certifications = [
  {
    name: "MINCETUR",
    description: "Agencia Certificada",
    logo: "🇵🇪",
  },
  {
    name: "IATA",
    description: "Miembro Oficial",
    logo: "✈️",
  },
  {
    name: "Green Tourism",
    description: "Turismo Sostenible",
    logo: "🌱",
  },
  {
    name: "TripAdvisor",
    description: "Certificate of Excellence",
    logo: "🏆",
  },
]

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState("historia")

  const getValueColor = (color: string) => {
    const colors = {
      green: "bg-green-100 border-green-300 text-green-700",
      red: "bg-red-100 border-red-300 text-red-700",
      blue: "bg-blue-100 border-blue-300 text-blue-700",
      purple: "bg-purple-100 border-purple-300 text-purple-700",
    }
    return colors[color as keyof typeof colors] || "bg-gray-100 border-gray-300 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <section className="relative bg-white border-4 border-black rounded-b-3xl mt-4 md:mt-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
                <span className="text-lg font-bold text-pink-400 uppercase tracking-wide">NOSOTROS</span>
              </div>

              <h1 className="text-[3rem] md:text-[4rem] xl:text-[5rem] font-black text-black leading-none tracking-tight mb-6">
                LÍDERES EN
                <br />
                <span className="text-blue-600">TURISMO PERUANO</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Desde 2009, hemos sido pioneros en crear experiencias auténticas y sostenibles que conectan a viajeros
                de todo el mundo con la magia del Perú.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">15+</div>
                  <div className="text-sm text-gray-600">Años de experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">25K+</div>
                  <div className="text-sm text-gray-600">Viajeros felices</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">4.9★</div>
                  <div className="text-sm text-gray-600">Rating promedio</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-105">
                  CONOCE NUESTROS TOURS
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-gray-50 font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
                >
                  NUESTRO EQUIPO
                </Button>
              </div>
            </div>

            {/* Right - Company Image */}
            <div className="relative">
              <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-black group">
                <Image
                  src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                  alt="Equipo Tawantinsuyo Peru"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-2xl md:text-3xl font-black mb-2">NUESTRO EQUIPO</div>
                  <div className="text-lg opacity-90">Expertos apasionados por el Perú</div>
                </div>
              </div>

              {/* Floating Awards */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm border-2 border-black shadow-lg animate-bounce">
                🏆 Premiados 2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 md:py-24 bg-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              PREMIOS Y
              <br />
              <span className="text-blue-600">RECONOCIMIENTOS</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestro compromiso con la excelencia ha sido reconocido por las principales organizaciones de turismo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {award.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-600 mb-2">{award.year}</div>
                <h3 className="text-lg md:text-xl font-black text-black mb-2 leading-tight">{award.title}</h3>
                <p className="text-sm font-bold text-blue-600 mb-3">{award.organization}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story Tabs */}
      <section className="py-16 md:py-24 bg-gray-50 border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              NUESTRA HISTORIA
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: "historia", label: "HISTORIA" },
              { id: "mision", label: "MISIÓN" },
              { id: "vision", label: "VISIÓN" },
              { id: "valores", label: "VALORES" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-bold border-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-black border-black hover:bg-blue-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-12">
            {activeTab === "historia" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-black mb-6">Desde 2009, Conectando Culturas</h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Todo comenzó con un sueño: mostrar al mundo la verdadera esencia del Perú. Carlos Mendoza, nuestro
                      fundador, era un guía local que veía cómo los turistas se perdían las experiencias más auténticas
                      de nuestro país.
                    </p>
                    <p>
                      En 2009, con solo una van y mucha pasión, fundamos Tawantinsuyo Peru Tours. El nombre, que
                      significa las cuatro regiones unidas en quechua, representa nuestra misión de conectar a
                      viajeros con todas las facetas del Perú.
                    </p>
                    <p>
                      Hoy, 15 años después, somos líderes en turismo sostenible, hemos llevado a más de 25,000 viajeros
                      por experiencias transformadoras y seguimos creciendo con el mismo espíritu de autenticidad que
                      nos fundó.
                    </p>
                  </div>
                </div>
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200">
                  <Image
                    src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                    alt="Historia de la empresa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {activeTab === "mision" && (
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-black text-black mb-6">Nuestra Misión</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Crear experiencias de viaje auténticas y sostenibles que conecten a viajeros de todo el mundo con la
                  rica cultura, historia y naturaleza del Perú, mientras generamos un impacto positivo en las
                  comunidades locales y el medio ambiente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                    <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-bold text-black mb-2">CONECTAR</h4>
                    <p className="text-sm text-gray-600">Culturas y personas a través del viaje</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                    <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-bold text-black mb-2">PROTEGER</h4>
                    <p className="text-sm text-gray-600">El patrimonio natural y cultural</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                    <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-bold text-black mb-2">INSPIRAR</h4>
                    <p className="text-sm text-gray-600">Experiencias que transforman vidas</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vision" && (
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-black text-black mb-6">Nuestra Visión</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Ser la agencia de turismo líder en Sudamérica, reconocida mundialmente por nuestras prácticas
                  sostenibles, experiencias auténticas y el impacto positivo que generamos en las comunidades que
                  visitamos.
                </p>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
                  <h4 className="text-xl font-black mb-4">METAS 2030</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-300" />
                      <span>100% operaciones carbono neutral</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-300" />
                      <span>50,000 viajeros anuales</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-300" />
                      <span>Presencia en 5 países</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-300" />
                      <span>100 comunidades beneficiadas</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "valores" && (
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-black mb-8 text-center">Nuestros Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border-2 text-center hover:scale-105 transition-transform duration-300 ${getValueColor(value.color)}`}
                    >
                      <value.icon className="w-12 h-12 mx-auto mb-4" />
                      <h4 className="font-black mb-3">{value.title}</h4>
                      <p className="text-sm leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              NUESTRO EQUIPO
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Conoce a los expertos apasionados que hacen posible cada experiencia única
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-3xl border-2 border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-black mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-bold mb-2">{member.position}</p>
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{member.experience}</span>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 border border-blue-200 inline-block mb-3">
                    {member.specialty}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-black text-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black leading-none tracking-tight mb-4">
              NÚMEROS QUE NOS
              <br />
              <span className="text-blue-400">RESPALDAN</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-24 bg-gray-50 border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[2.5rem] md:text-[4rem] font-black text-black leading-none tracking-tight mb-4">
              CERTIFICACIONES
            </h2>
            <p className="text-lg text-gray-600">Avalados por las principales organizaciones del sector</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-black p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{cert.logo}</div>
                <h3 className="font-black text-black mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white border-4 border-black rounded-3xl my-8 md:my-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[2.5rem] md:text-[4rem] font-black leading-none tracking-tight mb-6">
            ¿LISTO PARA VIVIR
            <br />
            <span className="text-yellow-400">LA EXPERIENCIA?</span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a los miles de viajeros que han confiado en nosotros para descubrir la magia del Perú
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-black px-8 py-4 text-lg rounded-full border-2 border-white transition-all duration-300 hover:scale-105">
              VER NUESTROS TOURS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              CONTACTAR AHORA
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Respuesta en 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Asesoría personalizada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Sin compromiso</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
