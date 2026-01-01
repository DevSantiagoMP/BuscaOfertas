import { useState } from "react";
import Logo from "../Logo/Logo";
import PublicMenu from "../../components/PublicMenu/PublicMenu";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar custom-navbar">
        <div className="container-fluid">
          <Logo />

          <button
            className="navbar-toggler always-hamburger"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>

      <PublicMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
