"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import type { TourFormData, TourCategory } from "@/types/tour"

interface BasicInfoFormProps {
  data: TourFormData
  onChange: (data: Partial<TourFormData>) => void
}

export function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const handleImageChange = (url: string, imageId: string) => {
    onChange({
      imageUrl: url,
      imageId: imageId || undefined,
    })
  }

  const handleImageRemove = () => {
    onChange({
      imageUrl: "",
      imageId: undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Información Básica</h3>
        <p className="text-sm text-muted-foreground">Información principal del paquete turístico</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles Principales</CardTitle>
          <CardDescription>Título, descripción e imagen del paquete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título del Paquete *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Ej: Europa Clásica Premium"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subtitle">Subtítulo *</Label>
            <Textarea
              id="subtitle"
              value={data.subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="Descripción breve y atractiva del paquete"
              rows={3}
              required
            />
          </div>

          <ImageUpload
            value={data.imageUrl}
            imageId={data.imageId}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
            label="Imagen Principal"
            placeholder="Subir imagen o ingresar URL"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
          <CardDescription>Información geográfica del destino</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Ubicación Principal *</Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="Ej: París"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Región *</Label>
              <Input
                id="region"
                value={data.region}
                onChange={(e) => onChange({ region: e.target.value })}
                placeholder="Ej: Europa"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select value={data.category} onValueChange={(value: TourCategory) => onChange({ category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aventura">Aventura</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Relajación">Relajación</SelectItem>
                <SelectItem value="Naturaleza">Naturaleza</SelectItem>
                <SelectItem value="Trekking">Trekking</SelectItem>
                <SelectItem value="Panoramico">Panoramico</SelectItem>
                <SelectItem value="Transporte Turistico">Transporte Turistico</SelectItem>
              </SelectContent>

            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precio</CardTitle>
          <CardDescription>Precio base del paquete turístico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Precio Base (PEN) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={data.price}
              onChange={(e) => onChange({ price: Number(e.target.value) })}
              placeholder="0"
              required
            />
            <p className="text-xs text-muted-foreground">Precio por persona en soles peruanos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
