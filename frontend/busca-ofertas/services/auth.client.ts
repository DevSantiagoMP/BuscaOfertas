import { apiFetch } from "./api";
// ------------------------------
// Registrar usuario
// ------------------------------
export const registerUser = async (data: {
  nombre: string;
  apellidos: string;
  rol_id: number;
  correo: string;
  password: string;
}) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ------------------------------
// Verificar email
// ------------------------------
export const verifyEmail = async (token: string) => {
  return apiFetch(`/auth/verify-email?token=${token}`, {
    method: "GET",
  });
};

// ------------------------------
// Reenviar enlace verificación
// ------------------------------
export const resendVerification = async (correo: string) => {
  return apiFetch("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ correo }),
  });
};

// ------------------------------
// Login
// ------------------------------
export const loginUser = async (correo: string, password: string) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
};

// ------------------------------
// Logout
// ------------------------------
export const logoutUser = async () => {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
};
