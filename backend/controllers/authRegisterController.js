import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../config/dbConnection.js";
import {
  createUser,
  findUserByEmail,
  verifyUserEmail,
} from "../models/authRegisterModel.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { validatePassword } from "../utils/validatePassword.js";

export const registerUser = async (req, res) => {
  try {
    const { nombre, apellidos, rol_id, correo, password } = req.body;

    // Sanitizar entradas
    const sanitize = (str) => String(str).trim();

    const nombreSan = sanitize(nombre);
    const apellidosSan = apellidos ? sanitize(apellidos) : null;
    const correoSan = sanitize(correo).toLowerCase();
    const rolSan = Number(rol_id); 
    const passwordSan = password;

    // 1. Validaciones básicas
    if (!nombreSan || !rolSan || !correoSan || !passwordSan) {
      return res.status(400).json({
        message: "Los campos nombre, rol, correo y contraseña son obligatorios",
      });
    }

    // Validar rol numérico
    if (isNaN(rolSan)) {
      return res.status(400).json({
        message: "El rol debe ser un número válido",
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoSan)) {
      return res.status(400).json({
        message: "El formato del correo no es válido",
      });
    }

    // Validar contraseña
    if (!validatePassword(passwordSan)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número",
      });
    }

    // 2. Verificar si el usuario ya existe
const userFound = await findUserByEmail(correoSan);
if (userFound) {
  // Si se registró con Google pero no tiene contraseña, permitir agregar contraseña
  if (!userFound.contrasena_hash) {
    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(passwordSan, salt);
    
    // Generar token de verificación
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    // Actualizar usuario con la contraseña pero SIN verificar aún
    await db.query(
      `UPDATE usuarios 
       SET contrasena_hash = ?,
           token_verificacion = ?,
           token_verificacion_expira = ?,
           fecha_actualizacion = NOW()
       WHERE id_usuario = ?`,
      [contrasena_hash, token, tokenExpiration, userFound.id_usuario]
    );
    
    // Enviar correo de verificación
    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${token}&email=${correoSan}`;
    
    try {
      await sendVerificationEmail(correoSan, verificationLink);
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);
      return res.status(500).json({
        message: "Contraseña guardada, pero hubo un error enviando el correo de verificación. Intenta reenviar el email.",
      });
    }
    
    return res.status(200).json({
      message: "Contraseña agregada. Revisa tu correo para verificar y activar el login con contraseña.",
      user: {
        id: userFound.id_usuario,
        correo: userFound.correo,
      },
    });
  }
  
  // Si ya tiene contraseña (registro manual previo)
  return res.status(400).json({ 
    message: "El correo ya está registrado. Intenta iniciar sesión o recuperar tu contraseña." 
  });
}

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(passwordSan, salt);

    // 4. Generar token y expiración (1 hora)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    // 5. Crear usuario en base de datos
    const newUser = await createUser({
      nombre: nombreSan,
      apellidos: apellidosSan,
      correo: correoSan,
      contrasena_hash,
      rol_id: rolSan,
      token_verificacion: token,
      token_verificacion_expira: tokenExpiration,
    });

    // Enlace de verificación
    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${token}&email=${correoSan}`;
    // 6. Enviar correo (manejar error de envío)
    try {
      await sendVerificationEmail(newUser.correo, verificationLink);
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);

      return res.status(500).json({
        message:
          "Tu cuenta fue creada, pero hubo un error enviando el correo de verificación. Intenta reenviar el email desde la opción 'Reenviar verificación'.",
      });
    }

    // 7. Respuesta final
    return res.status(201).json({
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

    // Generar nuevo token
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 60 * 60 * 1000);

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
    const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?token=${token}&email=${correo}`;

    await sendVerificationEmail(correo, verificationLink);

    res.json({
      message: "Se ha enviado un nuevo enlace de verificación a tu correo.",
    });
  } catch (error) {
    console.error("Error en reenvío de verificación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
