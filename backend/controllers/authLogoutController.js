import jwt from "jsonwebtoken";
import { agregarTokenALaBlacklist } from "../models/authLogoutModel.js";

export const logoutManual = async (req, res) => {
  try {
    let token = null;

    // 1. Buscar token en Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Buscar token en cookie
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(400).json({ message: "No se envió el token" });
    }

    // 3. Decodificar sin validar firma
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: "Token no válido" });
    }

    const expiracion = new Date(decoded.exp * 1000); // convertir a ms

    // 4. Insertar en la blacklist (si no existe)
    await agregarTokenALaBlacklist(token, expiracion);

    // 5. Borrar cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ message: "Logout exitoso. Sesión cerrada." });

  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
