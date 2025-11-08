import './Navbar.css'
import Logo from '../Logo/Logo'

const Navbar = () => {
  return (
    <nav className="mi-navbar">
      <div className='container-fluid'>

        <div className="row align-items-center">

            {/* Logo y titulo */}
            <div className="col-md-3">
              <Logo />
            </div>

            {/* Barra de busqueda  */}
            <div className="col-md-9 d-flex justify-content-center justify-content-md-start mt-sm-3">
              <input className="search-bar" type="text" placeholder="¿Que estas buscando hoy?" />
              <button className="button-search">
                <i className="bi bi-search search-icon"></i>
              </button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
