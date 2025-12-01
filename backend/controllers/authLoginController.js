import bcrypt from "bcrypt"; 
import { 
  findUserForLogin, 
  updateFailedAttempts,
  blockAccount,
  resetLoginState,
  updateLastLogin, } from "../models/authLoginModel.js";
import jwt from "jsonwebtoken";


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

    // Verificar si el email está verificado
    if (user.email_verificado !== 1) {
      return res.status(403).json({
        message: "Debes verificar tu correo antes de iniciar sesión",
      });
    }

    // Verificar si está bloqueado
    if (user.cuenta_bloqueada_hasta && new Date() < new Date(user.cuenta_bloqueada_hasta)) {
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
          message: "Has superado el límite de intentos. Tu cuenta ha sido bloqueada por 3 horas.",
        });
      }

      // Solo aumentar intentos
      await updateFailedAttempts(user.id_usuario, nuevosIntentos);

      return res.status(400).json({
        message: `Correo o contraseña incorrectos. Intentos restantes: ${5 - nuevosIntentos}`,
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
      },
      process.env.JWT_SECRET,  
      { expiresIn: "24h" }
    );

    // 4. Respuesta
    res.json({
      message: "Login exitoso",
      token,
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
