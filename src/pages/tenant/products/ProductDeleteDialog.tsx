import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  product: Product | null
  onConfirm: () => void
}

const ProductDeleteDialog: React.FC<Props> = ({ open, setOpen, product, onConfirm }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogDescription>
          Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <div className="py-2">
        <p>
          ¿Estás seguro que deseas eliminar el producto
          <span className="font-semibold"> {product?.name}</span>? Esta acción <span className="font-semibold text-red-600">no se puede deshacer</span>.
        </p>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Eliminar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default ProductDeleteDialog
