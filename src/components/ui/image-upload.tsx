"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { uploadApi } from "@/lib/upload-api"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  imageId?: string
  onChange: (url: string, imageId: string) => void
  onRemove: () => void
  label?: string
  placeholder?: string
  className?: string
}

export function ImageUpload({
  value,
  imageId,
  onChange,
  onRemove,
  label = "Imagen",
  placeholder = "Seleccionar imagen o ingresar URL",
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || "")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setError(null)

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido.")
      toast.error("Archivo inválido", {
        description: "Por favor selecciona un archivo de imagen válido.",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo debe ser menor a 5MB.")
      toast.error("Archivo muy grande", {
        description: "El archivo debe ser menor a 5MB.",
      })
      return
    }

    try {
      setUploading(true)

      // Si ya hay una imagen subida anteriormente, eliminarla
      if (imageId && imageId.trim() !== "") {
        try {
          await uploadApi.deleteImage(imageId)
          console.log(`Imagen anterior ${imageId} eliminada antes de subir nueva`)
        } catch (error) {
          console.warn("Error deleting previous image:", error)
          // No interrumpir el flujo si no se puede eliminar la imagen anterior
        }
      }

      // Subir nueva imagen
      const response = await uploadApi.uploadImage(file)

      // Extraer solo el ID sin la carpeta
      const cleanId = response.publicId.replace("uploads/", "")

      onChange(response.url, cleanId)
      setUrlInput(response.url)

      toast.success("Imagen subida", {
        description: "La imagen se ha subido correctamente.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)

      if (error instanceof Error) {
        setError(error.message)
        toast.error("Error al subir imagen", {
          description: error.message || "No se pudo subir la imagen. Intenta nuevamente.",
        })
      } else {
        setError("Error desconocido al subir la imagen.")
        toast.error("Error al subir imagen", {
          description: "No se pudo subir la imagen. Intenta nuevamente.",
        })
      }
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    setUrlInput(url)
    setError(null)

    if (url.trim()) {
      // Si se ingresa una URL, limpiar el imageId ya que no es una imagen subida
      onChange(url, "")
    }
  }

  const handleRemove = async () => {
    try {
      // Solo eliminar del servidor si hay un imageId (imagen subida)
      if (imageId && imageId.trim() !== "") {
        const result = await uploadApi.deleteImage(imageId)
        if (result.success) {
          toast.success("Imagen eliminada", {
            description: "La imagen se ha eliminado del servidor.",
          })
        } else {
          console.warn("No se pudo eliminar la imagen del servidor:", result.message)
        }
      }

      onRemove()
      setUrlInput("")
      setError(null)

      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error removing image:", error)

      // No mostrar error al usuario para no interrumpir el flujo
      console.warn("No se pudo eliminar la imagen del servidor, pero se removió del formulario")

      // Aún así remover del formulario
      onRemove()
      setUrlInput("")
      setError(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className={className}>
      <Label>{label}</Label>

      <div className="space-y-4 mt-2">
        {/* Input de URL */}
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            disabled={uploading}
            className={error ? "border-red-500" : ""}
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileUpload(file)
            }
          }}
          className="hidden"
        />

        {/* Preview de imagen */}
        {urlInput && (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Image
                  src={urlInput || "/placeholder.svg"}
                  alt="Preview"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    setError("La URL de la imagen no es válida o no está accesible.")
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Indicador de imagen subida vs URL */}
                <div className="absolute bottom-2 left-2">
                  {imageId ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      Subida
                    </div>
                  ) : (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      URL
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
