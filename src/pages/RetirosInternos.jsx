export default function RetirosInternos({
  codigoRetiro,
  setCodigoRetiro,
  buscarProductoRetiro,
  retiroActual,
  aumentarCantidadRetiro,
  disminuirCantidadRetiro,
  quitarProductoRetiro,
  totalRetiro,
  tipoRetiro,
  setTipoRetiro,
  estadoPagoRetiro,
  setEstadoPagoRetiro,
  usuarios,
  usuarioRetiroId,
  setUsuarioRetiroId,
  confirmarRetiroInterno,
  retirosInternos,
}) {
  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const usuariosFiltrados =
    tipoRetiro === "Empleado"
      ? usuarios.filter((u) => u.rol === "Empleado")
      : usuarios.filter((u) => u.rol === "Administrador");

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Retiros internos</h4>

      <div className="alert alert-info py-2">
        Seleccioná quién retiró el producto. El sistema también guarda
        automáticamente quién lo registró y la fecha/hora.
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={tipoRetiro}
            onChange={(e) => {
              setTipoRetiro(e.target.value);
              setUsuarioRetiroId("");
              setEstadoPagoRetiro("Pagado");
            }}
          >
            <option value="Administrador">Administrador / Dueño</option>
            <option value="Empleado">Empleado</option>
          </select>
        </div>

        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={usuarioRetiroId}
            onChange={(e) => setUsuarioRetiroId(e.target.value)}
          >
            <option value="">Quién retiró</option>
            {usuariosFiltrados.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} ({usuario.rol})
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={estadoPagoRetiro}
            onChange={(e) => setEstadoPagoRetiro(e.target.value)}
          >
            {tipoRetiro === "Empleado" ? (
              <>
                <option value="Pagado">Pagado</option>
                <option value="Descontar sueldo">Descontar sueldo</option>
              </>
            ) : (
              <>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </>
            )}
          </select>
        </div>
      </div>

      <form onSubmit={buscarProductoRetiro} className="row g-3 mb-3">
        <div className="col-12 col-md-8">
          <input
            className="form-control form-control-lg"
            placeholder="Escaneá producto para retiro interno..."
            value={codigoRetiro}
            onChange={(e) => setCodigoRetiro(e.target.value)}
            autoFocus
          />
        </div>

        <div className="col-12 col-md-4">
          <button className="btn btn-success btn-lg w-100">Agregar</button>
        </div>
      </form>

      <div className="table-responsive mb-3">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {retiroActual.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted">
                  Todavía no hay productos en el retiro.
                </td>
              </tr>
            ) : (
              retiroActual.map((item) => (
                <tr key={item.codigo}>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td>
                    <span className="badge bg-primary">{item.cantidad}</span>
                  </td>
                  <td>${formatoPrecio(item.precioVenta)}</td>
                  <td>${formatoPrecio(item.precioVenta * item.cantidad)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => aumentarCantidadRetiro(item.codigo)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => disminuirCantidadRetiro(item.codigo)}
                      >
                        -
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => quitarProductoRetiro(item.codigo)}
                      >
                        Quitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="venta-total">
        <span>Total retiro</span>
        <strong>${formatoPrecio(totalRetiro)}</strong>
      </div>

      <button
        className="btn btn-primary btn-lg mt-3"
        onClick={confirmarRetiroInterno}
      >
        Confirmar retiro interno
      </button>

      <hr />

      <h5 className="fw-bold mt-4">Historial de retiros</h5>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Retiró</th>
              <th>Registró</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>

          <tbody>
            {retirosInternos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-muted">
                  Todavía no hay retiros internos.
                </td>
              </tr>
            ) : (
              retirosInternos.map((retiro) => (
                <tr key={retiro.id}>
                  <td>{retiro.fecha}</td>
                  <td className="fw-semibold">{retiro.nombreUsuario}</td>
                  <td>{retiro.registradoPorNombre || "-"}</td>
                  <td>{retiro.tipoRetiro}</td>
                  <td>
                    <span
                      className={
                        retiro.estadoPago === "Pagado"
                          ? "badge bg-success"
                          : retiro.estadoPago === "Pendiente"
                          ? "badge bg-warning text-dark"
                          : "badge bg-danger"
                      }
                    >
                      {retiro.estadoPago}
                    </span>
                  </td>
                  <td>${formatoPrecio(retiro.total)}</td>
                  <td>
                    {retiro.productos.map((p, index) => (
                      <div key={`${retiro.id}-${index}`}>
                        {p.nombre} x {p.cantidad}
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}