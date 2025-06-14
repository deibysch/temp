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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Eliminar Categoría</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          ¿Estás seguro que deseas eliminar la categoría{" "}
          <span className="font-semibold">{category?.name}</span>?
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
}

export default CategoryDeleteDialog
