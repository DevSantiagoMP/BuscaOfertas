//Components
import Logo from "../../components/Logo/Logo";

import { useEffect, useState } from "react";

import { Link } from "react-router";

//CSS
import "./principal.css";

const principal = () => {
  // Estado para boton administrar negocio
  const [rolId, setRolId] = useState<number | null>(null);
  // Estado para correo
  const [correo, setCorreo] = useState<string | null>(null);

  useEffect(() => {
  const fetchSession = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/check-session",
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setRolId(data.usuario.rol);
      setCorreo(data.usuario.correo);
    } catch (err) {
      console.error("Error obteniendo sesión", err);
    }
  };

  fetchSession();
}, []);

  return (
    <>
      {/* Header */}
      <header className="personal-header py-2">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <Logo />

            {/* Botón hamburguesa */}
            <button
              className="btn border-0"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
            >
              <i className="bi bi-list" style={{ fontSize: "1.8rem" }}></i>
            </button>
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
          {/* Al tocar el menu hamburguesa se muestra */}
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

        {/* Logo usuario y correo */}
        <div className="d-flex flex-column justify-content-center align-items-center">
          <i className="bi bi-person-circle user-icon"></i>
          <p>{correo ?? "Cargando..."}</p>
        </div>

        {/* Botones adicionales */}
        <div className="offcanvas-body d-flex flex-column gap-4">
          {rolId === 2 && (
            <Link to="/administrar-negocio">
              <button className="personal-header-button w-100">
                Administrar mi negocio
              </button>
            </Link>
          )}
          <button className="close-section w-100">Cerrar sesion</button>
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
                <p className="text-filters-container">Filtrar por:</p>

                {/* Category */}
                <select className="filter-category" defaultValue="">
                  <option value="" disabled>
                    Categoría
                  </option>
                  <option value="ropa">Ropa</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                </select>

                {/* Price */}
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
