import "./Logo.css";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="logo-container">
      <img src="/logo-busca-ofertas.png" alt="BuscaOfertas Logo" />
      <span className="nombre-marca">BuscaOfertas</span>
    </Link>
  );
};

export default Logo;
