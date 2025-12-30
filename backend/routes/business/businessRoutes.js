import express from "express";
import { validarJWT } from "../../middlewares/auth.js";
import { cargarMiNegocio } from "../../middlewares/tieneNegocio.js";
import {
  crearNegocio,
  updateBusiness,
  updateBusinessPlan,
  getNegocios,
  getNegociosPorCategoria,
  getMyBusiness,
  getNegocioById 
} from "../../controllers/businessController.js";

const router = express.Router();
// NEGOCIOS

// Ruta para registrar negocios
router.post(
  "/register-business",
  validarJWT,
  crearNegocio
);

// Actualizar datos del negocio
router.put(
  "/mi-negocio",
  validarJWT,
  cargarMiNegocio,
  updateBusiness
);

// Actualizar plan del negocio
router.put(
  "/mi-negocio/plan",
  validarJWT,
  cargarMiNegocio,
  updateBusinessPlan
);

//Ruta para obtener todos los negocios
router.get("/", validarJWT, getNegocios);
//Ruta para obtener todos los negocios por categoria
router.get("/categoria/:categoriaId", validarJWT, getNegociosPorCategoria);
//Ruta para obtener el negocio del usuario autenticado
router.get("/me", validarJWT, getMyBusiness);
// Ruta para obtener negocio por ID
router.get("/:id", validarJWT, getNegocioById);

export default router;
