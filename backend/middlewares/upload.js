import multer from "multer";

const storage = multer.diskStorage({}); // almacenamiento temporal

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Solo se permiten imágenes"));
    }
    cb(null, true);
  },
});

export default upload;
