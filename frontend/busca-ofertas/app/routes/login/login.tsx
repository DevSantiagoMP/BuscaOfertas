import Logo from "../../components/Logo/Logo";
import { Link } from "react-router";
import "./login.css";

const Login = () => {
  return (
    <>
      <header className="login-header d-flex justify-content-between align-items-center">
        <Logo />
      </header>

      <main className="principal-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-box">

          <div className="d-flex flex-column align-items-center">
            <h1 className="login-title">Inicia sesión en tu cuenta</h1>

            <div className="d-flex align-items-center gap-1 mb-3">
              <p>¿No tienes una cuenta?</p>
              <Link to="/registro" className="hero-link">
                <p>Regístrate</p>
              </Link>
            </div>
          </div>

          <input
            type="text"
            placeholder="Correo electrónico"
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
          />

          <div className="text-end mb-3">
            <Link to="/recuperar-contraseña" className="hero-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button className="btn-login">Iniciar Sesión</button>
        </div>
      </main>
    </>
  );
};

export default Login;
