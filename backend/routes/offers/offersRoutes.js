import express from "express";
import {
  createOferta,
  updateOferta,
  deleteOferta,
  getOfertas,
  getOfertasFiltradas,
  getOfertasByNegocio 
} from "../../controllers/offersController.js";
import { validarJWT } from "../../middlewares/auth.js";

const router = express.Router();
// OFERTAS

//Ruta para registrar Ofertas
router.post("/register-offers", validarJWT, createOferta);
//Ruta para actualizar datos de la Oferta
router.put("/:id", validarJWT, updateOferta);
//Ruta para borrar Ofertas
router.delete("/:id", validarJWT, deleteOferta);
//Ruta para obtener todos las Ofertas
router.get("/", getOfertas);
//Ruta para obtener Ofertas por categoria y precio
router.get("/filtrar", getOfertasFiltradas);
//Ruta para obtener ofertas por id de negocio
router.get("/:id_negocio/offers", getOfertasByNegocio);

export default router;
