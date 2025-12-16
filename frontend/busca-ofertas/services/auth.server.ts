import { redirect } from "react-router";

export async function checkSessionServer(request: Request) {
  const cookie = request.headers.get("cookie");

  if (!cookie) return false;

  const res = await fetch("http://localhost:3000/api/auth/check-session", {
    headers: {
      cookie, // 👈 reenviamos cookies al backend
    },
  });

  return res.ok;
}

export async function requireRole(request: Request, requiredRole: number) {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    throw redirect("/login");
  }

  const res = await fetch("http://localhost:3000/api/auth/check-session", {
    headers: {
      cookie,
    },
  });

  if (!res.ok) {
    throw redirect("/login");
  }

  const data = await res.json();

  if (data.usuario.rol !== requiredRole) {
    // ❌ no autorizado
    throw redirect("/principal"); // o /403 si quieres
  }

  // ✅ autorizado
  return data.usuario;
}
