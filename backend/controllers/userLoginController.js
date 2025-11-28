import bcrypt from "bcrypt"; // o bcrypt si te funciona
import { findUserForLogin } from "../models/userLoginModel.js";

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Validación básica
    if (!correo || !password) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    // 2. Buscar usuario
    const user = await findUserForLogin(correo);

    if (!user) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    // 3. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.contrasena_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    // 4. Respuesta
    res.json({
      message: "Login exitoso",
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol_id: user.rol_id,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
