import "./home.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
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
                {/* Buttons */}
                <button className="login-button">Iniciar Sesión</button>
                <button className="register-button">Registrarse</button>
              </div>
              <div className="container-hero-link">
                {/* Link */}
                <Link to="/principal" className="hero-link">
                  Explora ofertas sin registrarte
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="d-none d-xl-block col-xl-6 align-self-center">
              <img src={heroImage} alt="Hero Image" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="benefits">
        <div className="container container-benefit text-center text-md-start">
          <div className="row">
            {/* First benefit */}
            <div className="col-md-4">
              <i className="bi bi-cart-dash cart-icon ms-md-5"></i>
              <h5 className="first-benefit-title">Para clientes</h5>
              <p>Encuentra ofertas</p>
            </div>

            {/* Second benefit */}
            <div className="col-md-4">
              <i className="bi bi-shop shop-icon"></i>
              <h5 className="second-benefit-title">Para negocios</h5>
              <p>Publica productos y ofertas fácil y rápido.</p>
            </div>

            {/* Third benefit */}
            <div className="col-md-4">
              <i className="bi bi-piggy-bank piggy-icon"></i>
              <h5 className="third-benefit-title">
                Planes accesibles para negocios
              </h5>
              <p> * Plan gratuito: Registra 20 productos.</p>
              <p>
                * Con suscripción: Registra productos ilimitados y adquiere más
                visibilidad.
              </p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="container">
          <div className="row justify-content-center gap-md-4">
            <div className="col-md-4 plan-container">
              <h5>Registra productos ilimitados.</h5>
              <p> Plan mensual desde <br />10.000 COP.</p>
              <button>Adquirir plan</button>
            </div>

             <div className="col-md-4 plan-container">
              <h5>Registra productos ilimitados.</h5>
              <p>Plan anual desde <br />110.000 COP.</p>
              <button>Adquirir plan</button>
            </div>
          </div>
        </div>

        <Footer/>

      </section>
    </>
  );
}
