import { db } from "../config/dbConnection.js";

// Crear productos con limite segun plan
export const crearProducto = async (producto) => {
  try {
    const { negocio_id, nombre, descripcion, precio, foto_url } = producto;

    // 1. Obtener el plan del negocio
    const [negocioRows] = await db.execute(
      "SELECT plan_id FROM negocios WHERE id_negocio = ?",
      [negocio_id]
    );

    if (negocioRows.length === 0) {
      throw new Error("El negocio no existe");
    }

    const planId = negocioRows[0].plan_id;

    // 2. Definir límites por plan
    const limites = {
      1: 10,  // gratuito
      2: Infinity, // mensual
      3: Infinity, // anual
      4: Infinity, // fundadores
      5: 30, // primeros pasos
    };

    const limiteProductos = limites[planId];

    // 3. Contar productos existentes
    const [productosRows] = await db.execute(
      "SELECT COUNT(*) AS total FROM productos WHERE negocio_id = ?",
      [negocio_id]
    );

    const totalProductos = productosRows[0].total;

    // 4. Validar límite
    if (totalProductos >= limiteProductos) {
      throw new Error(
        `Este plan solo permite registrar ${limiteProductos} productos`
      );
    }

    // 5. Insertar producto
    const query = `
      INSERT INTO productos (negocio_id, nombre, descripcion, precio, foto_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      negocio_id,
      nombre,
      descripcion,
      precio,
      foto_url,
    ]);

    // 6. Calcular productos restantes
    let productos_restantes =
      limiteProductos === Infinity
        ? "ilimitado"
        : limiteProductos - (totalProductos + 1);

    // 7. Retornar toda la info
    return {
      insertResult: result,
      productos_actuales: totalProductos + 1,
      limite: limiteProductos,
      productos_restantes,
    };

  } catch (error) {
    console.error("Error en crearProducto:", error);
    throw error;
  }
};

// Actualizar producto por ID
export const actualizarProducto = async (id_producto, datos) => {
  try {
    const { negocio_id, nombre, descripcion, precio, foto_url } = datos;

    const query = `
      UPDATE productos
      SET negocio_id = ?, nombre = ?, descripcion = ?, precio = ?, foto_url = ?
      WHERE id_producto = ?
    `;

    const [result] = await db.execute(query, [
      negocio_id,
      nombre,
      descripcion,
      precio,
      foto_url,
      id_producto,
    ]);

    return result;
  } catch (error) {
    console.error("Error en actualizarProducto:", error);
    throw error;
  }
};

// Eliminar producto por ID
export const eliminarProducto = async (id_producto) => {
  try {
    const query = `DELETE FROM productos WHERE id_producto = ?`;
    const [result] = await db.execute(query, [id_producto]);
    return result;
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    throw error;
  }
};

// Obtener todos los productos con prioridad por plan
export const obtenerProductos = async () => {
  try {
    const query = `
      SELECT 
        p.*, 
        n.nombre AS nombre_negocio,
        n.plan_id
      FROM productos p
      INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      ORDER BY 
        CASE n.plan_id
          WHEN 2 THEN 1   -- mensual
          WHEN 3 THEN 2   -- anual
          WHEN 4 THEN 3   -- fundadores
          WHEN 5 THEN 4   -- primeros pasos
          WHEN 1 THEN 5   -- gratuito
          ELSE 6
        END,
        p.id_producto DESC;
    `;

    const [rows] = await db.execute(query);

    // agrupar productos por negocio
    const porNegocio = rows.reduce((acc, prod) => {
      if (!acc[prod.negocio_id]) acc[prod.negocio_id] = [];
      acc[prod.negocio_id].push(prod);
      return acc;
    }, {});

    // aplicar límites por plan
    const productosFiltrados = Object.values(porNegocio)
      .flatMap(lista => {
        const plan = lista[0].plan_id;

        const limit =
          plan === 1 ? 10 :         // gratuito
          plan === 5 ? 30 :         // primeros pasos
          Infinity;                 // mensual, anual, fundadores

        return lista.slice(0, limit);
      });

    return productosFiltrados;

  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    throw error;
  }
};

// Obtener productos por filtro
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

    // FILTRO POR NOMBRE (LIKE, búsqueda parcial)
    if (nombre) {
      query += ` AND p.nombre LIKE ?`;
      params.push(`%${nombre}%`);
    }

    // FILTRO POR CATEGORÍA
    if (categoria_id) {
      query += ` AND n.categoria_id = ?`;
      params.push(categoria_id);
    }

    // ORDENAR POR PRECIO
    if (orden) {
      const orderBy = orden === "desc" ? "DESC" : "ASC";
      query += ` ORDER BY p.precio ${orderBy}`;
    }

    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error en obtenerProductosFiltrados:", error);
    throw error;
  }
};

// Obtener productos de un negocio con límite según plan
export const obtenerProductosPorNegocio = async (negocio_id) => {
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

    // 2. Definir límites por plan
    const limites = {
      1: 10,        // gratuito
      2: Infinity,  // mensual
      3: Infinity,  // anual
      4: Infinity,        // fundadores
      5: 30,        // primeros pasos
    };

    const limite = limites[planId];

    let query =
      "SELECT * FROM productos WHERE negocio_id = ? ORDER BY id_producto ASC";

    // 3. Si el plan tiene límite, aplicar LIMIT en SQL
    if (limite !== Infinity) {
      query += ` LIMIT ${limite}`;
    }

    // 4. Ejecutar consulta
    const [rows] = await db.query(query, [negocio_id]);

    // 5. Retornar productos y también el límite aplicado (útil para frontend o Postman)
    return {
      ok: true,
      productos: rows,
      limite_aplicado: limite === Infinity ? "ilimitado" : limite,
    };

  } catch (error) {
    console.error("Error en obtenerProductosPorNegocio:", error);
    throw error;
  }
};

