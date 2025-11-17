import Logo from "../../components/Logo/Logo";
import "./Header.css";

const Header = () => {
  return (
    <>
      <header className="personal-header d-flex justify-content-between align-items-center">
        <Logo />
      </header>
    </>
  )
}

export default Header
