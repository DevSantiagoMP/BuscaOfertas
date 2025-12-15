// =======================
// LOADER (SERVER)
// =======================
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { checkSessionServer } from "../../../services/auth.server";
// =======================
// CLIENT
// =======================
import { Link, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { useState } from "react";
import { loginUser } from "../../../services/auth.client";

import "./login.css";

// 🔐 Loader: guest-only
export async function loader({ request }: Route.LoaderArgs) {
  const isAuthenticated = await checkSessionServer(request);

  if (isAuthenticated) {
    throw redirect("/principal");
  }

  return null;
}

const Login = () => {
  const navigate = useNavigate();

  // --- Estados del login ---
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // --- Estados para recuperar contraseña ---
  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");

  // --- Manejar login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await loginUser(correo, password);
      navigate("/principal");
    } catch (err: any) {
      // fetch → no existe err.response
      setErrorMsg(err?.message || "Error en el login");
    }
  };

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

          {/* --- FORMULARIO LOGIN --- */}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="login-input"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMsg && (
              <p
                className="text-danger mt-1 mb-1"
                style={{ fontSize: "0.9rem" }}
              >
                {errorMsg}
              </p>
            )}

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

            <button className="btn-login" type="submit">
              Iniciar Sesión
            </button>
          </form>

          {/* ------------------ CUADRO/MODAL DE RECUPERACIÓN ------------------ */}
          {showRecoverBox && (
            <div className="recover-overlay">
              <div className="recover-modal">
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
