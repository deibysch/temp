import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils"


export async function getRoles() {
  return GET(ENDPOINTS.ROLES)
}

export async function getRole(id: number) {
  return GET(`${ENDPOINTS.ROLES}/${id}`)
}

export async function createRole(data: { name: string, permissions?: string[] }) {
  const loading = showInfoToast("Creando rol...", "Por favor espera")
  try {
    const res = await POST(ENDPOINTS.ROLES, data)
    showSuccessToast("Rol creado", "El rol se ha creado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function updateRole(id: number, data: { name: string, permissions?: string[] }) {
  const loading = showInfoToast("Actualizando rol...", "Por favor espera")
  try {
    const res = await PUT(`${ENDPOINTS.ROLES}/${id}`, data)
    showSuccessToast("Rol actualizado", "El rol se ha actualizado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function deleteRole(id: number) {
  const loading = showInfoToast("Eliminando rol...", "Por favor espera")
  try {
    const res = await DELETE(`${ENDPOINTS.ROLES}/${id}`)
    showSuccessToast("Rol eliminado", "El rol se ha eliminado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

export async function getPermissions() {
  return GET(ENDPOINTS.PERMISSIONS)
}
