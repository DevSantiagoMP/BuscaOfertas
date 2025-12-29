import { useNavigate } from "react-router";
import type { Producto } from "../../../services/products.client";

interface Props {
  producto: Producto;
}

const ProductCard = ({ producto }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ver-negocio?businessId=${producto.negocio_id}`);
  };

  return (
    <div style={{ minWidth: "260px", maxWidth: "260px" }}>
      <div className="card h-100 shadow-sm">
        <img
          src={
            producto.foto_url ||
            "https://via.placeholder.com/300x200?text=Producto"
          }
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: "180px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombre}</h5>

          <p className="card-text text-muted">
            {producto.descripcion || "Sin descripción"}
          </p>

          <p className="fw-bold mb-1">
            💲 {Number(producto.precio).toLocaleString()}
          </p>

          <p className="small text-success mb-3">
            🏪 {producto.nombre_negocio}
          </p>

          <button className="btn btn-success mt-auto" onClick={handleClick}>
            Ver negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
