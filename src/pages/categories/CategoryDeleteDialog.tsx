import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types/categories"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  category: Category | null
  onConfirm: () => void
}

const CategoryDeleteDialog: React.FC<Props> = ({
  open,
  setOpen,
  category,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Categoría</DialogTitle>
        </DialogHeader>
        <div>
          ¿Estás seguro que deseas eliminar la categoría{" "}
          <span className="font-semibold">{category?.name}</span>?
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDeleteDialog
