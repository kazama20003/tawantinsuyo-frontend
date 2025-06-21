"use client"

import { Button } from "@/components/ui/button"
import { Play, ArrowDown } from "lucide-react"

export default function HeroSection() {
  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages-section")
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-white border-4 border-black-custom border-t-0 rounded-b-3xl overflow-hidden">
      {/* Desktop Hero */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 mb-6 lg:mb-8">
              <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-black-custom leading-none tracking-tight heading-primary">
                DESCUBRE
              </h1>
              <div className="bg-blue-100 rounded-full px-4 lg:px-6 xl:px-8 py-2 lg:py-3 xl:py-4 flex items-center gap-2 lg:gap-4 border-2 border-blue-600-custom self-start lg:self-center">
                <span className="text-lg lg:text-xl xl:text-2xl font-medium text-blue-600-custom">
                  Experiencias únicas
                </span>
                <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 bg-blue-600-custom rounded-full flex items-center justify-center border-2 border-black-custom">
                  <div className="text-lg lg:text-xl xl:text-2xl">🏔️</div>
                </div>
              </div>
            </div>
            <h2 className="text-6xl lg:text-8xl xl:text-9xl font-black text-black-custom leading-none tracking-tight mb-6 lg:mb-8 heading-primary">
              PERÚ!
            </h2>
          </div>
        </div>

        {/* Hero Video */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="hero-video-container relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-b-3xl overflow-hidden border-2 border-black-custom group">
              {/* Video Background */}
              <video autoPlay muted loop playsInline className="hero-video absolute inset-0 w-full h-full object-cover">
                <source
                  src="https://res.cloudinary.com/dlzq3rsot/video/upload/v1750527252/128688-742066271_small_qqsnpx.mp4"
                  type="video/mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600-custom to-blue-800"></div>
              </video>

              {/* Video Overlay */}
              <div className="video-overlay absolute inset-0"></div>

              {/* Video Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10 px-4">
                  <div className="mb-6 lg:mb-8">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-white group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" />
                    </div>
                    <p className="text-lg lg:text-xl font-medium mb-2">Descubre la magia del Perú</p>
                    <p className="text-base lg:text-lg opacity-90">Aventuras que transforman vidas</p>
                  </div>

                  <Button
                    onClick={scrollToPackages}
                    className="bg-blue-600-custom hover:bg-blue-700-custom text-white font-black px-8 lg:px-12 py-3 lg:py-4 text-lg lg:text-2xl rounded-full border-4 border-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  >
                    RESERVAR AHORA
                    <ArrowDown className="w-5 h-5 lg:w-6 lg:h-6 ml-2 lg:ml-3 group-hover:translate-y-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="md:hidden px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Title Section */}
        <div className="text-center mb-8 sm:mb-10 relative z-20">
          <h1 className="text-5xl sm:text-6xl font-black text-black-custom leading-[0.85] tracking-tight mb-3 sm:mb-4 heading-primary">
            DESCUBRE
          </h1>
          <h2 className="text-5xl sm:text-6xl font-black text-black-custom leading-[0.85] tracking-tight mb-6 sm:mb-8 heading-primary">
            PERÚ!
          </h2>

          {/* Mobile Experience Badge */}
          <div className="bg-blue-100 rounded-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-2 border-blue-600-custom mx-auto max-w-fit">
            <span className="text-base sm:text-lg font-medium text-blue-600-custom">Experiencias únicas</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600-custom rounded-full flex items-center justify-center border-2 border-black-custom">
              <div className="text-lg sm:text-xl">🏔️</div>
            </div>
          </div>
        </div>

        {/* Mobile Video */}
        <div className="w-full mb-8 sm:mb-10">
          <div className="hero-video-container relative w-full h-[280px] sm:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-black-custom group">
            {/* Mobile Video */}
            <video autoPlay muted loop playsInline className="hero-video absolute inset-0 w-full h-full object-cover">
              <source
                src="https://res.cloudinary.com/dlzq3rsot/video/upload/v1750527252/128688-742066271_small_qqsnpx.mp4"
                type="video/mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600-custom to-blue-800"></div>
            </video>

            {/* Mobile Video Overlay */}
            <div className="video-overlay absolute inset-0"></div>

            {/* Mobile Video Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white z-10 px-4">
                <div className="mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border-2 border-white group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" />
                  </div>
                  <p className="text-base sm:text-lg font-medium mb-2 px-2">Descubre la magia del Perú</p>
                  <p className="text-sm sm:text-base opacity-90 px-2">Aventuras que transforman vidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA Button */}
        <div className="text-center px-2">
          <Button
            onClick={scrollToPackages}
            className="bg-blue-600-custom hover:bg-blue-700-custom text-white font-black px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-full border-2 border-black-custom transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-xl group"
          >
            RESERVAR AHORA
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Extra spacing at bottom */}
        <div className="h-4 sm:h-6"></div>
      </div>
    </section>
  )
}
