import Header from "../../components/Header/Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <main className="principal-background min-vh-100 py-5">
        <div className="container">
          <h1 className="mb-4">Política de Privacidad</h1>
          <p>
            <strong>BuscaOfertas</strong>
          </p>
          <p>
            <strong>Última actualización:</strong> 02/01/26
          </p>

          <hr />

          <h4>1. Responsable del tratamiento</h4>
          <p>
            BuscaOfertas es responsable del tratamiento de los datos personales
            recolectados a través de la plataforma, de conformidad con la Ley
            1581 de 2012 y demás normas aplicables en la República de Colombia.
          </p>

          <h4>2. Datos personales recolectados</h4>
          <p>BuscaOfertas podrá recolectar los siguientes datos:</p>

          <ul>
            <li>
              <strong>Usuarios:</strong> nombre, apellidos, correo electrónico y
              datos de acceso.
            </li>
            <li>
              <strong>Negocios:</strong> nombre del negocio, descripción,
              ciudad, dirección, teléfono, categoría, imágenes del negocio y
              contenido comercial publicado.
            </li>
            <li>
              <strong>Productos:</strong> nombre, descripción, precio e imágenes
              asociadas.
            </li>
            <li>
              <strong>Ofertas:</strong> nombre, descripción, precio de oferta e
              imágenes asociadas.
            </li>
          </ul>

          <h4>3. Finalidad del tratamiento de los datos</h4>
          <p>Los datos personales se utilizan para:</p>
          <ul>
            <li>Crear y administrar cuentas</li>
            <li>Mostrar información publicitaria</li>
            <li>Gestionar el uso de la plataforma</li>
            <li>Mejorar la experiencia del usuario</li>
            <li>Enviar comunicaciones relacionadas con la plataforma</li>
          </ul>

          <h4>4. Información pública y contenido visible</h4>
          <p>
            La información, imágenes y publicaciones realizadas por los negocios
            serán visibles públicamente dentro de la plataforma. El negocio
            acepta que dicho contenido pueda ser pueda ser mostrado, reproducido
            y promocionado por BuscaOfertas tanto dentro de la plataforma como
            en medios digitales propios, incluyendo redes sociales, material
            promocional y capturas de pantalla, sin generar compensación
            económica, respetando siempre la finalidad publicitaria de la
            plataforma.
          </p>

          <h4>5. Uso de imágenes y contenido comercial</h4>
          <p>
            Al subir imágenes, logos o material gráfico, el negocio declara
            contar con los derechos necesarios para su uso y autoriza a
            BuscaOfertas a mostrarlos dentro de la plataforma y en medios
            digitales propios, incluyendo redes sociales y material promocional,
            sin generar compensación económica, exclusivamente con fines
            publicitarios y de difusión de la plataforma.
          </p>

          <h4>6. Almacenamiento y seguridad de la información</h4>
          <p>
            BuscaOfertas adopta medidas de seguridad razonables para proteger
            los datos personales. No obstante, no se puede garantizar una
            seguridad absoluta frente a accesos no autorizados.
          </p>

          <h4>7. Derechos de los titulares de los datos</h4>
          <p>
            De conformidad con la Ley 1581 de 2012, los titulares de los datos
            personales tienen derecho a:
          </p>
          <ul>
            <li>Conocer, actualizar y rectificar sus datos personales</li>
            <li>Solicitar la eliminación de sus datos personales</li>
            <li>
              Revocar la autorización para el tratamiento de datos personales
            </li>
          </ul>
          <p>
            La solicitud de eliminación de datos personales o la revocatoria de
            la autorización para su tratamiento podrá implicar la eliminación de
            la cuenta y la imposibilidad de continuar utilizando la plataforma
            BuscaOfertas.
          </p>

          <h4>8. Eliminación de datos y cuentas</h4>
          <p>BuscaOfertas podrá eliminar cuentas y datos personales cuando:</p>
          <ul>
            <li>El titular lo solicite</li>
            <li>Se incumplan los Términos y Condiciones</li>
            <li>Exista una obligación legal</li>
          </ul>

          <h4>9. Uso de cookies</h4>
          <p>
            BuscaOfertas podrá utilizar cookies para mejorar la experiencia del
            usuario. El usuario puede deshabilitarlas desde la configuración de
            su navegador.
          </p>

          <h4>10. Cambios en la política de privacidad</h4>
          <p>
            BuscaOfertas se reserva el derecho de modificar esta Política de
            Privacidad en cualquier momento. Los cambios entrarán en vigor desde
            su publicación.
          </p>

          <h4>11. Legislación aplicable</h4>
          <p>
            Esta Política de Privacidad se rige por las leyes de la República de
            Colombia.
          </p>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
