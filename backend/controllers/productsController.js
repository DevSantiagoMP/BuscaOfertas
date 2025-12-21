import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductos,
  obtenerProductosFiltrados,
  obtenerProductosPorNegocio,
} from "../models/productsModel.js";
import cloudinary from "../config/cloudinary.js";

export const createProducto = async (req, res) => {
  try {
    const negocio = req.negocio; // 👈 viene del middleware
    const { nombre, descripcion, precio } = req.body;

    // VALIDACIONES
    if (!nombre || precio == null) {
      return res.status(400).json({
        ok: false,
        msg: "nombre y precio son obligatorios",
      });
    }

    // 🟢 IMAGEN OPCIONAL
    let foto_url = null;
    let foto_public_id = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "productos",
      });

      foto_url = uploadResult.secure_url;
      foto_public_id = uploadResult.public_id;
    }

    const nuevoProducto = {
      negocio_id: negocio.id_negocio,
      nombre,
      descripcion: descripcion ?? null,
      precio,
      foto_url, // 👈 URL de Cloudinary
      foto_public_id, // opcional (recomendado para eliminar luego)
    };

    const { insertResult, productos_actuales, limite, productos_restantes } =
      await crearProducto(nuevoProducto);

    return res.status(201).json({
      ok: true,
      msg: "Producto creado exitosamente",
      id_producto: insertResult.insertId,
      foto_url,
      productos_actuales,
      limite,
      productos_restantes,
    });
  } catch (error) {
    console.error("Error en createProducto:", error);

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
    const producto = req.recurso; // 👈 validado por middleware
    const { nombre, descripcion, precio } = req.body;

    // Validación mínima
    if (!nombre || precio == null) {
      return res.status(400).json({
        ok: false,
        msg: "nombre y precio son obligatorios",
      });
    }

    const datosActualizados = {
      nombre,
      descripcion: descripcion ?? null,
      precio,
    };

    // 🟢 IMAGEN OPCIONAL
    if (req.file) {
      // 1️⃣ Subir nueva imagen
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "productos",
      });

      // 2️⃣ Eliminar imagen anterior SOLO si la nueva subió bien
      if (producto.foto_public_id) {
        await cloudinary.uploader.destroy(producto.foto_public_id);
      }

      // 3️⃣ Guardar nueva info
      datosActualizados.foto_url = uploadResult.secure_url;
      datosActualizados.foto_public_id = uploadResult.public_id;
    }

    await actualizarProducto(producto.id_producto, datosActualizados);

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
    const producto = req.recurso; // 👈 viene validado por middleware

    // 🟢 Intentar eliminar imagen en Cloudinary (NO bloqueante)
    if (producto.foto_public_id) {
      try {
        await cloudinary.uploader.destroy(producto.foto_public_id);
      } catch (cloudinaryError) {
        console.error(
          "Error al eliminar imagen de Cloudinary:",
          cloudinaryError
        );
      }
    }

    // 🗑️ Eliminar producto de la base de datos
    await eliminarProducto(producto.id_producto);

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
    const { nombre, categoriaId, orden } = req.query;
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
    const negocio = req.negocio; // 👈 viene del middleware

    const { productos, limite_aplicado } = await obtenerProductosPorNegocio(
      negocio.id_negocio
    );

    return res.json({
      ok: true,
      negocio_id: negocio.id_negocio,
      limite_aplicado,
      total: productos.length,
      productos,
    });
  } catch (error) {
    console.error("Error al obtener mis productos:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener productos",
    });
  }
};
