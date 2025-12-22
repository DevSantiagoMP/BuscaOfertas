import { db } from "../config/dbConnection.js";
import cloudinary from "../config/cloudinary.js";

import {
  registrarNegocio,
  actualizarNegocio,
  actualizarPlanNegocio,
  obtenerTodosLosNegocios,
  obtenerNegociosPorCategoria,
  findBusinessByUserId,
} from "../models/businessModel.js";

export const crearNegocio = async (req, res) => {
  try {
    const usuario_id = req.user.id; // 👈 viene del JWT

    // 🔥 VALIDAR SI YA TIENE NEGOCIO
    const negocioExistente = await findBusinessByUserId(usuario_id);
    if (negocioExistente) {
      return res.status(409).json({
        message: "El usuario ya tiene un negocio registrado",
      });
    }

    const {
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
    } = req.body;

    // VALIDACIONES
    if (!usuario_id)
      return res.status(400).json({ message: "usuario_id es obligatorio" });

    if (!nombre)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    if (!ciudad)
      return res.status(400).json({ message: "La ciudad es obligatoria" });

    if (!direccion)
      return res.status(400).json({ message: "La dirección es obligatoria" });

    if (!telefono)
      return res.status(400).json({ message: "El teléfono es obligatorio" });

    if (!categoria_id)
      return res.status(400).json({ message: "categoria_id es obligatorio" });

    // 🟢 IMAGEN OPCIONAL
    let foto_url = null;
    let foto_public_id = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "negocios",
      });
      foto_url = uploadResult.secure_url;
      foto_public_id = uploadResult.public_id;
    }

    // CONTAR NEGOCIOS
    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM negocios"
    );
    const totalNegocios = countRows[0].total;

    let finalPlanId;
    let planExpira = new Date();
    planExpira.setFullYear(planExpira.getFullYear() + 1);

    if (totalNegocios < 500) {
      finalPlanId = 4;
    } else {
      finalPlanId = 5;
    }

    // REGISTRAR NEGOCIO
    const nuevoId = await registrarNegocio({
      usuario_id,
      foto_url, // puede ser null
      foto_public_id,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      plan_id: finalPlanId,
      plan_expira: planExpira,
    });

    res.status(201).json({
      message: "Negocio registrado correctamente",
      id_negocio: nuevoId,
      plan_asignado: finalPlanId,
      plan_expira: planExpira,
      primeros_500: totalNegocios < 500,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar negocio" });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const negocio = req.negocio;

    // Solo campos editables
    const datos = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      ciudad: req.body.ciudad,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      categoria_id: req.body.categoria_id,
    };

    // Si llega una nueva imagen
    if (req.file) {
      // Subir nueva imagen
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "negocios",
      });

      // Eliminar imagen anterior si existe
      if (negocio.foto_public_id) {
        await cloudinary.uploader.destroy(negocio.foto_public_id);
      }

      // Guardar nueva información
      datos.foto_url = uploadResult.secure_url;
      datos.foto_public_id = uploadResult.public_id;
    }

    // Actualizar negocio
    const result = await actualizarNegocio(negocio.id_negocio, datos);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Negocio no encontrado",
      });
    }

    return res.json({
      ok: true,
      message: "Negocio actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar negocio:", error);
    return res.status(500).json({
      message: "Error al actualizar negocio",
    });
  }
};

export const updateBusinessPlan = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const negocio = req.negocio;

    if (!plan_id) {
      return res.status(400).json({
        message: "plan_id es obligatorio",
      });
    }

    await actualizarPlanNegocio(negocio.id_negocio, plan_id);

    const [rows] = await db.query(
      `
      SELECT plan_id, plan_expira
      FROM negocios
      WHERE id_negocio = ?
      `,
      [negocio.id_negocio]
    );

    return res.json({
      ok: true,
      message: "Plan del negocio actualizado correctamente",
      negocio: {
        id_negocio: negocio.id_negocio,
        nuevo_plan_id: rows[0].plan_id,
        plan_expira: rows[0].plan_expira,
      },
    });
  } catch (error) {
    console.error("Error al actualizar plan del negocio:", error);
    return res.status(500).json({
      message: "Error al actualizar plan",
    });
  }
};

export const getNegocios = async (req, res) => {
  try {
    const negocios = await obtenerTodosLosNegocios();
    res.json(negocios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los negocios" });
  }
};

export const getNegociosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    if (!categoriaId) {
      return res
        .status(400)
        .json({ message: "El ID de categoría es obligatorio" });
    }

    const negocios = await obtenerNegociosPorCategoria(categoriaId);

    res.json(negocios);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener negocios por categoría" });
  }
};

export const getMyBusiness = async (req, res) => {
  try {
    const userId = req.user.id;

    const negocio = await findBusinessByUserId(userId);

    if (!negocio) {
      return res.status(404).json({
        message: "El usuario no tiene un negocio registrado",
      });
    }

    res.json(negocio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el negocio" });
  }
}