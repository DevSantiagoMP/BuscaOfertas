import { db } from "../config/dbConnection.js";

// Buscar usuario por google_uid
export const findUserByGoogleId = async (googleUid) => {
  const [rows] = await db.execute(
    "SELECT * FROM usuarios WHERE google_uid = ?",
    [googleUid]
  );
  return rows[0];
};

// Buscar usuario por correo
export const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM usuarios WHERE correo = ?",
    [email]
  );
  return rows[0];
};

// Crear usuario o asociar Google UID
export const createUserWithGoogle = async (data) => {
  // Si el usuario ya existe por email (login normal)
  if (data.id_usuario) {
    await db.execute(
      "UPDATE usuarios SET google_uid = ? WHERE id_usuario = ?",
      [data.google_uid, data.id_usuario]
    );

    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [data.id_usuario]
    );
    return rows[0];
  }

  // Crear usuario nuevo con Google
  await db.execute(
    `INSERT INTO usuarios 
      (nombre, apellidos, correo, google_uid, email_verificado, rol_id) 
     VALUES (?, ?, ?, ?, 1, 1)`,
    [
      data.nombre,
      data.apellidos || "",        // Opcional
      data.correo,
      data.google_uid
    ]
  );

  const [rows] = await db.execute(
    "SELECT * FROM usuarios WHERE google_uid = ?",
    [data.google_uid]
  );

  return rows[0];
};
