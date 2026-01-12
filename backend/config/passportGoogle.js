import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { db } from "./dbConnection.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const correo = profile.emails[0].value;
        const nombre = profile.name.givenName;
        const apellidos = profile.name.familyName;

        // Buscar usuario por google_id o correo
        const [rows] = await db.query(
          "SELECT * FROM usuarios WHERE google_id = ? OR correo = ?",
          [googleId, correo]
        );

        let user;

        if (rows.length > 0) {
          user = rows[0];

          // Si existe pero no tiene google_id, lo vinculamos
          if (!user.google_id) {
            await db.query(
              "UPDATE usuarios SET google_id = ? WHERE id_usuario = ?",
              [googleId, user.id_usuario]
            );
          }
        } else {
          // Crear usuario nuevo
          const [result] = await db.query(
            `INSERT INTO usuarios 
            (nombre, apellidos, correo, google_id, email_verificado)
            VALUES (?, ?, ?, ?, 1)`,
            [nombre, apellidos, correo, googleId]
          );

          user = {
            id_usuario: result.insertId,
            nombre,
            correo,
            rol_id: 2, // rol por defecto
          };
        }

        // Crear JWT
        const token = jwt.sign(
          {
            id: user.id_usuario,
            rol: user.rol_id,
            correo: user.correo,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return done(null, { token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);
