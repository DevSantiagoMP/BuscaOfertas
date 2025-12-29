import { useEffect, useState } from "react";
import {
  obtenerNegocioPorId,
  type BusinessDetail,
} from "../../../../services/business.client";

interface Props {
  businessId: number;
}

const BusinessInfo = ({ businessId }: Props) => {
  const [negocio, setNegocio] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await obtenerNegocioPorId(businessId);
        setNegocio(response.data);
      } catch (error) {
        console.error("Error cargando negocio", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  if (loading) return <p>Cargando negocio...</p>;
  if (!negocio) return <p>No se encontró el negocio</p>;

  return (
    <div className="container section-container mb-5">
      <h3 className="mb-4">Datos del negocio</h3>

      <div className="row align-items-center">
        {negocio.foto_url && (
          <div className="col-12 col-md-4 text-center mb-3">
            <img
              src={negocio.foto_url}
              alt={negocio.nombre}
              className="img-fluid rounded preview-img"
              style={{ maxWidth: "250px" }}
            />
          </div>
        )}

        <div className="col-12 col-md-8">
          <p><strong>Nombre:</strong> {negocio.nombre}</p>
          <p><strong>Descripción:</strong> {negocio.descripcion}</p>
          <p><strong>Ciudad:</strong> {negocio.ciudad}</p>
          <p><strong>Dirección:</strong> {negocio.direccion}</p>
          <p><strong>Teléfono:</strong> {negocio.telefono}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
