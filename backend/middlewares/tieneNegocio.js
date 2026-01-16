import { findBusinessByUserId } from "../models/businessModel.js";

export const cargarMiNegocio = async (req, res, next) => {
  try {
    const negocio = await findBusinessByUserId(req.user.id);

    if (!negocio) {
      return res.status(404).json({
        message: "Por favor agrega la información de tu negocio antes de continuar.",
      });
    }

    req.negocio = negocio;
    next();
  } catch (error) {
    console.error("Error en cargarMiNegocio:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
