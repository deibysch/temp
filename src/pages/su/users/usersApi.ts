import { GET, POST, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils"


// Obtener todos los usuarios con sus roles y compañías
export async function getUsersWithRoles() {
  return GET(ENDPOINTS.USERS)
}

// Asignar un rol a un usuario (puede ser global o por empresa)
export async function addRoleToUser(userId: number, data: {
  role_id: number
  company_id?: number | null
}) {
  const loading = showInfoToast("Asignando rol...", "Por favor espera")
  try {
    const res = await POST(`${ENDPOINTS.USERS}/${userId}/roles`, data)
    showSuccessToast("Rol asignado", "El rol se ha asignado correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}

// Remover un rol de un usuario (puede ser global o por empresa)
export async function removeRoleFromUser(userId: number, data: {
  role_id: number
  company_id?: number | null
}) {
  const loading = showInfoToast("Removiendo rol...", "Por favor espera")
  try {
    const res = await DELETE(`${ENDPOINTS.USERS}/${userId}/roles`, data)
    showSuccessToast("Rol removido", "El rol se ha removido correctamente")
    return res
  } catch (error) {
    throw error
  } finally {
    loading.dismiss()
  }
}
