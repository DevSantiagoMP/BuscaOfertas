import { db } from "../config/dbConnection.js";
import cloudinary from "../config/cloudinary.js";

import {
  registrarNegocio,
  actualizarNegocio,
  actualizarPlanNegocio,
  obtenerTodosLosNegocios,
  obtenerNegociosPorCategoria,
  findBusinessByUserId,
  obtenerNegocioPorId 
} from "../models/businessModel.js";

export const crearNegocio = async (req, res) => {
  try {
    const usuario_id = req.user.id;

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
      foto_url = null,
      foto_public_id = null,
    } = req.body;

    // 🔒 VALIDACIONES
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

    // 📊 CONTAR NEGOCIOS
    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM negocios"
    );
    const totalNegocios = countRows[0].total;

    // 🏷️ PLAN AUTOMÁTICO
    const planExpira = new Date();
    planExpira.setFullYear(planExpira.getFullYear() + 1);

    const finalPlanId = totalNegocios < 500 ? 4 : 5;

    // 💾 REGISTRAR NEGOCIO
    const nuevoId = await registrarNegocio({
      usuario_id,
      foto_url,
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

    // ✅ RESPUESTA
    return res.status(201).json({
      message: "Negocio registrado correctamente",
      id_negocio: nuevoId,
      plan_asignado: finalPlanId,
      plan_expira: planExpira,
      primeros_500: totalNegocios < 500,
    });
  } catch (error) {
    console.error("Error al registrar negocio:", error);
    return res.status(500).json({
      message: "Error al registrar negocio",
    });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const negocio = req.negocio;

    const {
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      foto_url = null,
      foto_public_id = null,
    } = req.body;

    const datos = {
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
    };

    // 🔥 SI VIENE NUEVA IMAGEN, BORRAR LA ANTERIOR
    if (foto_url && foto_public_id) {
      if (negocio.foto_public_id) {
        await cloudinary.uploader.destroy(negocio.foto_public_id);
      }

      datos.foto_url = foto_url;
      datos.foto_public_id = foto_public_id;
    }

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

export const getNegocioById = async (req, res) => {
  try {
    const { id } = req.params;

    const negocio = await obtenerNegocioPorId(id);

    if (!negocio) {
      return res.status(404).json({
        ok: false,
        message: "Negocio no encontrado",
      });
    }

    res.json({
      ok: true,
      data: negocio,
    });
  } catch (error) {
    console.error("Error al obtener negocio:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};
