"use client"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Instagram,
  Linkedin,
  X,
  Search,
  User,
  Phone,
  Globe,
  ChevronDown,
  MessageCircle,
  Facebook,
  Youtube,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { getTranslation, type Locale } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { api } from "@/lib/axiosInstance"

// Type for translation function
type TranslationFunction = (key: keyof typeof import("@/lib/i18n").translations.es) => string
// Type for localized link function
type LocalizedLinkFunction = (path: string) => string

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("ES")
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Translation helper
  const t: TranslationFunction = (key) => getTranslation(currentLocale, key)

  // Get localized link
  const getLocalizedLink: LocalizedLinkFunction = (path: string): string => {
    if (currentLocale === "en") {
      return `/en${path}`
    }
    return path
  }

  // Fetch cart items count
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItemsCount(0)
      return
    }
    try {
      const response = await api.get("/cart")
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const cart = response.data.data[0]
        const totalItems = cart.items?.length || 0
        setCartItemsCount(totalItems)
      } else {
        setCartItemsCount(0)
      }
    } catch {
      setCartItemsCount(0)
    }
  }, [isAuthenticated])

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      // Verificar si hay token en localStorage o hacer una llamada a la API
      const token = localStorage.getItem("authToken") || localStorage.getItem("token")
      if (token) {
        // Opcional: verificar si el token es válido con una llamada a la API
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsAuthenticated(false)
    }
  }, [])

  // Navigation items with submenus
  const navItems = [
    {
      label: t("destinations"),
      href: getLocalizedLink("/destinations"),
      submenu: [
        { title: "Cusco & Machu Picchu", description: "La antigua capital del Imperio Inca" },
        { title: "Lima & Costa", description: "Capital gastronómica de Sudamérica" },
        { title: "Arequipa & Colca", description: "La ciudad blanca y paisajes únicos" },
      ],
    },
    {
      label: t("tours"),
      href: getLocalizedLink("/tours"),
      submenu: [
        {
          title: currentLocale === "en" ? "Classic Tours" : "Tours Clásicos",
          description: currentLocale === "en" ? "Traditional Peru experiences" : "Experiencias tradicionales del Perú",
        },
        {
          title: currentLocale === "en" ? "Adventure Tours" : "Tours de Aventura",
          description: currentLocale === "en" ? "For the most adventurous" : "Para los más aventureros",
        },
        {
          title: currentLocale === "en" ? "Cultural Tours" : "Tours Culturales",
          description: currentLocale === "en" ? "Immerse in Peruvian culture" : "Sumérgete en la cultura peruana",
        },
      ],
    },
    {
      label: t("itineraries"),
      href: getLocalizedLink("/daily-tours"),
      submenu: [
        { title: "7 días - Clásico", description: "Lo esencial del Perú en una semana" },
        { title: "14 días - Completo", description: "Experiencia completa por todo el país" },
        { title: "21 días - Premium", description: "La experiencia más completa disponible" },
      ],
    },
    {
      label: t("aboutUs"),
      href: getLocalizedLink("/about-us"),
      submenu: [
        {
          title: currentLocale === "en" ? "Our Story" : "Nuestra Historia",
          description: currentLocale === "en" ? "How Tawantinsuyo Peru began" : "Cómo comenzó Tawantinsuyo Peru",
        },
        {
          title: currentLocale === "en" ? "Our Team" : "Nuestro Equipo",
          description: currentLocale === "en" ? "Expert guides and staff" : "Guías expertos y personal especializado",
        },
        {
          title: currentLocale === "en" ? "Certifications" : "Certificaciones",
          description: currentLocale === "en" ? "Certified and recognized agency" : "Agencia certificada y reconocida",
        },
      ],
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update selected language based on current locale
  useEffect(() => {
    setSelectedLanguage(currentLocale === "en" ? "EN" : "ES")
  }, [currentLocale])

  // Fetch cart count on mount and when pathname changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount()
    }
  }, [pathname, isAuthenticated, fetchCartCount])

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const handleMenuEnter = (index: number) => {
    setActiveMenu(index)
  }

  const handleMenuLeave = () => {
    setActiveMenu(null)
  }

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

    let currentPath = pathname
    let newPath = ""

    if (currentPath.startsWith("/en")) {
      currentPath = currentPath.replace(/^\/en/, "") || "/"
    }

    if (targetLang.locale === "en") {
      newPath = currentPath === "/" ? "/en" : `/en${currentPath}`
    } else {
      newPath = currentPath === "/" ? "/" : currentPath
    }

    document.documentElement.lang = targetLang.locale
    setSelectedLanguage(newLanguage)
    router.push(newPath)
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

  // TikTok Icon Component
  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )

  const handleCartClick = useCallback(() => {
    if (!isAuthenticated) {
      showNotification(
        currentLocale === "es"
          ? "⚠️ No has iniciado sesión. Inicia sesión para ver tu carrito."
          : "⚠️ You haven't logged in. Please log in to view your cart.",
        "error",
      )
      // Redirigir al login después de mostrar la notificación
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }
    // Si está autenticado, ir al carrito
    router.push("/cart")
  }, [isAuthenticated, currentLocale, router])

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: scrolled ? 0 : -24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 overflow-hidden"
      >
        <div className="w-full flex justify-center px-2 sm:px-3 md:px-4 lg:px-6">
          <motion.div
            animate={{
              paddingTop: scrolled ? "1rem" : "2rem",
              paddingBottom: scrolled ? "1rem" : activeMenu !== null ? "6rem" : "2rem",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[1400px] bg-white rounded-b-[60px] shadow-md overflow-visible"
            onMouseLeave={handleMenuLeave}
          >
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
              {/* Top bar - Social media and contact info */}
              <AnimatePresence>
                {!scrolled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:flex justify-between items-center text-sm text-blue-600 mb-6 pb-4 border-b border-blue-100"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-xs hover:text-blue-800 transition-colors cursor-pointer">Travel trade</span>
                      <span className="text-xs hover:text-blue-800 transition-colors cursor-pointer">Media</span>
                      <span className="text-xs hover:text-blue-800 transition-colors cursor-pointer">Mice</span>
                      <div className="flex items-center gap-3 ml-6">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Facebook className="w-5 h-5 hover:text-blue-800 transition-colors cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Instagram className="w-5 h-5 hover:text-blue-800 transition-colors cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <TikTokIcon className="w-5 h-5 hover:text-blue-800 transition-colors cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Youtube className="w-5 h-5 hover:text-blue-800 transition-colors cursor-pointer" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Linkedin className="w-5 h-5 hover:text-blue-800 transition-colors cursor-pointer" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="hover:text-blue-800 transition-colors cursor-pointer">
                        {t("certifiedAgency")}
                      </span>
                      <span className="hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        +51913876154
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Main row: logo + nav + icons */}
              <div className="flex justify-between items-center gap-2 sm:gap-4 min-w-0">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0"
                >
                  <Link href={getLocalizedLink("/")} className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain rounded-full"
                        priority
                      />
                    </div>
                    <div className="flex flex-col min-w-0 sm:block">
                      <span className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-blue-600 leading-tight whitespace-nowrap">
                        Tawantinsuyo Peru
                      </span>
                    </div>
                  </Link>
                </motion.div>
                {/* Navigation */}
                <nav className="flex-1 hidden lg:flex justify-center gap-6 xl:gap-8 min-w-0">
                  {navItems.map((item, i) => (
                    <div key={i} className="group relative" onMouseEnter={() => handleMenuEnter(i)}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "flex items-center text-sm font-medium gap-1 transition-colors duration-200 hover:text-blue-600 whitespace-nowrap",
                          activeMenu === i || isActivePage(item.href) ? "text-blue-600" : "text-gray-900",
                        )}
                      >
                        {item.label}
                        <motion.div animate={{ rotate: activeMenu === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={14} />
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </nav>
                {/* Icons */}
                <div className="flex items-center gap-1 sm:gap-2 text-gray-700 text-sm flex-shrink-0">
                  {/* Social links - only on xl screens */}
                  <div className="hidden xl:flex gap-3 text-xs text-gray-400 pr-3 border-r border-gray-300">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link href="#" className="hover:text-blue-600 transition-colors">
                        <Facebook className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link href="#" className="hover:text-blue-600 transition-colors">
                        <Instagram className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link href="#" className="hover:text-blue-600 transition-colors">
                        <TikTokIcon className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link href="#" className="hover:text-blue-600 transition-colors">
                        <Youtube className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </div>
                  {/* Login */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={getLocalizedLink("/login")}
                      className="hidden md:flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline text-xs">{t("login")}</span>
                    </Link>
                  </motion.div>
                  {/* Language Selector - Desktop */}
                  <div className="relative hidden md:block">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors px-1 py-1 rounded-md"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-xs">{selectedLanguage}</span>
                      <ChevronDown className="w-3 h-3" />
                    </motion.button>
                    <AnimatePresence>
                      {isLanguageOpen && (
                        <>
                          {/* Backdrop */}
                          <div className="fixed inset-0 z-[60]" onClick={() => setIsLanguageOpen(false)} />
                          {/* Dropdown */}
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-32 z-[70] overflow-hidden"
                          >
                            {languages.map((lang) => (
                              <motion.button
                                key={lang.code}
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLanguageChange(lang.code)
                                }}
                                className={clsx(
                                  "flex items-center gap-2 px-3 py-2 w-full text-left transition-colors text-sm hover:bg-gray-50",
                                  selectedLanguage === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700",
                                )}
                              >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Action Icons */}
                  <div className="hidden sm:flex items-center gap-1">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Search className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors" />
                    </motion.div>
                    {/* Shopping Cart with Badge */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                      <ShoppingCart
                        className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={handleCartClick}
                      />
                      {cartItemsCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          {cartItemsCount}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  {/* Mobile menu button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileMenu}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors ml-1"
                  >
                    <Menu className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              {/* Expanded submenu */}
              <AnimatePresence>
                {activeMenu !== null && !scrolled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-8"
                  >
                    <div className="border-t border-gray-200 pt-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {navItems[activeMenu].submenu.map((sub, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: j * 0.1 }}
                          >
                            <Link
                              href="#"
                              className="group block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {sub.title}
                              </h3>
                              <p className="text-sm text-gray-600">{sub.description}</p>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bottom row: text + button */}
              <AnimatePresence>
                {!scrolled && activeMenu === null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mt-10 grid md:grid-cols-2 items-center gap-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                        {currentLocale === "en" ? "Your Peru travel portal" : "Tu portal de viajes a Perú"}
                      </h1>
                      <p className="text-sm text-gray-600">
                        {currentLocale === "en"
                          ? "Discover new ideas for your vacations and adventures in Peru."
                          : "Descubre nuevas ideas para tus vacaciones y aventuras en Perú."}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="md:text-right"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => router.push(getLocalizedLink("/tours"))}
                          className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                        >
                          {currentLocale === "en" ? "Book Now" : "Reservar"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.header>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[min(280px,85vw)] h-full bg-white shadow-lg z-[70] overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <Image
                        src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750535406/Imagen_de_WhatsApp_2025-06-02_a_las_12.51.49_e3f17722_uebdkn.jpg"
                        alt="Tawantinsuyo Peru Logo"
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-blue-600">Tawantinsuyo</div>
                      <div className="text-xs text-gray-600 -mt-1">Peru</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeMobileMenu}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                <nav className="space-y-2 mb-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={clsx(
                          "block px-3 py-2 rounded-lg font-medium transition-colors text-sm",
                          isActivePage(item.href) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                {/* Mobile Language Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mb-4 pt-3 border-t border-gray-200"
                >
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">Idioma / Language</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleLanguageChange(lang.code)
                          closeMobileMenu()
                        }}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300 text-left text-sm",
                          selectedLanguage === lang.code
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700",
                        )}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <div className="font-medium text-xs">{lang.code}</div>
                          <div className="text-xs opacity-75">{lang.name}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                {/* Mobile Social Media */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="mb-4 pt-3 border-t border-gray-200"
                >
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">Síguenos</h3>
                  <div className="flex justify-center gap-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <TikTokIcon className="w-6 h-6 text-gray-800 cursor-pointer" />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Youtube className="w-6 h-6 text-red-600 cursor-pointer" />
                    </motion.div>
                  </div>
                </motion.div>
                {/* Mobile Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent text-sm py-2"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {t("contact")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent text-sm py-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
