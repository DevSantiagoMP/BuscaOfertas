import express from "express";
import {
  createOferta,
  updateOferta,
  deleteOferta,
  getOfertas,
  getOfertasFiltradas,
  getOfertasByNegocio,
} from "../../controllers/offersController.js";

import { validarJWT } from "../../middlewares/auth.js";
import { cargarMiNegocio } from "../../middlewares/tieneNegocio.js";
import { esDuenoDelRecurso } from "../../middlewares/esDuenoDelRecurso.js";

const router = express.Router();

// =======================
// OFERTAS
// =======================

// Crear oferta (mi negocio)
router.post("/register-offers", validarJWT, cargarMiNegocio, createOferta);

// Actualizar oferta (dueño)
router.put(
  "/:id",
  validarJWT,
  esDuenoDelRecurso("ofertas", "id_oferta"),
  updateOferta
);

// Eliminar oferta (dueño)
router.delete(
  "/:id",
  validarJWT,
  esDuenoDelRecurso("ofertas", "id_oferta"),
  deleteOferta
);

// Obtener todas las ofertas (público)
router.get("/", getOfertas);

// Obtener ofertas filtradas (público)
router.get("/filtrar", getOfertasFiltradas);

// Obtener MIS ofertas (según sesión)
router.get("/mis-ofertas", validarJWT, cargarMiNegocio, getOfertasByNegocio);

export default router;
