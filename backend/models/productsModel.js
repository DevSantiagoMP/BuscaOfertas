import { db } from "../config/dbConnection.js";

// Crear un producto
export const crearProducto = async (producto) => {
  try {
    const { negocio_id, nombre, descripcion, precio, foto_url } = producto;

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

    return result;
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

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM productos");
    return rows;
  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    throw error;
  }
};

export const obtenerProductosFiltrados = async ({ categoria_id = null, orden = null }) => {
  try {
    let query = `
      SELECT p.*, n.nombre AS nombre_negocio, n.categoria_id
      FROM productos p
      INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      WHERE 1 = 1
    `;

    const params = [];

    // FILTRO POR CATEGORÍA
    if (categoria_id) {
      query += ` AND n.categoria_id = ?`;
      params.push(categoria_id);
    }

    // FILTRO POR PRECIO (ASC / DESC)
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
