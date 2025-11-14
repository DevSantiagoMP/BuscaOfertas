//Components
import Logo from "../../components/Logo/Logo";
//CSS
import "./principal.css";

const principal = () => {
  return (
    <>
      <header className="personal-header py-2">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <Logo />

            {/* Botón hamburguesa */}
            <button
              className="btn border-0 d-md-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
            >
              <i className="bi bi-list" style={{ fontSize: "1.8rem" }}></i>
            </button>

            {/* En desktop se siguen mostrando los botones normales */}
            <div className="d-none d-md-flex align-items-center gap-2">
              <button className="personal-header-button">
                Administrar mi negocio
              </button>
              <button className="close-button">Cerrar sesion</button>
            </div>
          </div>
        </div>
      </header>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">
            Menú
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column gap-4">
          <button className="personal-header-button w-100">
            Administrar mi negocio
          </button>
          <button className="close-button w-100">Cerrar sesion</button>
        </div>
      </div>

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
                <p>Filtrar por:</p>

                {/* Category */}
                <select className="select" defaultValue="">
                  <option value="" disabled>
                    Categoría
                  </option>
                  <option value="ropa">Ropa</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                </select>

                {/* Price */}
                <select className="select" defaultValue="">
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

        {/* Negocios */}
        <section className="business-section mt-5">
          <h4>Negocios</h4>
        </section>

        {/* Productos */}
        <section className="business-section mt-5">
          <h4>Productos</h4>
        </section>

        {/* Ofertas */}
        <section className="business-section mt-5">
          <h4>Ofertas</h4>
        </section>
      </main>
    </>
  );
};

export default principal;
