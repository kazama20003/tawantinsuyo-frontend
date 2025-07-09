"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Globe, Shield, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/axiosInstance"
import Cookies from "js-cookie"
import { toast } from "sonner"
import type { ApiError, AuthResponse, GoogleAuthResponse } from "@/types/api"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.get<AuthResponse>("/auth/login", {
        email,
        password,
      })

      const { access_token } = response.data

      // Solo guardar el token en cookies
      Cookies.set("token", access_token, { expires: 7 }) // Expira en 7 días

      toast.success("¡Inicio de sesión exitoso!", {
        description: "Redirigiendo al dashboard...",
      })

      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.response?.data?.message || "Error al iniciar sesión"

      toast.error("Error al iniciar sesión", {
        description: errorMessage,
      })

      console.error("Login error:", apiError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      const response = await api.post<GoogleAuthResponse>("/auth/google")

      if (response.data.url) {
        toast.info("Redirigiendo a Google...", {
          description: "Serás redirigido para autenticarte",
        })

        // Redirigir a la URL de autenticación de Google
        window.location.href = response.data.url
      }
    } catch (err) {
      const apiError = err as ApiError
      console.error("Google auth error:", apiError)

      toast.error("Error de conexión", {
        description: "No se pudo conectar con Google. Intenta nuevamente.",
      })

      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Left Side - Image & Content - Solo Desktop */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-2 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://res.cloudinary.com/dlzq3rsot/image/upload/v1750531194/colca-5154702_1920_yiiyi6.jpg"
              alt="Cañón del Colca - Perú"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <div className="text-white space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                    DESCUBRE LA
                    <br />
                    <span className="text-blue-400">MAGIA DEL PERÚ</span>
                  </h2>
                  <p className="text-xl lg:text-2xl opacity-90 font-medium">
                    Únete a miles de viajeros que han vivido experiencias inolvidables
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Users className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-lg font-bold">+10,000</div>
                      <div className="text-sm opacity-80">Viajeros felices</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <div>
                      <div className="text-lg font-bold">4.9★</div>
                      <div className="text-sm opacity-80">Rating promedio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form - Full width en móvil */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-screen">
          {/* Mobile Header - Mejorado y Consistente */}
          <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-black">¡BIENVENIDO DE VUELTA!</h2>
              <p className="text-blue-100 text-sm">Inicia sesión para continuar tu aventura</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-bold">+10K</div>
                  <div className="text-xs text-blue-100">Usuarios</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-bold">4.9★</div>
                  <div className="text-xs text-blue-100">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-6">
              {/* Back Button */}
              <div className="flex justify-start">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Volver al inicio</span>
                </Link>
              </div>

              {/* Logo */}
              <div className="text-center space-y-2">
                <div className="inline-block">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 mb-2">TAWANTINSUYO</div>
                  <div className="bg-black text-white px-4 py-2 rounded-xl font-black text-base lg:text-lg">PERU</div>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white rounded-2xl lg:rounded-3xl border-2 lg:border-4 border-black p-6 sm:p-8 lg:p-8 shadow-xl">
                <div className="text-center mb-6 lg:mb-8">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-2">INICIAR SESIÓN</h1>
                  <p className="text-gray-600 text-sm lg:text-base">Accede a tu cuenta para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs lg:text-sm font-bold text-black uppercase tracking-wide"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full h-12 lg:h-14 pl-12 pr-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-base"
                        required
                        disabled={isLoading}
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-xs lg:text-sm font-bold text-black uppercase tracking-wide"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        className="w-full h-12 lg:h-14 pl-12 pr-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-base"
                        required
                        disabled={isLoading}
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-gray-600">Recordarme</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 lg:py-4 h-12 lg:h-14 rounded-xl border-2 border-black transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base lg:text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        INICIANDO SESIÓN...
                      </div>
                    ) : (
                      "INICIAR SESIÓN"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500 bg-white font-medium">O continúa con</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Social Login */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-bold py-3 lg:py-4 h-12 lg:h-14 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-base lg:text-lg"
                  disabled={isLoading}
                >
                  <Globe className="w-5 h-5 mr-3" />
                  {isLoading ? "Conectando..." : "Continuar con Google"}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm lg:text-base">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 lg:gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Certificado MINCETUR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Datos Seguros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
