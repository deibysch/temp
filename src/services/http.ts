import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

const defaultHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return { ...defaultHeaders, Authorization: `Bearer ${token}` }
}

async function handleResponse<T>(promise: Promise<{ data: T }>) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    let errorMessage = "Error desconocido";
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      errorMessage = data?.message || data?.detail || data?.error || `Error ${error.response?.status}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    showErrorToast("Error", errorMessage);
    throw error;
  }
}

export async function GET(url: string, headers?: object) {
  return handleResponse(
    axios.get(url, {
      headers: { ...getAuthHeaders(), ...headers },
    })
  );
}

export async function POST(url: string, data?: any, headers?: object) {
  return handleResponse(
    axios.post(url, data, {
      headers: { ...getAuthHeaders(), ...headers },
    })
  );
}

export async function PUT(url: string, data?: any, headers?: object) {
  return handleResponse(
    axios.put(url, data, {
      headers: { ...getAuthHeaders(), ...headers },
    })
  );
}

export async function PATCH(url: string, data?: any, headers?: object) {
  return handleResponse(
    axios.patch(url, data, {
      headers: { ...getAuthHeaders(), ...headers },
    })
  );
}

export async function DELETE(url: string, headers?: object) {
  return handleResponse(
    axios.delete(url, {
      headers: { ...getAuthHeaders(), ...headers },
    })
  );
}
