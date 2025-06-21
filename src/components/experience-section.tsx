"use client"

import { Shield, Leaf, Clock, Star } from "lucide-react"

export default function ExperienceSection() {
  const features = [
    {
      icon: Shield,
      title: "PERÚ TRAVEL EXPERTS",
      description:
        "Certificados por MINCETUR, tenemos más de 15 años organizando tours en Perú. Expertos en experiencias auténticas para viajeros internacionales.",
    },
    {
      icon: Leaf,
      title: "EXPERIENCIAS SOSTENIBLES",
      description:
        "Promovemos el turismo responsable que protege la rica biodiversidad del Perú y apoya a las comunidades locales.",
    },
    {
      icon: Clock,
      title: "SOPORTE 24 HORAS",
      description:
        "Equipo multilingüe disponible 24/7 durante tu viaje. Español, inglés y quechua para una experiencia completa.",
    },
    {
      icon: Star,
      title: "EXCELENTE SERVICIO AL CLIENTE",
      description: "Calificación 4.9★ en Google, estamos aquí para ayudarte a preparar unas vacaciones épicas en Perú.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-100 border-4 border-black rounded-3xl my-8 md:my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
            <span className="text-lg md:text-xl font-bold text-pink-400 uppercase tracking-wide">THE</span>
          </div>
          <h2 className="text-[2.5rem] md:text-[4rem] xl:text-[5rem] font-black text-blue-600 leading-none tracking-tight uppercase">
            TAWANTINSUYO EXPERIENCE
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              {/* Icon Circle */}
              <div className="relative mb-6 md:mb-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-600 rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-lg group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-500">
                  <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2} />
                </div>

                {/* Decorative border effect */}
                <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 border-4 border-blue-300 rounded-full mx-auto scale-110 opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-500"></div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-black text-blue-600 uppercase tracking-wide leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border-2 border-black shadow-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-black">¡Más de 10,000 viajeros satisfechos!</span>
          </div>
        </div>
      </div>
    </section>
  )
}
