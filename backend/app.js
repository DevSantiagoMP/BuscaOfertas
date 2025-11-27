import "dotenv/config";
import cors from "cors";
import express from "express";

import { connectDB } from "./config/dbConnection.js";
import authRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Conectar primero a la base
const startServer = async () => {
  await connectDB();

  app.use("/api/auth", authRoutes);

  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en puerto 3000");
  });
};

startServer();
