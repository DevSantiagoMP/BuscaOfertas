import "./Footer.css";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-4">
            <h6>Encuentra:</h6>
            <Link to="/principal">Ofertas</Link>
            <Link to="/administrar-negocio">Administra tu negocio</Link>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>información de contacto:</h6>
            <p>📍Dirección: Colombia, Bogota</p>
            <p>📱Teléfono: +57 3219596318</p>
            <p>📧 Email: BuscaOfertas@gmail.com</p>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>Siguenos en nuestras redes sociales:</h6>
            {/* Cambiar por enlaces reales */}
            <Link to="#">Facebook</Link> 
            <Link to="#">Instagram</Link>
            <Link to="#">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
