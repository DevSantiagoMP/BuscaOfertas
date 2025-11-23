import { Link } from "react-router";
import Header from "../../components/Header/Header";
import { useState } from "react";
import { validatePassword } from "../../utils/validatePassword";
import "./register.css";

const Register = () => {
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
      console.log("Registrado con éxito");
      // Aquí haces el POST al backend
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
            {passwordError && <p className="input-error">{passwordError}</p>}

            {/* Confirmar */}
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
            {confirmError && <p className="input-register-error">{confirmError}</p>}

            <button className="btn-register mt-3" type="submit">
              Registrar
            </button>

            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <p>¿Ya tienes una cuenta?</p>
              <Link to="/login" className="link-register">
                <p>Inicia sesión</p>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
