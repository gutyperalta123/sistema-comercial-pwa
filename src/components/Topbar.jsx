export default function Topbar({
  usuarioActual,
  setPantalla,
  cerrarSesion,
  configuracion,
  setMenuMovilAbierto,
}) {
  return (
    <header className="topbar topbar-compact">
      <button
        type="button"
        className="btn btn-primary mobile-menu-button"
        onClick={() => setMenuMovilAbierto?.(true)}
      >
        <i className="bi bi-list"></i>
      </button>

      <div>
        <h5 className="fw-bold mb-0">
          {configuracion?.nombre || "Sistema Comercial"}
        </h5>
        <small className="text-muted">
          {configuracion?.ciudad || "Negocio"} · {usuarioActual.rol}
        </small>
      </div>

      <div className="dropdown">
        <button
          className="btn btn-outline-primary dropdown-toggle rounded-pill"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i className="bi bi-person-circle me-2"></i>
          {usuarioActual.nombre}
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button
              className="dropdown-item"
              onClick={() => setPantalla("mi-cuenta")}
            >
              <i className="bi bi-person-gear me-2"></i>
              Mi cuenta
            </button>
          </li>

          <li>
            <button
              className="dropdown-item"
              onClick={() => setPantalla("venta")}
            >
              <i className="bi bi-cart-check me-2"></i>
              Nueva venta
            </button>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <button className="dropdown-item text-danger" onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Salir
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}