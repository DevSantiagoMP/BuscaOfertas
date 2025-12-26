import {
  crearOferta,
  actualizarOferta,
  eliminarOferta,
  obtenerOfertas,
  obtenerOfertasFiltradas,
  obtenerOfertasPorNegocio 
} from "../models/offersModel.js";
import cloudinary from "../config/cloudinary.js";

// Crear oferta
export const createOferta = async (req, res) => {
  try {
    const negocio = req.negocio;
    const {
      nombre,
      descripcion,
      precio_oferta,
      foto_url = null,
      foto_public_id = null,
    } = req.body;

    // VALIDACIONES
    if (!nombre || precio_oferta == null) {
      return res.status(400).json({
        ok: false,
        msg: "nombre y precio_oferta son obligatorios",
      });
    }

    const nuevaOferta = {
      negocio_id: negocio.id_negocio,
      nombre,
      descripcion: descripcion ?? null,
      precio_oferta,
      foto_url,
      foto_public_id,
    };

    const {
      insertResult,
      ofertas_actuales,
      limite,
      ofertas_restantes,
    } = await crearOferta(nuevaOferta);

    return res.status(201).json({
      ok: true,
      msg: "Oferta creada exitosamente",
      id_oferta: insertResult.insertId,
      foto_url,
      ofertas_actuales,
      limite,
      ofertas_restantes,
    });
  } catch (error) {
    console.error("Error en createOferta:", error);

    if (error.message?.includes("plan")) {
      return res.status(403).json({
        ok: false,
        msg: error.message,
      });
    }

    return res.status(500).json({
      ok: false,
      msg: "Error al registrar la oferta",
    });
  }
};

// Actualizar informacion de oferta
export const updateOferta = async (req, res) => {
  try {
    const oferta = req.recurso;
    const {
      nombre,
      descripcion,
      precio_oferta,
      foto_url = null,
      foto_public_id = null,
    } = req.body;

    if (!nombre || precio_oferta == null) {
      return res.status(400).json({
        ok: false,
        msg: "nombre y precio_oferta son obligatorios",
      });
    }

    const datosActualizados = {
      nombre,
      descripcion: descripcion ?? null,
      precio_oferta,
    };

    // 🔥 Si viene nueva imagen → borrar la anterior
    if (foto_url && foto_public_id) {
      if (oferta.foto_public_id) {
        await cloudinary.uploader.destroy(oferta.foto_public_id);
      }

      datosActualizados.foto_url = foto_url;
      datosActualizados.foto_public_id = foto_public_id;
    }

    const result = await actualizarOferta(
      oferta.id_oferta,
      datosActualizados
    );

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

// Borrar ofertas
export const deleteOferta = async (req, res) => {
  try {
    const oferta = req.recurso; // 👈 viene validada por middleware

    // 🟢 Intentar eliminar imagen en Cloudinary (NO bloqueante)
    if (oferta.foto_public_id) {
      try {
        await cloudinary.uploader.destroy(oferta.foto_public_id);
      } catch (cloudinaryError) {
        console.error(
          "Error al eliminar imagen de Cloudinary:",
          cloudinaryError
        );
      }
    }

    // 🗑️ Eliminar oferta de la base de datos
    const result = await eliminarOferta(oferta.id_oferta);

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

// Obtener todas las ofertas
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

// Obtener ofertas por filtro
export const getOfertasFiltradas = async (req, res) => {
  try {
    const { nombre, categoriaId, orden } = req.query;

    const ofertas = await obtenerOfertasFiltradas({
      nombre: nombre || null,
      categoria_id: categoriaId || null,
      orden: orden || null,
    });

    return res.status(200).json({
      ok: true,
      ofertas,
    });

  } catch (error) {
    console.error("Error en getOfertasFiltradas:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener ofertas filtradas",
    });
  }
};

// Obtener todas las ofertas de un negocio segun plan 
export const getOfertasByNegocio = async (req, res) => {
  try {
    const negocio = req.negocio;

    const { ofertas, limite_aplicado } =
      await obtenerOfertasPorNegocio(negocio.id_negocio);

    return res.json({
      ok: true,
      negocio_id: negocio.id_negocio,
      limite_aplicado,
      total: ofertas.length,
      ofertas,
    });

  } catch (error) {
    console.error("Error al obtener ofertas del negocio:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener ofertas",
    });
  }
};

