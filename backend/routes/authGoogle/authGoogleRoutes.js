import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 1) Ruta donde el usuario da clic en "Login con Google"
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 2) Callback donde Google devuelve los datos
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Crear JWT
    const token = jwt.sign(
      {
        id: req.user.id_usuario,
        rol: req.user.rol_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirigir al frontend con el token
    const redirectURL = `${process.env.FRONTEND_URL}/auth/google?token=${token}`;

    return res.redirect(redirectURL);
  }
);

export default router;
