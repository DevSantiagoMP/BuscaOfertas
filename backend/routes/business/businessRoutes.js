import express from "express";
import { crearNegocio, updateBusiness, updateBusinessPlan, getNegocios, getNegociosPorCategoria  } from "../../controllers/businessController.js";


const router = express.Router();
// NEGOCIOS

// Ruta para registrar negocios
router.post("/register-business", crearNegocio);
// Actualizar exclusivamente el plan del negocio
router.put("/:id/plan", updateBusinessPlan);
// Ruta para actualizar datos de negocio
router.put("/:id", updateBusiness);
//Ruta para obtener todos los negocios
router.get("/", getNegocios);
//Ruta para obtener todos los negocios por categoria 
router.get("/categoria/:categoriaId", getNegociosPorCategoria);

export default router;