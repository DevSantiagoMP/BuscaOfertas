import { db } from "../config/dbConnection.js";

// Crear una ofertas con limite segun plan
export const crearOferta = async (oferta) => {
  try {
    const {
      negocio_id,
      nombre,
      descripcion,
      precio_oferta,
      foto_url,
      foto_public_id,
    } = oferta;

    // Obtener plan del negocio
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const planId = negocioRows[0].plan_id;

    // Límites por plan
    const limites = {
      1: 10, // gratuito
      2: Infinity, // mensual
      3: Infinity, // anual
      4: Infinity, // fundadores
      5: 30, // primeros pasos
    };

    const limiteOfertas = limites[planId];

    // Contar ofertas actuales
    const [ofertasRows] = await db.execute(
      "SELECT COUNT(*) AS total FROM ofertas WHERE negocio_id = ?",
      [negocio_id]
    );

    const totalOfertas = ofertasRows[0].total;

    // Validar límite
    if (totalOfertas >= limiteOfertas) {
      throw new Error(
        `Este plan solo permite registrar ${limiteOfertas} ofertas. Si deseas registrar mas renueva tu plan.`
      );
    }

    // Insertar oferta
    const query = `
      INSERT INTO ofertas 
        (negocio_id, nombre, descripcion, precio_oferta, foto_url, foto_public_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      negocio_id,
      nombre,
      descripcion,
      precio_oferta,
      foto_url,
      foto_public_id,
    ]);

    // Ofertas restantes
    const ofertas_restantes =
      limiteOfertas === Infinity
        ? "ilimitado"
        : limiteOfertas - (totalOfertas + 1);

    // Respuesta
    return {
      insertResult: result,
      ofertas_actuales: totalOfertas + 1,
      limite: limiteOfertas,
      ofertas_restantes,
    };
  } catch (error) {
    console.error("Error en crearOferta:", error);
    throw error;
  }
};

export const actualizarOferta = async (id_oferta, datos) => {
  try {
    const {
      nombre,
      descripcion,
      precio_oferta,
      foto_url = null,
      foto_public_id = null,
    } = datos;

    const query = `
      UPDATE ofertas
      SET
        nombre = ?,
        descripcion = ?,
        precio_oferta = ?,
        foto_url = ?,
        foto_public_id = ?
      WHERE id_oferta = ?
    `;

    const [result] = await db.execute(query, [
      nombre,
      descripcion ?? null,
      precio_oferta,
      foto_url,
      foto_public_id,
      id_oferta,
    ]);

    return result;
  } catch (error) {
    console.error("Error en actualizarOferta:", error);
    throw error;
  }
};

// Eliminar oferta por ID
export const eliminarOferta = async (id_oferta) => {
  try {
    const query = `DELETE FROM ofertas WHERE id_oferta = ?`;
    const [result] = await db.execute(query, [id_oferta]);
    return result;
  } catch (error) {
    console.error("Error en eliminarOferta:", error);
    throw error;
  }
};

// Obtener todas las ofertas (intercaladas por negocio)
export const obtenerOfertas = async () => {
  try {
    const query = `
      WITH ofertas_ranked AS (
        SELECT
          o.*,
          n.nombre AS nombre_negocio,
          n.plan_id,
          ROW_NUMBER() OVER (
            PARTITION BY o.negocio_id
            ORDER BY o.id_oferta DESC
          ) AS rn
        FROM ofertas o
        INNER JOIN negocios n ON o.negocio_id = n.id_negocio
      )
      SELECT *
      FROM ofertas_ranked
      ORDER BY
        CASE
          WHEN plan_id IN (2, 3) THEN 1
          WHEN plan_id = 4 THEN 2
          WHEN plan_id = 5 THEN 3
          WHEN plan_id = 1 THEN 4
          ELSE 5
        END,
        rn,
        negocio_id,
        id_oferta DESC;
    `;

    const [rows] = await db.execute(query);

    const porNegocio = rows.reduce((acc, oferta) => {
      if (!acc[oferta.negocio_id]) acc[oferta.negocio_id] = [];
      acc[oferta.negocio_id].push(oferta);
      return acc;
    }, {});

    const ofertasFiltradas = Object.values(porNegocio).flatMap((lista) => {
      const plan = lista[0].plan_id;

      const limit =
        plan === 1 ? 10 :
        plan === 5 ? 30 :
        Infinity;

      return lista.slice(0, limit);
    });

    return ofertasFiltradas;
  } catch (error) {
    console.error("Error en obtenerOfertas:", error);
    throw error;
  }
};

// Obtener ofertas por filtro
export const obtenerOfertasFiltradas = async ({
  nombre = null,
  categoria_id = null,
  orden = null,
}) => {
  try {
    let query = `
      SELECT o.*, n.nombre AS nombre_negocio, n.categoria_id
      FROM ofertas o
      INNER JOIN negocios n ON o.negocio_id = n.id_negocio
      WHERE 1 = 1
    `;

    const params = [];

    // FILTRO POR NOMBRE (coincidencia parcial)
    if (nombre) {
      query += ` AND o.nombre LIKE ?`;
      params.push(`%${nombre}%`);
    }

    // FILTRO POR CATEGORÍA
    if (categoria_id) {
      query += ` AND n.categoria_id = ?`;
      params.push(categoria_id);
    }

    // FILTRO POR PRECIO (ASC / DESC)
    if (orden) {
      const orderBy = orden === "desc" ? "DESC" : "ASC";
      query += ` ORDER BY o.precio_oferta ${orderBy}`;
    }

    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error en obtenerOfertasFiltradas:", error);
    throw error;
  }
};

// Obtener ofertas de un negocio con límite según plan
export const obtenerOfertasPorNegocio = async (negocio_id) => {
  try {
    // 1. Obtener el plan del negocio
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const planId = negocioRows[0].plan_id;

    // 2. Definir límites por plan (igual que productos)
    const limites = {
      1: 10, // gratuito
      2: Infinity, // mensual
      3: Infinity, // anual
      4: Infinity, // fundadores
      5: 30, // primeros pasos
    };

    const limite = limites[planId];

    let query =
      "SELECT * FROM ofertas WHERE negocio_id = ? ORDER BY id_oferta ASC";

    // 3. Aplicar límite si corresponde
    if (limite !== Infinity) {
      query += ` LIMIT ${limite}`;
    }

    // 4. Ejecutar consulta
    const [rows] = await db.query(query, [negocio_id]);

    // 5. Retornar ofertas y el límite aplicado
    return {
      ok: true,
      ofertas: rows,
      limite_aplicado: limite === Infinity ? "ilimitado" : limite,
    };
  } catch (error) {
    console.error("Error en obtenerOfertasPorNegocio:", error);
    throw error;
  }
};

export const obtenerOfertasPorNegocioId = async (negocioId) => {
  const [rows] = await db.query(
    `
    SELECT
      id_oferta,
      negocio_id,
      nombre,
      descripcion,
      precio_oferta,
      foto_url,
      foto_public_id
    FROM ofertas
    WHERE negocio_id = ?
    `,
    [negocioId]
  );

  return rows;
};

