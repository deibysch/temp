export interface User {
  id: number;
  email: string;
  email_verified_at: string | null;
  name: string;
  pat_surname: string;
  mat_surname: string;
  fullname: string;
  ci: number;
  birthdate: string;
  phone_number: number;
  gender: string;
  url_picture: string | null;
  url_thumbnail: string | null;
}

export interface UserUpdateInput {
  name?: string;
  pat_surname?: string;
  mat_surname?: string;
  ci?: number;
  birthdate?: string;
  phone_number?: number;
  gender?: string;
}