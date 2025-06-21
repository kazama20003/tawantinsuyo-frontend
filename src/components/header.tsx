"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Instagram, Linkedin, X, Search, User, MapPin, Calendar, Users, Phone, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const [, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("ES")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      if (currentScrollY > 100) {
        setIsHeaderCompact(true)
      } else {
        setIsHeaderCompact(false)
      }
    }

    let timeoutId: NodeJS.Timeout | null = null
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          handleScroll()
          timeoutId = null
        }, 10)
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const languages = [
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "PT", name: "Português", flag: "🇧🇷" },
  ]

  // Function to check if current path matches the link
  const isActivePage = (href: string) => {
    if (href === "/" || href === "/home") {
      return pathname === "/" || pathname === "/home"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Fixed Header - Full Screen Width with consistent rounded borders */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-blue-600 border-4 border-black transition-all duration-700 ease-out w-full ${
          isHeaderCompact
            ? "rounded-2xl" // Solo bordes, sin márgenes
            : "rounded-t-3xl"
        }`}
      >
        {/* Top bar - contracts/expands smoothly */}
        <div
          className={`bg-blue-600 text-white px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out overflow-hidden w-full ${
            isHeaderCompact ? "max-h-0 py-0 opacity-0 rounded-t-2xl" : "max-h-20 py-3 opacity-100 rounded-t-3xl"
          }`}
        >
          <div className="w-full flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <Instagram className="w-4 h-4 hover:text-blue-200 transition-colors duration-300 cursor-pointer" />
              <Linkedin className="w-4 h-4 hover:text-blue-200 transition-colors duration-300 cursor-pointer" />
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-blue-200 transition-colors duration-300 cursor-pointer hidden sm:block">
                Agencia de Turismo Certificada
              </span>
              <span className="hover:text-blue-200 transition-colors duration-300 cursor-pointer flex items-center gap-1">
                <Phone className="w-3 h-3" />
                +51 984 123 456
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation - always visible with consistent rounded borders */}
        <div
          className={`bg-white px-4 sm:px-6 lg:px-8 py-4 w-full transition-all duration-700 ease-out ${
            isHeaderCompact
              ? "rounded-2xl" // Compacto: bordes redondeados completos
              : "border-b-2 border-black" // Expandido: solo borde inferior
          }`}
        >
          <div className="w-full">
            {/* Desktop Navigation */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 items-center w-full">
              {/* Left Navigation */}
              <nav className="flex items-center gap-6 justify-start">
                <Link
                  href="/destinations"
                  className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                    isActivePage("/destinations") ? "text-blue-600" : "text-black"
                  }`}
                >
                  DESTINOS
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                      isActivePage("/destinations") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/tours"
                  className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                    isActivePage("/tours") ? "text-blue-600" : "text-black"
                  }`}
                >
                  TOURS
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                      isActivePage("/tours") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </nav>

              {/* Center Logo */}
              <div className="flex items-center justify-center">
                <Link href="/" className="text-center transform hover:scale-105 transition-transform duration-300">
                  {isHeaderCompact ? (
                    <div className="relative w-20 h-20 transition-all duration-700 ease-out">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-black text-blue-600">TAWANTINSUYO</div>
                      <div className="bg-black text-white px-4 py-1 rounded-lg font-black text-xl">PERU</div>
                    </div>
                  )}
                </Link>
              </div>

              {/* Right Navigation */}
              <nav className="flex items-center gap-6 justify-end">
                <Link
                  href="/itineraries"
                  className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                    isActivePage("/itineraries") ? "text-blue-600" : "text-black"
                  }`}
                >
                  ITINERARIOS
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                      isActivePage("/itineraries") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/about-us"
                  className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                    isActivePage("/about-us") ? "text-blue-600" : "text-black"
                  }`}
                >
                  NOSOTROS
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                      isActivePage("/about-us") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </nav>
            </div>

            {/* Desktop Search and Actions Row - Hidden when compact */}
            <div
              className={`lg:flex justify-between items-center mt-4 w-full transition-all duration-700 ease-out ${
                isHeaderCompact ? "hidden" : "hidden lg:flex"
              }`}
            >
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Buscar destinos, tours..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-full focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 border-2 border-black rounded-full hover:border-blue-600 transition-all duration-300">
                    <Globe className="w-4 h-4" />
                    <span className="font-bold">{selectedLanguage}</span>
                  </button>
                  <div className="absolute top-full right-0 mt-2 bg-white border-2 border-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg w-full text-left"
                      >
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-black text-black hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    INICIAR SESIÓN
                  </Button>
                </Link>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  RESERVAR AHORA
                </Button>
              </div>
            </div>

            {/* Tablet Navigation */}
            <div className="hidden md:flex lg:hidden justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center flex-1">
                <Link href="/" className="text-center">
                  {isHeaderCompact ? (
                    <div className="relative w-16 h-16 transition-all duration-700 ease-out">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-black text-blue-600">TAWANTINSUYO</div>
                      <div className="bg-black text-white px-3 py-1 rounded-lg font-black text-lg">PERU</div>
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full border-2 border-black transition-all duration-300">
                  RESERVAR
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Mobile Language Selector */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-2 py-1 border border-black rounded-full text-xs hover:border-blue-600 transition-all duration-300">
                    <Globe className="w-3 h-3" />
                    <span className="font-bold">{selectedLanguage}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center flex-1">
                <Link href="/" className="text-center">
                  {isHeaderCompact ? (
                    <div className="relative w-14 h-14 transition-all duration-700 ease-out">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-xl font-black text-blue-600">TAWANTINSUYO</div>
                      <div className="bg-black text-white px-2 py-1 rounded-lg font-black text-sm">PERU</div>
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-full border-2 border-black text-sm transition-all duration-300">
                  RESERVAR
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 lg:hidden">
          <div className="fixed top-4 left-4 right-4 bg-white rounded-2xl border-4 border-black shadow-2xl animate-in slide-in-from-top duration-500 max-h-[90vh] overflow-hidden">
            <div className="flex flex-col">
              {/* Compact Menu Header */}
              <div className="flex justify-between items-center p-4 bg-blue-600 border-b-2 border-black rounded-t-xl">
                <div className="text-center flex-1">
                  <div className="text-lg font-black text-white">TAWANTINSUYO</div>
                  <div className="bg-black text-white px-2 py-1 rounded-lg font-black text-sm inline-block">PERU</div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1 text-white hover:bg-blue-700 rounded-lg transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Compact Menu Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Language Selection - Compact */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Idioma</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-300 ${
                          selectedLanguage === lang.code
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-xs font-medium">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Section - Compact */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-full focus:border-blue-600 bg-blue-50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600" />
                  </div>
                </div>

                {/* Main Navigation - Compact */}
                <div className="p-4">
                  <div className="space-y-2">
                    <Link
                      href="/destinations"
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-300 cursor-pointer group ${
                        isActivePage("/destinations") ? "bg-blue-50 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                          isActivePage("/destinations") ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div
                          className={`text-lg font-black uppercase ${
                            isActivePage("/destinations") ? "text-blue-600" : "text-black"
                          }`}
                        >
                          DESTINOS
                        </div>
                        <div className="text-xs text-gray-600">Lugares increíbles</div>
                      </div>
                    </Link>

                    <Link
                      href="/tours"
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-300 cursor-pointer group ${
                        isActivePage("/tours") ? "bg-blue-50 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                          isActivePage("/tours") ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div
                          className={`text-lg font-black uppercase ${
                            isActivePage("/tours") ? "text-blue-600" : "text-black"
                          }`}
                        >
                          TOURS
                        </div>
                        <div className="text-xs text-gray-600">Experiencias guiadas</div>
                      </div>
                    </Link>

                    <Link
                      href="/itineraries"
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-300 cursor-pointer group ${
                        isActivePage("/itineraries") ? "bg-blue-50 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                          isActivePage("/itineraries") ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div
                          className={`text-lg font-black uppercase ${
                            isActivePage("/itineraries") ? "text-blue-600" : "text-black"
                          }`}
                        >
                          ITINERARIOS
                        </div>
                        <div className="text-xs text-gray-600">Rutas personalizadas</div>
                      </div>
                    </Link>

                    <Link
                      href="/about-us"
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-300 cursor-pointer group ${
                        isActivePage("/about-us") ? "bg-blue-50 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                          isActivePage("/about-us") ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div
                          className={`text-lg font-black uppercase ${
                            isActivePage("/about-us") ? "text-blue-600" : "text-black"
                          }`}
                        >
                          NOSOTROS
                        </div>
                        <div className="text-xs text-gray-600">Nuestro equipo</div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="p-4 space-y-2 border-t border-gray-100">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full py-2 text-sm border-2 border-black text-black hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      INICIAR SESIÓN
                    </Button>
                  </Link>
                  <Button
                    onClick={closeMobileMenu}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 text-sm rounded-lg border-2 border-black transition-all duration-300"
                  >
                    RESERVAR AHORA
                  </Button>
                </div>
              </div>

              {/* Compact Menu Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" />
                    <Linkedin className="w-4 h-4 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm">
                    <Phone className="w-3 h-3" />
                    +51 984 123 456
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header - Responsive */}
      <div
        className={`transition-all duration-700 ease-out ${
          isHeaderCompact ? "h-[80px] md:h-[100px]" : "h-[120px] md:h-[160px]"
        }`}
      ></div>
    </>
  )
}
