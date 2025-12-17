import { Link, useNavigate } from "react-router";

interface MobileMenuProps {
  rolId: number | null;
  correo: string | null;
  onLogout: () => void;
}

const MobileMenu = ({ rolId, correo, onLogout }: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="mobileMenu"
      aria-labelledby="mobileMenuLabel"
      data-bs-backdrop="false"
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

      {/* Usuario */}
      <div className="d-flex flex-column justify-content-center align-items-center">
        <i className="bi bi-person-circle user-icon"></i>
        <p>{correo ?? "Cargando..."}</p>
      </div>

      {/* Acciones */}
      <div className="offcanvas-body d-flex flex-column gap-4">
        {rolId === 2 && (
          <Link to="/administrar-negocio">
            <button className="personal-header-button w-100">
              Administrar mi negocio
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

export default MobileMenu;
