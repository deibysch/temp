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
  return await POST(ENDPOINTS.REGISTER, data);
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

export async function forgotPassword(email: string) {
  return await POST(ENDPOINTS.FORGOT_PASSWORD, { email });
}

export async function resetPassword(data: { email: string, token: string, password: string, password_confirmation: string }) {
  return await POST(ENDPOINTS.RESET_PASSWORD, data);
}