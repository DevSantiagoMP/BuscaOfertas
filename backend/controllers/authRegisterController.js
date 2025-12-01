import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../config/dbConnection.js";
import {
  createUser,
  findUserByEmail,
  verifyUserEmail,
} from "../models/authRegisterModel.js";
import { sendVerificationEmail } from "../services/emailService.js";


export const registerUser = async (req, res) => {
  try {
    const { nombre, apellidos, rol_id, correo, password } = req.body;

    // 1. Validaciones básicas
    if (!nombre || !rol_id || !correo || !password) {
      return res.status(400).json({
        message: "Los campos nombre, rol, correo y contraseña son obligatorios",
      });
    }

    // 2. Verificar si el usuario ya existe
    const userFound = await findUserByEmail(correo);
    if (userFound) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(password, salt);

    // 👉 Generar token y expiración (1 hora)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // 4. Guardar usuario en BD
    const newUser = await createUser({
      nombre,
      apellidos: apellidos || null,
      correo,
      contrasena_hash,
      rol_id,
      token_verificacion: token,
      token_verificacion_expira: tokenExpiration,
    });

    // 👉 Crear enlace de verificación
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    // 👉 Enviar correo
    await sendVerificationEmail(newUser.correo, verificationLink);

    // Respuesta
    res.status(201).json({
      message: "Usuario registrado. Revisa tu correo para verificar la cuenta.",
      user: {
        id: newUser.id_usuario,
        correo: newUser.correo,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token inválido" });

    const verified = await verifyUserEmail(token);

    if (!verified)
      return res.status(400).json({ message: "Token no válido o expirado" });

    res.json({ message: "Correo verificado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    const user = await findUserByEmail(correo);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.email_verificado === 1) {
      return res.status(400).json({ message: "El correo ya está verificado" });
    }

    // Generar nuevo token y expiración
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar en BD
    await db.query(
      `UPDATE usuarios 
       SET token_verificacion = ?, 
           token_verificacion_expira = ?, 
           fecha_actualizacion = NOW()
       WHERE id_usuario = ?`,
      [token, expiration, user.id_usuario]
    );

    // Nuevo enlace
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    // Enviar correo
    await sendVerificationEmail(correo, verificationLink);

    res.json({
      message: "Se ha enviado un nuevo enlace de verificación a tu correo."
    });

  } catch (error) {
    console.error("Error en reenvío de verificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
