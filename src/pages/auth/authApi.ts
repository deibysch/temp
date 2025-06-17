import { POST, GET, PATCH } from "@/services/http";
import { ENDPOINTS } from "@/constants/apiClient";
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils";

export async function login(email: string, password: string) {
  const loading = showInfoToast("Iniciando sesión...", "Por favor espera");
  try {
    type LoginResponse = {
      message: string;
      token: string;
      user: any;
      companies: Array<{
        id: number | null;
        name: string | null;
        photo_url: string | null;
        roles: string[];
        Permissions: string[];
      }>;
    };
    const res = await POST(ENDPOINTS.LOGIN, { email, password }) as LoginResponse;
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("companies", JSON.stringify(res.companies || []));
      // Guardar companyId principal si existe ADMIN_EMPRESA
      let adminCompanyId = "";
      if (res.companies && Array.isArray(res.companies)) {
        const adminCompany = res.companies.find(c => c.roles.includes("ADMIN_EMPRESA"));
        if (adminCompany && adminCompany.id) {
          adminCompanyId = adminCompany.id.toString();
          localStorage.setItem("adminCompanyId", adminCompanyId);
        }
      }
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
    localStorage.removeItem("companies");
    localStorage.removeItem("adminCompanyId");
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
    if (res && res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("roles", JSON.stringify(res.roles || []));
      localStorage.setItem("permissions", JSON.stringify(res.permissions || []));
    }
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

export async function sendEmailVerification() {
  const loading = showInfoToast("Enviando correo de verificación...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.SEND_EMAIL_VERIFICATION, {});
    showSuccessToast("Correo enviado", "Revisa tu bandeja de entrada para verificar tu correo");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function verifyEmailLink(id: string, hash: string, search: string = "") {
  const url = `${ENDPOINTS.VERIFY_EMAIL_LINK}/${id}/${hash}${search}`;
  try {
    const data = await GET(url);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "No se pudo verificar el correo.");
  }
}

export async function changePassword(current_password: string, new_password: string, new_password_confirmation: string) {
  const loading = showInfoToast("Cambiando contraseña...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.CHANGE_PASSWORD, { current_password, new_password, new_password_confirmation });
    localStorage.clear();
    showSuccessToast("Contraseña cambiada", "Tu contraseña ha sido cambiada correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function updateProfilePicture(file: File) {
  const loading = showInfoToast("Actualizando foto de perfil...", "Por favor espera");
  try {
    const formData = new FormData();
    formData.append("picture", file);
    const res = await POST(ENDPOINTS.PROFILE + "/picture", formData, {
      "Content-Type": "multipart/form-data",
    });
    showSuccessToast("Foto de perfil actualizada", "Tu foto se actualizó correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}
