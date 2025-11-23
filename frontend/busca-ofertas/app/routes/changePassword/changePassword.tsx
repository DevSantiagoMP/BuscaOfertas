import Header from "../../components/Header/Header";
import { useState } from "react";
import { validatePassword } from "../../utils/validatePassword";
import "./changePassword.css";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePassword(password);
    setPasswordError(error);

    if (password !== confirm) {
      setConfirmError("Las contraseñas no coinciden.");
      return;
    }

    setConfirmError("");

    if (!error) {
      console.log("Contraseña cambiada con éxito");
      // Aquí mandas el POST al backend
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
