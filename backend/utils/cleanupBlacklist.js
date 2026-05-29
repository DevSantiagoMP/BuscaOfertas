import { db } from "../config/dbConnection.js";

export const limpiarTokensExpirados = async () => {
  try {
    const query = `
      DELETE FROM token_blacklist 
      WHERE expiracion < NOW()
    `;
    const [result] = await db.execute(query);
    console.log(`✅ Limpieza de blacklist: ${result.affectedRows} tokens eliminados`);
    return result.affectedRows;
  } catch (error) {
    console.error("❌ Error limpiando blacklist:", error);
  }
};

// Ejecutar cada 24 horas
export const iniciarLimpiezaAutomatica = () => {
  // Limpiar inmediatamente al iniciar
  limpiarTokensExpirados();
  
  // Limpiar cada 24 horas
  setInterval(() => {
    limpiarTokensExpirados();
  }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
};
