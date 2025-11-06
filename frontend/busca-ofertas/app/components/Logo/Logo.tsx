import "./Logo.css";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="text-decoration-none text-dark">
      <div className="d-flex gap-2 align-items-end">
        <img src="/logo-busca-ofertas.png" alt="Logo" />
        <p className="nombre-marca">BuscaOfertas</p>
      </div>
    </Link>
  );
};

export default Logo;
