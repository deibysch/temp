import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils"


export async function getCategories() {
  return GET(ENDPOINTS.CATEGORIES)
}

export async function getCategory(id: number | string) {
  return GET(`${ENDPOINTS.CATEGORIES}/${id}`)
}

export async function createCategory(data: {
  name: string
  photo_url?: string
  description?: string
}) {
  const loading = showInfoToast("Creando categoría...", "Por favor espera")
  try {
    const res = await POST(ENDPOINTS.CATEGORIES, data)
    showSuccessToast("Categoría creada", "La categoría se ha creado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function updateCategory(id: number | string, data: {
  name?: string
  photo_url?: string
  description?: string
}) {
  const loading = showInfoToast("Actualizando categoría...", "Por favor espera")
  try {
    const res = await PUT(`${ENDPOINTS.CATEGORIES}/${id}`, data)
    showSuccessToast("Categoría actualizada", "La categoría se ha actualizado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function deleteCategory(id: number | string) {
  const loading = showInfoToast("Eliminando categoría...", "Por favor espera")
  try {
    const res = await DELETE(`${ENDPOINTS.CATEGORIES}/${id}`)
    showSuccessToast("Categoría eliminada", "La categoría se ha eliminado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}
