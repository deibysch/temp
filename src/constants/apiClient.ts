export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.ahorraya.shop";

export const ENDPOINTS = {
  REGISTER: API_BASE_URL+"/register",
  LOGIN: API_BASE_URL+"/login",
  LOGOUT: API_BASE_URL+"/logout",
  FORGOT_PASSWORD: API_BASE_URL+"/forgot-password",
  RESET_PASSWORD: API_BASE_URL+"/reset-password",
  
  PROFILE: API_BASE_URL+"/profile",
  SEND_EMAIL_VERIFICATION: API_BASE_URL+"/send-email-verification",
  VERIFY_EMAIL_LINK: API_BASE_URL+"/verify-email-link",
  CHANGE_PASSWORD: API_BASE_URL+"/change-password",

  CATEGORIES: API_BASE_URL+"/categories",
  COMPANIES: API_BASE_URL+"/companies",
  DISCOUNTS: API_BASE_URL+"/discounts",
  USERS: API_BASE_URL+"/users",
}
