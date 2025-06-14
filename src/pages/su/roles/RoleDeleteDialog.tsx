import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Role = {
  id: number
  name: string
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  role: Role | null
  onConfirm: () => void
}

const RoleDeleteDialog: React.FC<Props> = ({
  open,
  setOpen,
  role,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Eliminar Rol</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          ¿Estás seguro que deseas eliminar el rol{" "}
          <span className="font-semibold">{role?.name}</span>?
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

export default RoleDeleteDialog
