import jwt from "jsonwebtoken";
import { estaEnBlacklist } from "../models/authLogoutModel.js";

export const validarJWT = async (req, res, next) => {
  let token = null;

  // Token por header Authorization: Bearer xxx
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Token por cookie HttpOnly
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // Sanitizar token
  token = String(token).trim();

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Revisar blacklist
    const tokenInvalido = await estaEnBlacklist(token);
    if (tokenInvalido) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // Guardar usuario en req
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    }

    return res.status(401).json({ message: "Token inválido" });
  }
};