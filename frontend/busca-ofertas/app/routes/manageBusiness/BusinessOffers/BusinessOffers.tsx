import { useState } from "react";

// Definir cada variable de las ofertas
interface Oferta {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  imagen?: File | null;
  editando: boolean;
}

const BusinessOffers = () => {
  // Estado que define un arreglo para las ofertas
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  // Estado que define un id para cada oferta
  const [contadorId, setContadorId] = useState(1);

  const agregarOferta = () => {
    const yaEditando = ofertas.some((o) => o.editando);
    if (yaEditando) return;

    const nuevaOferta: Oferta = {
      id: contadorId,
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: null,
      editando: true,
    };

    setOfertas((prev) => [...prev, nuevaOferta]);
    setContadorId(contadorId + 1);
  };

  const guardarOferta = (id: number) => {
    setOfertas((prev) =>
      prev.map((of) =>
        of.id === id ? { ...of, editando: false } : of
      )
    );
  };

  const cancelarEdicion = (id: number) => {
    setOfertas((prev) => prev.filter((of) => of.id !== id));
  };

  const editarOferta = (id: number) => {
    const yaEditando = ofertas.some((o) => o.editando);
    if (yaEditando) return;

    setOfertas((prev) =>
      prev.map((of) =>
        of.id === id ? { ...of, editando: true } : of
      )
    );
  };

  const eliminarOferta = (id: number) => {
    setOfertas((prev) => prev.filter((of) => of.id !== id));
  };

  const actualizarCampo = (
    id: number,
    campo: keyof Oferta,
    valor: any
  ) => {
    setOfertas((prev) =>
      prev.map((of) =>
        of.id === id ? { ...of, [campo]: valor } : of
      )
    );
  };

  return (
    <>
      <div className="container section-container mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <h3 className="mb-4 mb-md-0">Ofertas</h3>
          </div>
          <div className="col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
            <button
              className="button-section-container"
              onClick={agregarOferta}
              disabled={ofertas.some((o) => o.editando)}
            >
              Agregar oferta
            </button>
          </div>
        </div>

        {/* Cards Ofertas */}
        <div className="row mt-4">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm p-3">

                {oferta.editando ? (
                  <form
                    onSubmit={(e) => {
                      // si el formulario NO es válido → el navegador muestra el mensaje
                      if (!e.currentTarget.checkValidity()) return;

                      e.preventDefault();
                      guardarOferta(oferta.id);
                    }}
                    noValidate={false}
                  >

                    {/* Imagen */}
                    <label
                      htmlFor={`imagen-oferta-${oferta.id}`}
                      className="custom-file-upload"
                    >
                      Toca aquí para añadir una foto (opcional)
                    </label>

                    <input
                      type="file"
                      id={`imagen-oferta-${oferta.id}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          actualizarCampo(
                            oferta.id,
                            "imagen",
                            e.target.files[0]
                          );
                        }
                      }}
                    />

                    {/* Vista previa */}
                    {oferta.imagen && (
                      <img
                        src={URL.createObjectURL(oferta.imagen)}
                        alt="Previsualización"
                        className="img-fluid rounded mt-2 mb-3"
                        style={{ maxHeight: "180px", objectFit: "cover" }}
                      />
                    )}

                    {/* Nombre */}
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Nombre de la oferta"
                      value={oferta.nombre}
                      required
                      onChange={(e) =>
                        actualizarCampo(oferta.id, "nombre", e.target.value)
                      }
                    />

                    {/* Descripción */}
                    <textarea
                      className="form-control mb-3"
                      placeholder="Descripción (opcional)"
                      value={oferta.descripcion}
                      onChange={(e) =>
                        actualizarCampo(oferta.id, "descripcion", e.target.value)
                      }
                    />

                    {/* Precio */}
                    <input
                      type="number"
                      className="form-control mb-3"
                      placeholder="Precio"
                      value={oferta.precio}
                      required
                      onChange={(e) =>
                        actualizarCampo(oferta.id, "precio", e.target.value)
                      }
                    />

                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-success flex-fill"
                      >
                        Guardar
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary flex-fill"
                        onClick={() => cancelarEdicion(oferta.id)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Modo vista */}
                    {oferta.imagen && (
                      <img
                        src={URL.createObjectURL(oferta.imagen)}
                        alt={oferta.nombre}
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: "160px", objectFit: "cover" }}
                      />
                    )}

                    <p className="fw-bold">Nombre: {oferta.nombre}</p>

                    {oferta.descripcion && (
                      <p className="fw-bold">Descripción: {oferta.descripcion}</p>
                    )}

                    <p className="fw-bold">Precio: {oferta.precio}</p>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={() => editarOferta(oferta.id)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger flex-fill"
                        onClick={() => eliminarOferta(oferta.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BusinessOffers;
