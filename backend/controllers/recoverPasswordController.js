import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  buscarPorCorreo,
  guardarTokenRecuperacion,
  buscarPorTokenRecuperacion,
  actualizarContrasena,
} from "../models/recoverPasswordModel.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

export const solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;

  try {
    const usuario = await buscarPorCorreo(correo);

    if (!usuario) {
      return res
        .status(404)
        .json({ mensaje: "No existe un usuario con ese correo" });
    }

    // Crear token
    const token = crypto.randomBytes(40).toString("hex");
    const expira = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    await guardarTokenRecuperacion(usuario.id_usuario, token, expira);

    const enlace = `${process.env.FRONTEND_URL}/cambiar-contraseña/${token}`;

    await sendPasswordResetEmail(usuario.correo, enlace);

    res.json({
      mensaje: "Se ha enviado un enlace de recuperación a tu correo.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const validarToken = async (req, res) => {
  const { token } = req.params;

  try {
    const usuario = await buscarPorTokenRecuperacion(token);

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }

    res.json({ mensaje: "Token válido" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

export const resetearContrasena = async (req, res) => {
  const { token } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const usuario = await buscarPorTokenRecuperacion(token);

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }

    const hash = await bcrypt.hash(nuevaContrasena, 10);

    await actualizarContrasena(usuario.id_usuario, hash);

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
