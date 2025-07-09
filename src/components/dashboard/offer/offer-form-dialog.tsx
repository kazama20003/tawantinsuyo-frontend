"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { offersApi } from "@/lib/offers-api"
import type { CreateOfferDto, TourOption } from "@/types/offer"

interface OfferFormDialogProps {
  onOfferCreated: () => void
}

export function OfferFormDialog({ onOfferCreated }: OfferFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<TourOption[]>([])
  const [selectedTours, setSelectedTours] = useState<string[]>([])
  const [formData, setFormData] = useState<CreateOfferDto>({
    title: "",
    description: "",
    discountPercentage: 10,
    startDate: "",
    endDate: "",
    applicableTours: [],
    isActive: true,
    discountCode: "",
  })

  useEffect(() => {
    if (open) {
      fetchTours()
    }
  }, [open])

  const fetchTours = async () => {
    try {
      const toursData = await offersApi.getToursForSelection()
      setTours(toursData)
    } catch {
      toast.error("No se pudieron cargar los tours")
    }
  }

  const handleInputChange = (field: keyof CreateOfferDto, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTourSelect = (tourId: string) => {
    if (!selectedTours.includes(tourId)) {
      const newSelectedTours = [...selectedTours, tourId]
      setSelectedTours(newSelectedTours)
      setFormData((prev) => ({
        ...prev,
        applicableTours: newSelectedTours,
      }))
    }
  }

  const handleTourRemove = (tourId: string) => {
    const newSelectedTours = selectedTours.filter((id) => id !== tourId)
    setSelectedTours(newSelectedTours)
    setFormData((prev) => ({
      ...prev,
      applicableTours: newSelectedTours,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("El título es requerido")
      return
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      toast.error("El porcentaje de descuento debe estar entre 0 y 100")
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Las fechas de inicio y fin son requeridas")
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
      return
    }

    if (formData.applicableTours.length === 0) {
      toast.error("Debe seleccionar al menos un tour")
      return
    }

    try {
      setLoading(true)
      await offersApi.createOffer(formData)
      toast.success("Oferta creada exitosamente")
      setOpen(false)
      resetForm()
      onOfferCreated()
    } catch {
      toast.error("No se pudo crear la oferta")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercentage: 10,
      startDate: "",
      endDate: "",
      applicableTours: [],
      isActive: true,
      discountCode: "",
    })
    setSelectedTours([])
  }

  const getSelectedTourNames = () => {
    return tours.filter((tour) => selectedTours.includes(tour._id))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oferta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Oferta</DialogTitle>
          <DialogDescription>Crea una nueva oferta promocional para tus tours</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ej: Oferta de Verano"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountCode">Código de Descuento</Label>
              <Input
                id="discountCode"
                value={formData.discountCode}
                onChange={(e) => handleInputChange("discountCode", e.target.value)}
                placeholder="Ej: VERANO2025"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe los detalles de la oferta..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Porcentaje de Descuento *</Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => handleInputChange("discountPercentage", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Oferta activa</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tours Aplicables *</Label>
            <Select onValueChange={handleTourSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tour..." />
              </SelectTrigger>
              <SelectContent>
                {tours
                  .filter((tour) => !selectedTours.includes(tour._id))
                  .map((tour) => (
                    <SelectItem key={tour._id} value={tour._id}>
                      {tour.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedTours.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {getSelectedTourNames().map((tour) => (
                  <Badge key={tour._id} variant="secondary" className="flex items-center gap-1">
                    {tour.title}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleTourRemove(tour._id)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Oferta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
