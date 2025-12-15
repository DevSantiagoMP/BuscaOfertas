// src/services/auth.server.ts
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
