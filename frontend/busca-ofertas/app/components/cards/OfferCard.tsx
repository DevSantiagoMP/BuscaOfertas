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
        <img
          src={
            oferta.foto_url || "https://via.placeholder.com/300x200?text=Oferta"
          }
          className="card-img-top"
          alt={oferta.nombre}
          style={{ height: "180px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{oferta.nombre}</h5>

          <p className="card-text text-muted">
            {oferta.descripcion || "Sin descripción"}
          </p>

          <p className="fw-bold mb-1">
            🔥💲 {Number(oferta.precio_oferta).toLocaleString()}
          </p>

          <p className="small text-muted mb-3">🏪 {oferta.nombre_negocio}</p>

          <button className="btn btn-warning mt-auto" onClick={handleClick}>
            Ver negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
