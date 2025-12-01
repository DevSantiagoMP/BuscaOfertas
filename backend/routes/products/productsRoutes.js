import express from "express";
import {
  createProducto,
  updateProducto,
  deleteProducto,
  getProductos,
  getProductosPorCategoria,
  getProductosPorPrecio,
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
//Ruta para obtener productos por categoria
router.get("/categoria/:categoriaId", getProductosPorCategoria);
//Ruta para obtener todos los productos por precio
router.get("/precio/:orden", getProductosPorPrecio);

export default router;
