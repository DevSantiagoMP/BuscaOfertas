// services/emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const isPerformance = process.env.NODE_ENV === "performance";

// ENVIAR CORREO DE VERIFICACION
export const sendVerificationEmail = async (to, verificationLink) => {
  if (isPerformance) {
    console.log("📧 [PERFORMANCE] Email de verificación simulado:", {
      to,
      verificationLink,
    });

    return {
      id: "simulated-email-id",
      status: "simulated",
    };
  }

  try {
    return await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Verifica tu correo - BuscaOfertas",
      html: `
        <h2>Confirma tu cuenta</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="${verificationLink}" style="color: blue">Verificar correo</a>
      `,
    });
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};

// ENVIAR CORREO DE RECUPERACIÓN
export const sendPasswordResetEmail = async (to, resetLink) => {
  if (isPerformance) {
    console.log("📧 [PERFORMANCE] Email de recuperación simulado:", {
      to,
      resetLink,
    });

    return {
      id: "simulated-email-id",
      status: "simulated",
    };
  }

  try {
    return await resend.emails.send({
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
  } catch (error) {
    console.error("Error enviando correo de recuperación:", error);
    throw error;
  }
};