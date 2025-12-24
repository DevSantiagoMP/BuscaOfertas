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
