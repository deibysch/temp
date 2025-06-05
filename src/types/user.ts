export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  phone?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateInput extends Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'role'>> {}

export interface UserProfile extends User {
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  }
} 