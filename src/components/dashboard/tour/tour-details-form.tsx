"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { useState } from "react"
import type { TourFormData, Difficulty, PackageType } from "@/types/tour"

interface TourDetailsFormProps {
  data: TourFormData
  onChange: (data: Partial<TourFormData>) => void
}

export function TourDetailsForm({ data, onChange }: TourDetailsFormProps) {
  const [newHighlight, setNewHighlight] = useState("")

  const addHighlight = () => {
    if (newHighlight.trim()) {
      const currentHighlights = data.highlights || []
      onChange({ highlights: [...currentHighlights, newHighlight.trim()] })
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    const currentHighlights = data.highlights || []
    onChange({ highlights: currentHighlights.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Detalles del Tour</h3>
        <p className="text-sm text-muted-foreground">Configuración específica del paquete turístico</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Tour</CardTitle>
          <CardDescription>Duración, rating y fechas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duración *</Label>
              <Input
                id="duration"
                value={data.duration}
                onChange={(e) => onChange({ duration: e.target.value })}
                placeholder="Ej: 7 días, 10 días y 9 noches"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={data.rating}
                onChange={(e) => onChange({ rating: Number(e.target.value) })}
                placeholder="4.5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reviews">Número de Reviews</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={data.reviews}
                onChange={(e) => onChange({ reviews: Number(e.target.value) })}
                placeholder="156"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="originalPrice">Precio Original (PEN)</Label>
            <Input
              id="originalPrice"
              type="number"
              min="0"
              step="0.01"
              value={data.originalPrice || ""}
              onChange={(e) => onChange({ originalPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Precio antes del descuento (opcional)"
            />
            <p className="text-xs text-muted-foreground">Solo completar si el tour tiene un precio con descuento</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clasificación</CardTitle>
          <CardDescription>Tipo de paquete y dificultad del tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="packageType">Tipo de Paquete *</Label>
              <Select value={data.packageType} onValueChange={(value: PackageType) => onChange({ packageType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de paquete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basico">Básico</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Dificultad *</Label>
              <Select value={data.difficulty} onValueChange={(value: Difficulty) => onChange({ difficulty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facil">Fácil</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={data.featured || false}
              onCheckedChange={(checked) => onChange({ featured: checked })}
            />
            <Label htmlFor="featured">Paquete destacado</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlights</CardTitle>
          <CardDescription>Puntos destacados del tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Agregar highlight"
              onKeyPress={(e) => e.key === "Enter" && addHighlight()}
            />
            <Button type="button" onClick={addHighlight}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(data.highlights || []).map((highlight, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {highlight}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeHighlight(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TourDetailsForm
