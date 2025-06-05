import { GET, POST, PUT, DELETE } from "@/services/http"
import { ENDPOINTS } from "@/constants/apiClient"

export async function getCompanies() {
  return GET(ENDPOINTS.COMPANIES)
}

export async function getCompany(id: number | string) {
  return GET(`${ENDPOINTS.COMPANIES}/${id}`)
}

export async function createCompany(data: {
  name: string
  photo_url?: string
  description?: string
  address?: string
  latitude?: string
  longitude?: string
}) {
  return POST(ENDPOINTS.COMPANIES, data)
}

export async function updateCompany(id: number | string, data: {
  name?: string
  photo_url?: string
  description?: string
  address?: string
  latitude?: string
  longitude?: string
}) {
  return PUT(`${ENDPOINTS.COMPANIES}/${id}`, data)
}

export async function deleteCompany(id: number | string) {
  return DELETE(`${ENDPOINTS.COMPANIES}/${id}`)
}
