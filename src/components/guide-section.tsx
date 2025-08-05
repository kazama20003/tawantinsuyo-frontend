"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Download } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n"

export default function GuideSection() {
  const pathname = usePathname()
  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  const guideFeatures =
    currentLocale === "es"
      ? [
          "Idioma local (Quechua)",
          "Trekking & Aventura",
          "Costos & Presupuesto",
          "Transporte",
          "Hoteles & Facilidades",
          "Cultura & Tradiciones",
        ]
      : [
          "Local Language (Quechua)",
          "Trekking & Adventure",
          "Costs & Budget",
          "Transportation",
          "Hotels & Facilities",
          "Culture & Traditions",
        ]

  return (
    <section className="py-16 md:py-24 bg-white">
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
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              <span className="text-lg md:text-xl font-bold text-blue-600 uppercase tracking-wide">
                {currentLocale === "es" ? "GRATIS" : "FREE"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
              {currentLocale === "es" ? "GUÍA DE" : "DESTINATION"}
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-blue-600 leading-tight">
              {currentLocale === "es" ? "DESTINOS" : "GUIDE"}
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
                ? "Descarga nuestra guía completa con toda la información que necesitas para tu viaje perfecto a Perú."
                : "Download our complete guide with all the information you need for your perfect trip to Peru."}
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Side - Guide Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1 overflow-hidden" // Added overflow-hidden here
          >
            <div className="relative mx-auto lg:max-w-none">
              {" "}
              {/* Removed max-w-md */}
              {/* Guide Book Mockup */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white rounded-3xl border-4 border-black shadow-2xl p-6 md:p-8 transform rotate-3"
              >
                {/* Guide Cover */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-gray-200 mb-4">
                  <Image
                    src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                    alt={currentLocale === "es" ? "Guía de Destinos Perú" : "Peru Destination Guide"}
                    fill
                    className="object-cover"
                  />
                  {/* Guide Title Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl md:text-2xl font-black mb-2">
                        {currentLocale === "es" ? "GUÍA DE DESTINOS" : "DESTINATION GUIDE"}
                      </h3>
                      <p className="text-sm opacity-90">
                        {currentLocale === "es"
                          ? "Todo lo que necesitas saber para tu viaje a Perú"
                          : "Everything you need to know for your trip to Peru"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Guide Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-white font-bold text-sm">🇵🇪</span>
                    </div>
                    <span className="font-black text-gray-900">TAWANTINSUYO PERU</span>
                  </div>
                  <p className="text-xs text-gray-600 font-bold">
                    {currentLocale === "es" ? "GUÍA COMPLETA • 50+ PÁGINAS • PDF" : "COMPLETE GUIDE • 50+ PAGES • PDF"}
                  </p>
                </div>
              </motion.div>
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-4 -right-4 bg-pink-400 text-white px-4 py-2 rounded-full font-black text-sm border-4 border-black shadow-lg"
              >
                {currentLocale === "es" ? "¡GRATIS!" : "FREE!"}
              </motion.div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black"></div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="max-w-lg mx-auto lg:max-w-none">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
                {currentLocale === "es"
                  ? "SUSCRÍBETE Y OBTÉN INFORMACIÓN EXCLUSIVA SOBRE PERÚ"
                  : "SUBSCRIBE AND GET EXCLUSIVE INFORMATION ABOUT PERU"}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-bold">
                {currentLocale === "es" ? "OBTÉN CONSEJOS SOBRE:" : "GET TIPS ABOUT:"}
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {guideFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-black">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 font-bold text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder={currentLocale === "es" ? "TU EMAIL AQUÍ..." : "YOUR EMAIL HERE..."}
                    className="flex-1 h-14 px-6 border-4 border-black rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-200 text-base font-bold placeholder:font-bold placeholder:text-gray-500"
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 h-14 rounded-2xl border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2 sm:min-w-[220px] text-base">
                      <Download className="w-5 h-5" />
                      {currentLocale === "es" ? "DESCARGAR GRATIS" : "DOWNLOAD FREE"}
                    </Button>
                  </motion.div>
                </div>
                <p className="text-sm text-gray-600 text-center sm:text-left font-bold">
                  {currentLocale === "es"
                    ? "* NO SPAM. PUEDES CANCELAR EN CUALQUIER MOMENTO."
                    : "* NO SPAM. YOU CAN CANCEL ANYTIME."}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t-4 border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                  <span className="text-sm text-gray-900 font-bold">
                    {currentLocale === "es" ? "+5,000 DESCARGAS" : "+5,000 DOWNLOADS"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                  <span className="text-sm text-gray-900 font-bold">
                    {currentLocale === "es" ? "ACTUALIZADO 2024" : "UPDATED 2024"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                  <span className="text-sm text-gray-900 font-bold">
                    {currentLocale === "es" ? "100% GRATIS" : "100% FREE"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
