// src/services/api.ts

const SERVER = import.meta.env.VITE_SERVER;

const API_URL = `${SERVER}/api`;

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
