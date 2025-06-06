export interface Discount {
    id: number
    company_id: number | string
    title: string
    description: string
    discount_percentage?: number
    discount_amount?: number
    valid_from: string
    valid_until: string
    is_active: boolean
    terms_and_conditions?: string
  }
  
  export type DiscountFormData = Omit<Discount, "id" | "created_at" | "updated_at">
  