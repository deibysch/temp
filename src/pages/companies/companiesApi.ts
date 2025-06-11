import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils"
import type { CompanyCreateInput, CompanyUpdateInput } from "@/types/company"

export async function getCompanies(categoryId?: number) {
  if (categoryId) {
    return GET(`${ENDPOINTS.COMPANIES}?category-id=${categoryId}`)
  }
  return GET(ENDPOINTS.COMPANIES)
}

export async function getCompany(id: number) {
  return GET(`${ENDPOINTS.COMPANIES}/${id}`)
}

export async function createCompany(data: CompanyCreateInput) {
  const loading = showInfoToast("Creando empresa...", "Por favor espera")
  try {
    const res = await POST(ENDPOINTS.COMPANIES, data)
    showSuccessToast("Empresa creada", "La empresa se ha creado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function updateCompany(id: number, data: CompanyUpdateInput) {
  const loading = showInfoToast("Actualizando empresa...", "Por favor espera")
  try {
    const res = await PUT(`${ENDPOINTS.COMPANIES}/${id}`, data)
    showSuccessToast("Empresa actualizada", "La empresa se ha actualizado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function deleteCompany(id: number | string) {
  const loading = showInfoToast("Eliminando empresa...", "Por favor espera")
  try {
    const res = await DELETE(`${ENDPOINTS.COMPANIES}/${id}`)
    showSuccessToast("Empresa eliminada", "La empresa se ha eliminado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}
