"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { usersApi } from "@/lib/users-api"
import type { User } from "@/types/user"

interface UsersTableProps {
  users: User[]
  onEdit: (user: User) => void
  onRefresh: () => void
}

export function UsersTable({ users, onEdit, onRefresh }: UsersTableProps) {
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteUser) return

    setIsDeleting(true)
    try {
      await usersApi.delete(deleteUser._id)
      toast.success("Usuario eliminado", {
        description: "El usuario se ha eliminado correctamente",
      })
      onRefresh()
    } catch (error: unknown) {
      console.error("Error:", error)
      toast.error("Error", {
        description: "No se pudo eliminar el usuario",
      })
    } finally {
      setIsDeleting(false)
      setDeleteUser(null)
    }
  }

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === "admin" ? "destructive" : "secondary"}>{role === "admin" ? "Admin" : "Usuario"}</Badge>
    )
  }

  const getProviderBadge = (provider: string) => {
    const variants = {
      local: "outline",
      google: "secondary",
      facebook: "secondary",
    } as const

    return <Badge variant={variants[provider as keyof typeof variants] || "outline"}>{provider.toUpperCase()}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Nombre</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[80px]">Rol</TableHead>
                <TableHead className="min-w-[100px]">Proveedor</TableHead>
                <TableHead className="min-w-[120px] hidden sm:table-cell">Teléfono</TableHead>
                <TableHead className="min-w-[100px] hidden md:table-cell">País</TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">Creado</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[150px] truncate" title={user.fullName}>
                        {user.fullName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={user.email}>
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getProviderBadge(user.authProvider)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{user.phone || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.country || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteUser(user)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{" "}
              <strong>{deleteUser?.fullName}</strong> y todos sus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
