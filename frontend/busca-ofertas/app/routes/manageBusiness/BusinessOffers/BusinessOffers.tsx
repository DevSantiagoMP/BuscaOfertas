import { useEffect, useState } from "react";
import {
  crearOferta,
  actualizarOferta,
  eliminarOfertaApi,
  obtenerMisOfertas,
} from "../../../../services/offers.client";
import { uploadImageToCloudinary } from "../../../../services/cloudinary.client";

/* =====================
   Tipos
===================== */
interface Oferta {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;

  imagen?: File | null;
  foto_url?: string | null;
  foto_public_id?: string | null;

  editando: boolean;
  isNew?: boolean; // ✅ FLAG
}

const BusinessOffers = () => {
  /* =====================
     Estados
  ===================== */
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  /* =====================
     Obtener ofertas
  ===================== */
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await obtenerMisOfertas();

        setOfertas(
          data.ofertas.map((o: any) => ({
            id: o.id_oferta,
            nombre: o.nombre,
            descripcion: o.descripcion,
            precio: o.precio_oferta,
            imagen: null,
            foto_url: o.foto_url,
            foto_public_id: o.foto_public_id,
            editando: false,
            isNew: false, // ✅ viene del backend
          }))
        );
      } catch (error) {
        console.error("Error cargando ofertas:", error);
      }
    };

    fetchOfertas();
  }, []);

  /* =====================
     Acciones UI
  ===================== */
  const agregarOferta = () => {
    if (ofertas.some((o) => o.editando)) return;

    const nuevaOferta: Oferta = {
      id: contadorId,
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: null,
      foto_url: null,
      foto_public_id: null,
      editando: true,
      isNew: true, // ✅ nueva
    };

    setOfertas((prev) => [...prev, nuevaOferta]);
    setContadorId((prev) => prev + 1);
  };

  const editarOferta = (id: number) => {
    if (ofertas.some((o) => o.editando)) return;

    setOfertas((prev) =>
      prev.map((o) => (o.id === id ? { ...o, editando: true } : o))
    );
  };

  const cancelarEdicion = (id: number) => {
    setOfertas((prev) => {
      const oferta = prev.find((o) => o.id === id);
      if (!oferta) return prev;

      // 🟢 Oferta nueva → eliminar
      if (oferta.isNew) {
        return prev.filter((o) => o.id !== id);
      }

      // 🟡 Oferta existente → solo salir de edición
      return prev.map((o) =>
        o.id === id ? { ...o, editando: false } : o
      );
    });
  };

  /* =====================
     Guardar oferta
  ===================== */
  const guardarOferta = async (id: number) => {
    try {
      setGuardandoId(id);
      const oferta = ofertas.find((o) => o.id === id);
      if (!oferta) return;

      let foto_url = oferta.foto_url ?? null;
      let foto_public_id = oferta.foto_public_id ?? null;

      if (oferta.imagen) {
        const upload = await uploadImageToCloudinary(oferta.imagen);
        foto_url = upload.secure_url;
        foto_public_id = upload.public_id;
      }

      // 🟢 CREAR
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
                  editando: false,
                  isNew: false, // ✅ normalizada
                }
              : o
          )
        );
      }
      // 🟡 ACTUALIZAR
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
                  editando: false,
                }
              : o
          )
        );
      }
    } catch (error: any) {
      alert(error.message || "Error al guardar la oferta");
    } finally {
      setGuardandoId(null);
    }
  };

  /* =====================
     Eliminar oferta
  ===================== */
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

  /* =====================
     Render
  ===================== */
  return (
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

      <div className="row mt-4">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3">
              {oferta.editando ? (
                <form
                  onSubmit={(e) => {
                    if (!e.currentTarget.checkValidity()) return;
                    e.preventDefault();
                    guardarOferta(oferta.id);
                  }}
                >
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
                    onChange={(e) =>
                      e.target.files &&
                      actualizarCampo(oferta.id, "imagen", e.target.files[0])
                    }
                  />

                  {(oferta.imagen || oferta.foto_url) && (
                    <img
                      src={
                        oferta.imagen
                          ? URL.createObjectURL(oferta.imagen)
                          : oferta.foto_url!
                      }
                      alt="Previsualización"
                      className="img-fluid rounded mt-2 mb-3"
                      style={{ maxHeight: "180px", objectFit: "cover" }}
                    />
                  )}

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

                  <textarea
                    className="form-control mb-3"
                    placeholder="Descripción (opcional)"
                    value={oferta.descripcion}
                    onChange={(e) =>
                      actualizarCampo(oferta.id, "descripcion", e.target.value)
                    }
                  />

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
                      alt={oferta.nombre}
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: "160px", objectFit: "cover" }}
                    />
                  )}

                  <p className="fw-bold">Nombre: {oferta.nombre}</p>
                  {oferta.descripcion && (
                    <p className="fw-bold">
                      Descripción: {oferta.descripcion}
                    </p>
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
