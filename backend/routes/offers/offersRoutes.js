import express from "express";
import {
  createOferta,
  updateOferta,
  deleteOferta,
  getOfertas,
  getOfertasPorCategoria,
  getOfertasPorPrecio,
} from "../../controllers/offersController.js";

const router = express.Router();
// OFERTAS

//Ruta para registrar Ofertas
router.post("/register-offers", createOferta);
//Ruta para actualizar datos de la Oferta
router.put("/:id", updateOferta);
//Ruta para borrar Ofertas
router.delete("/:id", deleteOferta);
//Ruta para obtener todos las Ofertas
router.get("/", getOfertas);
//Ruta para obtener Ofertas por categoria
router.get("/categoria/:categoriaId", getOfertasPorCategoria);
//Ruta para obtener todos las Ofertas por precio
router.get("/precio/:orden", getOfertasPorPrecio);

export default router;
