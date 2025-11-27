import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/userRegisterModel.js";

export const registerUser = async (req, res) => {
  try {
    const { nombre, apellidos, rol_id, correo, password } = req.body;

    // 1. Validaciones básicas
    if (!nombre || !rol_id || !correo || !password) {
      return res.status(400).json({
        message: "Los campos nombre, rol, correo y contraseña son obligatorios",
      });
    }

    // 2. Verificar si el usuario ya existe
    const userFound = await findUserByEmail(correo);
    if (userFound) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(password, salt);

    // 4. Guardar usuario en BD
    const newUser = await createUser({
      nombre,
      apellidos: apellidos || null,
      correo,
      contrasena_hash,
      rol_id,
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id_usuario,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol_id: newUser.rol_id,
      },
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
