import { useNavigate } from "react-router";
import type { Oferta } from "../../../services/offers.client";

interface Props {
  oferta: Oferta;
}

const OfferCard = ({ oferta }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ver-negocio?businessId=${oferta.negocio_id}`);
  };

  return (
    <div style={{ minWidth: "260px", maxWidth: "260px" }}>
      <div className="card h-100 shadow-sm border-success">

        {/* CONTENEDOR DE IMAGEN (siempre existe) */}
        <div style={{ height: "180px", backgroundColor: "#f1f1f1" }}>
          {oferta.foto_url ? (
            <img
              src={oferta.foto_url}
              alt={oferta.nombre}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              Sin imagen
            </div>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{oferta.nombre}</h5>

          <p className="card-text text-muted">
            {oferta.descripcion || "Sin descripción"}
          </p>

          <p className="fw-bold mb-1">
            🔥💲 {Number(oferta.precio_oferta).toLocaleString()}
          </p>

          <p className="small text-muted mb-3">
            🏪 {oferta.nombre_negocio}
          </p>

          <button className="btn btn-warning mt-auto" onClick={handleClick}>
            Ver negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
