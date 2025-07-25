"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Calendar, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { getToursForSelection, getUsers, updateOrder } from "@/lib/orders-api"
import type { TourSelectionOption, UserOption, Order, UpdateOrderDto } from "@/types/order"

interface OrderEditDialogProps {
  trigger?: React.ReactNode
  order: Order
  onOrderUpdated: () => void
}

export function OrderEditDialog({ trigger, order, onOrderUpdated }: OrderEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<TourSelectionOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [selectedTour, setSelectedTour] = useState<TourSelectionOption | null>(null)

  // Validar que el tour existe antes de acceder a sus propiedades
  const tourId = order.tour?._id || ""
  const tourPrice = order.tour?.price || 0

  const [formData, setFormData] = useState<UpdateOrderDto>({
    items: [
      {
        tour: tourId,
        startDate: order.startDate,
        people: order.people,
        pricePerPerson: tourPrice,
        total: order.totalPrice,
        notes: order.notes || "",
      },
    ],
    customer: {
      fullName: order.customer?.fullName || "",
      email: order.customer?.email || "",
      phone: order.customer?.phone || "",
      nationality: order.customer?.nationality || "",
    },
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod || "",
    notes: order.notes || "",
    discountCodeUsed: order.discountCodeUsed || "",
    user: order.user?._id || "",
  })

  const loadData = useCallback(async () => {
    try {
      const [toursData, usersData] = await Promise.all([getToursForSelection(), getUsers()])
      setTours(toursData)
      setUsers(usersData)
      // Set selected tour - validar que tourId existe
      if (tourId) {
        const currentTour = toursData.find((t: TourSelectionOption) => t._id === tourId)
        setSelectedTour(currentTour || null)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar los datos")
    }
  }, [tourId])

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, loadData])

  // Extract dependency to avoid complex expression
  const itemsPeople = formData.items?.[0]?.people || 0
  useEffect(() => {
    if (selectedTour && itemsPeople > 0) {
      const newTotal = selectedTour.price * itemsPeople
      setFormData((prev) => ({
        ...prev,
        items: [
          {
            ...prev.items![0],
            pricePerPerson: selectedTour.price,
            total: newTotal,
          },
        ],
        totalPrice: newTotal,
      }))
    }
  }, [selectedTour, itemsPeople])

  const handleTourChange = (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId)
    setSelectedTour(tour || null)
    const people = formData.items?.[0]?.people || 1
    const pricePerPerson = tour?.price || 0
    const total = pricePerPerson * people

    setFormData((prev) => ({
      ...prev,
      items: [
        {
          ...prev.items![0],
          tour: tourId,
          pricePerPerson,
          total,
        },
      ],
      totalPrice: total,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.items?.[0]?.tour ||
      !formData.customer?.fullName ||
      !formData.customer?.email ||
      !formData.items?.[0]?.startDate
    ) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setLoading(true)
      await updateOrder(order._id, formData)
      toast.success("Reserva actualizada exitosamente")
      onOrderUpdated()
      setOpen(false)
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Error al actualizar la reserva")
    } finally {
      setLoading(false)
    }
  }

  // Format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toISOString().slice(0, 16)
    } catch {
      return ""
    }
  }

  // Si no hay tour, mostrar mensaje de error
  if (!order.tour) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" disabled>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              No se puede editar esta reserva porque no tiene información del tour asociado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>Modifica la información de la reserva #{order._id.slice(-6)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tour Selection */}
          <div className="space-y-2">
            <Label htmlFor="tour">Tour *</Label>
            <Select value={formData.items?.[0]?.tour || ""} onValueChange={handleTourChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tour" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour._id} value={tour._id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tour.title}</span>
                      <span className="text-sm text-muted-foreground">
                        S/{tour.price} - {tour.duration} - {tour.region}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.customer?.fullName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customer: {
                        fullName: e.target.value,
                        email: prev.customer?.email || "",
                        phone: prev.customer?.phone || "",
                        nationality: prev.customer?.nationality || "",
                      },
                    }))
                  }
                  placeholder="Nombre completo del cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customer?.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customer: {
                        fullName: prev.customer?.fullName || "",
                        email: e.target.value,
                        phone: prev.customer?.phone || "",
                        nationality: prev.customer?.nationality || "",
                      },
                    }))
                  }
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.customer?.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customer: {
                        fullName: prev.customer?.fullName || "",
                        email: prev.customer?.email || "",
                        phone: e.target.value,
                        nationality: prev.customer?.nationality || "",
                      },
                    }))
                  }
                  placeholder="+51 999 999 999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input
                  id="nationality"
                  value={formData.customer?.nationality || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customer: {
                        fullName: prev.customer?.fullName || "",
                        email: prev.customer?.email || "",
                        phone: prev.customer?.phone || "",
                        nationality: e.target.value,
                      },
                    }))
                  }
                  placeholder="PE, US, BR, etc."
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalles de la Reserva</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.items?.[0]?.startDate ? formatDateForInput(formData.items[0].startDate) : ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        items: [
                          {
                            ...prev.items![0],
                            startDate: e.target.value,
                          },
                        ],
                      }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="people">Número de Personas *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="people"
                    type="number"
                    min="1"
                    value={formData.items?.[0]?.people || 1}
                    onChange={(e) => {
                      const people = Number.parseInt(e.target.value) || 1
                      const pricePerPerson = selectedTour?.price || formData.items?.[0]?.pricePerPerson || 0
                      const total = pricePerPerson * people
                      setFormData((prev) => ({
                        ...prev,
                        items: [
                          {
                            ...prev.items![0],
                            people,
                            total,
                          },
                        ],
                        totalPrice: total,
                      }))
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Precio Total</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={formData.totalPrice || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, totalPrice: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="bcp">BCP</SelectItem>
                    <SelectItem value="interbank">Interbank</SelectItem>
                    <SelectItem value="scotiabank">Scotiabank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user">Asignar a Usuario</Label>
                <Select
                  value={formData.user || ""}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, user: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountCode">Código de Descuento</Label>
              <Input
                id="discountCode"
                value={formData.discountCodeUsed}
                onChange={(e) => setFormData((prev) => ({ ...prev, discountCodeUsed: e.target.value }))}
                placeholder="Código de descuento (opcional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.items?.[0]?.notes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    items: [
                      {
                        ...prev.items![0],
                        notes: e.target.value,
                      },
                    ],
                  }))
                }
                placeholder="Notas adicionales sobre la reserva..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Reserva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
