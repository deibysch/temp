import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Editar Categoría" : "Agregar Categoría"}</DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Modifica los datos de la categoría"
              : "Completa el formulario para crear una nueva categoría"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category-name"
              value={formData.name || ""}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category-photo-url">Logo (URL)</Label>
            <Input
              id="category-photo-url"
              value={formData.photo_url || ""}
              onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="category-description">Descripción</Label>
            <Input
              id="category-description"
              value={formData.description || ""}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
          >
            {editingCategory ? "Actualizar Categoria" : "Crear Categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormDialog
