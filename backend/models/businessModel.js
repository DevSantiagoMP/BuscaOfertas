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
    plan_expira
  } = negocioData;

  const [result] = await db.query(
    `INSERT INTO negocios 
      (usuario_id, foto_url, nombre, descripcion, ciudad, direccion, telefono, categoria_id, plan_id, plan_expira) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      plan_expira
    ]
  );

  return result.insertId;
};

export const actualizarPlanAFree = async (id_negocio) => {
  await db.query(
    `UPDATE negocios
     SET plan_id = 1, plan_expira = NULL
     WHERE id_negocio = ?`,
    [id_negocio]
  );
};

export const obtenerNegocioPorId = async (id_negocio) => {
  const [rows] = await db.query(
    `SELECT * FROM negocios WHERE id_negocio = ?`,
    [id_negocio]
  );

  let negocio = rows[0];
  if (!negocio) return null;

  // ¿Tiene fecha de expiración?
  if (negocio.plan_expira) {
    const ahora = new Date();
    const expira = new Date(negocio.plan_expira);

    if (ahora > expira) {
      // Expiró → volver al plan gratuito
      await actualizarPlanAFree(id_negocio);

      // Volvemos a consultar el negocio para asegurar datos actualizados
      const [newRows] = await db.query(
        `SELECT * FROM negocios WHERE id_negocio = ?`,
        [id_negocio]
      );
      negocio = newRows[0];
    }
  }

  return negocio;
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

export const actualizarPlanNegocio = async (id_negocio, plan_id) => {

  let updateFecha = "";
  
  switch (parseInt(plan_id)) {
    case 2: // mensual
      updateFecha = ", plan_expira = DATE_ADD(NOW(), INTERVAL 1 MONTH)";
      break;

    case 3: // anual
      updateFecha = ", plan_expira = DATE_ADD(NOW(), INTERVAL 1 YEAR)";
      break;

    default:
      updateFecha = ""; // no se modifica plan_expira
  }

  const query = `
    UPDATE negocios
    SET plan_id = ?
    ${updateFecha}
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
        WHEN plan_id = 2 THEN 1   -- mensual
        WHEN plan_id = 3 THEN 2   -- anual
        WHEN plan_id = 4 THEN 3   -- fundadores
        WHEN plan_id = 5 THEN 4   -- primeros pasos
        WHEN plan_id = 1 THEN 5   -- gratuito
        ELSE 6                    -- cualquier otro plan
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
