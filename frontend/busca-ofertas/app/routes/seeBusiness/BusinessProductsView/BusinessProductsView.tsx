import { useEffect, useState } from "react";
import {
  obtenerProductosPorNegocio,
  type ProductoPublico,
} from "../../../../services/products.client";

interface Props {
  businessId: number;
}

const BusinessProductsView = ({ businessId }: Props) => {
  const [productos, setProductos] = useState<ProductoPublico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await obtenerProductosPorNegocio(businessId);
        setProductos(response.data);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [businessId]);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="container section-container mb-5">
      <h3 className="mb-4">Productos</h3>

      <div className="row">
        {productos.length === 0 && <p>No hay productos</p>}

        {productos.map((producto) => (
          <div key={producto.id_producto} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3">
              {producto.foto_url && (
                <img
                  src={producto.foto_url}
                  className="img-fluid rounded mb-3"
                />
              )}

              <p className="fw-bold">Nombre: {producto.nombre}</p>
              {producto.descripcion && (
                <p className="fw-bold">Descripción: {producto.descripcion}</p>
              )}
              <p className="fw-bold text-success">
                Precio: ${producto.precio.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessProductsView;
