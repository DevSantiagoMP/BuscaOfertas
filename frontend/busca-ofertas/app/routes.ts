import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("/opciones-login", "routes/beforeLogin/beforeLogin.tsx"),
  route("/opciones-registro", "routes/beforeRegister/beforeRegister.tsx"),
  route("/login", "routes/login/login.tsx"),
  route("/registro", "routes/register/register.tsx"),
  route("/principal", "routes/principal/principal.tsx"),        
  // ejemplo de ruta route("/about", "routes/about.tsx"), 
] satisfies RouteConfig;

