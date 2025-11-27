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
      (nombre, apellidos, correo, contrasena_hash, rol_id, email_verificado, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [
        userData.nombre,
        userData.apellidos,
        userData.correo,
        userData.contrasena_hash,
        userData.rol_id,
      ]
    );

    return {
      id_usuario: results.insertId,
      ...userData,
    };
  } catch (err) {
    throw err;
  }
};
