import { apiFetch } from "./api";

// ------------------------------
// Obtener negocio por ID de usuario
// ------------------------------
export const getMyBusiness = async (request: Request) => {
  const cookie = request.headers.get("cookie");

  const res = await fetch("http://localhost:3000/api/business/me", {
    headers: {
      Cookie: cookie ?? "",
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener negocio");
  }

  return res.json();
};


// ------------------------------
// Registrar negocio
// ------------------------------
export const createBusiness = async (formData: FormData) => {
  return apiFetch("/business/register-business", {
    method: "POST",
    body: formData,
  });
};

// ------------------------------
// Actualizar negocio
// ------------------------------
export const updateBusiness = async (
  id: number,
  formData: FormData
) => {
  return apiFetch(`/business/${id}`, {
    method: "PUT",
    body: formData,
  });
};
