import { crearProducto, actualizarProducto, eliminarProducto, obtenerProductos, obtenerProductosPorCategoria, obtenerProductosPorPrecio } from "../models/productsModel.js";

export const createProducto = async (req, res) => {
  try {
    const { negocio_id, nombre, descripcion, precio, foto_url } = req.body;

    // Validación simple
    if (!negocio_id || !nombre || !precio) {
      return res.status(400).json({
        ok: false,
        msg: "negocio_id, nombre y precio son obligatorios",
      });
    }

    const nuevoProducto = {
      negocio_id,
      nombre,
      descripcion: descripcion || null,
      precio,
      foto_url: foto_url || null,
    };

    const result = await crearProducto(nuevoProducto);

    return res.status(201).json({
      ok: true,
      msg: "Producto creado exitosamente",
      id_producto: result.insertId,
    });
  } catch (error) {
    console.error("Error en createProducto:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al registrar el producto",
    });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { negocio_id, nombre, descripcion, precio, foto_url } = req.body;

    // Validación mínima
    if (!negocio_id || !nombre || !precio) {
      return res.status(400).json({
        ok: false,
        msg: "negocio_id, nombre y precio son obligatorios",
      });
    }

    const datosActualizados = {
      negocio_id,
      nombre,
      descripcion: descripcion || null,
      precio,
      foto_url: foto_url || null,
    };

    const result = await actualizarProducto(id, datosActualizados);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Producto actualizado correctamente",
    });

  } catch (error) {
    console.error("Error en updateProducto:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar el producto",
    });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await eliminarProducto(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Producto eliminado correctamente",
    });

  } catch (error) {
    console.error("Error en deleteProducto:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al eliminar el producto",
    });
  }
};

export const getProductos = async (req, res) => {
  try {
    const productos = await obtenerProductos();

    return res.status(200).json({
      ok: true,
      productos,
    });
  } catch (error) {
    console.error("Error en getProductos:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los productos",
    });
  }
};

export const getProductosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const productos = await obtenerProductosPorCategoria(categoriaId);

    return res.status(200).json({
      ok: true,
      productos,
    });

  } catch (error) {
    console.error("Error en getProductosPorCategoria:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los productos por categoría",
    });
  }
};

export const getProductosPorPrecio = async (req, res) => {
  try {
    const { orden } = req.params; // "asc" o "desc"

    const productos = await obtenerProductosPorPrecio(orden);

    return res.status(200).json({
      ok: true,
      productos,
    });

  } catch (error) {
    console.error("Error en getProductosPorPrecio:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener productos por precio",
    });
  }
};