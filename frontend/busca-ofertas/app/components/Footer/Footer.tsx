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
            <Link to="/terminos-condiciones">Términos y condiciones</Link>
            <Link to="/politica-de-privacidad">Política de privacidad</Link>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>información de contacto:</h6>
            <p>📍Dirección: Colombia, Bogota</p>
            {/* <p>📱Teléfono: +57 3219596318</p> */}
            <p>📧 Email: buscaofertasprueba@gmail.com</p>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>Siguenos en nuestras redes sociales:</h6>
            {/* Cambiar por enlaces reales */}
            <a
              href="https://www.facebook.com/profile.php?id=61586957611495"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/buscaofertas.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://x.com/BuscaOfertas_co"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>

            <a
              href="https://www.tiktok.com/@buscaofertas.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
