"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Car, CheckCircle, Search } from "lucide-react"
import { toast } from "sonner"
import { transportApi } from "@/lib/transport-api"
import type { TourFormData, TransportOption } from "@/types/tour"
import Image from "next/image"

interface TransportFormProps {
  data: TourFormData
  onChange: (data: Partial<TourFormData>) => void
}

export function TransportForm({ data, onChange }: TransportFormProps) {
  const [availableTransports, setAvailableTransports] = useState<TransportOption[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar transportes disponibles
  useEffect(() => {
    const loadTransports = async () => {
      try {
        setLoading(true)
        const response = await transportApi.getAll(1, 50) // Cargar todos los transportes
        setAvailableTransports(response.data || [])
      } catch (error) {
        console.error("Error loading transports:", error)
        toast.error("Error al cargar transportes", {
          description: "No se pudieron cargar las opciones de transporte disponibles.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTransports()
  }, [])

  // Filtrar transportes por búsqueda
  const filteredTransports = (availableTransports || []).filter(
    (transport) =>
      transport.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Manejar selección de transporte
  const handleTransportToggle = (transport: TransportOption, checked: boolean) => {
    const currentSelected = data.selectedTransports || []
    const currentIds = data.transportOptionIds || []

    if (checked) {
      // Agregar transporte
      const newSelected = [...currentSelected, transport]
      const newIds = [...currentIds, transport._id]

      onChange({
        selectedTransports: newSelected,
        transportOptionIds: newIds,
      })

      toast.success("Transporte agregado", {
        description: `${transport.vehicle} ha sido agregado al tour.`,
      })
    } else {
      // Remover transporte
      const newSelected = currentSelected.filter((t) => t._id !== transport._id)
      const newIds = currentIds.filter((id) => id !== transport._id)

      onChange({
        selectedTransports: newSelected,
        transportOptionIds: newIds,
      })

      toast.success("Transporte removido", {
        description: `${transport.vehicle} ha sido removido del tour.`,
      })
    }
  }

  // Verificar si un transporte está seleccionado
  const isTransportSelected = (transportId: string): boolean => {
    return (data.transportOptionIds || []).includes(transportId)
  }

  const getPackageTypeColor = (type: string) => {
    switch (type) {
      case "Premium":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "Basico":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const selectedTransports = data.selectedTransports || []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Opciones de Transporte</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona las opciones de transporte disponibles para este tour
        </p>
      </div>

      {/* Buscador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Transportes
          </CardTitle>
          <CardDescription>Busca por tipo de vehículo, categoría o servicios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de transportes disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Transportes Disponibles
          </CardTitle>
          <CardDescription>Selecciona los transportes que estarán disponibles para este tour</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Cargando transportes...</span>
            </div>
          ) : filteredTransports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No se encontraron transportes que coincidan con la búsqueda."
                : "No hay transportes disponibles."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTransports.map((transport) => {
                const isSelected = isTransportSelected(transport._id)
                return (
                  <div
                    key={transport._id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleTransportToggle(transport, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-3">
                        {/* Header con imagen y tipo */}
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={transport.imageUrl || "/placeholder.svg"}
                              alt={transport.vehicle}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getPackageTypeColor(transport.type)}>{transport.type}</Badge>
                            </div>
                            <h4 className="font-medium text-sm">{transport.vehicle}</h4>
                          </div>
                        </div>

                        {/* Servicios */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">Servicios incluidos:</Label>
                          <div className="flex flex-wrap gap-1">
                            {transport.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transportes seleccionados */}
      {selectedTransports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Transportes Seleccionados ({selectedTransports.length})
            </CardTitle>
            <CardDescription>Transportes que estarán disponibles para este tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTransports.map((transport) => (
                <div
                  key={transport._id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background">
                      <Image
                        src={transport.imageUrl || "/placeholder.svg"}
                        alt={transport.vehicle}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getPackageTypeColor(transport.type)}>{transport.type}</Badge>
                        <span className="font-medium text-sm">{transport.vehicle}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {transport.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {transport.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{transport.services.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTransportToggle(transport, false)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {selectedTransports.length === 0 && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay transportes seleccionados</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecciona las opciones de transporte que estarán disponibles para este tour
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
