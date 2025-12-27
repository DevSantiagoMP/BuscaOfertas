import { db } from "../config/dbConnection.js";

/* =====================================================
   UTILIDAD: límites por plan (centralizado)
===================================================== */
const LIMITES_POR_PLAN = {
  1: 10,        // gratuito
  2: Infinity,  // mensual
  3: Infinity,  // anual
  4: Infinity,  // fundadores
  5: 30,        // primeros pasos
};

const obtenerLimitePorPlan = (planId) =>
  LIMITES_POR_PLAN[planId] ?? 0;

/* =====================================================
   CREAR PRODUCTO
===================================================== */
export const crearProducto = async (producto) => {
  try {
    const {
      negocio_id,
      nombre,
      descripcion,
      precio,
      foto_url,
      foto_public_id,
    } = producto;

    // 1. Obtener plan del negocio
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const planId = negocioRows[0].plan_id;
    const limiteProductos = obtenerLimitePorPlan(planId);

    // 2. Contar productos actuales
    const [productosRows] = await db.execute(
      "SELECT COUNT(*) AS total FROM productos WHERE negocio_id = ?",
      [negocio_id]
    );

    const totalProductos = productosRows[0].total;

    // 3. Validar límite
    if (totalProductos >= limiteProductos) {
      throw new Error(
        `Este plan solo permite registrar ${limiteProductos} productos. Si deseas registrar mas renueva tu plan.`
      );
    }

    // 4. Insertar producto
    const [result] = await db.execute(
      `
      INSERT INTO productos (
        negocio_id,
        nombre,
        descripcion,
        precio,
        foto_url,
        foto_public_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        negocio_id,
        nombre,
        descripcion ?? null,
        precio,
        foto_url ?? null,
        foto_public_id ?? null,
      ]
    );

    // 5. Retornar info
    return {
      insertResult: result,
      productos_actuales: totalProductos + 1,
      limite: limiteProductos,
      productos_restantes:
        limiteProductos === Infinity
          ? "ilimitado"
          : limiteProductos - (totalProductos + 1),
    };
  } catch (error) {
    console.error("Error en crearProducto:", error);
    throw error;
  }
};

/* =====================================================
   ACTUALIZAR PRODUCTO (SIN cambiar negocio)
===================================================== */
export const actualizarProducto = async (id_producto, datos) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      foto_url,
      foto_public_id,
    } = datos;

    const [result] = await db.execute(
      `
      UPDATE productos
      SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        foto_url = ?,
        foto_public_id = ?
      WHERE id_producto = ?
      `,
      [
        nombre,
        descripcion ?? null,
        precio,
        foto_url ?? null,
        foto_public_id ?? null,
        id_producto,
      ]
    );

    return result;
  } catch (error) {
    console.error("Error en actualizarProducto:", error);
    throw error;
  }
};

/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */
export const eliminarProducto = async (id_producto) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM productos WHERE id_producto = ?",
      [id_producto]
    );
    return result;
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    throw error;
  }
};

/* =====================================================
   OBTENER PRODUCTOS (prioridad por plan)
===================================================== */
export const obtenerProductos = async () => {
  try {
    const query = `
      WITH productos_ranked AS (
        SELECT
          p.*,
          n.nombre AS nombre_negocio,
          n.plan_id,
          ROW_NUMBER() OVER (
            PARTITION BY p.negocio_id
            ORDER BY p.id_producto DESC
          ) AS rn
        FROM productos p
        INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      )
      SELECT *
      FROM productos_ranked
      ORDER BY
        CASE
          WHEN plan_id IN (2, 3) THEN 1   -- mensual y anual
          WHEN plan_id = 4 THEN 2         -- fundadores
          WHEN plan_id = 5 THEN 3         -- primeros pasos
          WHEN plan_id = 1 THEN 4         -- gratuito
          ELSE 5
        END,
        rn,
        negocio_id,
        id_producto DESC;
    `;

    const [rows] = await db.execute(query);

    // Agrupar productos por negocio
    const porNegocio = rows.reduce((acc, prod) => {
      if (!acc[prod.negocio_id]) acc[prod.negocio_id] = [];
      acc[prod.negocio_id].push(prod);
      return acc;
    }, {});

    // Aplicar límites por plan
    return Object.values(porNegocio).flatMap((lista) => {
      const limite = obtenerLimitePorPlan(lista[0].plan_id);
      return limite === Infinity ? lista : lista.slice(0, limite);
    });

  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    throw error;
  }
};

/* =====================================================
   OBTENER PRODUCTOS FILTRADOS
===================================================== */
export const obtenerProductosFiltrados = async ({
  nombre = null,
  categoria_id = null,
  orden = null,
}) => {
  try {
    let query = `
      SELECT p.*, n.nombre AS nombre_negocio, n.categoria_id
      FROM productos p
      INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      WHERE 1 = 1
    `;

    const params = [];

    if (nombre) {
      query += " AND p.nombre LIKE ?";
      params.push(`%${nombre}%`);
    }

    if (categoria_id) {
      query += " AND n.categoria_id = ?";
      params.push(categoria_id);
    }

    if (orden) {
      query += ` ORDER BY p.precio ${orden === "desc" ? "DESC" : "ASC"}`;
    }

    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error en obtenerProductosFiltrados:", error);
    throw error;
  }
};

/* =====================================================
   OBTENER PRODUCTOS POR NEGOCIO
===================================================== */
export const obtenerProductosPorNegocio = async (negocio_id) => {
  try {
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const limite = obtenerLimitePorPlan(negocioRows[0].plan_id);

    let query =
      "SELECT * FROM productos WHERE negocio_id = ? ORDER BY id_producto ASC";

    if (limite !== Infinity) {
      query += ` LIMIT ${limite}`;
    }

    const [rows] = await db.execute(query, [negocio_id]);

    return {
      productos: rows,
      limite_aplicado: limite === Infinity ? "ilimitado" : limite,
    };
  } catch (error) {
    console.error("Error en obtenerProductosPorNegocio:", error);
    throw error;
  }
};

export const obtenerProductosPorNegocioId = async (negocioId) => {
  const [rows] = await db.query(
    `
    SELECT
      id_producto,
      negocio_id,
      nombre,
      descripcion,
      precio,
      foto_url,
      foto_public_id
    FROM productos
    WHERE negocio_id = ?
    `,
    [negocioId]
  );

  return rows;
};
