import { apiFetch } from "./api";

// Registrar usuario
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


// Verificar email
export const verifyEmail = async (token: string) => {
  return apiFetch(`/auth/verify-email?token=${token}`, {
    method: "GET",
  });
};

// Reenviar enlace verificación
export const resendVerification = async (correo: string) => {
  return apiFetch("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ correo }),
  });
};

// Login
export const loginUser = async (correo: string, password: string) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
};

// Recuperar contraseña - enviar correo
export const recoverPassword = async (correo: string) => {
  return apiFetch("/auth/recuperar", {
    method: "POST",
    body: JSON.stringify({ correo }),
  });
};

// Validar token de recuperación
export const validateRecoverToken = async (token: string) => {
  return apiFetch(`/auth/recuperar/${token}`, {
    method: "GET",
  });
};

// Actualizar contraseña
export const updatePassword = async (
  token: string,
  nuevaContrasena: string
) => {
  return apiFetch(`/auth/recuperar/${token}`, {
    method: "POST",
    body: JSON.stringify({ nuevaContrasena }),
  });
};

// Logout
export const logoutUser = async () => {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
};
