import type { Route } from "./+types/principal";
import { requireAuth } from "../../../services/auth.server";

import type { Business } from "../../../services/business.client";
import type { Producto } from "../../../services/products.client";
import type { Oferta } from "../../../services/offers.client";

import {
  obtenerNegocios,
  obtenerNegociosPorCategoria,
} from "../../../services/business.client";
import { filtrarProductos } from "../../../services/products.client";
import { filtrarOfertas } from "../../../services/offers.client";

// Components
import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";
import SlicerButtons from "../../components/SlicerButtons/SlicerButtons";

// Cards
import BusinessCard from "../../components/cards/BusinessCard";
import ProductCard from "../../components/cards/ProductCard";
import OfferCard from "../../components/cards/OfferCard";

// utils
import { scrollSlider } from "../../utils/scrollSlider";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";

// CSS
import "./principal.css";

/* =====================
  Utils
===================== */
const mapOrdenPrecio = (
  orden?: "economico" | "costoso"
): "asc" | "desc" | undefined => {
  if (orden === "economico") return "asc";
  if (orden === "costoso") return "desc";
  return undefined;
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request); // o requireRole(request, X)
  return null;
}

const Principal = () => {
  // Estados
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const [loading, setLoading] = useState({
    negocios: false,
    productos: false,
    ofertas: false,
  });

  const { rolId, correo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [ordenPrecio, setOrdenPrecio] = useState<
    "economico" | "costoso" | undefined
  >();

  // Sliders
  const negociosRef = useRef<HTMLDivElement>(null);
  const productosRef = useRef<HTMLDivElement>(null);
  const ofertasRef = useRef<HTMLDivElement>(null);

  // Obtener datos
  const fetchNegocios = async () => {
    setLoading((l) => ({ ...l, negocios: true }));
    try {
      const res = categoriaId
        ? await obtenerNegociosPorCategoria(categoriaId)
        : await obtenerNegocios();

      setBusinesses(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Negocios:", e);
      setBusinesses([]);
    } finally {
      setLoading((l) => ({ ...l, negocios: false }));
    }
  };

  const fetchProductos = async () => {
    setLoading((l) => ({ ...l, productos: true }));
    try {
      const res = await filtrarProductos({
        nombre: search || undefined,
        categoriaId,
        orden: mapOrdenPrecio(ordenPrecio),
      });

      setProductos(res.productos ?? []);
    } catch (e) {
      console.error("Productos:", e);
      setProductos([]);
    } finally {
      setLoading((l) => ({ ...l, productos: false }));
    }
  };

  const fetchOfertas = async () => {
    setLoading((l) => ({ ...l, ofertas: true }));
    try {
      const res = await filtrarOfertas({
        nombre: search || undefined,
        categoriaId,
        orden: mapOrdenPrecio(ordenPrecio),
      });

      setOfertas(res.ofertas ?? []);
    } catch (e) {
      console.error("Ofertas:", e);
      setOfertas([]);
    } finally {
      setLoading((l) => ({ ...l, ofertas: false }));
    }
  };

  const aplicarFiltros = async () => {
    await Promise.all([fetchNegocios(), fetchProductos(), fetchOfertas()]);
  };

  // Efectos en filtros
  useEffect(() => {
    aplicarFiltros();
  }, [categoriaId, ordenPrecio]);

  useEffect(() => {
    if (search.trim() === "") {
      aplicarFiltros();
      return;
    }

    const timeout = setTimeout(aplicarFiltros, 450);
    return () => clearTimeout(timeout);
  }, [search]);

  // Render
  return (
    <>
      <PrivateHeader onMenuClick={() => setMenuOpen(true)} />

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        rolId={rolId}
        correo={correo}
        onLogout={logout}
      />

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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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

                <select
                  className="filter-category"
                  value={categoriaId ?? ""}
                  onChange={(e) =>
                    setCategoriaId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Categoría</option>
                  <option value="1">Comida y bebidas</option>
                  <option value="2">Ropa y Accesorios</option>
                  <option value="3">Belleza</option>
                  <option value="4">Hogar</option>
                  <option value="5">Tecnología</option>
                  <option value="6">Mascotas</option>
                  <option value="7">Salud y Bienestar</option>
                  <option value="8">Vehículos y Talleres</option>
                  <option value="9">Deportes y Fitness</option>
                  <option value="10">Educación</option>
                  <option value="11">Bebés y Niños</option>
                  <option value="12">Arte y Entretenimiento</option>
                  <option value="13">Otra</option>

                </select>

                <select
                  className="filter-price"
                  value={ordenPrecio ?? ""}
                  onChange={(e) =>
                    setOrdenPrecio(
                      e.target.value
                        ? (e.target.value as "economico" | "costoso")
                        : undefined
                    )
                  }
                >
                  <option value="">Precio</option>
                  <option value="economico">Más económico</option>
                  <option value="costoso">Más costoso</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Negocios */}
        <section className="mt-5">
          <div className="d-flex justify-content-between mb-3">
            <h4>Negocios</h4>
            <SlicerButtons
              onLeft={() => scrollSlider(negociosRef, "left")}
              onRight={() => scrollSlider(negociosRef, "right")}
            />
          </div>

          {loading.negocios && <p>Cargando negocios...</p>}

          <div ref={negociosRef} className="d-flex gap-4 overflow-hidden">
            {!loading.negocios && businesses.length === 0 && (
              <p>No hay negocios disponibles</p>
            )}

            {businesses.map((b) => (
              <BusinessCard key={b.id_negocio} business={b} />
            ))}
          </div>
        </section>

        {/* Productos */}
        <section className="mt-5">
          <div className="d-flex justify-content-between mb-3">
            <h4>Productos</h4>
            <SlicerButtons
              onLeft={() => scrollSlider(productosRef, "left")}
              onRight={() => scrollSlider(productosRef, "right")}
            />
          </div>

          {loading.productos && <p>Cargando productos...</p>}

          <div ref={productosRef} className="d-flex gap-4 overflow-hidden">
            {!loading.productos && productos.length === 0 && (
              <p>No hay productos disponibles</p>
            )}

            {productos.map((p) => (
              <ProductCard key={p.id_producto} producto={p} />
            ))}
          </div>
        </section>

        {/* Ofertas */}
        <section className="mt-5">
          <div className="d-flex justify-content-between mb-3">
            <h4>Ofertas</h4>
            <SlicerButtons
              onLeft={() => scrollSlider(ofertasRef, "left")}
              onRight={() => scrollSlider(ofertasRef, "right")}
            />
          </div>

          {loading.ofertas && <p>Cargando ofertas...</p>}

          <div ref={ofertasRef} className="d-flex gap-4 overflow-hidden">
            {!loading.ofertas && ofertas.length === 0 && (
              <p>No hay ofertas disponibles</p>
            )}

            {ofertas.map((o) => (
              <OfferCard key={o.id_oferta} oferta={o} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Principal;
