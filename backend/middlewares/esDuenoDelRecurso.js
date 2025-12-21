import { db } from "../config/dbConnection.js";

export const esDuenoDelRecurso = (tabla, idCampo) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const [rows] = await db.execute(
        `
        SELECT r.*, n.usuario_id
        FROM ${tabla} r
        INNER JOIN negocios n ON r.negocio_id = n.id_negocio
        WHERE r.${idCampo} = ?
        `,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "Recurso no encontrado",
        });
      }

      if (rows[0].usuario_id !== usuarioId) {
        return res.status(403).json({
          ok: false,
          msg: "No tienes permiso para modificar este recurso",
        });
      }

      // 🔑 AQUÍ ESTÁ LA CLAVE
      req.producto = rows[0];

      next();
    } catch (error) {
      console.error("Error en esDuenoDelRecurso:", error);
      return res.status(500).json({
        ok: false,
        msg: "Error de autorización",
      });
    }
  };
};
