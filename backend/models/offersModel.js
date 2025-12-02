import { db } from "../config/dbConnection.js";

// Crear un oferta
export const crearOferta = async (oferta) => {
  try {
    const { negocio_id, nombre, descripcion, precio_oferta, foto_url } = oferta;

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

    return result;
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

// Obtener todos las ofertas
export const obtenerOfertas = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM ofertas");
    return rows;
  } catch (error) {
    console.error("Error en obtenerOfertas:", error);
    throw error;
  }
};

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

