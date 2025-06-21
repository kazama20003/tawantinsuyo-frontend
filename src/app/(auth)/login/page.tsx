"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })
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
                DESCUBRE LA MAGIA
                <br />
                <span className="text-blue-400">DEL PERÚ</span>
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Únete a miles de viajeros que han vivido experiencias inolvidables
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">+10,000 viajeros felices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">4.9★ rating promedio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              <h1 className="text-2xl md:text-3xl font-black text-black mb-2">INICIAR SESIÓN</h1>
              <p className="text-gray-600">Accede a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full h-12 pl-12 pr-4 border-2 border-black rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-2 border-black rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 h-12 rounded-lg border-2 border-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                INICIAR SESIÓN
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">O continúa con</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
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

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Certificado MINCETUR</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Datos Seguros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
