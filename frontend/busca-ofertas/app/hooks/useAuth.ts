import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Usuario {
  rol: number;
  correo: string;
}

export const useAuth = () => {
  const navigate = useNavigate();

  const [rolId, setRolId] = useState<number | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/check-session",
          { credentials: "include" }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setRolId(data.usuario.rol);
        setCorreo(data.usuario.correo);
      } catch (err) {
        console.error("Error obteniendo sesión", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setRolId(null);
      setCorreo(null);
      navigate("/opciones-login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return {
    rolId,
    correo,
    loading,
    logout,
  };
};