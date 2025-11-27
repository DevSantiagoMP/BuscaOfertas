import express from "express";
import { registerUser } from "../controllers/userRegisterController.js";

const router = express.Router();

// Ruta para registrar usuario
router.post("/register", registerUser);

export default router;
