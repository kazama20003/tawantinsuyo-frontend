"use client"
import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

function AuthLoadingFallback() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-3xl border-4 border-black p-8 shadow-xl text-center">
          <div className="mb-8">
            <div className="text-3xl font-black text-blue-600 mb-2">TAWANTINSUYO</div>
            <div className="bg-black text-white px-4 py-2 rounded-lg font-black text-lg inline-block">PERU</div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black mb-2">CARGANDO</h1>
              <p className="text-gray-600">Preparando la página...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-blue-50">
      <Suspense fallback={<AuthLoadingFallback />}>{children}</Suspense>
    </div>
  )
}
