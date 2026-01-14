import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { validatePassword } from "../../utils/validatePassword";
import { useNavigate, useLocation } from "react-router";
import {
  validateRecoverToken,
  updatePassword,
} from "../../../services/auth.client";
import "./changePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Obtener token desde query param (?token=...)
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // 🔒 Validar token al cargar la página
  useEffect(() => {
    if (!token) {
      alert("Token inválido o inexistente");
      navigate("/opciones-login");
      return;
    }

    validateRecoverToken(token).catch(() => {
      alert("Token inválido o expirado");
      navigate("/opciones-login");
    });
  }, [token, navigate]);

  // 🔄 Enviar nueva contraseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(password);
    setPasswordError(error);

    if (password !== confirm) {
      setConfirmError("Las contraseñas no coinciden.");
      return;
    }

    setConfirmError("");

    if (!error && token) {
      try {
        await updatePassword(token, password);
        alert("Contraseña actualizada con éxito");
        navigate("/login");
      } catch (err: any) {
        alert(err.message || "Error al cambiar la contraseña");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="password-card">
          <h3 className="password-title">Cambiar contraseña</h3>

          <form className="password-form" onSubmit={handleSubmit}>
            {/* Contraseña nueva */}
            <input
              type="password"
              placeholder="Contraseña nueva"
              required
              className="password-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
            />
            {passwordError && (
              <p className="input-password-error">{passwordError}</p>
            )}

            {/* Repetir contraseña */}
            <input
              type="password"
              placeholder="Repetir contraseña"
              required
              className="password-input"
              value={confirm}
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
              <p className="input-password-error">{confirmError}</p>
            )}

            <button type="submit" className="password-btn">
              Registrar nueva contraseña
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default ChangePassword;
