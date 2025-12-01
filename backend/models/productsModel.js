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

export const obtenerProductosPorCategoria = async (categoria_id) => {
  try {
    const query = `
      SELECT p.*, n.nombre AS nombre_negocio, n.categoria_id
      FROM productos p
      INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      WHERE n.categoria_id = ?
    `;

    const [rows] = await db.execute(query, [categoria_id]);
    return rows;

  } catch (error) {
    console.error("Error en obtenerProductosPorCategoria:", error);
    throw error;
  }
};

export const obtenerProductosPorPrecio = async (orden) => {
  try {
    // Validar orden
    const orderBy = orden === "desc" ? "DESC" : "ASC";

    const query = `
      SELECT p.*, n.nombre AS nombre_negocio
      FROM productos p
      INNER JOIN negocios n ON p.negocio_id = n.id_negocio
      ORDER BY p.precio ${orderBy}
    `;

    const [rows] = await db.execute(query);
    return rows;

  } catch (error) {
    console.error("Error en obtenerProductosPorPrecio:", error);
    throw error;
  }
};