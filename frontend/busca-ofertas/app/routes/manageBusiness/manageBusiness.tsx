import Header from "../../components/Header/Header";
import BusinessData from "./BusinessData/BusinessData";
import BusinessProducts from "./BusinessProducts/BusinessProducts";
import BusinessOffers from "./BusinessOffers/BusinessOffers";

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
