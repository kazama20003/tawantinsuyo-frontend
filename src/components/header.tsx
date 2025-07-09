"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Instagram, Linkedin, X, Search, User, Phone, Globe, ChevronDown, MessageCircle } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Header() {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("ES")
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Translation helper
  const t = (key: keyof typeof import("@/lib/i18n").translations.es) => getTranslation(currentLocale, key)

  // Get localized link
  const getLocalizedLink = (path: string): string => {
    if (currentLocale === "en") {
      return `/en${path}`
    }
    return path
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
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

  // Update selected language based on current locale
  useEffect(() => {
    setSelectedLanguage(currentLocale === "en" ? "EN" : "ES")
  }, [currentLocale])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const languages = [
    { code: "ES", name: "Español", flag: "🇪🇸", locale: "es", path: "" },
    { code: "EN", name: "English", flag: "🇺🇸", locale: "en", path: "/en" },
  ]

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    if (typeof window === "undefined") return

    const notification = document.createElement("div")
    const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"

    notification.className = `fixed top-24 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-[100] font-bold text-sm max-w-sm animate-in slide-in-from-right duration-300`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("animate-out", "slide-out-to-right")
      setTimeout(() => notification.remove(), 300)
    }, 4000)
  }

  // Función principal para cambiar idioma con navegación
  const handleLanguageChange = (newLanguage: string) => {
    const targetLang = languages.find((lang) => lang.code === newLanguage)
    if (!targetLang) return

    console.log(`🌐 Navegando a versión en ${targetLang.name}`)

    // Construir nueva URL con el idioma manteniendo la ruta actual
    let newPath = pathname

    // Remover prefijo de idioma existente si existe
    if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, "")
    }

    // Agregar nuevo prefijo de idioma si es necesario
    if (targetLang.locale === "en") {
      newPath = `/en${newPath || "/"}`
    } else {
      newPath = newPath || "/"
    }

    // Actualizar el idioma del documento
    document.documentElement.lang = targetLang.locale
    setSelectedLanguage(newLanguage)

    // Navegar a la nueva URL
    if (newPath !== pathname) {
      router.push(newPath)
    }

    showNotification(`🌐 ${t("languageChanged")}`, "success")
    setIsLanguageOpen(false)
  }

  // Function to check if current path matches the link
  const isActivePage = (href: string) => {
    const localizedHref = getLocalizedLink(href)
    if (localizedHref === getLocalizedLink("/") || localizedHref === getLocalizedLink("/home")) {
      return pathname === getLocalizedLink("/") || pathname === getLocalizedLink("/home")
    }
    return pathname.startsWith(localizedHref)
  }

  const navigation = [
    { name: t("destinations"), href: getLocalizedLink("/destinations") },
    { name: t("tours"), href: getLocalizedLink("/tours") },
    { name: t("itineraries"), href: getLocalizedLink("/itineraries") },
    { name: t("aboutUs"), href: getLocalizedLink("/about-us") },
  ]

  return (
    <>
      {/* Fixed Header - Full Screen Width with consistent rounded borders */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-blue-600 border-4 border-black transition-all duration-700 ease-out w-full ${
          isHeaderCompact
            ? "rounded-2xl" // Solo bordes, sin márgenes
            : "rounded-t-3xl"
        }`}
        data-no-translate
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
                {t("certifiedAgency")}
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
                {navigation.slice(0, 2).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                      isActivePage(item.href) ? "text-blue-600" : "text-black"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                        isActivePage(item.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                ))}
              </nav>

              {/* Center Logo */}
              <div className="flex items-center justify-center">
                <Link
                  href={getLocalizedLink("/")}
                  className="text-center transform hover:scale-105 transition-transform duration-300"
                >
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
                {navigation.slice(2).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-bold uppercase tracking-wide hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-pointer relative group ${
                      isActivePage(item.href) ? "text-blue-600" : "text-black"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ${
                        isActivePage(item.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                ))}
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
                  placeholder={t("searchDestinationsTours")}
                  className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-full focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-black rounded-full hover:border-blue-600 transition-all duration-300"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-bold">{selectedLanguage}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border-2 border-black rounded-lg shadow-xl min-w-48 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                        <div className="text-sm font-bold text-gray-700">{t("selectLanguage")}</div>
                        <div className="text-xs text-gray-600 mt-1">{t("languageChangeWithNavigation")}</div>
                      </div>

                      <div className="py-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 w-full text-left transition-colors ${
                              selectedLanguage === lang.code ? "bg-blue-100 border-l-4 border-blue-600" : ""
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <div className="flex-1">
                              <span className="font-medium block">{lang.name}</span>
                              <span className="text-xs text-gray-500">
                                {lang.code} • {lang.locale} • {lang.path || "/"}
                              </span>
                            </div>
                            {selectedLanguage === lang.code && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2">
                        <div className="text-xs text-gray-600 text-center">{t("seoOptimizedMultilingual")}</div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href={getLocalizedLink("/login")}>
                  <Button
                    variant="outline"
                    className="border-2 border-black text-black hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2 bg-transparent"
                  >
                    <User className="w-4 h-4" />
                    {t("login")}
                  </Button>
                </Link>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 text-lg rounded-full border-2 border-black transition-all duration-300 hover:scale-110 hover:shadow-xl">
                  {t("bookNow")}
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
                <Link href={getLocalizedLink("/")} className="text-center">
                  {isHeaderCompact ? (
                    <div className="relative w-16 h-16 transition-all duration-700 ease-out">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-black text-blue-600 leading-tight">TAWANTINSUYO</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium -mt-1">PERU TOURS</div>
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full border-2 border-black transition-all duration-300">
                  {t("bookNow")}
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
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center gap-1 px-2 py-1 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-md"
                  >
                    <Globe className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      {currentLocale === "en" ? "EN" : "ES"}
                    </span>
                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-32 md:w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full text-left px-3 md:px-4 py-2 text-xs md:text-sm hover:bg-blue-50 transition-colors ${
                            selectedLanguage === lang.code ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          {lang.flag} {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center flex-1">
                <Link href={getLocalizedLink("/")} className="text-center">
                  {isHeaderCompact ? (
                    <div className="relative w-12 h-12 transition-all duration-700 ease-out">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-black text-blue-600 leading-tight">TAWANTINSUYO</div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium -mt-1">PERU TOURS</div>
                    </div>
                  )}
                </Link>
              </div>

              <div className="flex items-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 text-sm rounded-full border-2 border-black transition-all duration-300">
                  {t("bookNow")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
            <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-center">
                    <div className="text-xl font-black text-blue-600">TAWANTINSUYO</div>
                    <div className="bg-black text-white px-3 py-1 rounded-lg font-black text-sm">PERU</div>
                  </div>
                  <button onClick={closeMobileMenu} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isActivePage(item.href)
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Contact */}
                <div className="pt-4 border-t border-gray-200 mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t("contact")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close language dropdown */}
        {isLanguageOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLanguageOpen(false)} />}
      </header>
    </>
  )
}
