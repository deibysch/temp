export interface Company {
  id: number
  category_id: number
  name: string
  photo_url?: string
  description?: string
  address: string
  latitude?: string
  longitude?: string
}

export interface CompanyCreateInput {
  category_id: number
  name: string
  photo_url?: string
  description?: string
  address?: string
  latitude?: string
  longitude?: string
}

export interface CompanyUpdateInput {
  category_id?: number
  name?: string
  photo_url?: string
  description?: string
  address?: string
  latitude?: string
  longitude?: string
}
