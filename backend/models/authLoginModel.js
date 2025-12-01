import { db } from "../config/dbConnection.js";

// Buscar usuario por correo
export const findUserForLogin = async (correo) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );
    return results[0] || null;
  } catch (err) {
    throw err;
  }
};

// Actualizar intentos fallidos
export const updateFailedAttempts = async (idUsuario, intentos) => {
  await db.query(
    "UPDATE usuarios SET intentos_fallidos = ? WHERE id_usuario = ?",
    [intentos, idUsuario]
  );
};

// Bloquear cuenta por 3 horas
export const blockAccount = async (idUsuario) => {
  await db.query(
    `UPDATE usuarios 
       SET cuenta_bloqueada_hasta = DATE_ADD(NOW(), INTERVAL 3 HOUR) 
     WHERE id_usuario = ?`,
    [idUsuario]
  );
};

// Reset de intentos y eliminación del bloqueo
export const resetLoginState = async (idUsuario) => {
  await db.query(
    `UPDATE usuarios 
       SET intentos_fallidos = 0, cuenta_bloqueada_hasta = NULL 
     WHERE id_usuario = ?`,
    [idUsuario]
  );
};

// Registrar último login
export const updateLastLogin = async (idUsuario) => {
  await db.query(
    "UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = ?",
    [idUsuario]
  );
};