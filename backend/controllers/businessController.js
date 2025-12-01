import { actualizarNegocio } from "../models/businessModel.js";
import { actualizarPlanNegocio } from "../models/businessModel.js";
import { obtenerTodosLosNegocios, registrarNegocio } from "../models/businessModel.js";


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
      plan_id,
    } = req.body;

    // Validaciones básicas
    if (!usuario_id) return res.status(400).json({ message: "usuario_id es obligatorio" });
    if (!nombre) return res.status(400).json({ message: "El nombre es obligatorio" });
    if (!categoria_id) return res.status(400).json({ message: "categoria_id es obligatorio" });
    if (!plan_id) return res.status(400).json({ message: "plan_id es obligatorio" });

    const nuevoId = await registrarNegocio({
      usuario_id,
      foto_url,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      plan_id,
    });

    res.status(201).json({
      message: "Negocio registrado correctamente",
      id_negocio: nuevoId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar negocio" });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "El id del negocio es obligatorio" });
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

    // Validación
    if (!plan_id) {
      return res.status(400).json({ message: "plan_id es obligatorio" });
    }

    const result = await actualizarPlanNegocio(id, plan_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }

    res.json({ message: "Plan del negocio actualizado correctamente" });

  } catch (error) {
    console.error("Error al actualizar plan del negocio:", error);
    res.status(500).json({ message: "Error al actualizar plan" });
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

import { obtenerNegociosPorCategoria } from "../models/businessModel.js";

export const getNegociosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    if (!categoriaId) {
      return res.status(400).json({ message: "El ID de categoría es obligatorio" });
    }

    const negocios = await obtenerNegociosPorCategoria(categoriaId);

    res.json(negocios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener negocios por categoría" });
  }
};

