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
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react"
import Image from "next/image"
import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { Locale } from "@/lib/i18n"
import Header from "@/components/header"

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
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Guía certificado con pasión por mostrar la verdadera esencia del Perú.",
  },
  {
    name: "Ana Quispe",
    position: "Directora de Operaciones",
    experience: "12+ años",
    specialty: "Logística de Tours",
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Experta en planificación de itinerarios y experiencias personalizadas.",
  },
  {
    name: "Miguel Torres",
    position: "Jefe de Guías",
    experience: "10+ años",
    specialty: "Historia Inca",
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
    description: "Historiador especializado en cultura precolombina y tradiciones andinas.",
  },
  {
    name: "Sofia Ramirez",
    position: "Coordinadora Internacional",
    experience: "8+ años",
    specialty: "Atención al Cliente",
    image:
      "https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530523/cheerful-tourist-using-cell-phone-260nw-2476924751_tpghmw.jpg",
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
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"


  // Handle WhatsApp contact
  const handleWhatsAppContact = useCallback(() => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa conocer más sobre Tawantinsuyo Peru Tours.

Me gustaría obtener información sobre sus servicios y tours disponibles.

¡Gracias!`,
    )
    const whatsappUrl = `https://wa.me/51913876154?text=${message}`
    window.open(whatsappUrl, "_blank")
  }, [])

  // Handle email contact
  const handleEmailContact = useCallback(() => {
    const subject = encodeURIComponent("Consulta sobre Tawantinsuyo Peru Tours")
    const body = encodeURIComponent(
      `Estimado equipo de Tawantinsuyo Peru,

Me interesa conocer más sobre su empresa y los servicios que ofrecen.

Me gustaría obtener más información.

Quedo atento a su respuesta.

Saludos cordiales.`,
    )
    const emailUrl = `mailto:tawantinsuyoaqp@gmail.com?subject=${subject}&body=${body}`
    window.open(emailUrl, "_blank")
  }, [])

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
            className="mb-12 md:mb-16 lg:mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
                  <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">
                    {currentLocale === "es" ? "NOSOTROS" : "ABOUT US"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight mb-4">
                  {currentLocale === "es" ? "LÍDERES EN" : "LEADERS IN"}
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight mb-6">
                  {currentLocale === "es" ? "TURISMO PERUANO" : "PERUVIAN TOURISM"}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                  {currentLocale === "es"
                    ? "Desde 2009, hemos sido pioneros en crear experiencias auténticas y sostenibles que conectan a viajeros de todo el mundo con la magia del Perú."
                    : "Since 2009, we have been pioneers in creating authentic and sustainable experiences that connect travelers from around the world with the magic of Peru."}
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-2xl border-4 border-black">
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">15+</div>
                    <div className="text-xs md:text-sm text-gray-600">{currentLocale === "es" ? "Años" : "Years"}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl border-4 border-black">
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">25K+</div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {currentLocale === "es" ? "Viajeros" : "Travelers"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl border-4 border-black">
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">4.9★</div>
                    <div className="text-xs md:text-sm text-gray-600">Rating</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleWhatsAppContact}
                      className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-2xl border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {currentLocale === "es" ? "CONTACTAR AHORA" : "CONTACT NOW"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleEmailContact}
                      variant="outline"
                      className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-4 text-lg rounded-2xl transition-all duration-300 flex items-center gap-2 bg-transparent"
                    >
                      <Mail className="w-5 h-5" />
                      {currentLocale === "es" ? "ENVIAR EMAIL" : "SEND EMAIL"}
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Right - Company Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-4 border-black group">
                  <Image
                    src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                    alt="Equipo Tawantinsuyo Peru"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-2xl md:text-3xl font-black mb-2">
                      {currentLocale === "es" ? "NUESTRO EQUIPO" : "OUR TEAM"}
                    </div>
                    <div className="text-lg opacity-90">
                      {currentLocale === "es" ? "Expertos apasionados por el Perú" : "Experts passionate about Peru"}
                    </div>
                  </div>
                </div>
                {/* Floating Awards */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm border-4 border-black shadow-lg"
                >
                  🏆 {currentLocale === "es" ? "Premiados 2024" : "Awarded 2024"}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Awards Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  {currentLocale === "es" ? "PREMIOS Y" : "AWARDS AND"}
                </h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 mb-6">
                  {currentLocale === "es" ? "RECONOCIMIENTOS" : "RECOGNITIONS"}
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {currentLocale === "es"
                    ? "Nuestro compromiso con la excelencia ha sido reconocido por las principales organizaciones de turismo"
                    : "Our commitment to excellence has been recognized by leading tourism organizations"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {awards.map((award, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {award.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-2">{award.year}</div>
                    <h3 className="text-lg md:text-xl font-black text-black mb-2 leading-tight">{award.title}</h3>
                    <p className="text-sm font-bold text-blue-600 mb-3">{award.organization}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Company Story Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  {currentLocale === "es" ? "NUESTRA HISTORIA" : "OUR STORY"}
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { id: "historia", label: currentLocale === "es" ? "HISTORIA" : "HISTORY" },
                  { id: "mision", label: currentLocale === "es" ? "MISIÓN" : "MISSION" },
                  { id: "vision", label: currentLocale === "es" ? "VISIÓN" : "VISION" },
                  { id: "valores", label: currentLocale === "es" ? "VALORES" : "VALUES" },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-2xl font-black border-4 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-black border-black hover:bg-blue-50"
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 rounded-3xl border-2 border-gray-200 p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {activeTab === "historia" && (
                    <motion.div
                      key="historia"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                    >
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-black mb-6">
                          {currentLocale === "es"
                            ? "Desde 2009, Conectando Culturas"
                            : "Since 2009, Connecting Cultures"}
                        </h3>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                          <p>
                            {currentLocale === "es"
                              ? "Todo comenzó con un sueño: mostrar al mundo la verdadera esencia del Perú. Carlos Mendoza, nuestro fundador, era un guía local que veía cómo los turistas se perdían las experiencias más auténticas de nuestro país."
                              : "It all started with a dream: to show the world the true essence of Peru. Carlos Mendoza, our founder, was a local guide who saw how tourists missed the most authentic experiences of our country."}
                          </p>
                          <p>
                            {currentLocale === "es"
                              ? "En 2009, con solo una van y mucha pasión, fundamos Tawantinsuyo Peru Tours. El nombre, que significa las cuatro regiones unidas en quechua, representa nuestra misión de conectar a viajeros con todas las facetas del Perú."
                              : "In 2009, with just a van and a lot of passion, we founded Tawantinsuyo Peru Tours. The name, which means the four united regions in Quechua, represents our mission to connect travelers with all facets of Peru."}
                          </p>
                          <p>
                            {currentLocale === "es"
                              ? "Hoy, 15 años después, somos líderes en turismo sostenible, hemos llevado a más de 25,000 viajeros por experiencias transformadoras y seguimos creciendo con el mismo espíritu de autenticidad que nos fundó."
                              : "Today, 15 years later, we are leaders in sustainable tourism, we have taken more than 25,000 travelers through transformative experiences and continue to grow with the same spirit of authenticity that founded us."}
                          </p>
                        </div>
                      </div>
                      <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden border-4 border-black">
                        <Image
                          src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                          alt="Historia de la empresa"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "mision" && (
                    <motion.div
                      key="mision"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center max-w-4xl mx-auto"
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-6">
                        {currentLocale === "es" ? "Nuestra Misión" : "Our Mission"}
                      </h3>
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                        {currentLocale === "es"
                          ? "Crear experiencias de viaje auténticas y sostenibles que conecten a viajeros de todo el mundo con la rica cultura, historia y naturaleza del Perú, mientras generamos un impacto positivo en las comunidades locales y el medio ambiente."
                          : "Create authentic and sustainable travel experiences that connect travelers from around the world with Peru's rich culture, history and nature, while generating a positive impact on local communities and the environment."}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border-4 border-blue-200">
                          <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                          <h4 className="font-bold text-black mb-2">
                            {currentLocale === "es" ? "CONECTAR" : "CONNECT"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {currentLocale === "es"
                              ? "Culturas y personas a través del viaje"
                              : "Cultures and people through travel"}
                          </p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl border-4 border-green-200">
                          <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h4 className="font-bold text-black mb-2">
                            {currentLocale === "es" ? "PROTEGER" : "PROTECT"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {currentLocale === "es"
                              ? "El patrimonio natural y cultural"
                              : "Natural and cultural heritage"}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl border-4 border-purple-200">
                          <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                          <h4 className="font-bold text-black mb-2">
                            {currentLocale === "es" ? "INSPIRAR" : "INSPIRE"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {currentLocale === "es"
                              ? "Experiencias que transforman vidas"
                              : "Life-transforming experiences"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "vision" && (
                    <motion.div
                      key="vision"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center max-w-4xl mx-auto"
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-6">
                        {currentLocale === "es" ? "Nuestra Visión" : "Our Vision"}
                      </h3>
                      <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                        {currentLocale === "es"
                          ? "Ser la agencia de turismo líder en Sudamérica, reconocida mundialmente por nuestras prácticas sostenibles, experiencias auténticas y el impacto positivo que generamos en las comunidades que visitamos."
                          : "To be the leading tourism agency in South America, recognized worldwide for our sustainable practices, authentic experiences and the positive impact we generate in the communities we visit."}
                      </p>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl border-4 border-black">
                        <h4 className="text-xl font-black mb-4">
                          {currentLocale === "es" ? "METAS 2030" : "GOALS 2030"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-300" />
                            <span>
                              {currentLocale === "es"
                                ? "100% operaciones carbono neutral"
                                : "100% carbon neutral operations"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-300" />
                            <span>
                              {currentLocale === "es" ? "50,000 viajeros anuales" : "50,000 annual travelers"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-300" />
                            <span>{currentLocale === "es" ? "Presencia en 5 países" : "Presence in 5 countries"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-300" />
                            <span>
                              {currentLocale === "es" ? "100 comunidades beneficiadas" : "100 benefited communities"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "valores" && (
                    <motion.div
                      key="valores"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-black mb-8 text-center">
                        {currentLocale === "es" ? "Nuestros Valores" : "Our Values"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`p-6 rounded-2xl border-4 text-center transition-all duration-300 ${getValueColor(value.color)}`}
                          >
                            <value.icon className="w-12 h-12 mx-auto mb-4" />
                            <h4 className="font-black mb-3">{value.title}</h4>
                            <p className="text-sm leading-relaxed">{value.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                  {currentLocale === "es" ? "NUESTRO EQUIPO" : "OUR TEAM"}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {currentLocale === "es"
                    ? "Conoce a los expertos apasionados que hacen posible cada experiencia única"
                    : "Meet the passionate experts who make every unique experience possible"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-blue-50 rounded-3xl border-4 border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-500 group"
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
                      <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 border-2 border-blue-200 inline-block mb-3">
                        {member.specialty}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-black text-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                  {currentLocale === "es" ? "NÚMEROS QUE NOS" : "NUMBERS THAT"}
                </h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-400">
                  {currentLocale === "es" ? "RESPALDAN" : "SUPPORT US"}
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                      <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Certifications */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <div className="bg-white rounded-3xl border-4 border-black p-8 md:p-12 shadow-xl">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                  {currentLocale === "es" ? "CERTIFICACIONES" : "CERTIFICATIONS"}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentLocale === "es"
                    ? "Avalados por las principales organizaciones del sector"
                    : "Endorsed by leading industry organizations"}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gray-50 rounded-2xl border-4 border-black p-6 text-center hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-4xl mb-4">{cert.logo}</div>
                    <h3 className="font-black text-black mb-2">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-blue-600 text-white rounded-3xl border-4 border-black p-8 md:p-12 text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6">
                {currentLocale === "es" ? "¿LISTO PARA VIVIR" : "READY TO LIVE"}
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 mb-8">
                {currentLocale === "es" ? "LA EXPERIENCIA?" : "THE EXPERIENCE?"}
              </h3>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {currentLocale === "es"
                  ? "Únete a los miles de viajeros que han confiado en nosotros para descubrir la magia del Perú"
                  : "Join the thousands of travelers who have trusted us to discover the magic of Peru"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 text-lg rounded-full border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {currentLocale === "es" ? "CONTACTAR POR WHATSAPP" : "CONTACT VIA WHATSAPP"}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleEmailContact}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-black px-8 py-4 text-lg rounded-full border-4 border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    {currentLocale === "es" ? "ENVIAR EMAIL" : "SEND EMAIL"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">+51 913 876 154</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-bold">tawantinsuyoaqp@gmail.com</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{currentLocale === "es" ? "Respuesta en 24h" : "24h response"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>{currentLocale === "es" ? "Asesoría personalizada" : "Personalized advice"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>{currentLocale === "es" ? "Sin compromiso" : "No commitment"}</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
