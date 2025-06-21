export interface Product {
  id: number;
  company_id: number;
  name: string;
  price: number;
  description?: string;
  url_picture?: string;
  url_thumbnail?: string;
  is_active: boolean;
}
