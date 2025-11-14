import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("/principal", "routes/principal/principal.tsx"),
  route("/login", "routes/login/login.tsx")          
  // ejemplo de ruta route("/about", "routes/about.tsx"), 
] satisfies RouteConfig;

