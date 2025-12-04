import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductos,
  obtenerProductosFiltrados,
  obtenerProductosPorNegocio 
} from "../models/productsModel.js";

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

    // Llamada al modelo
    const {
      insertResult,
      productos_actuales,
      limite,
      productos_restantes,
    } = await crearProducto(nuevoProducto);

    return res.status(201).json({
      ok: true,
      msg: "Producto creado exitosamente",
      id_producto: insertResult.insertId,
      productos_actuales,
      limite,
      productos_restantes,
    });

  } catch (error) {
    console.error("Error en createProducto:", error);

    // Si el error viene del modelo (por límite) lo mostramos tal cual
    if (error.message.includes("plan") || error.message.includes("permite")) {
      return res.status(403).json({
        ok: false,
        msg: error.message,
      });
    }

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

export const getProductosFiltrados = async (req, res) => {
  try {
    const {nombre, categoriaId, orden } = req.query;
    // Ejemplo:
    // /productos/filtrar?categoriaId=1&nombre=pollo&orden=asc

    const productos = await obtenerProductosFiltrados({
      nombre: nombre || null,
      categoria_id: categoriaId || null,
      orden: orden || null,
    });

    return res.status(200).json({
      ok: true,
      productos,
    });

  } catch (error) {
    console.error("Error en getProductosFiltrados:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener productos filtrados",
    });
  }
};

export const getProductosByNegocio = async (req, res) => {
  try {
    const { id_negocio } = req.params;

    if (!id_negocio) {
      return res.status(400).json({
        ok: false,
        message: "id_negocio es obligatorio",
      });
    }

    const {
      productos,
      limite_aplicado
    } = await obtenerProductosPorNegocio(id_negocio);

    res.json({
      ok: true,
      negocio_id: id_negocio,
      limite_aplicado,
      total: productos.length,
      productos
    });

  } catch (error) {
    console.error("Error al obtener productos del negocio:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener productos"
    });
  }
};


