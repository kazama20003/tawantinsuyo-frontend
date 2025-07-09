"use client"

import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { transportApi, type CreateTransportDto, type UpdateTransportDto } from "@/lib/transport-api"
import { uploadApi } from "@/lib/upload-api"
import type { TransportOption, PackageType } from "@/types/tour"
import {
  Plus,
  Edit,
  Trash2,
  Car,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import Image from "next/image"

export default function TransportesPage() {
  const [transports, setTransports] = useState<TransportOption[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransports, setTotalTransports] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<PackageType | "all">("all")

  // Estados para modales
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null)

  // Estados para formularios
  const [formData, setFormData] = useState<CreateTransportDto>({
    type: "Basico",
    vehicle: "",
    services: [],
    imageUrl: "",
    imageId: "",
  })
  const [servicesInput, setServicesInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const limit = 6 // Transportes por página

  // Cargar transportes
  const loadTransports = async (page = 1) => {
    try {
      setLoading(true)
      const response = await transportApi.getAll(page, limit)
      setTransports(response.data)
      setCurrentPage(response.meta.page)
      setTotalPages(response.meta.totalPages)
      setTotalTransports(response.meta.total)
    } catch (error) {
      console.error("Error loading transports:", error)
      toast.error("Error al cargar transportes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransports(currentPage)
  }, [currentPage])

  // Filtrar transportes
  const filteredTransports = transports.filter((transport) => {
    const matchesSearch =
      transport.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || transport.type === filterType
    return matchesSearch && matchesType
  })

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      type: "Basico",
      vehicle: "",
      services: [],
      imageUrl: "",
      imageId: "",
    })
    setServicesInput("")
  }

  // Manejar servicios (convertir string a array)
  const handleServicesChange = (value: string) => {
    setServicesInput(value)
    const servicesArray = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    setFormData((prev) => ({ ...prev, services: servicesArray }))
  }

  // Manejar subida de imagen
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const result = await uploadApi.uploadImage(file)
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        imageId: result.publicId,
      }))
      toast.success("Imagen subida exitosamente")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error al subir imagen")
    } finally {
      setUploading(false)
    }
  }

  // Remover imagen
  const handleRemoveImage = async () => {
    if (formData.imageId) {
      try {
        await uploadApi.deleteImage(formData.imageId)
        toast.success("Imagen eliminada exitosamente")
      } catch (error) {
        console.error("Error deleting image:", error)
        toast.error("Error al eliminar imagen")
      }
    }
    setFormData((prev) => ({ ...prev, imageUrl: "", imageId: "" }))
  }

  // Crear transporte
  const handleCreate = async () => {
    if (!formData.vehicle.trim()) {
      toast.error("El nombre del vehículo es requerido")
      return
    }
    if (formData.services.length === 0) {
      toast.error("Debe agregar al menos un servicio")
      return
    }

    try {
      setSubmitting(true)
      await transportApi.create(formData)
      toast.success("Transporte creado exitosamente")
      setIsCreateDialogOpen(false)
      resetForm()
      loadTransports(currentPage)
    } catch (error) {
      console.error("Error creating transport:", error)
      toast.error("Error al crear transporte")
    } finally {
      setSubmitting(false)
    }
  }

  // Editar transporte
  const handleEdit = async () => {
    if (!selectedTransport) return

    const updateData: UpdateTransportDto = {
      type: formData.type,
      vehicle: formData.vehicle,
      services: formData.services,
      imageUrl: formData.imageUrl,
      imageId: formData.imageId,
    }

    try {
      setSubmitting(true)
      await transportApi.update(selectedTransport._id, updateData)
      toast.success("Transporte actualizado exitosamente")
      setIsEditDialogOpen(false)
      setSelectedTransport(null)
      resetForm()
      loadTransports(currentPage)
    } catch (error) {
      console.error("Error updating transport:", error)
      toast.error("Error al actualizar transporte")
    } finally {
      setSubmitting(false)
    }
  }

  // Eliminar transporte
  const handleDelete = async (transport: TransportOption) => {
    try {
      // Eliminar imagen de Cloudinary si existe
      if (transport.imageId) {
        try {
          await uploadApi.deleteImage(transport.imageId)
        } catch (error) {
          console.warn("Error deleting image from Cloudinary:", error)
        }
      }

      await transportApi.delete(transport._id)
      toast.success("Transporte eliminado exitosamente")
      loadTransports(currentPage)
    } catch (error) {
      console.error("Error deleting transport:", error)
      toast.error("Error al eliminar transporte")
    }
  }

  // Abrir modal de edición
  const openEditDialog = (transport: TransportOption) => {
    setSelectedTransport(transport)
    setFormData({
      type: transport.type,
      vehicle: transport.vehicle,
      services: transport.services,
      imageUrl: transport.imageUrl || "",
      imageId: transport.imageId || "",
    })
    setServicesInput(transport.services.join(", "))
    setIsEditDialogOpen(true)
  }

  // Abrir modal de visualización
  const openViewDialog = (transport: TransportOption) => {
    setSelectedTransport(transport)
    setIsViewDialogOpen(true)
  }

  // Badge para tipo de transporte
  const getTypeBadge = (type: PackageType) => {
    const variants = {
      Basico: "secondary",
      Premium: "default",
    } as const

    return <Badge variant={variants[type] || "secondary"}>{type}</Badge>
  }

  // Componente de subida de imagen
  const ImageUploadComponent = () => (
    <div className="space-y-2">
      <Label>Imagen del Transporte</Label>
      {formData.imageUrl ? (
        <div className="relative">
          <div className="relative h-32 w-full rounded-lg overflow-hidden border">
            <Image src={formData.imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Subir imagen del transporte</p>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
            disabled={uploading}
            className="max-w-xs mx-auto"
          />
          {uploading && (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Subiendo imagen...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Panel Administrativo</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Gestión de Transportes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transportes</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransports}</div>
              <p className="text-xs text-muted-foreground">Transportes disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Básicos</CardTitle>
              <Badge variant="secondary" className="h-4 w-4 p-0 text-xs">
                B
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transports.filter((t) => t.type === "Basico").length}
              </div>
              <p className="text-xs text-muted-foreground">Transportes básicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium</CardTitle>
              <Badge variant="default" className="h-4 w-4 p-0 text-xs">
                P
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {transports.filter((t) => t.type === "Premium").length}
              </div>
              <p className="text-xs text-muted-foreground">Transportes premium</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Promedio</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {transports.length > 0
                  ? Math.round(transports.reduce((acc, t) => acc + t.services.length, 0) / transports.length)
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Servicios por transporte</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Gestión de Transportes</CardTitle>
                <CardDescription>Administra los transportes disponibles para los tours</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Transporte
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Transporte</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicle">Vehículo *</Label>
                        <Input
                          id="vehicle"
                          value={formData.vehicle}
                          onChange={(e) => setFormData((prev) => ({ ...prev, vehicle: e.target.value }))}
                          placeholder="Ej: Toyota Runner"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: PackageType) => setFormData((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basico">Básico</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="services">Servicios *</Label>
                      <Textarea
                        id="services"
                        value={servicesInput}
                        onChange={(e) => handleServicesChange(e.target.value)}
                        placeholder="Separar servicios con comas: Aire Acondicionado, WiFi, Asientos Cómodos"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Servicios: {formData.services.length > 0 ? formData.services.join(", ") : "Ninguno"}
                      </p>
                    </div>

                    <ImageUploadComponent />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreate} disabled={submitting || uploading}>
                        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Crear Transporte
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por vehículo o servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filterType} onValueChange={(value: PackageType | "all") => setFilterType(value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Basico">Básico</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de transportes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando transportes...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTransports.map((transport) => (
              <Card key={transport._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 relative">
                    <Image
                      src={transport.imageUrl || "/placeholder.svg?height=200&width=400&text=Transport"}
                      alt={transport.vehicle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div className="absolute top-2 left-2 flex gap-2">{getTypeBadge(transport.type)}</div>
                  <div className="absolute top-2 right-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar transporte?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el transporte 
                            {transport.vehicle} y su imagen asociada.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(transport)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg leading-tight">{transport.vehicle}</h3>
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
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openViewDialog(transport)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(transport)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{transport.services.length} servicios</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * limit + 1} a {Math.min(currentPage * limit, totalTransports)} de{" "}
              {totalTransports} transportes
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Transporte</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-vehicle">Vehículo *</Label>
                  <Input
                    id="edit-vehicle"
                    value={formData.vehicle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle: e.target.value }))}
                    placeholder="Ej: Toyota Runner"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: PackageType) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basico">Básico</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-services">Servicios *</Label>
                <Textarea
                  id="edit-services"
                  value={servicesInput}
                  onChange={(e) => handleServicesChange(e.target.value)}
                  placeholder="Separar servicios con comas: Aire Acondicionado, WiFi, Asientos Cómodos"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Servicios: {formData.services.length > 0 ? formData.services.join(", ") : "Ninguno"}
                </p>
              </div>

              <ImageUploadComponent />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit} disabled={submitting || uploading}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Actualizar Transporte
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de visualización */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Transporte</DialogTitle>
            </DialogHeader>
            {selectedTransport && (
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={selectedTransport.imageUrl || "/placeholder.svg"}
                    alt={selectedTransport.vehicle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Vehículo</Label>
                    <p className="font-semibold">{selectedTransport.vehicle}</p>
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <div className="mt-1">{getTypeBadge(selectedTransport.type)}</div>
                  </div>
                </div>

                <div>
                  <Label>Servicios</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTransport.services.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <Label>Creado</Label>
                    <p>{new Date(selectedTransport.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Actualizado</Label>
                    <p>{new Date(selectedTransport.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  )
}
