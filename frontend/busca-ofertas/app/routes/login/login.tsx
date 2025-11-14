import Logo from "../../components/Logo/Logo";
import { Link } from "react-router";

// Para validacines
import { useState } from "react";

import "./login.css";

const Login = () => {

  // --- Para validacines de correo electronico ---
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  //validar que se escriba un correo
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Si ya hay un error, lo quitamos cuando el usuario corrija
    if (emailError) {
      if (value.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setEmailError("");
      }
    }
  };

  const validateEmail = () => {
    if (!email.includes("@")) {
      setEmailError("El correo debe contener un @");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Correo electrónico inválido");
    } else {
      setEmailError("");
    }
  };

  //Mostrar mensaje de error para que se corrigan
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateEmail();

    if (emailError || email.trim() === "") {
      alert("Por favor corrige los errores antes de continuar");
      return;
    }
  };

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
            type="email"
            placeholder="Correo electrónico"
            className="login-input"
            value={email}
            onChange={handleEmailChange}
            onBlur={validateEmail}
          />
          {emailError && <p className="input-error">{emailError}</p>}

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
            <Link to="/recuperar-contraseña" className="hero-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button className="btn-login" onClick={handleSubmit}>
            Iniciar Sesión
          </button>
        </div>
      </main>
    </>
  );
};

export default Login;
