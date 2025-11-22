import { useState } from "react";
import Header from "../../components/Header/Header";
import "./mensualPlan.css";

// VALIDACIONES DE PLAN SELECCIONADO Y NUMERO DE 10 DIGITOS
const mensualPlan = () => {
  const [telefono, setTelefono] = useState("");
  const [metodo, setMetodo] = useState("");
  const [errorMetodo, setErrorMetodo] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    // Validar método
    if (!metodo) {
      setErrorMetodo("Debes seleccionar un método de pago.");
      isValid = false;
    } else {
      setErrorMetodo("");
    }

    // Validar teléfono
    if (!/^\d{10}$/.test(telefono)) {
      setErrorTelefono("El número debe contener exactamente 10 dígitos.");
      isValid = false;
    } else {
      setErrorTelefono("");
    }

    if (!isValid) return;

    console.log("Método:", metodo);
    console.log("Teléfono:", telefono);
  };

  return (
    <>
      <Header />

      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="mensual-plan-card">
          <h2>Plan mensual</h2>
          <h3>10.000 COP</h3>

          <div className="mensual-beneficios">
            <p>
              <strong>Beneficios:</strong>
            </p>
            <ul>
              <li>Registra productos ilimitados</li>
              <li>Adquiere más visibilidad</li>
            </ul>
          </div>

          <p className="mensual-titulo-metodo">Selecciona tu método de pago:</p>

          <div className="mensual-metodos">
            <button
              type="button"
              className={`mensual-metodo mensual-nequi ${
                metodo === "Nequi" ? "active" : ""
              }`}
              onClick={() => {
                setMetodo("Nequi");
                setErrorMetodo("");
              }}
            >
              Nequi
            </button>

            <button
              type="button"
              className={`mensual-metodo mensual-daviplata ${
                metodo === "Daviplata" ? "active" : ""
              }`}
              onClick={() => {
                setMetodo("Daviplata");
                setErrorMetodo("");
              }}
            >
              Daviplata
            </button>
          </div>

          {errorMetodo && (
            <p className="mensual-error-text">{errorMetodo}</p>
          )}

          <div className="mensual-input-box">
            <label htmlFor="celular">Número de celular:</label>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="celular"
                placeholder="Escribe tu número"
                className={
                  telefono.length > 0 && telefono.length < 10 ? "error" : ""
                }
                value={telefono}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setTelefono(val);
                    if (val.length === 10) setErrorTelefono("");
                  }
                }}
              />

              {errorTelefono && (
                <p className="mensual-error-text">{errorTelefono}</p>
              )}

              <div className="d-flex justify-content-center">
                <button className="mensual-btn-continuar mt-3" type="submit">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default mensualPlan;
