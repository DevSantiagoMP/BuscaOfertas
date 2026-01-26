import "dotenv/config"; //para variables de entorno
import cors from "cors"; //para poder conectrar frontend
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/dbConnection.js"; //importacion base de datos

import passport from "passport";
import "./config/passportGoogle.js";

import googleAuthRoutes from "./routes/auth/googleAuthRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js"; //importacion de ruta autenticacion normal
import businessRoutes from "./routes/business/businessRoutes.js"; //importacion de ruta negocios
import productsRoutes from "./routes/products/productsRoutes.js"; //importacion de ruta productos
import offersRoutes from "./routes/offers/offersRoutes.js"; //importacion de ruta ofertas
import cloudinaryRoutes from "./routes/cloudinary.routes.js";

const app = express();
const PORT = process.env.BACKEND_PORT;

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // dominio frontend
    credentials: true,                // permitir cookies
  })
);

app.use(cookieParser());

// Conectar primero a la base
const startServer = async () => {
  await connectDB();

  app.use(passport.initialize());

  // Rutas
  app.use("/api/auth/google", googleAuthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/business", businessRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/offers", offersRoutes);
  app.use("/api/cloudinary", cloudinaryRoutes);
  
  //servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

startServer();
