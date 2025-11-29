// services/emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ENVIAR CORREO DE VERIFICACION
export const sendVerificationEmail = async (to, verificationLink) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // o tu dominio verificado
      to,
      subject: "Verifica tu correo - BuscaOfertas",
      html: `
        <h2>Confirma tu cuenta</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="${verificationLink}" style="color: blue">Verificar correo</a>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};

// ENVIAR CORREO DE RECUPERACIÓN
export const sendPasswordResetEmail = async (to, resetLink) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Recupera tu contraseña - BuscaOfertas",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Has solicitado recuperar tu contraseña. Haz clic en el enlace para crear una nueva:</p>
        <a href="${resetLink}" style="color: blue">Restablecer contraseña</a>
        <p>Este enlace expirará en <strong>15 minutos</strong>.</p>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error enviando correo de recuperación:", error);
    throw error;
  }
};
