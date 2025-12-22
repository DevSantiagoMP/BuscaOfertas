import { apiFetch } from "./api";

export interface RegisterBusinessPayload {
  nombre: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  categoria_id: number;
  foto?: File | null;
}

export const registerBusiness = async (
  payload: RegisterBusinessPayload
) => {
  const formData = new FormData();

  formData.append("nombre", payload.nombre);
  formData.append("descripcion", payload.descripcion);
  formData.append("ciudad", payload.ciudad);
  formData.append("direccion", payload.direccion);
  formData.append("telefono", payload.telefono);
  formData.append("categoria_id", String(payload.categoria_id));

  if (payload.foto) {
    formData.append("foto", payload.foto);
  }

  return apiFetch("/business/register-business", {
    method: "POST",
    body: formData,
  });
};

export const getMyBusiness = async () => {
  return apiFetch("/business/me", {
    method: "GET",
  });
};

// 🔹 Actualizar mi negocio (FormData)
export const updateMyBusiness = async (data: {
  nombre: string;
  descripcion?: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  categoria_id: number;
  foto?: File | null;
}) => {
  const formData = new FormData();

  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion || "");
  formData.append("ciudad", data.ciudad);
  formData.append("direccion", data.direccion);
  formData.append("telefono", data.telefono);
  formData.append("categoria_id", String(data.categoria_id));

  if (data.foto) {
    formData.append("foto", data.foto);
  }

  return apiFetch("/business/mi-negocio", {
    method: "PUT",
    body: formData,
  });
};

