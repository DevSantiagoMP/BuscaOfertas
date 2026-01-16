import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserForLogin,
  updateFailedAttempts,
  blockAccount,
  resetLoginState,
  updateLastLogin,
  registrarRolUsuario,
  obtenerRolUsuario
} from "../models/authLoginModel.js";

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Validación básica
    if (!correo || !password) {
      return res.status(400).json({
        message: "El correo y la contraseña son obligatorios",
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        message: "El formato del correo no es válido",
      });
    }

    // 2. Buscar usuario
    const user = await findUserForLogin(correo);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Verificar si el email está verificado
    if (user.email_verificado !== 1) {
      return res.status(403).json({
        message: "Debes verificar tu correo antes de iniciar sesión",
      });
    }

    // Verificar si está bloqueado
    if (
      user.cuenta_bloqueada_hasta &&
      new Date() < new Date(user.cuenta_bloqueada_hasta)
    ) {
      const faltanMinutos = Math.ceil(
        (new Date(user.cuenta_bloqueada_hasta) - new Date()) / 60000
      );
      return res.status(403).json({
        message: `Cuenta bloqueada. Inténtalo de nuevo en ${faltanMinutos} minutos.`,
      });
    }

    // 3. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.contrasena_hash);

    // Numero de intentos
    if (!isMatch) {
      const nuevosIntentos = user.intentos_fallidos + 1;

      if (nuevosIntentos >= 5) {
        // Bloquear por 3 horas
        await blockAccount(user.id_usuario);
        await updateFailedAttempts(user.id_usuario, nuevosIntentos);

        return res.status(403).json({
          message:
            "Has superado el límite de intentos. Tu cuenta ha sido bloqueada por 3 horas.",
        });
      }

      // Solo aumentar intentos
      await updateFailedAttempts(user.id_usuario, nuevosIntentos);

      return res.status(400).json({
        message: `Correo o contraseña incorrectos. Intentos restantes: ${
          5 - nuevosIntentos
        }`,
      });
    }

    // Si la contraseña es correcta, resetear contador y bloqueo
    await resetLoginState(user.id_usuario);

    // Registrar último login
    await updateLastLogin(user.id_usuario);

    // Generar JWT para proteger rutas
    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol_id,
        correo: user.correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Enviar token como cookie segura
    try {
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false, // cambiar a true en producción con HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
    } catch (err) {
      console.error("Error enviando cookie:", err);
      return res.status(500).json({
        message: "Error al generar la sesión del usuario",
      });
    }

    // No enviar el token al frontend
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

export const checkSession = (req, res) => {
  try {
    // Si llegó aquí, validarJWT ya verificó el token
    const usuario = req.user; // viene del JWT decodificado

    return res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al verificar la sesión",
    });
  }
};

export const asignarRolUsuario = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { rol_id } = req.body;

    if (!rol_id) {
      return res.status(400).json({
        ok: false,
        msg: "rol_id es obligatorio",
      });
    }

    const usuario = await obtenerRolUsuario(usuario_id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    if (usuario.rol_id !== null) {
      return res.status(403).json({
        ok: false,
        msg: "El rol ya fue asignado y no puede modificarse",
      });
    }

    await registrarRolUsuario(usuario_id, rol_id);

    // JWT nuevo con el rol asignado
    const token = jwt.sign(
      {
        id: req.user.id,
        rol: rol_id,
        correo: req.user.correo, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      msg: "Rol asignado correctamente",
    });
  } catch (error) {
    console.error("Error al asignar rol:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al asignar el rol",
    });
  }
};

