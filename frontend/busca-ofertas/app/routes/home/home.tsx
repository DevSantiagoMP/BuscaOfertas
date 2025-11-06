import "./home.css";
import Navbar from "../../components/Navbar/Navbar";
import heroImage from "../../assets/hero-image.png";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-section">
          <div className="row">
            <div className="col-12 col-md-6 container-hero-text">
                <h1>Compra mas inteligente, vende con mayor visibilidad</h1>
                <h6 className="hero-titles">Para Clientes</h6>
                <p>
                  Encuentra las mejores ofertas cerca de ti y ahorra comparando
                  precios.
                </p>
                <h6 className="hero-titles">Para Negocios</h6>
                <p>
                  Haz crecer tu negocio publicando productos y ofertas en
                  minutos.
                </p>
            </div>

            <div className="d-none d-md-block col-md-6 container-hero-image">
              <img src={heroImage} alt="Hero Image" className="hero-image" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
