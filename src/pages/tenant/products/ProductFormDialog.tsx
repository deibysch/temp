"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/types/product"
import { useRef } from "react"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  product: Product | null
  setProduct: (product: Product | null) => void
  formData: Partial<Product>
  setFormData: (data: Partial<Product>) => void
  onSubmit: (e: React.FormEvent) => void
  openAddDialog: () => void
}

const ProductFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  product,
  setProduct,
  formData,
  setFormData,
  onSubmit,
  openAddDialog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Modifica los datos del producto."
              : "Completa el formulario para crear un nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Nombre<span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="price">Precio<span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price ?? ""}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <Label htmlFor="picture">Imagen (archivo)</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setFormData({ ...formData, picture: e.target.files[0] })
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-1">Puedes subir una imagen para el producto.</div>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
          >
            {product ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductFormDialog
