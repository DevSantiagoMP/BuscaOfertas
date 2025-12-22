import { requireRole } from "../../../services/auth.server";
import type { Route } from "./+types/manageBusiness";

import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";

import BusinessData from "./BusinessData/BusinessData";
import BusinessProducts from "./BusinessProducts/BusinessProducts";
import BusinessOffers from "./BusinessOffers/BusinessOffers";

import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  await requireRole(request, 2);
  return null;
}

const manageBusiness = () => {
  const { rolId, correo, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <PrivateHeader onMenuClick={() => setMenuOpen(true)} />

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        rolId={rolId}
        correo={correo}
        onLogout={logout}
      />

      <main className="principal-background min-vh-100 p-5">
        <BusinessData />
        <BusinessProducts />
        <BusinessOffers />
      </main>
    </>
  );
};

export default manageBusiness;
