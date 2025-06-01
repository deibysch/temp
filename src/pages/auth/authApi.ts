import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/ApiClient"

export async function login(email: string, password: string) {
  const res = await POST(ENDPOINTS.LOGIN, { email, password })
  if (res.token) {
    localStorage.setItem("token", res.token)
  }
  return res
}

export async function register(data: object) {
  const res = await POST(ENDPOINTS.REGISTER, data)
  return res
}

export async function logout() {
  const res = await POST(ENDPOINTS.LOGOUT, {})
  localStorage.removeItem("token")
  return res
}

export async function changePassword(current_password: string, new_password: string, new_password_confirmation: string) {
  const res = await POST(ENDPOINTS.LOGIN, {current_password, new_password, new_password_confirmation})
  localStorage.removeItem("token")
  return res
}