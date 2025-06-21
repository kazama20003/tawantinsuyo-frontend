"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Download } from "lucide-react"
import Image from "next/image"

export default function GuideSection() {
  const guideFeatures = [
    "Idioma local (Quechua)",
    "Trekking & Aventura",
    "Costos & Presupuesto",
    "Transporte",
    "Hoteles & Facilidades",
    "Cultura & Tradiciones",
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50 border-4 border-black rounded-3xl my-8 md:my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
            <span className="text-lg md:text-xl font-bold text-blue-600 uppercase tracking-wide">GRATIS</span>
          </div>
          <h2 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-black text-blue-600 leading-none tracking-tight uppercase">
            GUÍA DE DESTINOS
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Side - Guide Mockup */}
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Guide Book Mockup */}
              <div className="relative bg-white rounded-2xl border-4 border-black shadow-2xl p-6 md:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Guide Cover */}
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border-2 border-gray-200 mb-4">
                  <Image
                    src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750530534/destinations-peru-arequipa-main-square-misti-volcano_pzcelq.webp"
                    alt="Guía de Destinos Perú"
                    fill
                    className="object-cover"
                  />

                  {/* Guide Title Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl md:text-2xl font-black mb-2">GUÍA DE DESTINOS</h3>
                      <p className="text-sm opacity-90">Todo lo que necesitas saber para tu viaje a Perú</p>
                    </div>
                  </div>
                </div>

                {/* Guide Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🇵🇪</span>
                    </div>
                    <span className="font-bold text-black">TAWANTINSUYO PERU</span>
                  </div>
                  <p className="text-xs text-gray-600">Guía completa • 50+ páginas • PDF</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-pink-400 text-white px-3 py-2 rounded-full font-bold text-sm border-2 border-black shadow-lg animate-bounce">
                ¡GRATIS!
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
            <div className="max-w-lg mx-auto lg:max-w-none">
              <h3 className="text-2xl md:text-3xl font-black text-black mb-6 leading-tight">
                Suscríbete a nuestro newsletter para obtener información útil y consejos actualizados sobre Perú
              </h3>

              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">Obtén consejos sobre:</p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {guideFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Email Form */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Tu email aquí..."
                    className="flex-1 h-12 px-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-base"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 h-12 rounded-lg border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 sm:min-w-[200px]">
                    <Download className="w-5 h-5" />
                    DESCARGAR GRATIS
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center sm:text-left">
                  * No spam. Puedes cancelar en cualquier momento.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">+5,000 descargas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Actualizado 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">100% Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
