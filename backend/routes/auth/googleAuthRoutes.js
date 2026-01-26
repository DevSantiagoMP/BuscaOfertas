import express from "express";
import passport from "passport";

const router = express.Router();

import { validarJWT } from "../../middlewares/auth.js";
import { asignarRolUsuario } from "../../controllers/authLoginController.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

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
    failureRedirect: `${FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const { token } = req.user;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // cambiar a true en producción con HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URL}/rol`);
  }
);

router.post("/asignar-rol", validarJWT, asignarRolUsuario);

export default router;
