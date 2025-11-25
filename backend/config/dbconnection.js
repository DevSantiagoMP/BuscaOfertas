import mysql from "mysql2/promise";

// Crear la conexión una sola vez
export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Función para verificar la conexión
export const connectDB = async () => {
  try {
    await db.connect();
    console.log("📌 Conexión a MySQL exitosa");
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error);
    process.exit(1);
  }
};
