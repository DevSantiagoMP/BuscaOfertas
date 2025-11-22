import Header from "../../components/Header/Header";
import BusinessData from "./BusinessData/businessData";

const manageBusiness = () => {
  return (
    <>
      <Header />
      <main className="principal-background min-vh-100 p-5">
        <BusinessData />
      </main>
    </>
  );
};

export default manageBusiness;
