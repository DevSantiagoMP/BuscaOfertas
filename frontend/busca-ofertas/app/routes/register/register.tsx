import { Link } from "react-router";
import Header from "../../components/Header/Header";
import "./register.css";

const Register = () => {
  return (
    <>
      <Header/>
       {/* Fondo (principal container definido en app.css) */}
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="register-box">
          <h1 className="register-title">Regístrate</h1>

          <form>
            {/* Nombres y Apellidos */}
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
            <select id="rol">
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
              placeholder="Escribe tu correo electrónico"
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
            />

            {/* Confirmar contraseña */}
            <label className="mt-3" htmlFor="confirmar-contraseña">
              Confirma contraseña
            </label>
            <input
              id="confirmar-contraseña"
              type="password"
              placeholder="Escribe de nuevo tu contraseña"
              required
            />

            <button className="btn-register mt-3" type="submit">Registrar</button>

            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <p> ¿Ya tienes una cuenta? </p>
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
