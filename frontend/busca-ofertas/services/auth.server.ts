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

// Requiere login
export async function requireAuth(request: Request) {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    throw redirect("/login");
  }

  let res: Response;

  try {
    res = await fetch(API_URL, {
      headers: { cookie },
    });
  } catch {
    throw redirect("/login");
  }

  if (!res.ok) {
    throw redirect("/login");
  }

  const data = await res.json();
  return data.usuario;
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
