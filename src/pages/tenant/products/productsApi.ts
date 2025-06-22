import { GET, POST, PUT, DELETE } from "@/services/http";
import { ENDPOINTS } from "@/constants/apiClient";
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils";
import { Product } from "@/types/product";

export async function getProducts() {
  return GET(ENDPOINTS.PRODUCTS, { "Company-ID": getCompanyIdFromUrl() });
}

function getCompanyIdFromUrl(): string | undefined {
  // regex según la estructura de rutas: /business/:companyId/...
  const match = window.location.pathname.match(/business\/(\d+)/);
  return match ? match[1] : undefined;
}

export async function getProduct(id: number) {
  return GET(`${ENDPOINTS.PRODUCTS}/${id}`, { "Company-ID": getCompanyIdFromUrl() });
}

export async function createProduct(data: Omit<Product, "id">) {
  const loading = showInfoToast("Creando producto...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.PRODUCTS, data, { "Company-ID": getCompanyIdFromUrl() });
    showSuccessToast("Producto creado", "El producto se ha creado correctamente");
    // Si hay imagen, súbela
    if ((data as any).picture) {
      await uploadProductPicture(res.data.id, (data as any).picture);
    }
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function updateProduct(id: number, data: Partial<Product>) {
  const loading = showInfoToast("Actualizando producto...", "Por favor espera");
  try {
    const res = await PUT(`${ENDPOINTS.PRODUCTS}/${id}`, data, { "Company-ID": getCompanyIdFromUrl() });
    showSuccessToast("Producto actualizado", "El producto se ha actualizado correctamente");
    // Si hay imagen, súbela
    if ((data as any).picture) {
      await uploadProductPicture(id, (data as any).picture);
    }
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function deleteProduct(id: number) {
  const loading = showInfoToast("Eliminando producto...", "Por favor espera");
  try {
    const res = await DELETE(`${ENDPOINTS.PRODUCTS}/${id}`, {}, { "Company-ID": getCompanyIdFromUrl() });
    showSuccessToast("Producto eliminado", "El producto se ha eliminado correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function uploadProductPicture(productId: number, file: File) {
  const loading = showInfoToast("Subiendo imagen...", "Por favor espera");
  try {
    const formData = new FormData();
    formData.append("picture", file);
    const res = await POST(`${ENDPOINTS.PRODUCTS}/${productId}/picture`, formData, {
      "Content-Type": "multipart/form-data",
      "Company-ID": getCompanyIdFromUrl()
    });
    showSuccessToast("Imagen subida", "La imagen del producto se actualizó correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}