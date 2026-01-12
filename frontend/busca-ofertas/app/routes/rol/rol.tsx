import Header from "../../components/Header/Header";

const beforeRegister = () => {

  return (
    <>
      <Header />
      {/* Fondo (principal container definido en app.css) */}
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        <div className="option-box">
          <h1>Selecciona tu rol</h1>
          <select name="" id="">
            <option value={1}>Usuario</option>
            <option value={2}>Negocio</option>
          </select>
          <button className="btn-google mb-3">
            Guardar
          </button>
        </div>
      </main>
    </>
  );
};

export default beforeRegister;
