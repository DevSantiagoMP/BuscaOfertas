import { Link } from "react-router";
import Header from "../../components/Header/Header";
import "./beforeLogin.css";

const beforeRegister = () => {
  return (
    <>
      <Header/>
       {/* Fondo (principal container definido en app.css) */}
      <main className="principal-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="option-box">
          <h1 className="login-title mb-5">¿Como deseas ingresar?</h1>
           <button className="btn-google mb-3">Continuar con google <br />(recomendado)</button>
         <Link to="/login">
          <button className="btn-login mb-5">Iniciar sesión <br />manualmente</button>
         </Link>
        </div>
      </main>
    </>
  );
};

export default beforeRegister;
