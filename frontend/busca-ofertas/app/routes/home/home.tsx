import "./home.css";
import Navbar from "../../components/Navbar/Navbar";
import heroImage from "../../assets/hero-image.png";
import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-section">
          <div className="row">
            <div className="col-12 col-xl-6 container-hero-text">
              <h1>Compra mas inteligente, vende con mayor visibilidad</h1>
              <h6 className="hero-titles">Para Clientes</h6>
              <p>
                Encuentra las mejores ofertas cerca de ti y ahorra comparando
                precios.
              </p>
              <h6 className="hero-titles">Para Negocios</h6>
              <p>
                Haz crecer tu negocio publicando productos y ofertas en minutos.
              </p>
              <div className="d-flex gap-4 container-hero-buttons">
                <button className="login-button">Iniciar Sesión</button>
                <button className="register-button">Registrarse</button>
              </div>
              <div className="container-hero-link">
                <Link to="/principal" className="hero-link">Explora ofertas sin registrarte</Link>
              </div>
            </div>

            <div className="d-none d-xl-block col-xl-6 align-self-center">
              <img src={heroImage} alt="Hero Image" className="hero-image" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
