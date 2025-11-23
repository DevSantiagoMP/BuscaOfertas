import { Link } from "react-router";
import Header from "../../components/Header/Header";
import { useState } from "react";

import "./login.css";

const Login = () => {
  // --- Estados para recuperar contraseña ---
  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");

  return (
    <>
      <Header />

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
              required
            />

            <div className="text-end mb-3">
              <p
                className="forgot-link"
                onClick={() => {
                  setShowRecoverBox(true);
                  setEmailSent(false);
                }}
                style={{ cursor: "pointer" }}
              >
                ¿Olvidaste tu contraseña?
              </p>
            </div>

            <button className="btn-login">Iniciar Sesión</button>
          </form>

          {/* ------------------ CUADRO/MODAL DE RECUPERACIÓN ------------------ */}
          {showRecoverBox && (
            <div className="recover-overlay">
              <div className="recover-modal">
                {/* Botón cerrar */}
                <button
                  className="close-btn"
                  onClick={() => setShowRecoverBox(false)}
                >
                  ✕
                </button>

                {!emailSent ? (
                  <>
                    <h3 className="recover-title">Recuperar contraseña</h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (recoverEmail.trim() !== "") setEmailSent(true);
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        className="login-input mb-2"
                        value={recoverEmail}
                        onChange={(e) => setRecoverEmail(e.target.value)}
                        required
                      />

                      <button className="btn-login" type="submit">
                        Continuar
                      </button>
                    </form>
                  </>
                ) : (
                  <p className="recover-message mt-2">
                    Te enviamos un enlace a tu correo para restablecer tu
                    contraseña.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Login;
