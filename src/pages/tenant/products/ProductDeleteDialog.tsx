import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Company } from "@/types/company"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  company: Company | null
  onConfirm: () => void
}

const CompanyDeleteDialog: React.FC<Props> = ({ open, setOpen, company, onConfirm }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>¿Eliminar empresa?</DialogTitle>
        <DialogDescription>
          Esta acción no se puede deshacer.
        </DialogDescription>
      </DialogHeader>
      <div className="py-2">
        <p>
          ¿Estás seguro que deseas eliminar la empresa
          <span className="font-semibold"> {company?.name}</span>?
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

export default CompanyDeleteDialog
