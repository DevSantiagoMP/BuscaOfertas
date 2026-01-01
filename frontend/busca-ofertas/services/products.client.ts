import { apiFetch } from "./api";

// Tipos
export interface ProductoPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  foto_url?: string | null;
  foto_public_id?: string | null;
}

// Tipo para obtener productos
export interface Producto {
  id_producto: number;
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  foto_url?: string | null;
  nombre_negocio: string;
  plan_id: number;
}

// Tipo para productos públicos por id negocio
export interface ProductoPublico {
  id_producto: number;
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  foto_url?: string | null;
}


export interface ProductoUpdatePayload extends ProductoPayload {
  id: number;
}

// Parámetros para filtrar productos
export interface FiltroProductosParams {
  nombre?: string;
  categoriaId?: number;
  orden?: "asc" | "desc";
}

// Crear producto
export const crearProducto = async (data: ProductoPayload) => {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio: data.precio,
      foto_url: data.foto_url ?? null,
      foto_public_id: data.foto_public_id ?? null,
    }),
  });
};

// Actualizar producto
export const actualizarProducto = async (data: ProductoUpdatePayload) => {
  return apiFetch(`/products/${data.id}`, {
    method: "PUT",
    body: JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      precio: data.precio,
      foto_url: data.foto_url ?? null,
      foto_public_id: data.foto_public_id ?? null,
    }),
  });
};

// Eliminar producto
export const eliminarProductoApi = async (id: number) => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
};

// Obtener productos del negocio
export const obtenerMisProductos = async () => {
  return apiFetch("/products/mios", {
    method: "GET",
  });
};

//Obtener todos los productos
export const obtenerProductos = async () => {
  return apiFetch("/products", {
    method: "GET",
  });
};

// Filtrar productos
export const filtrarProductos = async ({
  nombre,
  categoriaId,
  orden = "asc",
}: FiltroProductosParams) => {
  const params = new URLSearchParams();

  if (nombre) params.append("nombre", nombre);
  if (categoriaId) params.append("categoriaId", String(categoriaId));
  if (orden) params.append("orden", orden);

  return apiFetch(`/products/filtrar?${params.toString()}`, {
    method: "GET",
  });
};

// Obtener productos por negocio
export const obtenerProductosPorNegocio = async (businessId: number) => {
  return apiFetch(`/products/business/${businessId}`, {
    method: "GET",
  });
};

