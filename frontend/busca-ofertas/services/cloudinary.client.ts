const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  // VALIDACIÓN LOCAL (ANTES DE SUBIR)
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error(
      "Formato de imagen no permitido (Formatos permitidos: JPG, PNG, WEBP)"
    );
  }

  // 300 KB = 300 * 1024 bytes
  if (file.size > 300 * 1024) {
    throw new Error("La imagen supera los 300 KB");
  }

  // FormData solo si pasó validaciones
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Cloudinary error:", error);

    let message = "Error subiendo imagen";
    const cloudMsg = error?.error?.message?.toLowerCase() || "";

    if (cloudMsg.includes("file size")) {
      message = "La imagen supera el tamaño permitido (tamaño máximo: 2MB)";
    } else if (
      cloudMsg.includes("format") ||
      cloudMsg.includes("not allowed")
    ) {
      message = "Formato de imagen no permitido";
    }

    throw new Error(message);
  }

  const data = await response.json();

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};

export const deleteImageFromCloudinary = async (public_id: string) => {
  const SERVER = import.meta.env.VITE_SERVER;
  const response = await fetch(`${SERVER}/api/cloudinary/delete-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id }),
  });

  if (!response.ok) {
    throw new Error("Error eliminando imagen");
  }

  return response.json();
};
