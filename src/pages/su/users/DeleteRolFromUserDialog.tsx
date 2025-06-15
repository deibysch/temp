import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  roleName: string | null
  companyName: string | null
  onConfirm: () => void
}

const DeleteRolFromUserDialog: React.FC<Props> = ({
  open,
  setOpen,
  roleName,
  companyName,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Quitar rol del usuario</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          ¿Estás seguro que deseas quitar el rol{" "}
          <span className="font-semibold">{roleName}</span>
          {" de "}
          <span className="font-semibold">{companyName}</span>?
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Quitar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteRolFromUserDialog
