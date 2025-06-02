const API_BASE_URL = "http://127.0.0.1:8000/api"
// const API_BASE_URL = "http://38.54.57.210:8000/api"

export const ENDPOINTS = {
  REGISTER: API_BASE_URL+"/register",
  LOGIN: API_BASE_URL+"/login",
  LOGOUT: API_BASE_URL+"/logout",
  CHANGE_PASSWORD: API_BASE_URL+"/change-password",
  FORGOT_PASSWORD: API_BASE_URL+"/forgot-password",
  RESET_PASSWORD: API_BASE_URL+"/reset-password",
}
