import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { asignarRolGoogle } from "../../../services/auth.client";

const Rol = () => {
  const [rolId, setRolId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleGuardarRol = async () => {
    if (!rolId) return;

    try {
      setLoading(true);
      setError(null);

      await asignarRolGoogle(Number(rolId));

      // Redirección según rol
      if (rolId === 1) {
        navigate("/principal"); // home usuario
      } else if (rolId === 2) {
        navigate("/administrar-negocio"); // dashboard negocio
      }
    } catch (err: any) {
      setError(err.message || "No se pudo asignar el rol");
    } finally {
      setLoading(false);
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

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Tipo de cuenta
            </label>
            <select
              className="form-select"
              value={rolId}
              onChange={(e) => setRolId(Number(e.target.value))}
              disabled={loading}
            >
              <option value="">Selecciona una opción</option>
              <option value={1}>Usuario</option>
              <option value={2}>Negocio</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary w-100"
            disabled={!rolId || loading}
            onClick={handleGuardarRol}
          >
            {loading ? "Guardando..." : "Guardar rol"}
          </button>
        </div>
      </main>
    </>
  );
};

export default Rol;
