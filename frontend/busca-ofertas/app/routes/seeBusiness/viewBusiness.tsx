import { redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/viewBusiness";

import { requireAuth } from "../../../services/auth.server";

import PrivateHeader from "../../components/PrivateHeader/PrivateHeader";
import Menu from "../../components/Menu/Menu";

import BusinessInfo from "./BusinessInfo/BusinessInfo";
import BusinessProductsView from "./BusinessProductsView/BusinessProductsView";
import BusinessOffersView from "./BusinessOffersView/BusinessOffersView";

import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

// loader
export async function loader({ request }: Route.LoaderArgs) {
  // Verificar sesión
  await requireAuth(request);

  // Obtener businessId desde query
  const url = new URL(request.url);
  const businessId = Number(url.searchParams.get("businessId"));

  if (!businessId || Number.isNaN(businessId)) {
    throw redirect("/principal");
  }

  return { businessId };
}

const ViewBusiness = () => {
  const { businessId } = useLoaderData() as { businessId: number };

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
        <BusinessInfo businessId={businessId} />
        <BusinessProductsView businessId={businessId} />
        <BusinessOffersView businessId={businessId} />
      </main>
    </>
  );
};

export default ViewBusiness;
