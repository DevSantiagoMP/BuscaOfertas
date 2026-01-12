import jwt from "jsonwebtoken";
import { estaEnBlacklist } from "../models/authLogoutModel.js";

export const validarJWT = async (req, res, next) => {
  let token = null;

  // 1️⃣ Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Cookie HttpOnly
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Sesión no válida o expirada",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Revisar blacklist
    const tokenInvalido = await estaEnBlacklist(token);
    if (tokenInvalido) {
      return res.status(401).json({
        ok: false,
        message: "Sesión cerrada",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message:
        error.name === "TokenExpiredError"
          ? "La sesión ha expirado"
          : "Sesión inválida",
    });
  }
};