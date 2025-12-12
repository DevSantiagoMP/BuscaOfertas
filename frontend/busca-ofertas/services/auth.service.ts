import api from "./api";

// Registrar usuario
export const registerUser = async (data: {
  nombre: string;
  apellidos: string;
  rol_id: number;
  correo: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Enviar enlace verificación
export const verifyEmail = async (token: string) => {
  const res = await api.get(`/auth/verify-email?token=${token}`);
  return res.data;
};

// Reenviar enlace verificación
export const resendVerification = (correo: string) =>
  api.post("/auth/resend-verification", { correo });

// Iniciar sesión
export const loginUser = async (correo: string, password: string) => {
  const res = await api.post("/auth/login", { correo, password });
  return res.data; 
};

