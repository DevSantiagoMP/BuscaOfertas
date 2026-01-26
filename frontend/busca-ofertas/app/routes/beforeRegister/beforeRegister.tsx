import { Link } from "react-router";
import Header from "../../components/Header/Header";
import "./beforeRegister.css";

const BeforeRegister = () => {
  const SERVER = import.meta.env.VITE_SERVER;
  const googleLogin = () => {
    window.location.href = `${SERVER}/api/auth/google`;
  };

  return (
    <>
      <Header />
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="option-box">
          <h1 className="login-title mb-5">¿Cómo deseas registrarte?</h1>

          <button className="btn-google mb-3" onClick={googleLogin}>
            Continuar con Google <br />
            (recomendado)
          </button>

          <Link to="/registro">
            <button className="btn-login mb-5">
              Registrarse <br />
              manualmente
            </button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default BeforeRegister;
