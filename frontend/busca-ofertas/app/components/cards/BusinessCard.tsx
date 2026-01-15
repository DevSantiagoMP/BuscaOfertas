import { useNavigate } from "react-router";
import type { Business } from "../../../services/business.client";

interface Props {
  business: Business;
}

const BusinessCard = ({ business }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ver-negocio?businessId=${business.id_negocio}`);
  };

  return (
    <div style={{ minWidth: "260px", maxWidth: "260px" }}>
      <div className={`card shadow-sm ${business.foto_url ? "h-100" : ""}`}>
        {business.foto_url && (
          <div style={{ height: "180px" }}>
            <img
              src={business.foto_url}
              alt={business.nombre}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{business.nombre}</h5>

          <p className="card-text text-muted">
            {business.descripcion || "Sin descripción"}
          </p>

          <p className="small mb-1">📍 {business.ciudad}</p>
          <p className="small mb-3">📞 {business.telefono}</p>

          <button className="btn btn-primary mt-auto" onClick={handleClick}>
            Ver negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
