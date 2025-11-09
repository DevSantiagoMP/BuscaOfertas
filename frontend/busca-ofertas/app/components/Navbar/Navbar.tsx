import "./Navbar.css";
import Logo from "../Logo/Logo";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">

        {/* Logo */}
        <Logo />

        {/* Hamburger menu */}
        <button
          className="navbar-toggler hamburger-menu"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Search bar */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <form className="d-flex justify-content-center w-100" role="search">
            <input
              className="search-bar"
              type="search"
              placeholder="¿Qué estás buscando?"
              aria-label="Search"
            />
            <button className="button-search">
              <i className="bi bi-search search-icon"></i>
            </button>
          </form>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
