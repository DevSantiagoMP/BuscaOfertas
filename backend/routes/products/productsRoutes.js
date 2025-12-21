import express from "express";
import {
  createProducto,
  updateProducto,
  deleteProducto,
  getProductos,
  getProductosFiltrados,
  getProductosByNegocio
} from "../../controllers/productsController.js";

import { validarJWT } from "../../middlewares/auth.js";
import { cargarMiNegocio } from "../../middlewares/tieneNegocio.js";
import { esDuenoDelRecurso } from "../../middlewares/esDuenoDelRecurso.js";

const router = express.Router();

/* ===============================
   PRODUCTOS
================================ */

// Crear producto (mi negocio)
router.post(
  "/",
  validarJWT,
  cargarMiNegocio,
  createProducto
);

// Actualizar producto
router.put(
  "/:id",
  validarJWT,
  esDuenoDelRecurso("productos", "id_producto"),
  updateProducto
);

// Eliminar producto
router.delete(
  "/:id",
  validarJWT,
  esDuenoDelRecurso("productos", "id_producto"),
  deleteProducto
);

// Obtener todos los productos (público)
router.get("/", getProductos);

// Obtener productos filtrados (público)
router.get("/filtrar", getProductosFiltrados);

// Obtener MIS productos (negocio del usuario)
router.get(
  "/mios",
  validarJWT,
  cargarMiNegocio,
  getProductosByNegocio
);

export default router;
