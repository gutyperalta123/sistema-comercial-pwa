


export default function Sidebar({
  pantalla,
  setPantalla,
  esAdmin,
  menuMovilAbierto = false,
  setMenuMovilAbierto,
  cerrarSesion,
}) {
  const irAPantalla = (nuevaPantalla) => {
    setPantalla(nuevaPantalla);
    setMenuMovilAbierto?.(false);
  };

  const salir = () => {
    const confirmar = confirm("¿Querés cerrar sesión?");

    if (!confirmar) return;

    setMenuMovilAbierto?.(false);
    cerrarSesion?.();
  };

  return (
    <aside className={`sidebar ${menuMovilAbierto ? "sidebar-mobile-open" : ""}`}>
      <div>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-shop text-primary me-2"></i>
          Sistema Comercial
        </h4>

        <nav className="menu">
          {esAdmin && (
            <a
              className={pantalla === "dashboard" ? "active" : ""}
              onClick={() => irAPantalla("dashboard")}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </a>
          )}

          <a
            className={pantalla === "venta" ? "active" : ""}
            onClick={() => irAPantalla("venta")}
          >
            <i className="bi bi-cart-check"></i> Ventas
          </a>

          {esAdmin && (
            <a
              className={pantalla === "caja" ? "active" : ""}
              onClick={() => irAPantalla("caja")}
            >
              <i className="bi bi-cash-stack"></i> Caja
            </a>
          )}

          <a
            className={pantalla === "cierre-caja" ? "active" : ""}
            onClick={() => irAPantalla("cierre-caja")}
          >
            <i className="bi bi-lock"></i> Cierre caja
          </a>

          <a
            className={pantalla === "retiros-internos" ? "active" : ""}
            onClick={() => irAPantalla("retiros-internos")}
          >
            <i className="bi bi-person-dash"></i> Retiros internos
          </a>

          {esAdmin && (
            <a
              className={pantalla === "promociones" ? "active" : ""}
              onClick={() => irAPantalla("promociones")}
            >
              <i className="bi bi-tags"></i> Promociones
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "productos" ? "active" : ""}
              onClick={() => irAPantalla("productos")}
            >
              <i className="bi bi-box-seam"></i> Productos
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "ajustes-stock" ? "active" : ""}
              onClick={() => irAPantalla("ajustes-stock")}
            >
              <i className="bi bi-sliders"></i> Ajustes stock
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "pedidos" ? "active" : ""}
              onClick={() => irAPantalla("pedidos")}
            >
              <i className="bi bi-truck"></i> Pedidos
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "vencimientos" ? "active" : ""}
              onClick={() => irAPantalla("vencimientos")}
            >
              <i className="bi bi-exclamation-triangle"></i> Vencimientos
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "usuarios" ? "active" : ""}
              onClick={() => irAPantalla("usuarios")}
            >
              <i className="bi bi-people"></i> Usuarios
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "pagos-mensuales" ? "active" : ""}
              onClick={() => irAPantalla("pagos-mensuales")}
            >
              <i className="bi bi-cash-coin"></i> Pagos mensuales
            </a>
          )}

          {esAdmin && (
            <a
              className={pantalla === "configuracion" ? "active" : ""}
              onClick={() => irAPantalla("configuracion")}
            >
              <i className="bi bi-gear"></i> Configuración
            </a>
          )}

          <a
            className={pantalla === "mi-cuenta" ? "active" : ""}
            onClick={() => irAPantalla("mi-cuenta")}
          >
            <i className="bi bi-person-gear"></i> Mi cuenta
          </a>

          <button
            type="button"
            className="btn btn-danger w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
            onClick={salir}
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </nav>
      </div>
    </aside>
  );
}