"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Percent, DollarSign } from "lucide-react"
import * as discountsApi from "./discountsApi"
import type { Discount, DiscountFormData } from "@/types/discount"
import DiscountFormDialog from "./DiscountFormDialog"
import DiscountDeleteDialog from "./DiscountDeleteDialog"
import type { Company } from "@/types/company"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  editingCompany: Company | null
  setEditingCompany: (company: Company | null) => void
  formData: Partial<Company>
  setFormData: (data: Partial<Company>) => void
  onSubmit: (e: React.FormEvent) => void
  openAddDialog: () => void
}

const CompanyFormDialog: React.FC<Props> = ({
  open,
  setOpen,
  editingCompany,
  setEditingCompany,
  formData,
  setFormData,
  onSubmit,
  openAddDialog,
}) => {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [discountFormOpen, setDiscountFormOpen] = useState(false)
  const [discountDeleteOpen, setDiscountDeleteOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null)
  const [discountFormData, setDiscountFormData] = useState<Partial<DiscountFormData>>({
    discount_percentage: 0,
    is_active: true,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 días
  })

  useEffect(() => {
    if (editingCompany?.id) {
      loadDiscounts()
    } else {
      setDiscounts([])
    }
  }, [editingCompany])

  const loadDiscounts = async () => {
    if (!editingCompany?.id) return
    try {
      const data = await discountsApi.getDiscountsByCompany(editingCompany.id)
      setDiscounts(data)
    } catch (error) {
      console.error("Error loading discounts:", error)
    }
  }

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCompany?.id) return

    try {
      const discountData = {
        ...discountFormData,
        company_id: editingCompany.id,
      } as DiscountFormData

      if (editingDiscount) {
        await discountsApi.updateDiscount(editingDiscount.id, discountData)
      } else {
        await discountsApi.createDiscount(discountData)
      }

      setDiscountFormOpen(false)
      setEditingDiscount(null)
      resetDiscountForm()
      loadDiscounts()
    } catch (error) {
      // Error ya manejado por la API
    }
  }

  const resetDiscountForm = () => {
    setDiscountFormData({
      discount_percentage: 0,
      is_active: true,
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  const handleAddDiscount = () => {
    setEditingDiscount(null)
    resetDiscountForm()
    setDiscountFormOpen(true)
  }

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount)
    setDiscountFormData({
      title: discount.title,
      description: discount.description,
      discount_percentage: discount.discount_percentage,
      discount_amount: discount.discount_amount,
      valid_from: discount.valid_from,
      valid_until: discount.valid_until,
      is_active: discount.is_active,
      terms_and_conditions: discount.terms_and_conditions,
    })
    setDiscountFormOpen(true)
  }

  const handleDeleteClick = (discount: Discount) => {
    setDiscountToDelete(discount)
    setDiscountDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!discountToDelete) return

    try {
      await discountsApi.deleteDiscount(discountToDelete.id)
      loadDiscounts()
    } catch (error) {
      // Error ya manejado por la API
    } finally {
      setDiscountDeleteOpen(false)
      setDiscountToDelete(null)
    }
  }

  const handleToggleDiscountStatus = async (discountId: number | string, currentStatus: boolean) => {
    try {
      await discountsApi.toggleDiscountStatus(discountId, !currentStatus)
      loadDiscounts()
    } catch (error) {
      // Error ya manejado por la API
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl w-[calc(100%-2rem)] m-auto max-h-[calc(100%-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
            <DialogDescription>
              {editingCompany
                ? "Modifica los datos de la empresa"
                : "Completa el formulario para crear una nueva empresa"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de la Empresa</h3>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoComplete="organization"
                  />
                </div>
                <div>
                  <Label htmlFor="photo_url">Logo (URL)</Label>
                  <Input
                    id="photo_url"
                    value={formData.photo_url || ""}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    autoComplete="url"
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
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    autoComplete="street-address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude || ""}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude || ""}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
                >
                  {editingCompany ? "Actualizar Empresa" : "Crear Empresa"}
                </Button>
              </form>
            </div>

            {/* Gestión de Descuentos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Descuentos</h3>
                {editingCompany && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddDiscount}
                    className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                )}
              </div>

              {!editingCompany ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Guarda la empresa primero para gestionar descuentos</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {discounts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      <p>No hay descuentos registrados</p>
                    </div>
                  ) : (
                    discounts.map((discount) => (
                      <Card
                        key={discount.id}
                        className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{discount.title}</h4>
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
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{discount.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <div className="flex items-center gap-1">
                                {discount.discount_percentage ? (
                                  <>
                                    <Percent className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      {discount.discount_percentage}% OFF
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    <span className="text-green-600 dark:text-green-400 font-medium">
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
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleDiscountStatus(discount.id, discount.is_active)}
                              className={`h-6 w-6 p-0 ${
                                discount.is_active
                                  ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                  : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              }`}
                            >
                              {discount.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditDiscount(discount)}
                              className="h-6 w-6 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(discount)}
                              className="h-6 w-6 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogos flotantes para descuentos */}
      <DiscountFormDialog
        open={discountFormOpen}
        setOpen={setDiscountFormOpen}
        editingDiscount={editingDiscount}
        discountFormData={discountFormData}
        setDiscountFormData={setDiscountFormData}
        onSubmit={handleDiscountSubmit}
      />

      <DiscountDeleteDialog
        open={discountDeleteOpen}
        setOpen={setDiscountDeleteOpen}
        discount={discountToDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default CompanyFormDialog
