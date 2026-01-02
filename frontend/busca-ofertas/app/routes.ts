import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("/opciones-login", "routes/beforeLogin/beforeLogin.tsx"),
  route("/opciones-registro", "routes/beforeRegister/beforeRegister.tsx"),
  route("/login", "routes/login/login.tsx"),
  route("/cambiar-contrasena", "routes/changePassword/changePassword.tsx"),
  route("/registro", "routes/register/register.tsx"),
  route("/verificar-correo", "routes/verifyEmail/verifyEmail.tsx"),
  route("/principal", "routes/principal/principal.tsx"), 
  // route("/plan-mensual", "routes/mensualPlan/mensualPlan.tsx"), 
  // route("/plan-anual", "routes/anualPlan/anualPlan.tsx"), 
  route("/administrar-negocio", "routes/manageBusiness/manageBusiness.tsx"),
  route("/ver-negocio", "routes/seeBusiness/viewBusiness.tsx"),
  route("/terminos-condiciones", "routes/terms/terms.tsx"),
  route("/politica-de-privacidad", "routes/privacyPolicy/privacyPolicy.tsx"),
] satisfies RouteConfig;

