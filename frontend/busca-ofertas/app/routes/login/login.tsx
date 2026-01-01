// LOADER
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { checkSessionServer } from "../../../services/auth.server";

import { Link, useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { useState } from "react";
import { loginUser, recoverPassword } from "../../../services/auth.client";

import "./login.css";

//Loader
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

  // --- Loading recuperación ---
  const [recoverLoading, setRecoverLoading] = useState(false);

  //Estados para reenvío de correo
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);

  // --- Manejar login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = await loginUser(correo, password);

      const rolId = data.user.rol_id;

      if (rolId === 2) {
        navigate("/administrar-negocio");
      } else if (rolId === 1) {
        navigate("/principal");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Error en el login");
    }
  };

  const handleResend = async () => {
    if (resendDisabled) return;

    try {
      setResendDisabled(true);
      setResendCooldown(60);

      await recoverPassword(recoverEmail);

      // Iniciar contador
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Error al reenviar el correo");
      setResendDisabled(false);
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
                      onSubmit={async (e) => {
                        e.preventDefault();

                        if (recoverLoading) return;

                        try {
                          setRecoverLoading(true);
                          await recoverPassword(recoverEmail);
                          setEmailSent(true);
                        } catch (err: any) {
                          alert(err.message || "Error al enviar el correo");
                        } finally {
                          setRecoverLoading(false);
                        }
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        className="login-input mb-2"
                        value={recoverEmail}
                        onChange={(e) => setRecoverEmail(e.target.value)}
                        disabled={recoverLoading}
                        required
                      />

                      <button
                        className="btn-login d-flex justify-content-center align-items-center gap-2"
                        type="submit"
                        disabled={recoverLoading}
                      >
                        {recoverLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Enviando...
                          </>
                        ) : (
                          "Continuar"
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="recover-message mt-2">
                      Te enviamos un enlace a tu correo para restablecer tu
                      contraseña.
                    </p>

                    <button
                      className="btn-login resend-btn mt-3"
                      onClick={handleResend}
                      disabled={resendDisabled}
                    >
                      {resendDisabled
                        ? `Reenviar (${resendCooldown}s)`
                        : "Reenviar"}
                    </button>
                  </>
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
