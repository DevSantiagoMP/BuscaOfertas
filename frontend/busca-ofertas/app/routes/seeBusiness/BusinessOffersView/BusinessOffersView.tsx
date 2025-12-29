import { useEffect, useState } from "react";
import {
  obtenerOfertasPorNegocio,
  type OfertaPublica,
} from "../../../../services/offers.client";

interface Props {
  businessId: number;
}

const BusinessOffersView = ({ businessId }: Props) => {
  const [ofertas, setOfertas] = useState<OfertaPublica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await obtenerOfertasPorNegocio(businessId);
        setOfertas(response.data);
      } catch (error) {
        console.error("Error cargando ofertas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [businessId]);

  if (loading) return <p>Cargando ofertas...</p>;

  return (
    <div className="container section-container mb-5">
      <h3 className="mb-4">Ofertas</h3>

      <div className="row">
        {ofertas.length === 0 && <p>No hay ofertas</p>}

        {ofertas.map((oferta) => (
          <div key={oferta.id_oferta} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm p-3">
              {oferta.foto_url && (
                <img
                  src={oferta.foto_url}
                  className="img-fluid rounded mb-3"
                />
              )}

              <p className="fw-bold">Nombre: {oferta.nombre}</p>
              {oferta.descripcion && (
                <p className="fw-bold">
                  Descripción: {oferta.descripcion}
                </p>
              )}
              <p className="fw-bold text-success">
                Precio: ${oferta.precio_oferta.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessOffersView;
