import Logo from "../Logo/Logo";

interface PrivateHeaderProps {
  onMenuClick: () => void;
}

const PrivateHeader = ({ onMenuClick }: PrivateHeaderProps) => {
  return (
    <header className="personal-header py-2">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <Logo />

          <button
            className="btn border-0"
            type="button"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <i className="bi bi-list" style={{ fontSize: "1.8rem" }} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PrivateHeader;
