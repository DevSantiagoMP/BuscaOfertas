import { db } from "../config/dbConnection.js";

// Buscar usuario por correo
export const findUserByEmail = async (correo) => {
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

// Crear usuario nuevo
export const createUser = async (userData) => {
  try {
    const [results] = await db.query(
      `INSERT INTO usuarios 
      (nombre, apellidos, correo, contrasena_hash, rol_id, 
       token_verificacion, token_verificacion_expira, 
       email_verificado, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [
        userData.nombre,
        userData.apellidos,
        userData.correo,
        userData.contrasena_hash,
        userData.rol_id,
        userData.token_verificacion,
        new Date(userData.token_verificacion_expira),
      ]
    );

    return {
      id_usuario: results.insertId,
      ...userData,
    };
  } catch (err) {
    console.error("❌ Error en INSERT MySQL:", err.sqlMessage);
    console.error("📌 SQL:", err.sql);
    throw err;
  }
};

// Verificar usuario por token
export const verifyUserEmail = async (token) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM usuarios 
       WHERE token_verificacion = ? LIMIT 1`,
      [token]
    );

    const user = rows[0];
    if (!user) return false;

    // Verificar expiración (fecha actual > fecha guardada)
    const expired =
      Date.now() > new Date(user.token_verificacion_expira).getTime();
    if (expired) return false;

    // Actualizar usuario como verificado
    await db.query(
      `UPDATE usuarios 
       SET email_verificado = 1, 
           token_verificacion = NULL, 
           token_verificacion_expira = NULL,
           fecha_actualizacion = NOW()
       WHERE id_usuario = ?`,
      [user.id_usuario]
    );

    return true;
  } catch (err) {
    throw err;
  }
};
