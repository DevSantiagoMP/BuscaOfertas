import mysql from "mysql2/promise";

let db;

export const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("📌 Conexión a MySQL exitosa");
    return db;
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err);
    process.exit(1);
  }
};

export { db };
