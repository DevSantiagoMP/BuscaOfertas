import { useState, useEffect } from "react";
import {
  registerBusiness,
  getMyBusiness,
  updateMyBusiness,
} from "../../../../services/business.client";
import { uploadImageToCloudinary } from "../../../../services/cloudinary.client";
import "./businessData.css";

// Interfaz para tipar los datos del negocio
interface DatosNegocio {
  idNegocio?: number;
  nombreNegocio: string;
  descripcionNegocio: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  categoriaId: number;
  fotoPreview?: string;
}

const CATEGORIAS: Record<number, string> = {
  1: "Comida y bebidas",
  2: "Ropa y Accesorios",
  3: "Belleza y Cuidado Personal",
  4: "Hogar y Decoración",
  5: "Tecnología",
  6: "Mascotas",
  7: "Salud y Bienestar",
  8: "Vehículos y Talleres",
  9: "Deportes y Fitness",
  10: "Educación",
  11: "Bebés y Niños",
  12: "Arte y Entretenimiento",
  13: "Otra",
};

const BusinessData = () => {
  const [mostrar, setMostrar] = useState(false);

  const [imagenNegocio, setImagenNegocio] = useState<File | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [descripcionNegocio, setDescripcionNegocio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState<number | "">("");

  const [datosGuardados, setDatosGuardados] = useState<DatosNegocio | null>(
    null
  );

  // Estado de spinner de carga
  const [loading, setLoading] = useState(false);

  // 🔹 CARGAR NEGOCIO
  useEffect(() => {
    const fetchMyBusiness = async () => {
      try {
        const data = await getMyBusiness();

        setDatosGuardados({
          idNegocio: data.id_negocio,
          nombreNegocio: data.nombre,
          descripcionNegocio: data.descripcion,
          ciudad: data.ciudad,
          direccion: data.direccion,
          telefono: data.telefono,
          categoriaId: data.categoria_id,
          fotoPreview: data.foto_url,
        });

        setNombreNegocio(data.nombre);
        setDescripcionNegocio(data.descripcion);
        setCiudad(data.ciudad);
        setDireccion(data.direccion);
        setTelefono(data.telefono);
        setCategoria(data.categoria_id);
      } catch {
        console.log("El usuario aún no tiene negocio");
      }
    };

    fetchMyBusiness();
  }, []);

  // 🔹 ENVIAR FORMULARIO
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (categoria === "") return;

    try {
      setLoading(true); // 🔥 INICIA SPINNER
      let foto_url: string | null = null;
      let foto_public_id: string | null = null;

      // 🔥 1️⃣ SUBIR IMAGEN DIRECTO A CLOUDINARY (SI EXISTE)
      if (imagenNegocio) {
        const uploadResult = await uploadImageToCloudinary(imagenNegocio);
        foto_url = uploadResult.secure_url;
        foto_public_id = uploadResult.public_id;
      }

      // 🔹 ACTUALIZAR NEGOCIO
      if (datosGuardados) {
        await updateMyBusiness({
          nombre: nombreNegocio,
          descripcion: descripcionNegocio,
          ciudad,
          direccion,
          telefono,
          categoria_id: categoria,
          foto_url,
          foto_public_id,
        });

        setDatosGuardados({
          ...datosGuardados,
          nombreNegocio,
          descripcionNegocio,
          ciudad,
          direccion,
          telefono,
          categoriaId: categoria,
          fotoPreview: foto_url || datosGuardados.fotoPreview,
        });
      }
      // 🔹 CREAR NEGOCIO
      else {
        const response = await registerBusiness({
          nombre: nombreNegocio,
          descripcion: descripcionNegocio,
          ciudad,
          direccion,
          telefono,
          categoria_id: categoria,
          foto_url,
          foto_public_id,
        });

        setDatosGuardados({
          idNegocio: response.id_negocio,
          nombreNegocio,
          descripcionNegocio,
          ciudad,
          direccion,
          telefono,
          categoriaId: categoria,
          fotoPreview: foto_url || undefined,
        });
      }

      setMostrar(false);
    } catch (error: any) {
      alert(error.message || "Error al guardar la información");
    } finally {
      setLoading(false); // 🔥 DETIENE SPINNER
    }
  };

  return (
    <div className="container section-container mb-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <h3 className="mb-4 mb-md-0">Datos del negocio</h3>
        </div>

        <div className="mt-2 mt-md-0 col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
          <button
            className="button-section-container"
            onClick={() => {
              if (!mostrar && datosGuardados) {
                setNombreNegocio(datosGuardados.nombreNegocio);
                setDescripcionNegocio(datosGuardados.descripcionNegocio);
                setCiudad(datosGuardados.ciudad);
                setDireccion(datosGuardados.direccion);
                setTelefono(datosGuardados.telefono);
                setCategoria(datosGuardados.categoriaId);
              }
              setMostrar((prev) => !prev);
            }}
          >
            {mostrar
              ? "Cancelar"
              : datosGuardados
                ? "Editar información"
                : "Agregar información"}
          </button>
        </div>
      </div>

      {/* Agregar o editar información */}
      <div className="row">
        {mostrar && (
          <div className="col-12">
            <div className="box-inputs">
              <form onSubmit={handleSubmit}>
                <label htmlFor="imagenNegocio" className="custom-file-upload">
                  Toca aquí para añadir una foto (opcional)
                </label>

                <input
                  className="input-box-input"
                  type="file"
                  id="imagenNegocio"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ];
                    const maxSize = 300 * 1024; // 300KB

                    // Validar formato
                    if (!allowedTypes.includes(file.type)) {
                      alert(
                        "Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP."
                      );
                      e.target.value = ""; // limpia el input
                      return;
                    }

                    // Validar tamaño
                    if (file.size > maxSize) {
                      alert(
                        "La imagen excede el tamaño máximo permitido de 300KB."
                      );
                      e.target.value = ""; // limpia el input
                      return;
                    }

                    // Si pasa todas las validaciones
                    setImagenNegocio(file);
                  }}
                />

                {imagenNegocio && (
                  <div className="mb-3 d-flex justify-content-center">
                    <img
                      src={URL.createObjectURL(imagenNegocio)}
                      alt="Vista previa"
                      className="info-preview-img"
                    />
                  </div>
                )}

                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Escriba el nombre del negocio"
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  required
                />

                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Descripcion (opcional)"
                  value={descripcionNegocio}
                  onChange={(e) => setDescripcionNegocio(e.target.value)}
                />

                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                />

                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />

                <input
                  className="d-block input-box-input"
                  type="number"
                  placeholder="Telefono o numero de celular"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />

                <select
                  className="select-box-input"
                  value={categoria}
                  onChange={(e) => setCategoria(Number(e.target.value))}
                  required
                >
                  <option value="">Categoria negocio</option>
                  {Object.entries(CATEGORIAS).map(([id, nombre]) => (
                    <option key={id} value={id}>
                      {nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span style={{ marginLeft: 8 }}>Guardando...</span>
                    </>
                  ) : (
                    "Guardar información"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Mostrar datos */}
      {datosGuardados && !mostrar && (
        <div className="mt-4 p-2">
          <div className="row align-items-center">
            {datosGuardados.fotoPreview && (
              <div className="col-12 text-center mb-3">
                <img
                  src={datosGuardados.fotoPreview}
                  alt="Imagen del negocio"
                  className="img-fluid rounded preview-img"
                  style={{ maxWidth: "250px" }}
                />
              </div>
            )}

            <div className="col-12">
              <p>
                <strong>Nombre:</strong> {datosGuardados.nombreNegocio}
              </p>
              <p>
                <strong>Descripción:</strong>{" "}
                {datosGuardados.descripcionNegocio}
              </p>
              <p>
                <strong>Ciudad:</strong> {datosGuardados.ciudad}
              </p>
              <p>
                <strong>Dirección:</strong> {datosGuardados.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {datosGuardados.telefono}
              </p>
              <p>
                <strong>Categoría:</strong>{" "}
                {CATEGORIAS[datosGuardados.categoriaId] || "Sin categoría"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessData;
