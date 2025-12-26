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

// tipo de negocio (para cargar negocios en cards)
export interface Business {
  id_negocio: number;
  nombre: string;
  descripcion?: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  foto_url?: string | null;
}


//Crear negocio
export const registerBusiness = async (payload: BusinessPayload) => {
  return apiFetch("/business/register-business", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

//Obtener mi negocio
export const getMyBusiness = async () => {
  return apiFetch("/business/me", {
    method: "GET",
  });
};

//Actualizar mi negocio
export const updateMyBusiness = async (payload: BusinessPayload) => {
  return apiFetch("/business/mi-negocio", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

//Obtener todos los negocios
export const obtenerNegocios = async () => {
  return apiFetch("/business", {
    method: "GET",
  });
};

/* =====================
   🔥 Obtener negocios por categoría
   GET /business/categoria/:categoriaId
===================== */
export const obtenerNegociosPorCategoria = async (categoriaId: number) => {
  return apiFetch(`/business/categoria/${categoriaId}`, {
    method: "GET",
  });
};