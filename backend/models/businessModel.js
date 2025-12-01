import { db } from "../config/dbConnection.js";

export const registrarNegocio = async (negocioData) => {
  const {
    usuario_id,
    foto_url,
    nombre,
    descripcion,
    ciudad,
    direccion,
    telefono,
    categoria_id,
    plan_id,
  } = negocioData;

  const [result] = await db.query(
    `INSERT INTO negocios 
      (usuario_id, foto_url, nombre, descripcion, ciudad, direccion, telefono, categoria_id, plan_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      foto_url,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      plan_id,
    ]
  );

  return result.insertId; // devolvemos el id del nuevo negocio
};

// Actualizar negocio por id
export const actualizarNegocio = async (id_negocio, datos) => {
  const {
    foto_url,
    nombre,
    descripcion,
    ciudad,
    direccion,
    telefono,
    categoria_id,
  } = datos;

  const query = `
    UPDATE negocios
    SET 
      foto_url = ?,
      nombre = ?,
      descripcion = ?,
      ciudad = ?,
      direccion = ?,
      telefono = ?,
      categoria_id = ?
    WHERE id_negocio = ?
  `;

  const values = [
    foto_url,
    nombre,
    descripcion,
    ciudad,
    direccion,
    telefono,
    categoria_id,
    id_negocio
  ];

  const [result] = await db.query(query, values);
  return result;
};

// Actualizar plan de un negocio
export const actualizarPlanNegocio = async (id_negocio, plan_id) => {
  const query = `
    UPDATE negocios
    SET plan_id = ?
    WHERE id_negocio = ?
  `;

  const [result] = await db.query(query, [plan_id, id_negocio]);
  return result;
};

export const obtenerTodosLosNegocios = async () => {
  const [rows] = await db.query(`
    SELECT * FROM negocios
    ORDER BY 
      CASE 
        WHEN plan_id = 2 THEN 1
        WHEN plan_id = 3 THEN 2
        WHEN plan_id = 1 THEN 3
        ELSE 4  
      END
  `);
  return rows;
};


export const obtenerNegociosPorCategoria = async (categoriaId) => {
  const [rows] = await db.query(
    `SELECT * FROM negocios WHERE categoria_id = ?`,
    [categoriaId]
  );
  return rows;
};
