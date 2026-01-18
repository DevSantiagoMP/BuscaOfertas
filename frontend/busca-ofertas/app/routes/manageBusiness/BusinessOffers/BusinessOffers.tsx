import { useEffect, useState } from "react";
import {
  crearOferta,
  actualizarOferta,
  eliminarOfertaApi,
  obtenerMisOfertas,
} from "../../../../services/offers.client";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../../../services/cloudinary.client";

// Tipos
interface Oferta {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;

  imagen?: File | null;
  foto_url?: string | null;
  foto_public_id?: string | null;

  imagenEliminada?: boolean;

  editando: boolean;
  isNew?: boolean;

  backup?: {
    nombre: string;
    descripcion?: string;
    precio: string;
    foto_url?: string | null;
    foto_public_id?: string | null;
    imagenEliminada?: boolean;
  };
}

const BusinessOffers = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  // Obtener ofertas
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await obtenerMisOfertas();

        setOfertas(
          data.ofertas.map((o: any) => ({
            id: o.id_oferta,
            nombre: o.nombre,
            descripcion: o.descripcion,
            precio: String(o.precio_oferta),
            imagen: null,
            foto_url: o.foto_url,
            foto_public_id: o.foto_public_id,
            imagenEliminada: false,
            editando: false,
            isNew: false,
          }))
        );

        const maxId = Math.max(0, ...data.ofertas.map((o: any) => o.id_oferta));
        setContadorId(maxId + 1);
      } catch (error) {
        console.error("Error cargando ofertas:", error);
      }
    };

    fetchOfertas();
  }, []);

  // Agregar oferta
  const agregarOferta = () => {
    if (ofertas.some((o) => o.editando)) return;

    setOfertas((prev) => [
      ...prev,
      {
        id: contadorId,
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: null,
        foto_url: null,
        foto_public_id: null,
        imagenEliminada: false,
        editando: true,
        isNew: true,
      },
    ]);

    setContadorId((prev) => prev + 1);
  };

  const editarOferta = (id: number) => {
    if (ofertas.some((o) => o.editando)) return;

    setOfertas((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              editando: true,
              backup: {
                nombre: o.nombre,
                descripcion: o.descripcion,
                precio: o.precio,
                foto_url: o.foto_url,
                foto_public_id: o.foto_public_id,
                imagenEliminada: o.imagenEliminada,
              },
            }
          : o
      )
    );
  };

  const cancelarEdicion = (id: number) => {
    setOfertas(
      (prev) =>
        prev
          .map((o) => {
            if (o.id !== id) return o;

            // Nueva → eliminar
            if (o.isNew) return null;

            // Existente → restaurar backup
            return {
              ...o,
              ...o.backup,
              imagen: null,
              editando: false,
              backup: undefined,
            };
          })
          .filter(Boolean) as Oferta[]
    );
  };

  const eliminarImagenOferta = (id: number) => {
    const confirmar = confirm("¿Seguro que deseas eliminar la imagen?");
    if (!confirmar) return;

    setOfertas((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              imagen: null,
              foto_url: null,
              imagenEliminada: true,
            }
          : o
      )
    );
  };

  //    Guardar oferta
  const guardarOferta = async (id: number) => {
    try {
      setGuardandoId(id);
      const oferta = ofertas.find((o) => o.id === id);
      if (!oferta) return;

      let foto_url = oferta.foto_url ?? null;
      let foto_public_id = oferta.foto_public_id ?? null;

      // Si la imagen fue marcada para eliminar
      if (oferta.imagenEliminada && oferta.foto_public_id) {
        await deleteImageFromCloudinary(oferta.foto_public_id);
        foto_public_id = null;
        foto_url = null;
      }

      if (oferta.imagen) {
        const upload = await uploadImageToCloudinary(oferta.imagen);
        foto_url = upload.secure_url;
        foto_public_id = upload.public_id;
      }

      // CREAR
      if (oferta.isNew) {
        const response = await crearOferta({
          nombre: oferta.nombre,
          descripcion: oferta.descripcion,
          precio_oferta: Number(oferta.precio),
          foto_url,
          foto_public_id,
        });

        setOfertas((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  id: response.id_oferta,
                  foto_url,
                  foto_public_id,
                  imagenEliminada: false,
                  editando: false,
                  isNew: false,
                  backup: undefined,
                  imagen: null,
                }
              : o
          )
        );
      }
      // ACTUALIZAR
      else {
        await actualizarOferta({
          id: oferta.id,
          nombre: oferta.nombre,
          descripcion: oferta.descripcion,
          precio_oferta: Number(oferta.precio),
          foto_url,
          foto_public_id,
        });

        setOfertas((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  foto_url,
                  foto_public_id,
                  imagenEliminada: false,
                  editando: false,
                  backup: undefined,
                  imagen: null,
                }
              : o
          )
        );
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Error al guardar la oferta"
      );

      cancelarEdicion(id);
    } finally {
      setGuardandoId(null);
    }
  };

  // Eliminar oferta
  const eliminarOferta = async (id: number) => {
    try {
      await eliminarOfertaApi(id);
      setOfertas((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert("Error al eliminar la oferta");
    }
  };

  const actualizarCampo = (id: number, campo: keyof Oferta, valor: any) => {
    setOfertas((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [campo]: valor } : o))
    );
  };

  //Render
  return (
    <div className="container section-container mb-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <h3>Ofertas</h3>
        </div>

        <div className="mt-2 mt-md-0 col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
          <button
            className="button-section-container"
            onClick={agregarOferta}
            disabled={ofertas.some((o) => o.editando)}
          >
            Agregar oferta
          </button>
        </div>
      </div>

      <div className="row mt-4">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3">
              {oferta.editando ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    guardarOferta(oferta.id);
                  }}
                >
                  <label className="custom-file-upload">
                    Toca aquí para añadir una foto (opcional)
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const allowedTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ];
                        const maxSize = 300 * 1024; // 300 KB

                        if (!allowedTypes.includes(file.type)) {
                          alert("Solo se permiten imágenes JPG, PNG o WEBP");
                          e.target.value = "";
                          return;
                        }

                        if (file.size > maxSize) {
                          alert("La imagen no puede exceder los 300KB");
                          e.target.value = "";
                          return;
                        }

                        actualizarCampo(oferta.id, "imagen", file);
                        actualizarCampo(oferta.id, "imagenEliminada", false);
                      }}
                    />
                  </label>

                  {(oferta.imagen || oferta.foto_url) && (
                    <>
                      <img
                        src={
                          oferta.imagen
                            ? URL.createObjectURL(oferta.imagen)
                            : oferta.foto_url!
                        }
                        className="img-fluid rounded my-3"
                      />

                      {oferta.foto_public_id && !oferta.imagen && !oferta.imagenEliminada && (
                        <button
                          type="button"
                          className="btn btn-outline-danger w-100 mb-3"
                          onClick={() => eliminarImagenOferta(oferta.id)}
                        >
                          Eliminar imagen
                        </button>
                      )}
                    </>
                  )}

                  <input
                    className="form-control mb-3"
                    placeholder="Nombre"
                    value={oferta.nombre}
                    required
                    onChange={(e) =>
                      actualizarCampo(oferta.id, "nombre", e.target.value)
                    }
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Descripción"
                    value={oferta.descripcion}
                    onChange={(e) =>
                      actualizarCampo(oferta.id, "descripcion", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Precio"
                    value={oferta.precio}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      actualizarCampo(
                        oferta.id,
                        "precio",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                  />

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success flex-fill"
                      disabled={guardandoId === oferta.id}
                    >
                      {guardandoId === oferta.id ? "Guardando..." : "Guardar"}
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
                  {oferta.foto_url && (
                    <img
                      src={oferta.foto_url}
                      className="img-fluid rounded mb-3"
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
  );
};

export default BusinessOffers;
