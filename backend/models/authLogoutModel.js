import { db } from "../config/dbConnection.js";

export const agregarTokenALaBlacklist = async (token, expiracion) => {
  const query = `
    INSERT IGNORE INTO token_blacklist (token, expiracion)
    VALUES (?, ?)
  `;
  await db.execute(query, [token, expiracion]);
};

export const estaEnBlacklist = async (token) => {
  const query = `
    SELECT 1 FROM token_blacklist
    WHERE token = ?
    LIMIT 1
  `;
  const [rows] = await db.execute(query, [token]);
  return rows.length > 0;
};