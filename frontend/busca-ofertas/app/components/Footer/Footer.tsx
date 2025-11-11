import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-4">
            <h6>Encuentra:</h6>
            <p>Ofertas</p>
            <p>Administra tu negocio</p>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>informacion de contacto:</h6>
            <p>📍Dirección: Colombia, Bogota</p>
            <p>📱Teléfono: +57 3219596318</p>
            <p>📧 Email: BuscaOfertas@gmail.com</p>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <h6>Redes sociales:</h6>
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
