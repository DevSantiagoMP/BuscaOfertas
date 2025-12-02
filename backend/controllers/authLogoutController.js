import jwt from "jsonwebtoken";
import { agregarTokenALaBlacklist } from "../models/authLogoutModel.js";

export const logoutManual = async (req, res) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ message: "No se envió el token" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Decodificar sin validar
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(400).json({ message: "Token no válido" });
    }

    // Fecha de expiración del token (segundos → ms)
    const expiracion = new Date(decoded.exp * 1000);

    // Insertarlo en la blacklist
    await agregarTokenALaBlacklist(token, expiracion);

    return res.json({ message: "Logout exitoso. Token invalidado." });

  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
