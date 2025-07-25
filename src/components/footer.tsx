"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Clock,
  Globe,
  Shield,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Footer() {
  const pathname = usePathname()

  // Get current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "es"

  // Memoize translation helper
  const t = useMemo(
    () => (key: keyof typeof import("@/lib/i18n").translations.es) => getTranslation(currentLocale, key),
    [currentLocale],
  )

  // Get localized link
  const getLocalizedLink = useCallback(
    (path: string): string => {
      // Remove any existing language prefix from path
      const cleanPath = path.replace(/^\/en/, "").replace(/^\/es/, "") || "/"

      if (currentLocale === "en") {
        return cleanPath === "/" ? "/en" : `/en${cleanPath}`
      }
      return cleanPath === "/" ? "/" : cleanPath
    },
    [currentLocale],
  )

  return (
    <footer className="bg-black text-white border-4 border-black rounded-t-3xl mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="mb-6">
                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-400 mb-2">TAWANTINSUYO</div>
                <div className="bg-white text-black px-4 py-2 rounded-2xl font-black text-lg md:text-xl inline-block border-4 border-white">
                  PERU
                </div>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
                {currentLocale === "es"
                  ? "Tu agencia de turismo certificada para descubrir la magia del Perú. Experiencias auténticas desde 2009."
                  : "Your certified tourism agency to discover the magic of Peru. Authentic experiences since 2009."}
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Instagram, color: "hover:text-pink-400" },
                  { icon: Facebook, color: "hover:text-blue-400" },
                  { icon: Twitter, color: "hover:text-blue-300" },
                  { icon: Youtube, color: "hover:text-red-400" },
                ].map(({ icon: Icon, color }, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-white text-black ${color} transition-colors cursor-pointer`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white mb-6 uppercase">
                {currentLocale === "es" ? "ENLACES RÁPIDOS" : "QUICK LINKS"}
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/destinations", label: t("destinations") },
                  { href: "/tours", label: t("tours") },
                  { href: "/itineraries", label: t("itineraries") },
                  { href: "/about-us", label: t("aboutUs") },
                  { href: "/blog", label: currentLocale === "es" ? "Blog" : "Blog" },
                  { href: "/contact", label: t("contact") },
                ].map((link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={getLocalizedLink(link.href)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base font-bold uppercase tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white mb-6 uppercase">{t("contact")}</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    content: (
                      <div>
                        <p className="text-gray-300 text-sm md:text-base font-bold">Portal San Agustín 133-139</p>
                        <p className="text-gray-300 text-sm md:text-base font-bold">Arequipa, Perú</p>
                      </div>
                    ),
                  },
                  {
                    icon: Phone,
                    content: (
                      <div className="text-gray-300 text-sm md:text-base font-bold">
                        <p>+51 913 876 154</p>
                        <p>+51 975 440 345</p>
                      </div>
                    ),
                  },
                  {
                    icon: Mail,
                    content: <p className="text-gray-300 text-sm md:text-base font-bold">info@tawantinsuyoperu.com</p>,
                  },
                  {
                    icon: Clock,
                    content: (
                      <p className="text-gray-300 text-sm md:text-base font-bold">
                        {currentLocale === "es" ? "24/7 SOPORTE" : "24/7 SUPPORT"}
                      </p>
                    ),
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white">
                      <item.icon className="w-4 h-4 text-black" />
                    </div>
                    {item.content}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg md:text-xl lg:text-2xl font-black text-white mb-6 uppercase">NEWSLETTER</h3>
              <p className="text-gray-300 text-sm md:text-base mb-4 font-bold">
                {currentLocale === "es"
                  ? "RECIBE OFERTAS EXCLUSIVAS Y TIPS DE VIAJE"
                  : "RECEIVE EXCLUSIVE OFFERS AND TRAVEL TIPS"}
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder={currentLocale === "es" ? "TU EMAIL" : "YOUR EMAIL"}
                  className="bg-white border-4 border-white text-black placeholder-gray-600 focus:border-blue-400 font-bold h-12 rounded-2xl"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 h-12 rounded-2xl border-4 border-blue-600 transition-all duration-300 text-base">
                    {currentLocale === "es" ? "SUSCRIBIRSE" : "SUBSCRIBE"}
                  </Button>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                {[
                  {
                    icon: Shield,
                    text: currentLocale === "es" ? "CERTIFICADO MINCETUR" : "MINCETUR CERTIFIED",
                  },
                  {
                    icon: CreditCard,
                    text: currentLocale === "es" ? "PAGOS SEGUROS" : "SECURE PAYMENTS",
                  },
                  {
                    icon: Globe,
                    text: currentLocale === "es" ? "SOPORTE MULTILINGÜE" : "MULTILINGUAL SUPPORT",
                  },
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                      <badge.icon className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-xs text-gray-300 font-bold">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t-4 border-gray-700 py-6 md:py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm font-bold">
                {currentLocale === "es"
                  ? "© 2024 TAWANTINSUYO PERU TOURS. TODOS LOS DERECHOS RESERVADOS."
                  : "© 2024 TAWANTINSUYO PERU TOURS. ALL RIGHTS RESERVED."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              {[
                { href: "/terms", label: currentLocale === "es" ? "TÉRMINOS" : "TERMS" },
                { href: "/privacy", label: currentLocale === "es" ? "PRIVACIDAD" : "PRIVACY" },
                { href: "/cookies", label: "COOKIES" },
                { href: "/cancellations", label: currentLocale === "es" ? "CANCELACIONES" : "CANCELLATIONS" },
              ].map((link, index) => (
                <motion.div key={index} whileHover={{ y: -2 }}>
                  <Link
                    href={getLocalizedLink(link.href)}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors font-bold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
