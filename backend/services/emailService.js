// services/emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
