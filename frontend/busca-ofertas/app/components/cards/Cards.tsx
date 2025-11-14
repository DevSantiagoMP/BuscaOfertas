import imgPrueba from "../../assets/papa.png";

const Cards = () => {
  return (
    <article>
      <div className="personal-card">
        <img src={imgPrueba} alt="Imagen negocio" className="imagen-card" />

        <div className="container-text-card">
          <h6> Nombre producto: </h6>
          <p>
            Descripcion: Hola soly santiago y estoy haciendo una prueba
            interesante.
          </p>
          <h6>Precio: </h6>
          <button className="button-card">Ver mas</button>
        </div>
      </div>
    </article>
  );
};

export default Cards;
