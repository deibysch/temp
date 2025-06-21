import { GET, POST, PUT, DELETE } from "@/services/http";
import { ENDPOINTS } from "@/constants/apiClient";
import { showSuccessToast, showInfoToast } from "@/lib/toast-utils";
import { Product } from "@/types/product";

export async function getProducts(companyId: number | string) {
  return GET(ENDPOINTS.PRODUCTS, { "Company-ID": companyId });
}

export async function getProduct(id: number | string, companyId: number | string) {
  return GET(`${ENDPOINTS.PRODUCTS}/${id}`, { "Company-ID": companyId });
}

export async function createProduct(data: Omit<Product, "id">, companyId: number | string) {
  const loading = showInfoToast("Creando producto...", "Por favor espera");
  try {
    const res = await POST(ENDPOINTS.PRODUCTS, data, { "Company-ID": companyId });
    showSuccessToast("Producto creado", "El producto se ha creado correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function updateProduct(id: number | string, data: Partial<Product>, companyId: number | string) {
  const loading = showInfoToast("Actualizando producto...", "Por favor espera");
  try {
    const res = await PUT(`${ENDPOINTS.PRODUCTS}/${id}`, data, { "Company-ID": companyId });
    showSuccessToast("Producto actualizado", "El producto se ha actualizado correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}

export async function deleteProduct(id: number | string, companyId: number | string) {
  const loading = showInfoToast("Eliminando producto...", "Por favor espera");
  try {
    const res = await DELETE(`${ENDPOINTS.PRODUCTS}/${id}`, { "Company-ID": companyId });
    showSuccessToast("Producto eliminado", "El producto se ha eliminado correctamente");
    return res;
  } catch (error) {
    throw error;
  } finally {
    loading.dismiss();
  }
}
