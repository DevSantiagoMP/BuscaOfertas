import { db } from "../config/dbConnection.js";

// Buscar usuario por correo
export const buscarPorCorreo = async (correo) => {
    const [rows] = await db.query(
        "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
        [correo]
    );
    return rows[0];
};

// Guardar token de recuperación
export const guardarTokenRecuperacion = async (idUsuario, token, expira) => {
    await db.query(
        `UPDATE usuarios 
         SET token_recuperacion = ?, token_recuperacion_expira = ?, fecha_actualizacion = NOW()
         WHERE id_usuario = ?`,
        [token, expira, idUsuario]
    );
};

// Buscar por token de recuperación
export const buscarPorTokenRecuperacion = async (token) => {
    const [rows] = await db.query(
        `SELECT * FROM usuarios 
         WHERE token_recuperacion = ? 
         AND token_recuperacion_expira > NOW()
         LIMIT 1`,
        [token]
    );
    return rows[0];
};

// Actualizar contraseña
export const actualizarContrasena = async (idUsuario, hash) => {
    await db.query(
        `UPDATE usuarios 
         SET contrasena_hash = ?, 
             token_recuperacion = NULL, 
             token_recuperacion_expira = NULL, 
             fecha_actualizacion = NOW()
         WHERE id_usuario = ?`,
        [hash, idUsuario]
    );
};
