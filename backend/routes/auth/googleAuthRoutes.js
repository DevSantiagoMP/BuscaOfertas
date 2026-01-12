import express from "express";
import passport from "passport";

const router = express.Router();

import { validarJWT } from "../../middlewares/auth.js";
import { asignarRolUsuario } from "../../controllers/authLoginController.js";


// Iniciar login Google
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Callback Google
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const { token } = req.user;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // cambiar a true en producción con HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/rol");
  }
);

router.post("/asignar-rol", validarJWT, asignarRolUsuario);

export default router;
