import "dotenv/config"; //para variables de entorno
import cors from "cors"; //para poder conectrar frontend
import express from "express"; 

import { connectDB } from "./config/dbConnection.js"; //importacion base de datos

import authRoutes from "./routes/userRoutes.js"; //importacion de rutas

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

// Conectar primero a la base
const startServer = async () => {
  await connectDB();

  // Rutas
  app.use("/api/auth", authRoutes);

  //servidor
  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en puerto 3000");
  });
};

startServer();
