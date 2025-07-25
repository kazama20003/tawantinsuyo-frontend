"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadApi } from "@/lib/upload-api"
import { toast } from "sonner"

interface ImageUploadProps {
  value?: string
  imageId?: string
  onChange: (url: string, imageId: string) => void
  onRemove: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, imageId, onChange, onRemove, disabled, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Error", {
        description: "Por favor selecciona un archivo de imagen válido.",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Error", {
        description: "El archivo es demasiado grande. Máximo 5MB.",
      })
      return
    }

    try {
      setUploading(true)

      // Delete previous image if exists
      if (imageId) {
        try {
          await uploadApi.deleteImage(imageId)
        } catch (error) {
          console.warn("Error deleting previous image:", error)
          // Continue with upload even if deletion fails
        }
      }

      const response = await uploadApi.uploadImage(file)
      onChange(response.url, response.publicId)

      toast.success("Imagen subida", {
        description: "La imagen se ha subido correctamente.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir imagen", {
        description: error instanceof Error ? error.message : "No se pudo subir la imagen.",
      })
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    if (imageId) {
      try {
        await uploadApi.deleteImage(imageId)
        toast.success("Imagen eliminada", {
          description: "La imagen se ha eliminado correctamente.",
        })
      } catch (error) {
        console.error("Error deleting image:", error)
        toast.error("Error al eliminar imagen", {
          description: error instanceof Error ? error.message : "No se pudo eliminar la imagen.",
        })
      }
    }
    onRemove()
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {value ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={value || "/placeholder.svg"}
                alt="Imagen subida"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
              className="mb-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Imagen
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Selecciona una imagen (máximo 5MB)
              <br />
              Formatos: JPG, PNG, WEBP
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
