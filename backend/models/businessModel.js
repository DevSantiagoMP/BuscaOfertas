import { db } from "../config/dbConnection.js";

export const registrarNegocio = async (negocioData) => {
  const {
    usuario_id,
    foto_url,
    foto_public_id,
    nombre,
    descripcion,
    ciudad,
    direccion,
    telefono,
    categoria_id,
    plan_id,
    plan_expira,
  } = negocioData;

  const [result] = await db.query(
    `INSERT INTO negocios 
      (
        usuario_id,
        foto_url,
        foto_public_id,
        nombre,
        descripcion,
        ciudad,
        direccion,
        telefono,
        categoria_id,
        plan_id,
        plan_expira
      ) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      foto_url,
      foto_public_id,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      plan_id,
      plan_expira,
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

export const actualizarNegocio = async (id_negocio, datos) => {
  const {
    foto_url,
    foto_public_id,
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
      foto_public_id = ?,
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
    foto_public_id,
    nombre,
    descripcion,
    ciudad,
    direccion,
    telefono,
    categoria_id,
    id_negocio,
  ];

  const [result] = await db.query(query, values);
  return result;
};

export const actualizarPlanNegocio = async (id_negocio, plan_id) => {
  let updateFecha = "";
  
  switch (parseInt(plan_id)) {
    case 2: // mensual
      updateFecha = `,
        plan_expira = DATE_ADD(
          COALESCE(
            IF(plan_expira > NOW(), plan_expira, NOW()),
            NOW()
          ),
          INTERVAL 1 MONTH
        )`;
      break;

    case 3: // anual
      updateFecha = `,
        plan_expira = DATE_ADD(
          COALESCE(
            IF(plan_expira > NOW(), plan_expira, NOW()),
            NOW()
          ),
          INTERVAL 1 YEAR
        )`;
      break;

    default:
      updateFecha = ""; // NO modifica plan_expira si no es 2 o 3
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
    SELECT * 
    FROM negocios
    ORDER BY 
      CASE 
        WHEN plan_id IN (2, 3) THEN 1   -- mensual y anual
        WHEN plan_id = 4 THEN 2         -- fundadores
        WHEN plan_id = 5 THEN 3         -- primeros pasos
        WHEN plan_id = 1 THEN 4         -- gratuito
        ELSE 5
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

// Obtener negocio del usuario autenticado
export const findBusinessByUserId = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      id_negocio,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      foto_url,
      foto_public_id,
      plan_expira
    FROM negocios
    WHERE usuario_id = ?
    LIMIT 1
    `,
    [userId]
  );

  let negocio = rows[0];
  if (!negocio) return null;

  // ¿Tiene fecha de expiración?
  if (negocio.plan_expira) {
    const ahora = new Date();
    const expira = new Date(negocio.plan_expira);

    if (ahora > expira) {
      // Expiró → volver al plan gratuito
      await actualizarPlanAFree(negocio.id_negocio);

      // Reconsultar el negocio para obtener datos actualizados
      const [newRows] = await db.query(
        `
        SELECT
          id_negocio,
          nombre,
          descripcion,
          ciudad,
          direccion,
          telefono,
          categoria_id,
          foto_url,
          foto_public_id,
          plan_expira
        FROM negocios
        WHERE id_negocio = ?
        `,
        [negocio.id_negocio]
      );

      negocio = newRows[0];
    }
  }

  return negocio;
};

export const obtenerNegocioPorId = async (id_negocio) => {
  const [rows] = await db.query(
    `
    SELECT
      id_negocio,
      nombre,
      descripcion,
      ciudad,
      direccion,
      telefono,
      categoria_id,
      foto_url,
      foto_public_id
    FROM negocios
    WHERE id_negocio = ?
    LIMIT 1
    `,
    [id_negocio]
  );

  return rows[0] || null;
};
