import { useState } from "react";
import "./businessData.css";

// Interfaz para tipar los datos del negocio
interface DatosNegocio {
  imagenNegocio: File | null;
  nombreNegocio: string;
  descripcionNegocio: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  categoria: string;
}

const businessData = () => {
  // Estado para mostrar inputs de datos del negocio
  const [mostrar, setMostrar] = useState(false);

  // Estados de inputs de datos del negocio
  const [imagenNegocio, setImagenNegocio] = useState<File | null>(null);
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [descripcionNegocio, setDescripcionNegocio] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState("");

  // Estado para guardar los datos del negocio
  const [datosGuardados, setDatosGuardados] = useState<DatosNegocio | null>(
    null
  );

  // Envío del formulario de datos del negocio
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datos: DatosNegocio = {
      imagenNegocio,
      nombreNegocio,
      descripcionNegocio,
      ciudad,
      direccion,
      telefono,
      categoria,
    };

    setDatosGuardados(datos);
    setMostrar(false);
  };

  return (
    <>
      <div className="container section-container mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <h3 className="mb-4 mb-md-0">Datos del negocio</h3>
          </div>

          <div className="col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
            <button
            className="button-section-container"
              onClick={() => {
                if (!mostrar && datosGuardados) {
                  // Rellenar el formulario al presionar "Editar"
                  setNombreNegocio(datosGuardados.nombreNegocio);
                  setDescripcionNegocio(datosGuardados.descripcionNegocio);
                  setCiudad(datosGuardados.ciudad);
                  setDireccion(datosGuardados.direccion);
                  setTelefono(datosGuardados.telefono);
                  setCategoria(datosGuardados.categoria);
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

        <div className="row">
          {/* Al click se muestra card con inputs */}
          {mostrar && (
            <div className="box-inputs">
              <form onSubmit={handleSubmit}>
                <label htmlFor="imagenNegocio" className="custom-file-upload">
                  Toca aquí para añadir una foto (opcional)
                </label>
                <input
                  className="input-box-input"
                  type="file"
                  id="imagenNegocio"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagenNegocio(e.target.files[0]);
                    }
                  }}
                />
                {/* Vista previa de imagen en el formulario */}
                {imagenNegocio && (
                  <div className="mb-3 d-flex justify-content-center align-items-center">
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
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  value={nombreNegocio}
                  required
                />
                <input
                  className="d-block input-box-input"
                  type="area"
                  placeholder="Descripcion (opcional)"
                  onChange={(e) => setDescripcionNegocio(e.target.value)}
                  value={descripcionNegocio}
                />
                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Ciudad"
                  onChange={(e) => setCiudad(e.target.value)}
                  value={ciudad}
                  required
                />
                <input
                  className="d-block input-box-input"
                  type="text"
                  placeholder="Dirección"
                  onChange={(e) => setDireccion(e.target.value)}
                  value={direccion}
                  required
                />
                <input
                  className="d-block input-box-input"
                  type="number"
                  placeholder="Telefono o numero de celular"
                  onChange={(e) => setTelefono(e.target.value)}
                  value={telefono}
                  required
                />
                <select
                  className="select-box-input"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="">Categoria negocio</option>
                  <option value="Comida">Comida</option>
                  <option value="Belleza">Belleza</option>
                </select>
                <button type="submit" className="save-button">
                  Guardar información
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mostrar datos guardados */}
        {datosGuardados && !mostrar && (
          <div className="mt-4">
            <div className="row align-items-center">
              {/* Imagen */}
              {datosGuardados.imagenNegocio && (
                <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
                  <img
                    src={URL.createObjectURL(datosGuardados.imagenNegocio!)}
                    alt="Imagen del negocio"
                    className="img-fluid rounded preview-img"
                    style={{ maxWidth: "250px" }}
                  />
                </div>
              )}

              {/* Datos */}
              <div
                className={
                  datosGuardados.imagenNegocio
                    ? "col-12 col-md-8" // Si hay imagen
                    : "col-12 col-md-12" // Si NO hay imagen → ocupar todo el ancho
                }
              >
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
                  <strong>Categoría:</strong> {datosGuardados.categoria}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default businessData;
