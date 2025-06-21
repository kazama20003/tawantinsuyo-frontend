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

export default function Footer() {
  return (
    <footer className="bg-black text-white border-4 border-black rounded-t-3xl mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="text-2xl md:text-3xl font-black text-blue-400 mb-2">TAWANTINSUYO</div>
                <div className="bg-white text-black px-3 py-1 rounded-lg font-black text-lg inline-block">PERU</div>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                Tu agencia de turismo certificada para descubrir la magia del Perú. Experiencias auténticas desde 2009.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <Instagram className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" />
                <Facebook className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" />
                <Twitter className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" />
                <Youtube className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg md:text-xl font-black text-white mb-6 uppercase">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Destinos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Tours
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Itinerarios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm md:text-base">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg md:text-xl font-black text-white mb-6 uppercase">Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm md:text-base">Av. El Sol 123, Cusco</p>
                    <p className="text-gray-300 text-sm md:text-base">Perú, 08000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-gray-300 text-sm md:text-base">+51 984 123 456</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-gray-300 text-sm md:text-base">info@tawantinsuyoperu.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-gray-300 text-sm md:text-base">24/7 Soporte</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg md:text-xl font-black text-white mb-6 uppercase">Newsletter</h3>
              <p className="text-gray-300 text-sm md:text-base mb-4">Recibe ofertas exclusivas y tips de viaje</p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Tu email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg border-2 border-blue-600 transition-all duration-300">
                  SUSCRIBIRSE
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">Certificado MINCETUR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">Pagos Seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">Soporte Multilingüe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">© 2024 Tawantinsuyo Peru Tours. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookies
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cancelaciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
