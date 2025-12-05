import { db } from "../config/dbConnection.js";

// Crear una ofertas con limite segun plan 
export const crearOferta = async (oferta) => {
  try {
    const { negocio_id, nombre, descripcion, precio_oferta, foto_url } = oferta;

    // 1. Obtener el plan del negocio
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const planId = negocioRows[0].plan_id;

    // 2. Definir límites por plan (MISMO que productos)
    const limites = {
      1: 10,         // gratuito
      2: Infinity,   // mensual
      3: Infinity,   // anual
      4: 30,         // fundadores
      5: 30,         // primeros pasos
    };

    const limiteOfertas = limites[planId];

    // 3. Contar ofertas existentes
    const [ofertasRows] = await db.execute(
      "SELECT COUNT(*) AS total FROM ofertas WHERE negocio_id = ?",
      [negocio_id]
    );

    const totalOfertas = ofertasRows[0].total;

    // 4. Validar límite
    if (totalOfertas >= limiteOfertas) {
      throw new Error(
        `Este plan solo permite registrar ${limiteOfertas} ofertas`
      );
    }

    // 5. Insertar oferta
    const query = `
      INSERT INTO ofertas (negocio_id, nombre, descripcion, precio_oferta, foto_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      negocio_id,
      nombre,
      descripcion,
      precio_oferta,
      foto_url,
    ]);

    // 6. Calcular ofertas restantes
    const ofertas_restantes =
      limiteOfertas === Infinity
        ? "ilimitado"
        : limiteOfertas - (totalOfertas + 1);

    // 7. Retornar info completa
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

// Actualizar oferta por ID
export const actualizarOferta = async (id_oferta, datos) => {
  try {
    const { negocio_id, nombre, descripcion, precio_oferta, foto_url } = datos;

    const query = `
      UPDATE ofertas
      SET negocio_id = ?, nombre = ?, descripcion = ?, precio_oferta = ?, foto_url = ?
      WHERE id_oferta = ?
    `;

    const [result] = await db.execute(query, [
      negocio_id,
      nombre,
      descripcion,
      precio_oferta,
      foto_url,
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

// Obtener todas las ofertas 
export const obtenerOfertas = async () => {
  try {
    const query = `
      SELECT 
        o.*, 
        n.nombre AS nombre_negocio,
        n.plan_id
      FROM ofertas o
      INNER JOIN negocios n ON o.negocio_id = n.id_negocio
      ORDER BY 
        CASE n.plan_id
          WHEN 2 THEN 1   -- mensual
          WHEN 3 THEN 2   -- anual
          WHEN 4 THEN 3   -- fundadores
          WHEN 5 THEN 4   -- primeros pasos
          WHEN 1 THEN 5   -- gratuito
          ELSE 6
        END,
        o.id_oferta DESC;
    `;

    const [rows] = await db.execute(query);

    // Agrupar ofertas por negocio
    const porNegocio = rows.reduce((acc, oferta) => {
      if (!acc[oferta.negocio_id]) acc[oferta.negocio_id] = [];
      acc[oferta.negocio_id].push(oferta);
      return acc;
    }, {});

    // Aplicar límites según el plan
    const ofertasFiltradas = Object.values(porNegocio)
      .flatMap(lista => {
        const plan = lista[0].plan_id;

        const limit =
          plan === 1 ? 10 :        // gratuito
          plan === 5 ? 30 :        // primeros pasos
          Infinity;                // mensual, anual, fundadores

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
      1: 10,        // gratuito
      2: Infinity,  // mensual
      3: Infinity,  // anual
      4: Infinity,        // fundadores
      5: 30,        // primeros pasos
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

