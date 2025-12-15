import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { verifyEmail } from "../../../services/auth.client";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verificando tu cuenta...");
  const [isSuccess, setIsSuccess] = useState(false); // para estilos si quieres

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("Token inválido.");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setIsSuccess(true);

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      } catch (err) {
        console.log(err);
        setMessage("El enlace es inválido o ha expirado.");
      }
    };

    verify();
  }, []);

  return (
    <>
      <Header />
      <main className="principal-background d-flex justify-content-center align-items-center min-vh-100">
        {/* BACKDROP IGUAL AL REGISTRO */}
        <div className="modal-backdrop-custom">
          {/* MODAL IGUAL AL DEL REGISTRO */}
          <div className="modal-custom">
            <h2 className="modal-title">
              {isSuccess ? "Cuenta Verificada" : "Verificación"}
            </h2>

            {isSuccess && (
              <>
                <small>Por favor inicia sesion con tu correo y contraseña</small>
                <br />
                <small>Redirigiendo al login...</small>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default VerifyEmail;
