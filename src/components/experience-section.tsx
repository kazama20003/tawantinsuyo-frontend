"use client"
import { Shield, Leaf, Clock, Star } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n"

export default function ExperienceSection() {
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  const features = [
    {
      icon: Shield,
      title: currentLocale === "es" ? "PERÚ TRAVEL EXPERTS" : "PERU TRAVEL EXPERTS",
      description:
        currentLocale === "es"
          ? "Certificados por MINCETUR, tenemos más de 15 años organizando tours en Perú. Expertos en experiencias auténticas para viajeros internacionales."
          : "MINCETUR certified, we have over 15 years organizing tours in Peru. Experts in authentic experiences for international travelers.",
    },
    {
      icon: Leaf,
      title: currentLocale === "es" ? "EXPERIENCIAS SOSTENIBLES" : "SUSTAINABLE EXPERIENCES",
      description:
        currentLocale === "es"
          ? "Promovemos el turismo responsable que protege la rica biodiversidad del Perú y apoya a las comunidades locales."
          : "We promote responsible tourism that protects Peru's rich biodiversity and supports local communities.",
    },
    {
      icon: Clock,
      title: currentLocale === "es" ? "SOPORTE 24 HORAS" : "24 HOUR SUPPORT",
      description:
        currentLocale === "es"
          ? "Equipo multilingüe disponible 24/7 durante tu viaje. Español, inglés y quechua para una experiencia completa."
          : "Multilingual team available 24/7 during your trip. Spanish, English and Quechua for a complete experience.",
    },
    {
      icon: Star,
      title: currentLocale === "es" ? "EXCELENTE SERVICIO AL CLIENTE" : "EXCELLENT CUSTOMER SERVICE",
      description:
        currentLocale === "es"
          ? "Calificación 4.9★ en Google, estamos aquí para ayudarte a preparar unas vacaciones épicas en Perú."
          : "4.9★ rating on Google, we're here to help you prepare an epic vacation in Peru.",
    },
  ]

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
                {currentLocale === "es" ? "LA" : "THE"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
              {currentLocale === "es" ? "EXPERIENCIA" : "EXPERIENCE"}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight">
              TAWANTINSUYO
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
                ? "Más de 15 años creando experiencias únicas en Perú con el más alto estándar de calidad y servicio personalizado."
                : "Over 15 years creating unique experiences in Peru with the highest standard of quality and personalized service."}
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center group"
            >
              {/* Icon Circle */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative mb-6 md:mb-8"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border-4 border-black flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-blue-600" strokeWidth={2} />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full border-2 border-black"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black"></div>
              </motion.div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-wide leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full border-4 border-black shadow-lg">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-black"></div>
            <span className="font-black text-gray-900 text-lg md:text-xl">
              {currentLocale === "es" ? "¡MÁS DE 10,000 VIAJEROS SATISFECHOS!" : "OVER 10,000 SATISFIED TRAVELERS!"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
