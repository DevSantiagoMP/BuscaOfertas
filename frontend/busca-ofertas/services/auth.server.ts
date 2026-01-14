import { redirect } from "react-router";

const API_URL = "http://localhost:3000/api/auth/check-session";

// chequear sesion
export async function checkSessionServer(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie");

  if (!cookie) return false;

  try {
    const res = await fetch(API_URL, {
      headers: { cookie },
    });

    return res.ok;
  } catch {
    return false;
  }
}

// Requiere login + rol
export async function requireAuth(request: Request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) {
    throw redirect("/opciones-login");
  }

  let res: Response;

  try {
    res = await fetch(API_URL, {
      headers: { cookie },
    });
  } catch {
    throw redirect("/opciones-login");
  }

  if (!res.ok) {
    throw redirect("/opciones-login");
  }

  const data = await res.json();
  const usuario = data.usuario;

  // 🔴 NUEVO: tiene sesión pero NO rol
  if (!usuario.rol) {
    throw redirect("/rol");
  }

  return usuario;
}

// Requiere rol específico
export async function requireRole(
  request: Request,
  requiredRole: number
) {
  const usuario = await requireAuth(request);

  if (usuario.rol !== requiredRole) {
    throw redirect("/principal"); // o /403
  }

  return usuario;
}
