import "./Logo.css";

const Logo = () => {
  return (
      <div className="d-flex gap-2 align-items-end">
        <img src="/logo-busca-ofertas.png" alt="Logo" />
        <p className="nombre-marca">BuscaOfertas</p>
      </div>
  );
};

export default Logo;
