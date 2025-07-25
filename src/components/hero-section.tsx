"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isEnglish = pathname.startsWith("/en")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToPackages = () => {
    const packagesSection = document.getElementById("packages-section")
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source
          src="https://res.cloudinary.com/dlzq3rsot/video/upload/v1753464795/V%C3%ADdeo_sin_t%C3%ADtulo_Hecho_con_Clipchamp_2_xahyej.mp4"
          type="video/mp4"
        />
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-8"
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="block"
            >
              TAWANTINSUYO
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="block text-blue-400"
            >
              PERU
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              onClick={scrollToPackages}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-full border-2 border-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              {isEnglish ? "BOOK NOW" : "RESERVAR AHORA"}
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  )
}
