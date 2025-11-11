import './principal.css'
import Logo from '../../components/Logo/Logo'
import UserLogo from '../../components/UserLogo/UserLogo'
const principal = () => {
  return (
    <>
      <header className='header'>
        <div className='d-flex justify-content-between'>
            <Logo/>
            <div className='d-flex gap-4 align-items-center'>
                <button className='header-button'>Administrar mi negocio</button>
                <UserLogo/>
            </div>
        </div>
      </header>

      {/* Principal-section */}
      <section className='principal-section'>

        {/* Search bar */}
        <div className='container-fluid d-flex justify-content-center'>
          <input type="text" placeholder='Buscar productos, negocios u ofertas' className='search-bar'/>
          <button className='search-button'>
            <i className="bi bi-search search-icon"></i>
            </button>
        </div>

        {/* Filters */}

      </section>
    </>
  )
}

export default principal
