"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { CreateTourDto } from "@/types/tour"

interface IncludesFormProps {
  data: CreateTourDto
  onChange: (data: Partial<CreateTourDto>) => void
}

export function IncludesForm({ data, onChange }: IncludesFormProps) {
  const [newInclude, setNewInclude] = useState("")
  const [newNotInclude, setNewNotInclude] = useState("")
  const [newToBring, setNewToBring] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const addItem = (
    type: "includes" | "notIncludes" | "toBring" | "conditions",
    value: string,
    setter: (value: string) => void,
  ) => {
    if (value.trim()) {
      const currentArray = data[type] || []
      onChange({ [type]: [...currentArray, value.trim()] })
      setter("")
    }
  }

  const removeItem = (type: "includes" | "notIncludes" | "toBring" | "conditions", index: number) => {
    const currentArray = data[type] || []
    onChange({ [type]: currentArray.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Incluye / No Incluye</h3>
        <p className="text-sm text-muted-foreground">
          Define qué está incluido en el paquete y qué condiciones aplican
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servicios Incluidos</CardTitle>
          <CardDescription>Qué servicios están incluidos en el precio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInclude}
              onChange={(e) => setNewInclude(e.target.value)}
              placeholder="Ej: Vuelos internacionales, Hoteles 4*"
              onKeyPress={(e) => e.key === "Enter" && addItem("includes", newInclude, setNewInclude)}
            />
            <Button type="button" onClick={() => addItem("includes", newInclude, setNewInclude)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.includes?.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeItem("includes", index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No Incluido</CardTitle>
          <CardDescription>Servicios que NO están incluidos en el precio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newNotInclude}
              onChange={(e) => setNewNotInclude(e.target.value)}
              placeholder="Ej: Propinas, Gastos personales"
              onKeyPress={(e) => e.key === "Enter" && addItem("notIncludes", newNotInclude, setNewNotInclude)}
            />
            <Button type="button" onClick={() => addItem("notIncludes", newNotInclude, setNewNotInclude)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.notIncludes?.map((item, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeItem("notIncludes", index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qué Traer</CardTitle>
          <CardDescription>Elementos que el cliente debe traer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newToBring}
              onChange={(e) => setNewToBring(e.target.value)}
              placeholder="Ej: Pasaporte vigente, Ropa cómoda"
              onKeyPress={(e) => e.key === "Enter" && addItem("toBring", newToBring, setNewToBring)}
            />
            <Button type="button" onClick={() => addItem("toBring", newToBring, setNewToBring)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.toBring?.map((item, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeItem("toBring", index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condiciones</CardTitle>
          <CardDescription>Términos y condiciones del tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Ej: Mínimo 2 personas, Cancelación 15 días antes"
              onKeyPress={(e) => e.key === "Enter" && addItem("conditions", newCondition, setNewCondition)}
            />
            <Button type="button" onClick={() => addItem("conditions", newCondition, setNewCondition)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.conditions?.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeItem("conditions", index)}
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
