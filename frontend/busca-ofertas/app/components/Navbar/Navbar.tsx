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
            <div className="col-md-6 d-flex">
              <input className="search-bar" type="text" placeholder="¿Que estas buscando hoy?" />
              <button className="button-search">
                <i className="bi bi-search search-icon"></i>
              </button>
            </div>

            {/* Botones de iniciar sesion y registro */}
            <div className="col-md-3 d-flex justify-content-center gap-2 buttons-navbar">
              <button className="login-button">Iniciar Sesión</button>
              <button className="register-button">Registrarse</button>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
