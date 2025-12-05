import { db } from "../config/dbConnection.js";

import {
  registrarNegocio,
  obtenerNegocioPorId,
  actualizarNegocio,
  actualizarPlanNegocio,
  obtenerTodosLosNegocios,
  obtenerNegociosPorCategoria,
} from "../models/businessModel.js";

export const crearNegocio = async (req, res) => {
  try {
    const {
      usuario_id,
      foto_url,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
    } = req.body;

    // Validaciones según la tabla actual
    if (!usuario_id)
      return res.status(400).json({ message: "usuario_id es obligatorio" });

    if (!nombre)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    if (!direccion)
      return res.status(400).json({ message: "La dirección es obligatoria" });

    if (!categoria_id)
      return res.status(400).json({ message: "categoria_id es obligatorio" });

    // 1. Contar cuántos negocios existen actualmente
    const [countRows] = await db.query(
      "SELECT COUNT(*) AS total FROM negocios"
    );
    const totalNegocios = countRows[0].total;

    let finalPlanId;
    let planExpira = new Date();
    planExpira.setFullYear(planExpira.getFullYear() + 1); // Expira en 1 año

    // 2. Asignar plan según cantidad de negocios
    if (totalNegocios < 500) {
      finalPlanId = 4; // plan fundadores
    } else {
      finalPlanId = 5; // plan primeros pasos
    }

    // 3. Registrar negocio
    const nuevoId = await registrarNegocio({
      usuario_id,
      foto_url,
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

export const obtenerNegocio = async (req, res) => {
  try {
    const { id } = req.params;

    const negocio = await obtenerNegocioPorId(id);
    if (!negocio)
      return res.status(404).json({ message: "Negocio no encontrado" });

    res.json(negocio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener negocio" });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "El id del negocio es obligatorio" });
    }

    const datos = req.body;

    const result = await actualizarNegocio(id, datos);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }

    res.json({ message: "Negocio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar negocio:", error);
    res.status(500).json({ message: "Error al actualizar negocio" });
  }
};

export const updateBusinessPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "plan_id es obligatorio" });
    }

    const result = await actualizarPlanNegocio(id, plan_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }

    // 🔥 Obtener los datos actualizados del negocio
    const [rows] = await db.query(
      `SELECT plan_id, plan_expira FROM negocios WHERE id_negocio = ?`,
      [id]
    );

    const negocio = rows[0];

    return res.json({
      ok: true,
      message: "Plan del negocio actualizado correctamente",
      negocio: {
        id_negocio: id,
        nuevo_plan_id: negocio.plan_id,
        plan_expira: negocio.plan_expira,
      }
    });

  } catch (error) {
    console.error("Error al actualizar plan del negocio:", error);
    return res.status(500).json({ message: "Error al actualizar plan" });
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
