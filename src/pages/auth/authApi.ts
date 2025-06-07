import { POST, GET, PATCH } from "@/services/http";
import { ENDPOINTS } from "@/constants/apiClient";
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils";

export async function login(email: string, password: string) {
  const loading = showInfoToast("Iniciando sesión...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.LOGIN, { email, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("roles", JSON.stringify(res.roles));
      localStorage.setItem("permissions", JSON.stringify(res.permissions));
      showSuccessToast("¡Bienvenido!", "Has iniciado sesión correctamente");
    }
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function register(data: {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  pat_surname?: string;
  mat_surname?: string;
  ci: string;
  birthdate?: string;
  phone_number?: string;
  gender?: "male" | "female";
}) {
  const loading = showInfoToast("Registrando usuario...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.REGISTER, data);
    showSuccessToast("¡Cuenta creada!", "Tu registro se completó exitosamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function logout() {
  const loading = showInfoToast("Cerrando sesión...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.LOGOUT, {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");
    showSuccessToast("Sesión cerrada", "Has cerrado sesión correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function forgotPassword(email: string) {
  const loading = showInfoToast("Enviando correo...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.FORGOT_PASSWORD, { email });
    showSuccessToast("Correo enviado", "Revisa tu bandeja de entrada para restablecer tu contraseña");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function resetPassword(data: { email: string; token: string; password: string; password_confirmation: string }) {
  const loading = showInfoToast("Restableciendo contraseña...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.RESET_PASSWORD, data);
    showSuccessToast("Contraseña restablecida", "Tu contraseña ha sido actualizada correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function getProfile() {
  try {
    const res = await GET(ENDPOINTS.PROFILE);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateProfile(data: {
  name: string;
  pat_surname?: string;
  mat_surname?: string;
  ci: number;
  birthdate?: string;
  phone_number?: number;
  gender?: "male" | "female";
}) {
  const loading = showInfoToast("Actualizando perfil...", "Por favor espera");
  try {
    const res = await PATCH(ENDPOINTS.PROFILE, data);
    showSuccessToast("Perfil actualizado", "Tus datos han sido actualizados correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function changePassword(current_password: string, new_password: string, new_password_confirmation: string) {
  const loading = showInfoToast("Cambiando contraseña...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.CHANGE_PASSWORD, { current_password, new_password, new_password_confirmation });
    localStorage.removeItem("token");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}
