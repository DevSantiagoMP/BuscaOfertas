import Header from "../../components/Header/Header";
import { Link } from "react-router";

const Terms = () => {
  return (
    <>
      <Header />
      <main className="principal-background min-vh-100 py-5">
        <div className="container">
          <h1 className="mb-4">Términos y Condiciones de Uso</h1>
          <p>
            <strong>BuscaOfertas</strong>
          </p>

          <hr />

          <h4>1. Aceptación de los términos</h4>
          <p>
            Al acceder, registrarse o utilizar la plataforma BuscaOfertas, el
            usuario o negocio acepta estos Términos y Condiciones. Si no está de
            acuerdo, debe abstenerse de usar la plataforma.
          </p>

          <h4>2. ¿Qué es BuscaOfertas?</h4>
          <p>
            BuscaOfertas es una plataforma digital de publicidad que permite a
            los negocios publicar información comercial, lo cual incluye
            imágenes del negocio, productos y ofertas. La plataforma no vende
            productos, no procesa pagos ni participa en transacciones
            comerciales.
          </p>

          <h4>3. Registro de usuarios y negocios</h4>
          <p>
            Para acceder a ciertas funciones es obligatorio registrarse. El
            usuario o negocio se compromete a proporcionar información veraz y
            actualizada y a utilizar la plataforma de forma legal.
          </p>

          <h4>4. Contenido e imágenes publicadas</h4>
          <p>
            Los negocios pueden publicar información, textos, imágenes y
            material gráfico relacionado con su negocio, productos u ofertas. El
            negocio declara que es propietario del contenido o que cuenta con
            autorización para su uso y que dicho contenido no infringe derechos
            de terceros.
          </p>

          <h4>5. Responsabilidad del contenido</h4>
          <p>
            Cada negocio es el único responsable de la información publicada,
            incluyendo precios, promociones, condiciones y legalidad de los
            productos o servicios ofrecidos.
          </p>

          <h4>6. Relación entre usuarios y negocios</h4>
          <p>
            BuscaOfertas no forma parte de la relación comercial entre usuarios
            y negocios. Cualquier acuerdo se realiza directamente entre las
            partes. La plataforma no se hace responsable por estafas,
            incumplimientos, garantías o devoluciones.
          </p>

          <h4>7. Publicidad, planes y pagos</h4>
          <p>
            BuscaOfertas puede ofrecer planes de mayor visibilidad publicitaria.
            Los pagos corresponden únicamente a servicios de publicidad y no
            garantizan ventas ni resultados. Los pagos no son reembolsables,
            salvo obligación legal.
          </p>

          <h4>8. Prohibiciones</h4>
          <p>
            Está prohibido publicar información falsa o engañosa, productos
            ilegales, contenido ofensivo o imágenes sin derechos de uso.
          </p>

          <h4>9. Eliminación de cuentas y contenido</h4>
          <p>
            BuscaOfertas se reserva el derecho de eliminar publicaciones y
            cuentas de usuarios o negocios que incumplan estos términos, sin
            previo aviso.
          </p>

          <h4>10. Disponibilidad del servicio</h4>
          <p>
            BuscaOfertas no garantiza disponibilidad permanente ni ausencia de
            errores y podrá realizar cambios o mantenimientos en cualquier
            momento.
          </p>

          <h4>11. Limitación de responsabilidad</h4>
          <p>
            BuscaOfertas no será responsable por pérdidas económicas, daños
            directos o indirectos derivados del uso de la plataforma.
          </p>

          <h4>12. Propiedad intelectual</h4>
          <p>
            El contenido publicado sigue siendo propiedad del negocio. El
            negocio concede a BuscaOfertas una licencia gratuita, no exclusiva y
            por tiempo indefinido para usar, reproducir, mostrar y promocionar
            dicho contenido dentro de la plataforma, así como en redes sociales,
            material promocional, campañas publicitarias y comunicaciones
            relacionadas con BuscaOfertas, sin generar compensación económica ni
            derecho a pago alguno.
          </p>

          <h4>13. Protección de datos personales</h4>
          <p>
            El tratamiento de datos personales se rige por la{" "}
            <Link to="/politica-de-privacidad" className="d-inline">
              Política de Privacidad
            </Link>{" "}
            de BuscaOfertas, conforme a la Ley 1581 de 2012 de la República de
            Colombia.
          </p>

          <h4>14. Modificaciones</h4>
          <p>
            BuscaOfertas podrá modificar estos términos en cualquier momento.
            Las modificaciones entrarán en vigor desde su publicación.
          </p>

          <h4>15. Legislación aplicable</h4>
          <p>
            Estos términos se rigen por las leyes de la República de Colombia.
          </p>
        </div>
      </main>
    </>
  );
};

export default Terms;
