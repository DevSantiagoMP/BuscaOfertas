import { Link, useNavigate, useLocation } from "react-router";
import "./Menu.css";

interface MenuProps {
  rolId: number | null;
  correo: string | null;
  onLogout: () => void;
}

const Menu = ({ rolId, correo, onLogout }: MenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPrincipal = location.pathname === "/principal";
  const isAdmin = location.pathname === "/administrar-negocio";

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="menu"
      aria-labelledby="menuLabel"
      data-bs-backdrop="false"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLabel">
          Menú
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      {/* Usuario */}
      <div className="d-flex flex-column justify-content-center align-items-center">
        <i className="bi bi-person-circle user-icon"></i>
        <p>{correo ?? "Cargando..."}</p>
      </div>

      {/* Acciones */}
      <div className="offcanvas-body d-flex flex-column gap-4">
        {rolId === 2 && isPrincipal && (
          <Link to="/administrar-negocio">
            <button className="menu-button w-100">
              Administrar mi negocio
            </button>
          </Link>
        )}

        {rolId === 2 && isAdmin && (
          <Link to="/principal">
            <button className="menu-button w-100">
              Página principal
            </button>
          </Link>
        )}

        <button className="close-section w-100" onClick={handleLogoutClick}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Menu;
