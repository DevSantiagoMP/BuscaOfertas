import cors from "cors"; //para conectar con frontend
import express from "express"; //para crear servidor
import "dotenv/config"; //para variables de entorno
import { connectDB } from "./config/dbconnection.js"; //conexion base de datos

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexion base de datos
connectDB();

// Puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
