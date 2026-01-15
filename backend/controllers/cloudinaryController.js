// controllers/cloudinary.controller.ts
import cloudinary from "../config/cloudinary.js";

export const eliminarImagen = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "public_id requerido" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando imagen" });
  }
};
