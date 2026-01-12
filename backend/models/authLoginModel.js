import { db } from "../config/dbConnection.js";

// Buscar usuario por correo
export const findUserForLogin = async (correo) => {
  try {
    const correoSan = String(correo).trim().toLowerCase();

    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
      [correoSan]
    );
    return results[0] || null;
  } catch (err) {
    console.error("Error en findUserForLogin:", err);
    throw err;
  }
};

// Actualizar intentos fallidos
export const updateFailedAttempts = async (idUsuario, intentos) => {
  try {
    await db.query(
      "UPDATE usuarios SET intentos_fallidos = ? WHERE id_usuario = ?",
      [intentos, idUsuario]
    );
  } catch (err) {
    console.error("Error en updateFailedAttempts:", err);
    throw err;
  }
};

// Bloquear cuenta por 3 horas
export const blockAccount = async (idUsuario) => {
  try {
    await db.query(
      `UPDATE usuarios 
         SET cuenta_bloqueada_hasta = DATE_ADD(NOW(), INTERVAL 3 HOUR) 
       WHERE id_usuario = ?`,
      [idUsuario]
    );
  } catch (err) {
    console.error("Error en blockAccount:", err);
    throw err;
  }
};

// Reset de intentos y eliminación del bloqueo
export const resetLoginState = async (idUsuario) => {
  try {
    await db.query(
      `UPDATE usuarios 
         SET intentos_fallidos = 0, cuenta_bloqueada_hasta = NULL 
       WHERE id_usuario = ?`,
      [idUsuario]
    );
  } catch (err) {
    console.error("Error en resetLoginState:", err);
    throw err;
  }
};

// Registrar último login
export const updateLastLogin = async (idUsuario) => {
  try {
    await db.query(
      "UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = ?",
      [idUsuario]
    );
  } catch (err) {
    console.error("Error en updateLastLogin:", err);
    throw err;
  }
};

// Obtener rol de usuario
export const obtenerRolUsuario = async (usuario_id) => {
  const [rows] = await db.execute(
    "SELECT rol_id FROM usuarios WHERE id_usuario = ?",
    [usuario_id]
  );
  return rows[0]; // puede ser undefined
};

// Registrar rol de usuario
export const registrarRolUsuario = async (usuario_id, rol_id) => {
  try {
    const [result] = await db.execute(
      `UPDATE usuarios 
       SET rol_id = ? 
       WHERE id_usuario = ?`,
      [rol_id, usuario_id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en registrarRolUsuario:", error);
    throw error;
  }
};