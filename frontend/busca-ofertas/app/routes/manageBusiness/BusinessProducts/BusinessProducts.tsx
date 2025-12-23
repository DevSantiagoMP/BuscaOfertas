import { useState } from "react";

// Definir cada variable de los productos
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  imagen?: File | null;
  editando: boolean;
}

const BusinessProducts = () => {
  // Estado que define un arreglo para los productos
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado que define un id para cada producto
  const [contadorId, setContadorId] = useState(1);

  const agregarProducto = () => {
    // Si se esta editando un producto no se puede agregar otro
    const yaEditando = productos.some((p) => p.editando);
    if (yaEditando) return;

    const nuevoProducto: Producto = {
      id: contadorId,
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: null,
      editando: true,
    };

    setProductos((prev) => [...prev, nuevoProducto]);
    setContadorId(contadorId + 1);
  };

  const guardarProducto = (id: number) => {
    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, editando: false } : prod
      )
    );
  };

  const cancelarEdicion = (id: number) => {
    setProductos((prev) => prev.filter((prod) => prod.id !== id));
  };

  const editarProducto = (id: number) => {
    const yaEditando = productos.some((p) => p.editando);
    if (yaEditando) return;

    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, editando: true } : prod
      )
    );
  };

  const eliminarProducto = (id: number) => {
    setProductos((prev) => prev.filter((prod) => prod.id !== id));
  };

  const actualizarCampo = (
    id: number,
    campo: keyof Producto,
    valor: any
  ) => {
    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, [campo]: valor } : prod
      )
    );
  };

  return (
    <>
      <div className="container section-container mb-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <h3 className="mb-4 mb-md-0">Productos</h3>
          </div>

          <div className="col-12 col-md-6 mb-3 d-flex justify-content-center justify-content-md-end">
            <button
              className="button-section-container"
              onClick={agregarProducto}
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
                      guardarProducto(producto.id);
                    }}
                  >
                    {/* Imagen */}
                    <label
                      htmlFor={`imagen-${producto.id}`}
                      className="custom-file-upload"
                    >
                      Toca aquí para añadir una foto (opcional)
                    </label>

                    <input
                      type="file"
                      id={`imagen-${producto.id}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          actualizarCampo(producto.id, "imagen", e.target.files[0]);
                        }
                      }}
                    />

                    {producto.imagen && (
                      <img
                        src={URL.createObjectURL(producto.imagen)}
                        alt="Previsualización"
                        className="img-fluid rounded mt-2 mb-3"
                        style={{ maxHeight: "180px", objectFit: "cover" }}
                      />
                    )}

                    {/* Nombre */}
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Nombre del producto"
                      value={producto.nombre}
                      onChange={(e) =>
                        actualizarCampo(producto.id, "nombre", e.target.value)
                      }
                      required
                    />

                    {/* Descripción */}
                    <textarea
                      className="form-control mb-3"
                      placeholder="Descripción (opcional)"
                      value={producto.descripcion}
                      onChange={(e) =>
                        actualizarCampo(producto.id, "descripcion", e.target.value)
                      }
                    />

                    {/* Precio */}
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

                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className="btn btn-success flex-fill">
                        Guardar
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
                    {producto.imagen && (
                      <img
                        src={URL.createObjectURL(producto.imagen)}
                        alt={producto.nombre}
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: "160px", objectFit: "cover" }}
                      />
                    )}

                    <p className="fw-bold">Nombre: {producto.nombre}</p>
                    {producto.descripcion && (
                      <p className="fw-bold">Descripción: {producto.descripcion}</p>
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
    </>
  );
};

export default BusinessProducts;