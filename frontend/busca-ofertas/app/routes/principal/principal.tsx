// Components
import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";

// Hooks
import { useAuth } from "../../hooks/useAuth";

// CSS
import "./principal.css";

const principal = () => {
  const { rolId, correo, logout } = useAuth();

  return (
    <>
      {/* Header privado */}
      <PrivateHeader />

      {/* Menú hamburguesa */}
      <Menu rolId={rolId} correo={correo} onLogout={logout} />

      {/* Principal-section */}
      <main className="principal-section min-vh-100">
        {/* Search bar */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex w-100">
                <input
                  type="text"
                  placeholder="Buscar"
                  className="personal-search-bar"
                />
                <button className="personal-search-button">
                  <i className="bi bi-search search-icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="filters-container d-flex flex-wrap gap-2 flex-column flex-md-row">
                <p className="text-filters-container">Filtrar por:</p>

                <select className="filter-category" defaultValue="">
                  <option value="" disabled>
                    Categoría
                  </option>
                  <option value="ropa">Ropa</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                </select>

                <select className="filter-price" defaultValue="">
                  <option value="" disabled>
                    Precio
                  </option>
                  <option value="economico">Mas economico</option>
                  <option value="costoso">Mas costoso</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <section className="business-section mt-5">
          <h4>Negocios</h4>
        </section>

        <section className="business-section mt-5">
          <h4>Productos</h4>
        </section>

        <section className="business-section mt-5">
          <h4>Ofertas</h4>
        </section>
      </main>
    </>
  );
};

export default principal;
