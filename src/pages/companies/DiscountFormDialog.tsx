"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Percent, DollarSign } from "lucide-react"
import type { Discount, DiscountFormData } from "@/types/discount"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingDiscount: Discount | null
  discountFormData: Partial<DiscountFormData>
  setDiscountFormData: (data: Partial<DiscountFormData>) => void
  onSubmit: (e: React.FormEvent) => void
}

const DiscountFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingDiscount,
  discountFormData,
  setDiscountFormData,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] m-auto max-h-[calc(100%-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingDiscount ? (
              <>
                <Percent className="h-5 w-5 text-green-600 dark:text-green-400" />
                Editar Descuento
              </>
            ) : (
              <>
                <Percent className="h-5 w-5 text-green-600 dark:text-green-400" />
                Nuevo Descuento
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="discount-title">Título del descuento</Label>
            <Input
              id="discount-title"
              value={discountFormData.title || ""}
              onChange={(e) => setDiscountFormData({ ...discountFormData, title: e.target.value })}
              placeholder="Ej: 20% OFF en todos los productos"
              required
            />
          </div>

          <div>
            <Label htmlFor="discount-description">Descripción</Label>
            <Textarea
              id="discount-description"
              value={discountFormData.description || ""}
              onChange={(e) => setDiscountFormData({ ...discountFormData, description: e.target.value })}
              placeholder="Describe los detalles del descuento..."
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount-percentage" className="flex items-center gap-1">
                <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
                Porcentaje de descuento
              </Label>
              <Input
                id="discount-percentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discountFormData.discount_percentage || ""}
                onChange={(e) =>
                  setDiscountFormData({
                    ...discountFormData,
                    discount_percentage: Number(e.target.value),
                    discount_amount: undefined,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="discount-amount" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                Monto fijo de descuento
              </Label>
              <Input
                id="discount-amount"
                type="number"
                min="0"
                step="0.01"
                value={discountFormData.discount_amount || ""}
                onChange={(e) =>
                  setDiscountFormData({
                    ...discountFormData,
                    discount_amount: Number(e.target.value),
                    discount_percentage: undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 rounded">
            💡 Puedes usar porcentaje O monto fijo, no ambos al mismo tiempo.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid-from" className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                Válido desde
              </Label>
              <Input
                id="valid-from"
                type="date"
                value={discountFormData.valid_from || ""}
                onChange={(e) => setDiscountFormData({ ...discountFormData, valid_from: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="valid-until" className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                Válido hasta
              </Label>
              <Input
                id="valid-until"
                type="date"
                value={discountFormData.valid_until || ""}
                onChange={(e) => setDiscountFormData({ ...discountFormData, valid_until: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="terms">Términos y condiciones</Label>
            <Textarea
              id="terms"
              value={discountFormData.terms_and_conditions || ""}
              onChange={(e) => setDiscountFormData({ ...discountFormData, terms_and_conditions: e.target.value })}
              placeholder="Términos y condiciones del descuento (opcional)..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600"
            >
              {editingDiscount ? "Actualizar Descuento" : "Crear Descuento"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DiscountFormDialog
