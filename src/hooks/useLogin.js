import { loginSuperAdmin } from "../services/maestroService";
import { loginUsuario } from "../services/usuariosService";

export function useLogin({
  setUsuarioActual,
  setEsSuperAdmin,
  setLogueado,
  setPantalla,
  asegurarAperturaCajaUsuario,
  setUltimoCierreResultado,
}) {
  const iniciarSesionSistema = async (loginData) => {
    if (!loginData.usuario || !loginData.password) {
      throw new Error("Ingresá usuario y contraseña");
    }

    try {
      const superAdmin = await loginSuperAdmin(
        loginData.usuario,
        loginData.password
      );

      setUsuarioActual(superAdmin);
      setEsSuperAdmin(true);
      setLogueado(true);
      setPantalla("panel-maestro");

      return;
    } catch {
      // Si no es super admin, continúa con login normal.
    }

    const usuario = await loginUsuario(loginData.usuario, loginData.password);

    if (!usuario.activo) {
      throw new Error("Este usuario está desactivado");
    }

    const usuarioSistema = {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      rol: usuario.rol,
      activo: usuario.activo,
      negocio_id: usuario.negocio_id,
      negocioId: usuario.negocio_id,
      negocio: usuario.negocio_nombre || "Negocio",
    };

    setUsuarioActual(usuarioSistema);
    setEsSuperAdmin(false);

    if (asegurarAperturaCajaUsuario) {
      await asegurarAperturaCajaUsuario(usuarioSistema);
    }

    if (setUltimoCierreResultado) {
      setUltimoCierreResultado(null);
    }

    setLogueado(true);
    setPantalla(usuario.rol === "Administrador" ? "dashboard" : "venta");
  };

  const entrarComoNegocioDesdePanel = (usuarioSoporte) => {
    setUsuarioActual(usuarioSoporte);
    setEsSuperAdmin(false);
    setLogueado(true);
    setPantalla("dashboard");
  };

  return {
    iniciarSesionSistema,
    entrarComoNegocioDesdePanel,
  };
}