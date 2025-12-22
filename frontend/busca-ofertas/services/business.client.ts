import { apiFetch } from "./api";

export const updateMyBusinessFormData = async (formData: FormData) => {
  return apiFetch("/business/mi-negocio", {
    method: "PUT",
    body: formData, // 👈 NO JSON
  });
};
