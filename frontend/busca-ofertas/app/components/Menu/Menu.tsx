import { Link, useNavigate, useLocation } from "react-router";
import "./Menu.css";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  rolId: number | null;
  correo: string | null;
  onLogout: () => void;
}

const Menu = ({ open, onClose, rolId, correo, onLogout }: MenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const isPrincipal = pathname === "/principal";
  const isAdmin = pathname === "/administrar-negocio";

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && <div className="menu-backdrop" onClick={onClose} />}

      <aside className={`menu-offcanvas ${open ? "open" : ""}`}>
        <div className="offcanvas-header p-2">
          <h5>Menú</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="d-flex flex-column justify-content-center align-items-center">
          <i className="bi bi-person-circle user-icon"></i>
          <p>{correo ?? "Cargando..."}</p>
        </div>

        <div className="offcanvas-body d-flex flex-column gap-4">

          {rolId === 2 && !isAdmin && (
            <Link to="/administrar-negocio" onClick={onClose}>
              <button className="admin-menu-button w-100">
                Administrar mi negocio
              </button>
            </Link>
          )}

          {rolId === 2 && !isPrincipal && (
            <Link to="/principal" onClick={onClose}>
              <button className="principal-menu-button w-100">Página principal</button>
            </Link>
          )}

          <button className="close-section w-100" onClick={handleLogoutClick}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Menu;
