import { apiFetch } from "./api";

/* =====================
   Tipos
===================== */
export interface ProductoPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: File | null;
}

export interface ProductoUpdatePayload extends ProductoPayload {
  id: number;
}

/* =====================
   Crear producto
   POST /products
===================== */
export const crearProducto = async (data: ProductoPayload) => {
  const formData = new FormData();

  formData.append("nombre", data.nombre);
  if (data.descripcion) formData.append("descripcion", data.descripcion);
  formData.append("precio", String(data.precio));
  if (data.imagen) formData.append("foto", data.imagen);

  return apiFetch("/products", {
    method: "POST",
    body: formData,
  });
};

/* =====================
   Actualizar producto
   PUT /products/:id
===================== */
export const actualizarProducto = async (data: ProductoUpdatePayload) => {
  const formData = new FormData();

  formData.append("nombre", data.nombre);
  if (data.descripcion) formData.append("descripcion", data.descripcion);
  formData.append("precio", String(data.precio));
  if (data.imagen) formData.append("foto", data.imagen);

  return apiFetch(`/products/${data.id}`, {
    method: "PUT",
    body: formData,
  });
};

/* =====================
   Eliminar producto
   DELETE /products/:id
===================== */
export const eliminarProductoApi = async (id: number) => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
};

/* =====================
   Obtener productos del negocio
   GET /products/mios
===================== */
export const obtenerMisProductos = async () => {
  return apiFetch("/products/mios");
};
