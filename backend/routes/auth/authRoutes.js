import express from "express";
import { registerUser, verifyEmail, resendVerificationEmail   } from "../../controllers/authRegisterController.js";
import { loginUser } from "../../controllers/authLoginController.js";
import {
    solicitarRecuperacion,
    validarToken,
    resetearContrasena
} from "../../controllers/recoverPasswordController.js";

const router = express.Router();

// REGISTRO Y LOGIN

// Ruta para registrar usuario
router.post("/register", registerUser);
// Ruta para verficar correos
router.get("/verify-email", verifyEmail);
// Ruta para reenviar correo de verificación
router.post("/resend-verification", resendVerificationEmail);
// Ruta para logear usuario
router.post("/login", loginUser);
// Ruta para solicitar correo para enviar enlace de recuperacion de contraseña
router.post("/recuperar", solicitarRecuperacion);
// Ruta para validar token recuperacion de contraseña
router.get("/recuperar/:token", validarToken);
// Ruta para crear nueva contraseña
router.post("/recuperar/:token", resetearContrasena);

export default router;
