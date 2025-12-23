import { apiFetch } from "./api";

/**
 * Payload único para crear y actualizar negocio
 * (Cloudinary ya devuelve la imagen)
 */
export interface BusinessPayload {
  nombre: string;
  descripcion?: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  categoria_id: number;
  foto_url?: string | null;
  foto_public_id?: string | null;
}

// 🔹 Crear negocio
export const registerBusiness = async (payload: BusinessPayload) => {
  return apiFetch("/business/register-business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

// 🔹 Obtener mi negocio
export const getMyBusiness = async () => {
  return apiFetch("/business/me", {
    method: "GET",
  });
};

// 🔹 Actualizar mi negocio
export const updateMyBusiness = async (payload: BusinessPayload) => {
  return apiFetch("/business/mi-negocio", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
