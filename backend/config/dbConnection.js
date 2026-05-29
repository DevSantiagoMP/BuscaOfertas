import mysql from "mysql2/promise";
import "dotenv/config";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export const connectDB = async () => {
  try {
    await db.query("SELECT 1");
    console.log("📌 Conexión a MySQL exitosa");
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error);
    throw error;
  }
};
