import "dotenv/config"; //para variables de entorno
import cors from "cors"; //para poder conectrar frontend
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/dbConnection.js"; //importacion base de datos

import authRoutes from "./routes/auth/authRoutes.js"; //importacion de ruta autenticacion normal
import businessRoutes from "./routes/business/businessRoutes.js"; //importacion de ruta negocios
import productsRoutes from "./routes/products/productsRoutes.js"; //importacion de ruta productos
import offersRoutes from "./routes/offers/offersRoutes.js"; //importacion de ruta ofertas

const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));  // ← Recomendado
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",  // dominio frontend
    credentials: true,                // permitir cookies
  })
);

app.use(cookieParser());

// Conectar primero a la base
const startServer = async () => {
  await connectDB();

  // Rutas
  app.use("/api/auth", authRoutes);
  app.use("/api/business", businessRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/offers", offersRoutes);

  //servidor
  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en puerto 3000");
  });
};

startServer();
