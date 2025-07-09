"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Route, Info } from "lucide-react"
import type { TourFormData } from "@/types/tour"

interface RouteFormProps {
   
  _data: TourFormData
   
  _onChange: (data: Partial<TourFormData>) => void
}

export function RouteForm({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onChange,
}: RouteFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Rutas del Tour</h3>
        <p className="text-sm text-muted-foreground">Las rutas ahora se configuran dentro de cada día del itinerario</p>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Route className="h-16 w-16 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Rutas Integradas en el Itinerario</h3>
          <div className="max-w-md space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p>Las rutas ahora se configuran directly in each day of the itinerary for a better organization.</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3 text-left">
              <p className="font-medium mb-2">Para agregar rutas:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Ve a la pestaña &quot;Itinerario&quot;</li>
                <li>Crea un nuevo día</li>
                <li>Agrega puntos de ruta específicos para ese día</li>
                <li>Cada punto puede tener ubicación, descripción e imagen</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Cambios en la Estructura
          </CardTitle>
          <CardDescription className="text-amber-800">
            Información sobre los cambios en cómo se manejan las rutas
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-amber-800 space-y-2">
          <p>
            <strong>Antes:</strong> Las rutas se configuraban como opciones separadas del tour.
          </p>
          <p>
            <strong>Ahora:</strong> Cada día del itinerario puede tener su propia ruta con múltiples puntos de interés.
          </p>
          <p>
            <strong>Beneficio:</strong> Mayor flexibilidad y organización cronológica de los puntos de interés.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
