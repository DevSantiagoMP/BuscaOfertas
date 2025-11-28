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
