import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

const defaultHeaders = {
  "Content-Type": "application/json",
}

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return { ...defaultHeaders, Authorization: `Bearer ${token}` }
}

async function handleResponse(response: Response) {
  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data.message || data.detail || data.error || `Error ${response.status}`
    showErrorToast("Error", errorMessage)
  }

  return data
}

export async function GET(url: string, headers?: object) {
  try {
    const res = await fetch(url, {
      headers: { ...getAuthHeaders(), ...headers },
    })
    return await handleResponse(res)
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast("Error de conexión", error.message)
    }
    throw error
  }
}

export async function POST(url: string, data?: any, headers?: object) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { ...getAuthHeaders(), ...headers },
      body: data ? JSON.stringify(data) : undefined,
    })
    return await handleResponse(res)
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast("Error de conexión", error.message)
    }
    throw error
  }
}

export async function PUT(url: string, data?: any, headers?: object) {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { ...getAuthHeaders(), ...headers },
      body: data ? JSON.stringify(data) : undefined,
    })
    return await handleResponse(res)
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast("Error de conexión", error.message)
    }
    throw error
  }
}

export async function PATCH(url: string, data?: any, headers?: object) {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), ...headers },
      body: data ? JSON.stringify(data) : undefined,
    })
    return await handleResponse(res)
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast("Error de conexión", error.message)
    }
    throw error
  }
}

export async function DELETE(url: string, headers?: object) {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { ...getAuthHeaders(), ...headers },
    })
    return await handleResponse(res)
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast("Error de conexión", error.message)
    }
    throw error
  }
}
