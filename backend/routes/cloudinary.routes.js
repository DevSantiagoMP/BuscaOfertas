// routes/cloudinary.routes.ts
import { Router } from "express";
import { eliminarImagen } from "../controllers/cloudinaryController.js";

const router = Router();

router.post("/delete-image", eliminarImagen);

export default router;
