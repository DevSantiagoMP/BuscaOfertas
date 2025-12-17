import Logo from "../Logo/Logo";

const PrivateHeader = () => {
  return (
    <header className="personal-header py-2">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <Logo />

          <button
            className="btn border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menu"
            aria-controls="menu"
          >
            <i className="bi bi-list" style={{ fontSize: "1.8rem" }} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PrivateHeader;
