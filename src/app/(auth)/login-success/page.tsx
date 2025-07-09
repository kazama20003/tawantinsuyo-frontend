"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Cookies from "js-cookie"
import { toast } from "sonner"

export default function LoginSuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Obtener el token de los parámetros de la URL
        const token = searchParams.get("token")

        if (!token) {
          setStatus("error")
          setMessage("Token no encontrado en la URL")
          toast.error("Error de autenticación", {
            description: "Token no encontrado en la URL",
          })
          return
        }

        // Solo guardar el token en cookies
        Cookies.set("token", token, { expires: 7 }) // Expira en 7 días

        setStatus("success")
        setMessage("¡Autenticación exitosa! Redirigiendo...")

        toast.success("¡Autenticación exitosa!", {
          description: "Redirigiendo al dashboard...",
        })

        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (err) {
        console.error("Authentication processing error:", err)
        setStatus("error")
        setMessage("Error al procesar la autenticación")

        toast.error("Error de autenticación", {
          description: "No se pudo procesar la autenticación",
        })
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  // Redirigir si no hay token después de 5 segundos
  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => {
        router.push("/login")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-xl text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-3xl font-black text-blue-600 mb-2">TAWANTINSUYO</div>
            <div className="bg-black text-white px-4 py-2 rounded-lg font-black text-lg inline-block">PERU</div>
          </div>

          {/* Status Content */}
          <div className="space-y-6">
            {status === "loading" && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-black mb-2">PROCESANDO</h1>
                  <p className="text-gray-600">Verificando tu autenticación...</p>
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-green-600 mb-2">¡ÉXITO!</h1>
                  <p className="text-gray-600">{message}</p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-red-600 mb-2">ERROR</h1>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <p className="text-sm text-gray-500">Redirigiendo al login en 5 segundos...</p>
                </div>
              </>
            )}
          </div>

          {/* Manual redirect button for error state */}
          {status === "error" && (
            <div className="mt-6">
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-lg border-2 border-black transition-all duration-300 hover:scale-105"
              >
                Volver al Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
