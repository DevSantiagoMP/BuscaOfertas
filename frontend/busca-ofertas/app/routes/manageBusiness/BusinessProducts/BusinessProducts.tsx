import { useState, useEffect } from "react";
import {
  crearProducto,
  actualizarProducto,
  eliminarProductoApi,
  obtenerMisProductos,
} from "../../../../services/products.client";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../../../../services/cloudinary.client";

// Tipos
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;

  imagen?: File | null;
  foto_url?: string | null;
  foto_public_id?: string | null;

  editando: boolean;
  isNew?: boolean;
  imagenEliminada?: boolean;

  backup?: {
    nombre: string;
    descripcion?: string;
    precio: string;
    foto_url?: string | null;
    foto_public_id?: string | null;
    imagenEliminada?: boolean;
  };
}

const BusinessProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerMisProductos();

        const productosFormateados: Producto[] = data.productos.map(
          (p: any) => ({
            id: p.id_producto,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: String(p.precio),
            imagen: null,
            foto_url: p.foto_url,
            foto_public_id: p.foto_public_id,
            imagenEliminada: false,
            editando: false,
            isNew: false,
          })
        );

        setProductos(productosFormateados);

        const maxId = Math.max(0, ...productosFormateados.map((p) => p.id));
        setContadorId(maxId + 1);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Acciones UI
  const agregarProducto = () => {
    if (productos.some((p) => p.editando)) return;

    setProductos((prev) => [
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

  const editarProducto = (id: number) => {
    if (productos.some((p) => p.editando)) return;

    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              editando: true,
              backup: {
                nombre: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                foto_url: p.foto_url,
                foto_public_id: p.foto_public_id,
                imagenEliminada: p.imagenEliminada,
              },
            }
          : p
      )
    );
  };

  const cancelarEdicion = (id: number) => {
    setProductos(
      (prev) =>
        prev
          .map((p) => {
            if (p.id !== id) return p;

            // Nuevo → eliminar
            if (p.isNew) return null;

            //Existente → restaurar backup
            return {
              ...p,
              ...p.backup,
              imagen: null,
              editando: false,
              backup: undefined,
            };
          })
          .filter(Boolean) as Producto[]
    );
  };

  const eliminarImagenProducto = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto || !producto.foto_public_id) return;

    const confirmar = confirm("¿Seguro que deseas eliminar la imagen?");
    if (!confirmar) return;

    // NO borrar de Cloudinary aquí
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              imagenEliminada: true,
              imagen: null,
              foto_url: null,
            }
          : p
      )
    );
  };

  // Guardar producto
  const guardarProducto = async (producto: Producto) => {
    setGuardandoId(producto.id);

    try {
      let foto_url = producto.foto_url ?? null;
      let foto_public_id = producto.foto_public_id ?? null;

      // eliminar imagen anterior SOLO si se confirmó
      if (producto.imagenEliminada && producto.foto_public_id) {
        await deleteImageFromCloudinary(producto.foto_public_id);
        foto_url = null;
        foto_public_id = null;
      }

      if (producto.imagen) {
        const upload = await uploadImageToCloudinary(producto.imagen);
        foto_url = upload.secure_url;
        foto_public_id = upload.public_id;
      }

      // CREAR
      if (producto.isNew) {
        const response = await crearProducto({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          foto_url,
          foto_public_id,
        });

        setProductos((prev) =>
          prev.map((p) =>
            p.id === producto.id
              ? {
                  ...p,
                  id: response.id_producto,
                  foto_url,
                  foto_public_id,
                  editando: false,
                  isNew: false,
                  backup: undefined,
                  imagen: null,
                  imagenEliminada: false,
                }
              : p
          )
        );
      }
      // ACTUALIZAR
      else {
        await actualizarProducto({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          foto_url,
          foto_public_id,
        });

        setProductos((prev) =>
          prev.map((p) =>
            p.id === producto.id
              ? {
                  ...p,
                  foto_url,
                  foto_public_id,
                  editando: false,
                  backup: undefined,
                  imagen: null,
                  imagenEliminada: false,
                }
              : p
          )
        );
      }
    } catch (error: any) {
      alert(
        error.response?.data?.msg ||
          error.message ||
          "Error al guardar producto"
      );

      cancelarEdicion(producto.id);
    } finally {
      setGuardandoId(null);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id: number) => {
    try {
      await eliminarProductoApi(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar producto");
    }
  };

  const actualizarCampo = (id: number, campo: keyof Producto, valor: any) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  // Render
  return (
    <div className="container section-container mb-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <h3>Productos</h3>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
          <button
            className="button-section-container"
            onClick={agregarProducto}
            disabled={productos.some((p) => p.editando)}
          >
            Agregar producto
          </button>
        </div>
      </div>

      <div className="row mt-4">
        {productos.map((producto) => (
          <div key={producto.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3">
              {producto.editando ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    guardarProducto(producto);
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
                        const maxSize = 300 * 1024;

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

                        actualizarCampo(producto.id, "imagen", file);
                        actualizarCampo(producto.id, "imagenEliminada", false)
                      }}
                    />
                  </label>

                  {(producto.imagen || producto.foto_url) && (
                    <>
                      <img
                        src={
                          producto.imagen
                            ? URL.createObjectURL(producto.imagen)
                            : producto.foto_url!
                        }
                        className="img-fluid rounded my-3"
                      />

                      {producto.foto_public_id &&
                        !producto.imagen &&
                        !producto.imagenEliminada && (
                          <button
                            type="button"
                            className="btn btn-outline-danger w-100 mb-3"
                            onClick={() => eliminarImagenProducto(producto.id)}
                          >
                            Eliminar imagen
                          </button>
                        )}
                    </>
                  )}

                  <input
                    className="form-control mb-3"
                    placeholder="Nombre"
                    value={producto.nombre}
                    required
                    onChange={(e) =>
                      actualizarCampo(producto.id, "nombre", e.target.value)
                    }
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Descripción"
                    value={producto.descripcion}
                    onChange={(e) =>
                      actualizarCampo(
                        producto.id,
                        "descripcion",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Precio"
                    value={producto.precio}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      actualizarCampo(
                        producto.id,
                        "precio",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                  />

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success flex-fill"
                      disabled={guardandoId === producto.id}
                    >
                      {guardandoId === producto.id ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary flex-fill"
                      onClick={() => cancelarEdicion(producto.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {producto.foto_url && (
                    <img
                      src={producto.foto_url}
                      className="img-fluid rounded mb-3"
                    />
                  )}

                  <p className="fw-bold">Nombre: {producto.nombre}</p>
                  {producto.descripcion && (
                    <p className="fw-bold">
                      Descripción: {producto.descripcion}
                    </p>
                  )}
                  <p className="fw-bold">Precio: {producto.precio}</p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => editarProducto(producto.id)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger flex-fill"
                      onClick={() => eliminarProducto(producto.id)}
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

export default BusinessProducts;
