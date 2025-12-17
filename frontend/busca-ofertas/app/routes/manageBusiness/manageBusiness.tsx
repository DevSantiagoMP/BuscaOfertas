// LOADER
import { requireRole } from "../../../services/auth.server";
import type { Route } from "./+types/manageBusiness";

// Components
import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";

import BusinessData from "./BusinessData/BusinessData";
import BusinessProducts from "./BusinessProducts/BusinessProducts";
import BusinessOffers from "./BusinessOffers/BusinessOffers";

// Hook
import { useAuth } from "../../hooks/useAuth";

export async function loader({ request }: Route.LoaderArgs) {
  // 👇 solo rol 2 (negocio)
  await requireRole(request, 2);
  return null;
}

const manageBusiness = () => {
  const { rolId, correo, logout } = useAuth();

  return (
    <>
      {/* Header privado (con botón hamburguesa) */}
      <PrivateHeader />

      {/* Menú hamburguesa reutilizable */}
      <Menu rolId={rolId} correo={correo} onLogout={logout} />

      <main className="principal-background min-vh-100 p-5">
        <BusinessData />
        <BusinessProducts />
        <BusinessOffers />
      </main>
    </>
  );
};

export default manageBusiness;
