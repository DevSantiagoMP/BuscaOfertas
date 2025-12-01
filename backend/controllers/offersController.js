import {
  crearOferta,
  actualizarOferta,
  eliminarOferta,
  obtenerOfertas,
  obtenerOfertasPorCategoria,
  obtenerOfertasPorPrecio,
} from "../models/offersModel.js";

export const createOferta = async (req, res) => {
  try {
    const { negocio_id, nombre, descripcion, precio_oferta, foto_url } = req.body;

    // Validación simple
    if (!negocio_id || !nombre || !precio_oferta) {
      return res.status(400).json({
        ok: false,
        msg: "negocio_id, nombre y precio_oferta son obligatorios",
      });
    }

    const nuevaOferta = {
      negocio_id,
      nombre,
      descripcion: descripcion || null,
      precio_oferta,
      foto_url: foto_url || null,
    };

    const result = await crearOferta(nuevaOferta);

    return res.status(201).json({
      ok: true,
      msg: "Oferta creada exitosamente",
      id_oferta: result.insertId,
    });
  } catch (error) {
    console.error("Error en createOferta:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al registrar la oferta",
    });
  }
};

export const updateOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { negocio_id, nombre, descripcion, precio_oferta, foto_url } = req.body;

    // Validación mínima
    if (!negocio_id || !nombre || !precio_oferta) {
      return res.status(400).json({
        ok: false,
        msg: "negocio_id, nombre y precio_oferta son obligatorios",
      });
    }

    const datosActualizados = {
      negocio_id,
      nombre,
      descripcion: descripcion || null,
      precio_oferta,
      foto_url: foto_url || null,
    };

    const result = await actualizarOferta(id, datosActualizados);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Oferta no encontrada",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Oferta actualizada correctamente",
    });
  } catch (error) {
    console.error("Error en updateOferta:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar la oferta",
    });
  }
};

export const deleteOferta = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await eliminarOferta(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Oferta no encontrada",
      });
    }

    return res.status(200).json({
      ok: true,
      msg: "Oferta eliminada correctamente",
    });
  } catch (error) {
    console.error("Error en deleteOferta:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al eliminar la oferta",
    });
  }
};

export const getOfertas = async (req, res) => {
  try {
    const ofertas = await obtenerOfertas();

    return res.status(200).json({
      ok: true,
      ofertas,
    });
  } catch (error) {
    console.error("Error en getOfertas:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las ofertas",
    });
  }
};

export const getOfertasPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const ofertas = await obtenerOfertasPorCategoria(categoriaId);

    return res.status(200).json({
      ok: true,
      ofertas,
    });
  } catch (error) {
    console.error("Error en getOfertasPorCategoria:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener las ofertas por categoría",
    });
  }
};

export const getOfertasPorPrecio = async (req, res) => {
  try {
    const { orden } = req.params; // "asc" o "desc"

    const ofertas = await obtenerOfertasPorPrecio(orden);

    return res.status(200).json({
      ok: true,
      ofertas,
    });
  } catch (error) {
    console.error("Error en getOfertasPorPrecio:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener ofertas por precio",
    });
  }
};
