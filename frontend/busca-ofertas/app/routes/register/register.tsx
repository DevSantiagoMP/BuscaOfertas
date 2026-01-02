import { Link } from "react-router";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { validatePassword } from "../../utils/validatePassword";
import {
  registerUser,
  resendVerification,
} from "../../../services/auth.client";
import "./register.css";

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Estados para el modal de envío de enlace
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Para reenviar enlace con cooldown
  const [correoGuardado, setCorreoGuardado] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // spiner de carga
  const [isLoading, setIsLoading] = useState(false);

  // Timer cada 1 segundo
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  // Función para reenviar correo
  const handleResend = async () => {
    try {
      await resendVerification(correoGuardado);
      setSuccessMessage("Hemos enviado un nuevo enlace a tu correo.");
      setCooldown(60);
    } catch (err: any) {
      console.error(err.message);
      setSuccessMessage(err.message || "No se pudo reenviar el enlace.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(password);
    setPasswordError(error);

    if (password !== confirm) {
      setConfirmError("Las contraseñas no coinciden.");
      return;
    }

    if (error) return;

    // Obtener valores del formulario
    const nombre = (document.getElementById("nombre") as HTMLInputElement)
      .value;
    const apellidos = (document.getElementById("apellidos") as HTMLInputElement)
      .value;
    const correo = (document.getElementById("correo") as HTMLInputElement)
      .value;
    const rol = (document.getElementById("rol") as HTMLSelectElement).value;

    const rol_id = rol === "usuario" ? 1 : 2;

    try {
      setIsLoading(true); // START LOADING
      await registerUser({
        nombre,
        apellidos,
        rol_id,
        correo,
        password,
      });

      // Guardar correo para reenviar
      setCorreoGuardado(correo);
      setCooldown(60);

      setSuccessMessage(
        "Hemos enviado un enlace a tu correo electrónico para verificar tu cuenta."
      );
      setShowModal(true);
    } catch (err: any) {
      console.error("Error al registrar:", err.message);
      setSuccessMessage(err.message || "Error al registrar usuario");
      setShowModal(true);
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  return (
    <>
      <Header />
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="register-box">
          <h1 className="register-title">Regístrate</h1>

          <form onSubmit={handleSubmit}>
            {/* Nombres */}
            <div className="d-flex gap-2 names">
              <div className="d-flex flex-column w-100">
                <label htmlFor="nombre">Nombre(s)</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Escribe tu nombre"
                  required
                />
              </div>

              <div className="d-flex flex-column w-100">
                <label htmlFor="apellidos">Apellido(s)</label>
                <input
                  id="apellidos"
                  type="text"
                  placeholder="Escribe tus apellidos"
                />
              </div>
            </div>

            {/* Rol */}
            <label className="mt-3" htmlFor="rol">
              Selecciona tu rol
            </label>
            <select id="rol" required>
              <option value="">Selecciona tu rol</option>
              <option value="usuario">Usuario</option>
              <option value="negocio">Negocio</option>
            </select>

            {/* Correo */}
            <label className="mt-3" htmlFor="correo">
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              placeholder="Escribe tu correo"
              required
            />

            {/* Contraseña */}
            <label className="mt-3" htmlFor="contraseña">
              Contraseña
            </label>
            <input
              id="contraseña"
              type="password"
              placeholder="Escribe tu contraseña"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
            />
            {passwordError && (
              <p className="input-register-error">{passwordError}</p>
            )}

            {/* Confirmar contraseña */}
            <label className="mt-3" htmlFor="confirmar-contraseña">
              Confirma contraseña
            </label>
            <input
              id="confirmar-contraseña"
              type="password"
              placeholder="Escribe de nuevo tu contraseña"
              required
              onChange={(e) => {
                const value = e.target.value;
                setConfirm(value);

                if (password !== value) {
                  setConfirmError("Las contraseñas no coinciden.");
                } else {
                  setConfirmError("");
                }
              }}
            />
            {confirmError && (
              <p className="input-register-error">{confirmError}</p>
            )}

            <button
              className="btn-register mt-3 d-flex justify-content-center align-items-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registrando...
                </>
              ) : (
                "Registrar"
              )}
            </button>

            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <p className="mb-0">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="d-inline link-register">
                  Inicia sesión
                </Link>
              </p>
            </div>

            <p className="text-muted small mt-2">
              Al registrarte aceptas los{" "}
              <Link to="/terminos-condiciones" className="d-inline">
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/politica-de-privacidad" className="d-inline">
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </main>

      {/* Modal de envío de enlace */}
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-custom">
            <h2 className="modal-title">Cuenta creada</h2>
            <p className="mt-2">{successMessage}</p>

            <button
              className="btn-cooldown modal-button"
              disabled={cooldown > 0}
              onClick={handleResend}
              style={{ ["--cooldown" as any]: cooldown }}
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar enlace"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
