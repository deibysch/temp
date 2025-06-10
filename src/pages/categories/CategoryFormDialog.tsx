import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types/categories"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingCategory: Category | null
  setEditingCategory: (cat: Category | null) => void
  formData: Partial<Category>
  setFormData: (data: Partial<Category>) => void
  onSubmit: (e: React.FormEvent) => void
  openAddDialog: () => void
}

const CategoryFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingCategory,
  setEditingCategory,
  formData,
  setFormData,
  onSubmit,
  openAddDialog,
}) => {
  const handleClose = () => {
    setOpen(false)
    setEditingCategory(null)
    setFormData({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Editar Categoría" : "Agregar Categoría"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Nombre"
            value={formData.name || ""}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="URL de la imagen (opcional)"
            value={formData.photo_url || ""}
            onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
          />
          <Input
            placeholder="Descripción (opcional)"
            value={formData.description || ""}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCategory ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormDialog
