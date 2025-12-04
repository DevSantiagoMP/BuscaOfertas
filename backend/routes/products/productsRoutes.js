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

const router = express.Router();
// PRODUCTOS

//Ruta para registrar productos
router.post("/register-product", validarJWT, createProducto);
//Ruta para actualizar datos del producto
router.put("/:id", validarJWT, updateProducto);
//Ruta para borrar productos
router.delete("/:id", validarJWT, deleteProducto);
//Ruta para obtener todos los productos
router.get("/", getProductos);
//Ruta para obtener productos por categoria y precio
router.get("/filtrar", getProductosFiltrados);
// Ruta para obtener todos los productos por id de negocio
router.get("/:id_negocio/products", getProductosByNegocio);

export default router;
