// src/services/api.ts
const API_URL = "http://localhost:3000/api";

type FetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include", // cookies httpOnly
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }

  return res.json();
}
