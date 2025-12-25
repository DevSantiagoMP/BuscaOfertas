import type { Business } from "../../../services/business.client";
import type { Producto } from "../../../services/products.client";
import type { Oferta } from "../../../services/offers.client";

import { obtenerNegocios } from "../../../services/business.client";
import { obtenerProductos } from "../../../services/products.client";
import { obtenerOfertas } from "../../../services/offers.client";

// Components
import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";
import SlicerButtons from "../../components/SlicerButtons/SlicerButtons";

// util
import { scrollSlider } from "../../utils/scrollSlider";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";

// CSS
import "./principal.css";

const principal = () => {
  // Estados para ontener todos los negocios
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para obtener productos y ofertas
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingOfertas, setLoadingOfertas] = useState(true);

  const { rolId, correo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // UseRef para mover cards
  const negociosRef = useRef<HTMLDivElement>(null);
  const productosRef = useRef<HTMLDivElement>(null);
  const ofertasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      /* =====================
       Negocios
    ===================== */
      try {
        const res = await obtenerNegocios();
        setBusinesses(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error("Negocios:", e);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }

      /* =====================
       Productos
    ===================== */
      try {
        const res = await obtenerProductos();
        setProductos(res.productos ?? []);
      } catch (e) {
        console.error("Productos:", e);
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }

      /* =====================
       Ofertas
    ===================== */
      try {
        const res = await obtenerOfertas();
        setOfertas(res.ofertas ?? []);
      } catch (e) {
        console.error("Ofertas:", e);
        setOfertas([]);
      } finally {
        setLoadingOfertas(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      {/* Header privado */}
      <PrivateHeader onMenuClick={() => setMenuOpen(true)} />

      {/* Menú hamburguesa */}
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        rolId={rolId}
        correo={correo}
        onLogout={logout}
      />

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
                  <option value="">Categoría</option>
                  <option value="">Comida y bebidas</option>
                  <option value="">Ropa y Accesorios</option>
                  <option value="">Belleza y Cuidado Personal</option>
                  <option value="">Hogar y Decoración</option>
                  <option value="">Tecnología</option>
                  <option value="">Mascotas</option>
                  <option value="">Salud y Bienestar</option>
                  <option value="">Vehículos y Talleres</option>
                  <option value="">Deportes y Fitness</option>
                  <option value="">Educación</option>
                  <option value="">Bebés y Niños</option>
                  <option value="">Arte y Entretenimiento</option>
                  <option value="">Otra</option>
                </select>

                <select className="filter-price" defaultValue="">
                  <option value="">Precio</option>
                  <option value="economico">Mas economico</option>
                  <option value="costoso">Mas costoso</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}

        {/* Business section */}
        <section className="business-section mt-5">
          <div className="business-container p-2">
            <div className="d-flex justify-content-between mb-4">
              <h4>Negocios</h4>
              <SlicerButtons
                onLeft={() => scrollSlider(negociosRef, "left")}
                onRight={() => scrollSlider(negociosRef, "right")}
              />
            </div>

            {loading && <p>Cargando negocios...</p>}

            <div
              ref={negociosRef}
              className="d-flex gap-4 overflow-hidden"
              style={{ scrollBehavior: "smooth" }}
            >
              {!loading && businesses.length === 0 && (
                <p>No hay negocios disponibles</p>
              )}

              {businesses.map((business) => (
                <div
                  key={business.id_negocio}
                  style={{ minWidth: "260px", maxWidth: "260px" }}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        business.foto_url ||
                        "https://via.placeholder.com/300x200?text=Sin+Imagen"
                      }
                      className="card-img-top"
                      alt={business.nombre}
                      style={{ height: "180px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{business.nombre}</h5>
                      <p className="card-text text-muted">
                        {business.descripcion || "Sin descripción"}
                      </p>

                      <p className="small mb-1">📍 {business.ciudad}</p>
                      <p className="small mb-3">📞 {business.telefono}</p>

                      <button className="btn btn-primary mt-auto">
                        Ver negocio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section className="business-section mt-5">
          <div className="products-container p-2">
            <div className="d-flex justify-content-between mb-4">
              <h4>Productos</h4>
              <SlicerButtons
                onLeft={() => scrollSlider(productosRef, "left")}
                onRight={() => scrollSlider(productosRef, "right")}
              />
            </div>

            {loadingProductos && <p>Cargando productos...</p>}

            <div
              ref={productosRef}
              className="d-flex gap-4 overflow-hidden"
              style={{ scrollBehavior: "smooth" }}
            >
              {!loadingProductos && productos.length === 0 && (
                <p>No hay productos disponibles</p>
              )}

              {productos.map((producto) => (
                <div
                  key={producto.id_producto}
                  style={{ minWidth: "260px", maxWidth: "260px" }}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        producto.foto_url ||
                        "https://via.placeholder.com/300x200?text=Producto"
                      }
                      className="card-img-top"
                      alt={producto.nombre}
                      style={{ height: "180px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{producto.nombre}</h5>

                      <p className="card-text text-muted">
                        {producto.descripcion || "Sin descripción"}
                      </p>

                      <p className="fw-bold mb-1">
                        💲 {Number(producto.precio).toLocaleString()}
                      </p>

                      <p className="small text-muted mb-3">
                        🏪 {producto.nombre_negocio}
                      </p>

                      <button className="btn btn-success mt-auto">
                        Ver negocio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offers section */}
        <section className="business-section mt-5">
          <div className="offers-container p-2">
            <div className="d-flex justify-content-between mb-4">
              <h4>Ofertas</h4>
              <SlicerButtons
                onLeft={() => scrollSlider(ofertasRef, "left")}
                onRight={() => scrollSlider(ofertasRef, "right")}
              />
            </div>

            {loadingOfertas && <p>Cargando ofertas...</p>}

            <div
              ref={ofertasRef}
              className="d-flex gap-4 overflow-hidden"
              style={{ scrollBehavior: "smooth" }}
            >
              {!loadingOfertas && ofertas.length === 0 && (
                <p>No hay ofertas disponibles</p>
              )}

              {ofertas.map((oferta) => (
                <div
                  key={oferta.id_oferta}
                  style={{ minWidth: "260px", maxWidth: "260px" }}
                >
                  <div className="card h-100 shadow-sm border-success">
                    <img
                      src={
                        oferta.foto_url ||
                        "https://via.placeholder.com/300x200?text=Oferta"
                      }
                      className="card-img-top"
                      alt={oferta.nombre}
                      style={{ height: "180px", objectFit: "cover" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{oferta.nombre}</h5>

                      <p className="card-text text-muted">
                        {oferta.descripcion || "Sin descripción"}
                      </p>

                      <p className="fw-bold text-success mb-1">
                        🔥 {Number(oferta.precio_oferta).toLocaleString()}
                      </p>

                      <p className="small text-muted mb-3">
                        🏪 {oferta.nombre_negocio}
                      </p>

                      <button className="btn btn-warning mt-auto">
                        Ver negocio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default principal;
