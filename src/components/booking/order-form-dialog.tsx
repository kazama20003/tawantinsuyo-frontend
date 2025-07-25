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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Edit,
  CalendarIcon,
  CheckCircle2,
  Package,
} from "lucide-react"
import { toast } from "sonner"
import { getToursForSelection, createOrder, updateOrder, getUsers } from "@/lib/orders-api"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { TourSelectionOption, CreateOrderDto, Order, UpdateOrderDto, UserOption } from "@/types/order"

interface OrderFormDialogProps {
  trigger?: React.ReactNode
  onOrderUpdated: () => void
  mode: "create" | "edit"
  order?: Order
}

export function OrderFormDialog({ trigger, onOrderUpdated, mode = "create", order }: OrderFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<TourSelectionOption[]>([])
  const [, setUsers] = useState<UserOption[]>([])
  const [selectedTour, setSelectedTour] = useState<TourSelectionOption | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Estado inicial para crear
  const initialCreateState: CreateOrderDto = {
    tour: "",
    customer: {
      fullName: "",
      email: "",
      phone: "",
      nationality: "",
    },
    startDate: "",
    people: 1,
    totalPrice: 0,
    paymentMethod: "",
    notes: "",
    discountCodeUsed: "",
  }

  // Estado del formulario
  const [formData, setFormData] = useState<CreateOrderDto>(initialCreateState)

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      const [toursData, usersData] = await Promise.all([getToursForSelection(), getUsers()])
      setTours(toursData)
      setUsers(usersData)

      // Si estamos en modo edición y tenemos una orden, inicializar el formulario
      if (mode === "edit" && order) {
        // Encontrar el tour seleccionado
        const tourId = order.tour?._id || ""
        if (tourId) {
          const currentTour = toursData.find((t) => t._id === tourId)
          setSelectedTour(currentTour || null)
        }

        // Inicializar fecha (solo fecha, sin hora)
        if (order.startDate) {
          try {
            const startDate = new Date(order.startDate)
            setDate(startDate)
          } catch (e) {
            console.error("Error parsing date:", e)
          }
        }

        // Inicializar el formulario con los datos de la orden
        setFormData({
          tour: order.tour?._id || "",
          customer: {
            fullName: order.customer?.fullName || "",
            email: order.customer?.email || "",
            phone: order.customer?.phone || "",
            nationality: order.customer?.nationality || "",
          },
          startDate: order.startDate || "",
          people: order.people || 1,
          totalPrice: order.totalPrice || 0,
          paymentMethod: order.paymentMethod || "",
          notes: order.notes || "",
          discountCodeUsed: order.discountCodeUsed || "",
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar los datos")
    }
  }, [mode, order])

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open, loadData])

  // Actualizar precio total cuando cambia el tour o el número de personas
  useEffect(() => {
    if (selectedTour && formData.people > 0) {
      const newTotal = selectedTour.price * formData.people
      setFormData((prev) => ({
        ...prev,
        totalPrice: newTotal,
      }))
    }
  }, [selectedTour, formData.people])

  // Actualizar fecha cuando cambia la fecha seleccionada (solo fecha, sin hora)
  useEffect(() => {
    if (date) {
      try {
        // Crear fecha a las 12:00 PM para evitar problemas de zona horaria
        const newDate = new Date(date)
        newDate.setHours(12, 0, 0, 0)
        setFormData((prev) => ({
          ...prev,
          startDate: newDate.toISOString(),
        }))
      } catch (e) {
        console.error("Error setting date:", e)
      }
    }
  }, [date])

  const handleTourChange = (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId)
    setSelectedTour(tour || null)
    const total = (tour?.price || 0) * formData.people

    setFormData((prev) => ({
      ...prev,
      tour: tourId,
      totalPrice: total,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tour || !formData.customer.fullName || !formData.customer.email || !formData.startDate) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setLoading(true)

      if (mode === "create") {
        // Crear nueva reserva
        await createOrder(formData)
        toast.success("Reserva creada exitosamente")
      } else if (mode === "edit" && order) {
        // Actualizar reserva existente usando PATCH
        const updateData: UpdateOrderDto = {
          items: [
            {
              tour: formData.tour,
              startDate: formData.startDate,
              people: formData.people,
              pricePerPerson: formData.totalPrice / formData.people,
              total: formData.totalPrice,
              notes: formData.notes || "",
            },
          ],
          customer: formData.customer,
          totalPrice: formData.totalPrice,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          discountCodeUsed: formData.discountCodeUsed,
          user: order.user?._id,
        }

        await updateOrder(order._id, updateData)
        toast.success("Reserva actualizada exitosamente")
      }

      onOrderUpdated()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving order:", error)
      toast.error(mode === "create" ? "Error al crear la reserva" : "Error al actualizar la reserva")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialCreateState)
    setSelectedTour(null)
    setDate(undefined)
  }

  // Formatear fecha para mostrar
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ""

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Lima",
      }
      return date.toLocaleDateString("es-PE", options)
    } catch {
      return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ||
          (mode === "create" ? (
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Reserva
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="hover:bg-blue-50 bg-transparent">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          ))}
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[98vw] sm:w-[95vw] max-h-[98vh] sm:max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header fijo */}
        <DialogHeader className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b bg-white sticky top-0 z-20 shadow-sm">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
            {mode === "create" ? (
              <>
                <Plus className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Crear Nueva Reserva
              </>
            ) : (
              <>
                <Edit className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Editar Reserva
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            {mode === "create"
              ? "Completa la información para crear una nueva reserva de tour"
              : `Modifica la información de la reserva #${order?._id.slice(-6)}`}
          </DialogDescription>
        </DialogHeader>

        {/* Contenido con scroll */}
        <ScrollArea className="flex-1 max-h-[calc(98vh-200px)] sm:max-h-[calc(95vh-180px)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Tour Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Package className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Selección de Paquete Turístico
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="tour" className="text-sm font-medium text-gray-700">
                    Paquete Turístico *
                  </Label>
                  <Select value={formData.tour} onValueChange={handleTourChange}>
                    <SelectTrigger className="h-12 sm:h-14 bg-white border-2 border-blue-200 hover:border-blue-300 transition-colors text-left">
                      <SelectValue placeholder="🏔️ Selecciona un paquete turístico disponible" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 sm:max-h-80 z-50 w-full">
                      {tours.map((tour) => (
                        <SelectItem key={tour._id} value={tour._id} className="py-3 sm:py-4 cursor-pointer">
                          <div className="flex flex-col space-y-1 sm:space-y-2 w-full">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{tour.title}</span>
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center bg-green-100 px-2 sm:px-3 py-1 rounded-full">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600" />
                                <span className="font-medium text-green-700">S/{tour.price}</span>
                              </span>
                              <span className="flex items-center bg-blue-100 px-2 sm:px-3 py-1 rounded-full">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-600" />
                                <span className="text-blue-700">{tour.duration}</span>
                              </span>
                              <span className="flex items-center bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-purple-600" />
                                <span className="text-purple-700">{tour.region}</span>
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTour && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white border-2 border-blue-200 rounded-xl shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                        <span className="text-sm sm:text-base font-medium text-blue-900">✅ Paquete seleccionado:</span>
                        <span className="text-sm sm:text-base text-blue-700 font-semibold break-words">
                          {selectedTour.title}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm sm:text-base text-blue-600">💰 Precio por persona:</span>
                        <span className="text-lg sm:text-xl font-bold text-blue-800">S/{selectedTour.price}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      👤 Nombre Completo *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.customer.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, fullName: e.target.value },
                        }))
                      }
                      placeholder="Nombre completo del cliente"
                      className="h-10 sm:h-12 bg-white border-2 border-green-200 focus:border-green-400 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      📧 Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customer.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, email: e.target.value },
                        }))
                      }
                      placeholder="email@ejemplo.com"
                      className="h-10 sm:h-12 bg-white border-2 border-green-200 focus:border-green-400 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      📱 Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={formData.customer.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, phone: e.target.value },
                        }))
                      }
                      placeholder="+51 999 999 999"
                      className="h-10 sm:h-12 bg-white border-2 border-green-200 focus:border-green-400 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                      🌍 Nacionalidad
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.customer.nationality}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer: { ...prev.customer, nationality: e.target.value },
                        }))
                      }
                      placeholder="Peruana, Estadounidense, etc."
                      className="h-10 sm:h-12 bg-white border-2 border-green-200 focus:border-green-400 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border border-purple-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  Detalles de la Reserva
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Selector de fecha */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                      📅 Fecha de la Reserva *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal h-10 sm:h-12 bg-white border-2 border-purple-200 hover:border-purple-300 text-sm sm:text-base ${
                            !date && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                          {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                      </PopoverContent>
                    </Popover>
                    {formData.startDate && (
                      <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-green-700 bg-green-100 p-2 sm:p-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium block">Fecha confirmada:</span>
                          <span className="text-green-600 text-xs sm:text-sm break-words">
                            {formatDateForDisplay(formData.startDate)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="people" className="text-sm font-medium text-gray-700">
                      👥 Número de Personas *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        id="people"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.people}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            people: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                        className="pl-10 sm:pl-12 h-10 sm:h-12 bg-white border-2 border-purple-200 focus:border-purple-400 text-sm sm:text-base font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="totalPrice" className="text-sm font-medium text-gray-700">
                      💰 Precio Total
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        id="totalPrice"
                        type="number"
                        step="0.01"
                        value={formData.totalPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, totalPrice: Number.parseFloat(e.target.value) || 0 }))
                        }
                        className="pl-10 sm:pl-12 h-10 sm:h-12 font-bold text-base sm:text-lg bg-white border-2 border-purple-200 focus:border-purple-400"
                        readOnly={!!selectedTour}
                      />
                    </div>
                    {selectedTour && (
                      <div className="text-xs sm:text-sm text-gray-600 bg-white p-2 sm:p-3 rounded-lg border border-purple-200">
                        <div className="font-medium text-center break-words">
                          {formData.people} persona{formData.people > 1 ? "s" : ""} × S/{selectedTour.price} = S/
                          {formData.totalPrice}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 sm:p-6 rounded-xl border border-orange-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  📋 Información Adicional
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                        💳 Método de Pago
                      </Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger className="h-10 sm:h-12 bg-white border-2 border-orange-200 hover:border-orange-300 text-sm sm:text-base">
                          <SelectValue placeholder="Selecciona método de pago" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="efectivo" className="py-2 sm:py-3">
                            💵 Efectivo
                          </SelectItem>
                          <SelectItem value="tarjeta" className="py-2 sm:py-3">
                            💳 Tarjeta de Crédito
                          </SelectItem>
                          <SelectItem value="transferencia" className="py-2 sm:py-3">
                            🏦 Transferencia Bancaria
                          </SelectItem>
                          <SelectItem value="bcp" className="py-2 sm:py-3">
                            🏛️ BCP
                          </SelectItem>
                          <SelectItem value="interbank" className="py-2 sm:py-3">
                            🏛️ Interbank
                          </SelectItem>
                          <SelectItem value="scotiabank" className="py-2 sm:py-3">
                            🏛️ Scotiabank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="discountCode" className="text-sm font-medium text-gray-700">
                        🎟️ Código de Descuento
                      </Label>
                      <Input
                        id="discountCode"
                        value={formData.discountCodeUsed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, discountCodeUsed: e.target.value }))}
                        placeholder="Código de descuento (opcional)"
                        className="h-10 sm:h-12 bg-white border-2 border-orange-200 focus:border-orange-400 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      📝 Notas y Comentarios
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Notas adicionales sobre la reserva, preferencias especiales, alergias, etc..."
                      rows={3}
                      className="resize-none bg-white border-2 border-orange-200 focus:border-orange-400 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ScrollArea>

        {/* Footer fijo */}
        <DialogFooter className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t bg-gray-50 sticky bottom-0 z-20 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-medium order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.tour ||
                !formData.customer.fullName ||
                !formData.customer.email ||
                !formData.startDate
              }
              className="px-6 sm:px-8 h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 shadow-lg text-sm sm:text-base font-medium order-1 sm:order-2"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  {mode === "create" ? "Creando..." : "Actualizando..."}
                </>
              ) : (
                <>
                  {mode === "create" ? (
                    <>
                      <Plus className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                      Crear Reserva
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                      Actualizar Reserva
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
