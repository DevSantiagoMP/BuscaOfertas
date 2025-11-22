import { Link } from "react-router";
import Header from "../../components/Header/Header";

// Para validacines
import { useState } from "react";

import "./login.css";

const Login = () => {
  //--- Para validaciones de contraseña ---
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

    if (!regex.test(value)) {
      setPasswordError(
        "La contraseña debe tener mayúsculas, minúsculas, un número y un carácter especial."
      );
    } else {
      setPasswordError("");
    }
  };

  //Elementos html
  return (
    <>
      <Header/>
      {/* Fondo (principal container definido en app.css) */}
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-box">
          <div className="d-flex flex-column align-items-center">
            <h1 className="login-title">Inicia sesión en tu cuenta</h1>

            <div className="d-flex align-items-center gap-1 mb-3">
              <p>¿No tienes una cuenta?</p>
              <Link to="/registro" className="register-link">
                <p>Regístrate</p>
              </Link>
            </div>
          </div>

          <form>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="login-input"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="login-input"
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />

            {passwordError && <p className="input-error">{passwordError}</p>}

            <div className="text-end mb-3">
              <Link to="/recuperar-contraseña" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button className="btn-login">Iniciar Sesión</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
