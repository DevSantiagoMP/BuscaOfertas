// LOADER
import { requireRole } from "../../../services/auth.server";
import type { Route } from "./+types/manageBusiness";

import Header from "../../components/Header/Header";
import BusinessData from "./BusinessData/BusinessData";
import BusinessProducts from "./BusinessProducts/BusinessProducts";
import BusinessOffers from "./BusinessOffers/BusinessOffers";

export async function loader({ request }: Route.LoaderArgs) {
  // 👇 solo rol 2 (negocio)
  await requireRole(request, 2);
  return null;
}

const manageBusiness = () => {
  return (
    <>
      <Header />
      <main className="principal-background min-vh-100 p-5">
        <BusinessData />
        <BusinessProducts/>
        <BusinessOffers/>
      </main>
    </>
  );
};

export default manageBusiness;
