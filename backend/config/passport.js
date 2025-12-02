import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByGoogleId,
  findUserByEmail,
  createUserWithGoogle,
} from "../models/googleAuthModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleUid = profile.id;
        const email = profile.emails?.[0]?.value;
        const nombre = profile.name?.givenName || profile.displayName;
        const apellidos = profile.name?.familyName || "";

        // 1. Buscar si existe por google_uid
        let user = await findUserByGoogleId(googleUid);

        if (!user) {
          // 2. Si no existe, buscar por email
          user = await findUserByEmail(email);

          if (user) {
            // Si ya existía por login normal → asociar google_uid
            user = await createUserWithGoogle({
              id_usuario: user.id_usuario,
              google_uid: googleUid,
            });
          } else {
            // 3. Crear usuario nuevo con Google
            user = await createUserWithGoogle({
              nombre,
              apellidos,
              correo: email,
              google_uid: googleUid,
            });
          }
        }

        return done(null, user);

      } catch (error) {
        console.error("Error GoogleStrategy:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
