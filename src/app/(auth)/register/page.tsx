"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt:", formData)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-4 rounded-3xl border-4 border-black overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg"
            alt="Cañón del Colca - Perú"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                ÚNETE A NUESTRA
                <br />
                <span className="text-blue-400">COMUNIDAD</span>
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Crea tu cuenta y accede a ofertas exclusivas y experiencias personalizadas
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Ofertas exclusivas para miembros</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Soporte prioritario 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Guías de viaje gratuitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al inicio</span>
            </Link>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">TAWANTINSUYO</div>
              <div className="bg-black text-white px-4 py-2 rounded-lg font-black text-lg">PERU</div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl border-4 border-black p-6 md:p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-black mb-2">CREAR CUENTA</h1>
              <p className="text-gray-600">Únete a la familia Tawantinsuyo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                  >
                    Nombre
                  </label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Apellido
                  </label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Tu apellido"
                      className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Teléfono
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+51 999 999 999"
                    className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Contraseña"
                      className="w-full h-12 pl-12 pr-12 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-black mb-2 uppercase tracking-wide"
                  >
                    Confirmar
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirmar"
                      className="w-full h-12 pl-12 pr-12 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-2 border-black rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Acepto los{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      política de privacidad
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-2 border-black rounded focus:ring-blue-500 mt-1"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Quiero recibir ofertas exclusivas y noticias de viaje por email
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 h-12 rounded-lg border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                CREAR CUENTA
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">O regístrate con</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Register */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-black text-black hover:bg-gray-50 font-bold py-3 h-12 rounded-lg transition-all duration-300"
              >
                <Globe className="w-5 h-5 mr-2" />
                Continuar con Google
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Registro Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Sin Spam</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cancelación Fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
