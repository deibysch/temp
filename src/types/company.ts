export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  businessType: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  taxId: string;
  operatingHours: BusinessHours[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export type CompanyFormData = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;
