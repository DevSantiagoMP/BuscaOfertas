import { redirect, Link } from "react-router";
import type { Route } from "./+types/rol";
import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { asignarRolGoogle } from "../../../services/auth.client";

const SERVER = import.meta.env.VITE_SERVER;
const API_URL = `${SERVER}/api/auth/check-session`;

// Loader
export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("cookie");

  // 1 Sin sesión → login
  if (!cookie) {
    throw redirect("/opciones-login");
  }

  let res: Response;

  try {
    res = await fetch(API_URL, {
      headers: { cookie },
    });
  } catch {
    throw redirect("/opciones-login");
  }

  if (!res.ok) {
    throw redirect("/opciones-login");
  }

  const { usuario } = await res.json();

  // 2 Con sesión y con rol → fuera
  if (usuario.rol) {
    throw redirect("/principal");
  }

  // 3 Con sesión y sin rol → OK
  return null;
}

const Rol = () => {
  const [rolId, setRolId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleGuardarRol = async () => {
    try {
      setLoading(true);
      setError(null);

      const rol = Number(rolId);

      await asignarRolGoogle(rol);

      navigate(rol === 1 ? "/principal" : "/administrar-negocio", {
        replace: true,
      });
    } catch (err: any) {
      setError(err.message || "No se pudo asignar el rol");
      setLoading(false); // solo aquí
    }
  };

  return (
    <>
      <Header />

      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="bg-white p-4 rounded shadow"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <h2 className="text-center mb-3">Selecciona tu rol</h2>

          <p className="text-center text-muted mb-4">
            Elige cómo deseas usar la plataforma.
            <br />
            <small>Este rol no podrá cambiarse después.</small>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardarRol();
            }}
          >
            <div className="mb-4">
              <label className="form-label fw-semibold">Tipo de cuenta</label>

              <select
                className="form-select"
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecciona una opción</option>
                <option value="1">Usuario</option>
                <option value="2">Negocio</option>
              </select>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar rol"}
            </button>
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
    </>
  );
};

export default Rol;
