"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { usersApi } from "@/lib/users-api"
import type { User, CreateUserDto, UpdateUserDto, UserRole, AuthProvider } from "@/types/user"

interface UserFormProps {
  user?: User
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UserForm({ user, isOpen, onClose, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    role: user?.role || ("user" as UserRole),
    authProvider: user?.authProvider || ("local" as AuthProvider),
    phone: user?.phone || "",
    country: user?.country || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        // Actualizar usuario existente
        const updateData: UpdateUserDto = { ...formData }
        if (!updateData.password) {
          delete updateData.password
        }
        await usersApi.update(user._id, updateData)
        toast.success("Usuario actualizado", {
          description: "El usuario se ha actualizado correctamente",
        })
      } else {
        // Crear nuevo usuario
        const createData: CreateUserDto = { ...formData }
        if (!createData.password && createData.authProvider === "local") {
          toast.error("Contraseña requerida", {
            description: "La contraseña es obligatoria para usuarios locales",
          })
          return
        }
        await usersApi.create(createData)
        toast.success("Usuario creado", {
          description: "El usuario se ha creado correctamente",
        })
      }
      onSuccess()
      onClose()
    } catch (error: unknown) {
      console.error("Error:", error)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        toast.error("Error", {
          description: axiosError.response?.data?.message || "Ocurrió un error inesperado",
        })
      } else {
        toast.error("Error", {
          description: "Ocurrió un error inesperado",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="authProvider">Proveedor de Auth</Label>
              <Select value={formData.authProvider} onValueChange={(value) => handleInputChange("authProvider", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.authProvider === "local" && (
            <div>
              <Label htmlFor="password">Contraseña {!user && "*"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required={!user}
                placeholder={user ? "Dejar vacío para mantener actual" : ""}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : user ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
