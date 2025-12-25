import { useState, useEffect } from "react";
import {
  crearProducto,
  actualizarProducto,
  eliminarProductoApi,
  obtenerMisProductos,
} from "../../../../services/products.client";
import { uploadImageToCloudinary } from "../../../../services/cloudinary.client";

/* =====================
   Tipos
===================== */
interface Producto {
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

const BusinessProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  /* =====================
     Cargar productos
  ===================== */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerMisProductos();

        const productosFormateados: Producto[] = data.productos.map(
          (p: any) => ({
            id: p.id_producto,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            imagen: null,
            foto_url: p.foto_url,
            foto_public_id: p.foto_public_id,
            editando: false,
            isNew: false, // ✅ vienen del backend
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

  /* =====================
     Agregar producto
  ===================== */
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
        editando: true,
        isNew: true, // ✅ nuevo
      },
    ]);

    setContadorId((prev) => prev + 1);
  };

  /* =====================
     Guardar producto
  ===================== */
  const guardarProducto = async (producto: Producto) => {
    setGuardandoId(producto.id);

    try {
      let foto_url = producto.foto_url ?? null;
      let foto_public_id = producto.foto_public_id ?? null;

      if (producto.imagen) {
        const upload = await uploadImageToCloudinary(producto.imagen);
        foto_url = upload.secure_url;
        foto_public_id = upload.public_id;
      }

      // 🟢 CREAR
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
                  isNew: false, // ✅ normalizado
                }
              : p
          )
        );
      }
      // 🟡 ACTUALIZAR
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
                }
              : p
          )
        );
      }
    } catch (error: any) {
      alert(error.message || "Error al guardar producto");
    } finally {
      setGuardandoId(null);
    }
  };

  /* =====================
     Cancelar edición
  ===================== */
  const cancelarEdicion = (id: number) => {
    setProductos((prev) => {
      const producto = prev.find((p) => p.id === id);
      if (!producto) return prev;

      // 🟢 Producto nuevo → eliminar
      if (producto.isNew) {
        return prev.filter((p) => p.id !== id);
      }

      // 🟡 Producto existente → salir de edición
      return prev.map((p) =>
        p.id === id ? { ...p, editando: false } : p
      );
    });
  };

  /* =====================
     Editar producto
  ===================== */
  const editarProducto = (id: number) => {
    if (productos.some((p) => p.editando)) return;

    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, editando: true } : p))
    );
  };

  /* =====================
     Eliminar producto
  ===================== */
  const eliminarProducto = async (id: number) => {
    try {
      await eliminarProductoApi(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar producto");
    }
  };

  /* =====================
     Actualizar campo
  ===================== */
  const actualizarCampo = (id: number, campo: keyof Producto, valor: any) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  /* =====================
     Render
  ===================== */
  return (
    <div className="container section-container mb-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-6">
          <h3 className="mb-4 mb-md-0">Productos</h3>
        </div>

        <div className="col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
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
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        e.target.files &&
                        actualizarCampo(
                          producto.id,
                          "imagen",
                          e.target.files[0]
                        )
                      }
                    />
                  </label>

                  {(producto.imagen || producto.foto_url) && (
                    <img
                      src={
                        producto.imagen
                          ? URL.createObjectURL(producto.imagen)
                          : producto.foto_url!
                      }
                      className="img-fluid rounded mt-2 mb-3"
                      style={{ maxHeight: "180px", objectFit: "cover" }}
                    />
                  )}

                  <input
                    className="form-control mb-3"
                    placeholder="Nombre"
                    value={producto.nombre}
                    onChange={(e) =>
                      actualizarCampo(producto.id, "nombre", e.target.value)
                    }
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Descripción (opcional)"
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
                    type="number"
                    className="form-control mb-3"
                    placeholder="Precio"
                    value={producto.precio}
                    onChange={(e) =>
                      actualizarCampo(producto.id, "precio", e.target.value)
                    }
                    required
                  />

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success flex-fill d-flex align-items-center justify-content-center gap-2"
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
                      style={{ maxHeight: "160px", objectFit: "cover" }}
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