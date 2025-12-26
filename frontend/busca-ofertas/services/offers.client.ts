import { apiFetch } from "./api";

/* =====================
   Tipos
===================== */

export interface OfertaPayload {
  nombre: string;
  descripcion?: string;
  precio_oferta: number;
  foto_url?: string | null;
  foto_public_id?: string | null;
}

export interface OfertaUpdatePayload extends OfertaPayload {
  id: number;
}

// Tipo para obtener ofertas
export interface Oferta {
  id_oferta: number;
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio_oferta: string;
  foto_url?: string | null;
  nombre_negocio: string;
  plan_id: number;
}

// Parámetros para filtrar ofertas
export interface FiltroOfertasParams {
  nombre?: string;
  categoriaId?: number;
  orden?: "asc" | "desc";
}


/* =====================
   Crear oferta
   POST /offers/register-offers
===================== */
export const crearOferta = async (data: OfertaPayload) => {
  return apiFetch("/offers/register-offers", {
    method: "POST",
    body: JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio_oferta: data.precio_oferta,
      foto_url: data.foto_url ?? null,
      foto_public_id: data.foto_public_id ?? null,
    }),
  });
};

/* =====================
   Actualizar oferta
   PUT /offers/:id
===================== */
export const actualizarOferta = async (data: OfertaUpdatePayload) => {
  return apiFetch(`/offers/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio_oferta: data.precio_oferta,
      foto_url: data.foto_url ?? null,
      foto_public_id: data.foto_public_id ?? null,
    }),
  });
};

/* =====================
   Eliminar oferta
   DELETE /offers/:id
===================== */
export const eliminarOfertaApi = async (id: number) => {
  return apiFetch(`/offers/${id}`, {
    method: "DELETE",
  });
};

/* =====================
   Obtener ofertas del negocio
   GET /offers/mis-ofertas
===================== */
export const obtenerMisOfertas = async () => {
  return apiFetch("/offers/mis-ofertas", {
    method: "GET",
  });
};

// Obtener todas las ofertas
export const obtenerOfertas = async () => {
  return apiFetch("/offers", {
    method: "GET",
  });
};

// filtrar ofertas
export const filtrarOfertas = async ({
  nombre,
  categoriaId,
  orden = "asc",
}: FiltroOfertasParams) => {
  const params = new URLSearchParams();

  if (nombre) params.append("nombre", nombre);
  if (categoriaId) params.append("categoriaId", String(categoriaId));
  if (orden) params.append("orden", orden);

  return apiFetch(`/offers/filtrar?${params.toString()}`, {
    method: "GET",
  });
};