import { POST } from "@/services/http"
import { ENDPOINTS } from "@/constants/ApiClient"
import { showSuccessToast } from "@/lib/toast-utils"

export async function login(email: string, password: string) {
  const res = await POST(ENDPOINTS.LOGIN, { email, password }, {}, false)
  if (res.token) {
    localStorage.setItem("token", res.token)
    showSuccessToast("¡Bienvenido!", "Has iniciado sesión correctamente")
  }
  return res
}

export async function register(data: object) {
  const res = await POST(ENDPOINTS.REGISTER, data, {}, false)
  if (res.id || res.success) {
    showSuccessToast("¡Cuenta creada!", "Tu registro se completó exitosamente")
  }
  return res
}

export async function logout() {
  const res = await POST(ENDPOINTS.LOGOUT, {}, {}, false)
  localStorage.removeItem("token")
  showSuccessToast("Sesión cerrada", "Has cerrado sesión correctamente")
  return res
}

export async function changePassword(
  current_password: string,
  new_password: string,
  new_password_confirmation: string,
) {
  const res = await POST(ENDPOINTS.CHANGE_PASSWORD, { current_password, new_password, new_password_confirmation })
  localStorage.removeItem("token")
  return res
}

export async function forgotPassword(email: string) {
  const res = await POST(ENDPOINTS.FORGOT_PASSWORD, { email }, {}, false)
  showSuccessToast("Correo enviado", "Revisa tu bandeja de entrada para restablecer tu contraseña")
  return res
}

export async function resetPassword(data: {
  email: string
  token: string
  password: string
  password_confirmation: string
}) {
  const res = await POST(ENDPOINTS.RESET_PASSWORD, data, {}, false)
  showSuccessToast("Contraseña restablecida", "Tu contraseña ha sido actualizada correctamente")
  return res
}
