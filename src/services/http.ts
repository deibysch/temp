const defaultHeaders = {
  "Content-Type": "application/json",
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { ...defaultHeaders, Authorization: `Bearer ${token}` };
}

export async function GET(url: string, headers?: object) {
  const res = await fetch(url, {
    headers: { ...getAuthHeaders(), ...headers },
  });
  return res.json();
}

export async function POST(url: string, data?: any, headers?: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { ...getAuthHeaders(), ...headers },
    body: data ? JSON.stringify(data) : undefined,
  });
  return res.json();
}

export async function PUT(url: string, data?: any, headers?: object) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...getAuthHeaders(), ...headers },
    body: data ? JSON.stringify(data) : undefined,
  });
  return res.json();
}

export async function DELETE(url: string, headers?: object) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...getAuthHeaders(), ...headers },
  });
  return res.json();
}