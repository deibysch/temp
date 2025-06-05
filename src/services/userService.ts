import { User, UserUpdateInput } from '@/types/user';

// Mock data for development
const MOCK_USER: User = {
  id: "1",
  name: "SuperUser",
  email: "su@gmail.com",
  avatar_url: "/images/avatar-placeholder.png",
  role: "admin",
  phone: "+1234567890",
  location: "Santa Cruz, Bolivia",
  bio: "Este es un usuario de prueba para desarrollo.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

class UserService {
  private static instance: UserService;
  private baseUrl = '/api/users'; // Replace with your actual API endpoint

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getCurrentUser(): Promise<User> {
    // Simulamos un delay para simular la llamada a la API
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USER;
  }

  async updateProfile(data: UserUpdateInput): Promise<User> {
    // Simulamos un delay para simular la llamada a la API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulamos la actualización mezclando los datos nuevos con el usuario mock
    const updatedUser = {
      ...MOCK_USER,
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return updatedUser;
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    // Simulamos un delay para simular la subida del archivo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulamos una URL de avatar
    return {
      avatar_url: URL.createObjectURL(file)
    };
  }

  async deleteAccount(): Promise<void> {
    // Simulamos un delay para simular la eliminación
    await new Promise(resolve => setTimeout(resolve, 500));
    // En un caso real, aquí se haría la llamada a la API para eliminar la cuenta
  }
}

export const userService = UserService.getInstance(); 