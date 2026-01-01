import { Link, useLocation } from "react-router";
import "../Menu/Menu.css";

interface PublicMenuProps {
  open: boolean;
  onClose: () => void;
}

const PublicMenu = ({ open, onClose }: PublicMenuProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isPrincipal = pathname === "/principal";
  const isAdmin = pathname === "/administrar-negocio";

  return (
    <>
      {/* Backdrop */}
      {open && <div className="menu-backdrop" onClick={onClose} />}

      <aside className={`menu-offcanvas ${open ? "open" : ""}`}>
        <div className="offcanvas-header p-2">
          <h5>Menú</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="offcanvas-body d-flex flex-column gap-4 mt-3">

          {!isPrincipal && (
            <Link to="/principal" onClick={onClose}>
              <button className="principal-menu-button w-100">
                Negocios / Productos / Ofertas
              </button>
            </Link>
          )}

          {!isAdmin && (
            <Link to="/administrar-negocio" onClick={onClose}>
              <button className="admin-menu-button w-100">
                Administra tu negocio
              </button>
            </Link>
          )}

        </div>
      </aside>
    </>
  );
};

export default PublicMenu;
