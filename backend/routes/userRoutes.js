import express from "express";
import { registerUser, verifyEmail, resendVerificationEmail   } from "../controllers/userRegisterController.js";
import { loginUser } from "../controllers/userLoginController.js";

const router = express.Router();

// Ruta para registrar usuario
router.post("/register", registerUser);
// Ruta para verficar correos
router.get("/verify-email", verifyEmail);
// Ruta para reenviar correo de verificación
router.post("/resend-verification", resendVerificationEmail);
// Ruta para logear usuario
router.post("/login", loginUser);

export default router;
