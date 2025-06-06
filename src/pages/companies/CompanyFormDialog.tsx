import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import type { Company } from "@/data/companies"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingCompany: Company | null
  setEditingCompany: (company: Company | null) => void
  formData: Partial<Company>
  setFormData: (data: Partial<Company>) => void
  onSubmit: (e: React.FormEvent) => void
  openAddDialog: () => void
}

const CompanyFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingCompany,
  setEditingCompany,
  formData,
  setFormData,
  onSubmit,
  openAddDialog,
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button
        onClick={openAddDialog}
        className="bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nueva Empresa
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{editingCompany ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="photo_url">Logo (URL)</Label>
          <Input
            id="photo_url"
            value={formData.photo_url || ""}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="latitude">Latitud</Label>
          <Input
            id="latitude"
            value={formData.latitude || ""}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitud</Label>
          <Input
            id="longitude"
            value={formData.longitude || ""}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full">
          {editingCompany ? "Actualizar" : "Crear"}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
)

export default CompanyFormDialog
