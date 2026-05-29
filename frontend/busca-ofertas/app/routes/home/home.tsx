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
      <section>
        <div className="hero-section">
          <div className="container">
            <div className="row">
              <div className="col-12 col-xl-6 container-hero-text">
                <h1>Compra más inteligente, vende con mayor visibilidad.</h1>
                <h6 className="hero-titles">Para Usuarios</h6>
                <p>
                  Encuentra las mejores ofertas y ahorra comparando precios.
                </p>
                <h6 className="hero-titles">Para Negocios</h6>
                <p>
                  Haz crecer tu negocio publicando productos y ofertas en
                  minutos.
                </p>
                <div className="d-flex gap-4 container-hero-buttons">
                  {/* Buttons */}
                  <Link to="/principal">
                    <button className="login-button">Iniciar Sesión</button>
                  </Link>

                  <Link to="/opciones-registro">
                    <button className="register-button">Registrarse</button>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="d-none d-xl-block col-xl-6 align-self-center">
                <img src={heroImage} alt="Hero Image" className="hero-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="benefits">
        <div className="container-benefit">
        <div className="container text-center text-md-start">
          <div className="row">
            {/* First benefit */}
            <div className="col-md-4">
              <i className="bi bi-cart-dash cart-icon ms-md-5"></i>
              <h5 className="first-benefit-title">Para usuarios</h5>
              <p>Encuentra negocios, productos y ofertas</p>
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
              <p>
                * Plan fundadores: Los primeros 500 negocios en registrarse
                podrán registrar productos y ofertas ilimitadas y obtendrán
                mayor visibilidad ¡POR 4 MESES!
              </p>
              <p>
                * Plan primeros pasos: Si registras tu negocio por primera vez (aunque no estes entre los primeros 500)
                podrás registrar 30 productos y 30 ofertas por 4 meses.
              </p>
              <p>
                * Plan gratuito: Podrás registrar 10 productos y 10 ofertas.
              </p>
              <p>
                * Con suscripción: Registra productos ilimitados y adquiere más
                visibilidad (Aplica para: Plan mensual y anual).
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Plans */}
        <div className="container">
          <div className="row justify-content-center gap-md-4">
            <div className="col-md-4 plan-container">
              <h5>Registra productos y ofertas ilimitadas.</h5>
              <p>
                Plan mensual
              </p> {/* <br /> desde 10.000 COP */}
              {/* <Link to="/plan-mensual">
                <button>Adquirir plan</button>
              </Link> */}
              <h4>(Proximamente)</h4>
            </div>

            <div className="col-md-4 plan-container">
              <h5>Registra productos y ofertas ilimitadas.</h5>
              <p>
                Plan anual 
              </p> {/* <br /> desde 100.000 COP */}
              {/*<Link to="/plan-anual">
                <button>Adquirir plan</button>
              </Link>  */}
              <h4>(Proximamente)</h4>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}
