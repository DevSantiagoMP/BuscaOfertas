import jwt from "jsonwebtoken";
import { estaEnBlacklist } from "../models/authLogoutModel.js";

export const validarJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  // 1. Verificar si el token está en la blacklist
  const tokenInvalido = await estaEnBlacklist(token);
  if (tokenInvalido) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }

  try {
    // 2. Verificar la firma del JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();

  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
