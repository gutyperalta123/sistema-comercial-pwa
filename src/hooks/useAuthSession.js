import { useEffect } from "react";

export function useAuthSession({
  usuarioActual,
  setUsuarioActual,
  setLogueado,
  setEsSuperAdmin,
}) {
  useEffect(() => {
    const guardado = localStorage.getItem("usuarioActual");

    if (!guardado) return;

    try {
      const usuario = JSON.parse(guardado);

      setUsuarioActual(usuario);
      setLogueado(true);

      if (usuario.rol === "SuperAdmin") {
        setEsSuperAdmin(true);
      }
    } catch {
      localStorage.removeItem("usuarioActual");
    }
  }, []);

  const cerrarSesionSistema = () => {
    localStorage.removeItem("usuarioActual");

    setUsuarioActual(null);
    setLogueado(false);
    setEsSuperAdmin(false);
  };

  return {
    cerrarSesionSistema,
  };
}