import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils"
import type { Discount, DiscountFormData } from "@/types/discount"

export async function getDiscountsByCompany(companyId: number): Promise<Discount[]> {
  return GET(`${ENDPOINTS.DISCOUNTS}?company_id=${companyId}`)
}

export async function createDiscount(data: DiscountFormData) {
  const loading = showInfoToast("Creando descuento...", "Por favor espera")
  try {
    const res = await POST(ENDPOINTS.DISCOUNTS, data)
    showSuccessToast("Descuento creado", "El descuento se ha creado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function updateDiscount(id: number | string, data: Partial<DiscountFormData>) {
  const loading = showInfoToast("Actualizando descuento...", "Por favor espera")
  try {
    const res = await PUT(`${ENDPOINTS.DISCOUNTS}/${id}`, data)
    showSuccessToast("Descuento actualizado", "El descuento se ha actualizado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function deleteDiscount(id: number | string) {
  const loading = showInfoToast("Eliminando descuento...", "Por favor espera")
  try {
    const res = await DELETE(`${ENDPOINTS.DISCOUNTS}/${id}`)
    showSuccessToast("Descuento eliminado", "El descuento se ha eliminado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function toggleDiscountStatus(id: number | string, isActive: boolean) {
  const loading = showInfoToast(isActive ? "Activando descuento..." : "Desactivando descuento...", "Por favor espera")
  try {
    const res = await PUT(`${ENDPOINTS.DISCOUNTS}/${id}`, { is_active: isActive })
    showSuccessToast(
      isActive ? "Descuento activado" : "Descuento desactivado",
      `El descuento se ha ${isActive ? "activado" : "desactivado"} correctamente`,
    )
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}
