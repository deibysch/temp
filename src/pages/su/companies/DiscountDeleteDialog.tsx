"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Percent, DollarSign, Calendar } from "lucide-react"
import type { Discount } from "@/types/discount"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  discount: Discount | null
  onConfirm: () => void
}

const DiscountDeleteDialog: React.FC<Props> = ({ open, setOpen, discount, onConfirm }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            ¿Eliminar descuento?
          </DialogTitle>
          <DialogDescription>Esta acción eliminará permanentemente el descuento seleccionado.</DialogDescription>
        </DialogHeader>

        {discount && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                ¿Estás seguro de que quieres eliminar este descuento? Esta acción no se puede deshacer.
              </p>

              {/* Información del descuento */}
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{discount.title}</h4>
                  <Badge
                    variant={discount.is_active ? "default" : "secondary"}
                    className={
                      discount.is_active
                        ? "bg-green-600 dark:bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }
                  >
                    {discount.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{discount.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {discount.discount_percentage ? (
                      <>
                        <Percent className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {discount.discount_percentage}% OFF
                        </span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${discount.discount_amount} OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(discount.valid_from)} - {formatDate(discount.valid_until)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button variant="destructive" onClick={onConfirm} className="flex-1">
                Sí, eliminar descuento
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DiscountDeleteDialog
