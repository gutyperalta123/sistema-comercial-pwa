


export default function CierreCaja({
  cierreCaja,
  setCierreCaja,
  guardarCierreCaja,
  ultimoCierreResultado,
  cierresCaja,
  usuarioActual,
  esAdmin,
  reabrirCaja,
  solicitudesCaja,
  solicitarReaperturaCaja,
  autorizarSolicitudReapertura,
}) {
  const formatoPrecio = (valor) =>
    Math.abs(Number(valor || 0)).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const actualizar = (campo, valor) => {
    setCierreCaja({
      ...cierreCaja,
      [campo]: valor,
    });
  };

  const cierresUsuario = (cierresCaja || []).filter(
    (cierre) => cierre.usuarioId === usuarioActual?.id
  );

  const ultimoCierreUsuario = cierresUsuario[0];

  const cajaYaCerrada =
    ultimoCierreUsuario && ultimoCierreUsuario.estado === "Cerrado";

  const solicitudesPendientes = (solicitudesCaja || []).filter(
    (solicitud) => solicitud.estado === "Pendiente"
  );

  const solicitudPendienteUsuario = solicitudesPendientes.find(
    (solicitud) => solicitud.usuarioId === usuarioActual?.id
  );

  const resultadoVisible =
    ultimoCierreResultado?.usuarioId === usuarioActual?.id
      ? ultimoCierreResultado
      : null;

  const diferencia = Number(resultadoVisible?.diferencia || 0);
  const dineroFaltante = diferencia < 0 ? Math.abs(diferencia) : 0;
  const dineroSobrante = diferencia > 0 ? diferencia : 0;

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Cierre de caja ciego</h4>

      <div className="alert alert-info">
        Primero cargá el dinero contado. El sistema recién mostrará el resultado
        después de confirmar el cierre.
      </div>

      {cajaYaCerrada && !esAdmin && (
        <div className="alert alert-success">
          <strong>Caja cerrada correctamente.</strong>
          <br />
          Si necesitás corregir el cierre, solicitá autorización al
          administrador.

          <div className="mt-3">
            {solicitudPendienteUsuario ? (
              <button className="btn btn-outline-secondary" disabled>
                Solicitud de reapertura pendiente
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => solicitarReaperturaCaja(ultimoCierreUsuario.id)}
              >
                Solicitar reapertura de caja
              </button>
            )}
          </div>
        </div>
      )}

      {(!cajaYaCerrada || esAdmin) && (
        <form onSubmit={guardarCierreCaja} className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $20.000"
              value={cierreCaja.billete20000}
              onChange={(e) => actualizar("billete20000", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $10.000"
              value={cierreCaja.billete10000}
              onChange={(e) => actualizar("billete10000", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $2.000"
              value={cierreCaja.billete2000}
              onChange={(e) => actualizar("billete2000", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $1.000"
              value={cierreCaja.billete1000}
              onChange={(e) => actualizar("billete1000", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $500"
              value={cierreCaja.billete500}
              onChange={(e) => actualizar("billete500", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $200"
              value={cierreCaja.billete200}
              onChange={(e) => actualizar("billete200", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $100"
              value={cierreCaja.billete100}
              onChange={(e) => actualizar("billete100", e.target.value)}
            />
          </div>

          <div className="col-6 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Billetes $50"
              value={cierreCaja.billete50}
              onChange={(e) => actualizar("billete50", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Monedas"
              value={cierreCaja.monedas}
              onChange={(e) => actualizar("monedas", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Transferencias declaradas"
              value={cierreCaja.transferenciasDeclaradas}
              onChange={(e) =>
                actualizar("transferenciasDeclaradas", e.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Observación opcional"
              value={cierreCaja.observacion}
              onChange={(e) => actualizar("observacion", e.target.value)}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary btn-lg">
              Confirmar cierre de caja
            </button>
          </div>
        </form>
      )}

      {resultadoVisible && (
        <div className="panel p-3 border border-primary mb-4">
          <h5 className="fw-bold mb-3">Resultado del cierre</h5>

          <div className="row g-3">
            <div className="col-12 col-md-3">
              <div className="alert alert-success">
                <strong>Dinero declarado</strong>
                <h4>${formatoPrecio(resultadoVisible.efectivoDeclarado)}</h4>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="alert alert-primary">
                <strong>Dinero esperado</strong>
                <h4>${formatoPrecio(resultadoVisible.totalEsperado)}</h4>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="alert alert-danger">
                <strong>Dinero faltante</strong>
                <h4>${formatoPrecio(dineroFaltante)}</h4>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="alert alert-warning">
                <strong>Dinero sobrante</strong>
                <h4>${formatoPrecio(dineroSobrante)}</h4>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="alert alert-secondary">
                <strong>Transferencias declaradas</strong>
                <h4>${formatoPrecio(resultadoVisible.transferenciasDeclaradas)}</h4>
                <small>
                  Esperadas: ${formatoPrecio(resultadoVisible.totalTransferencias || 0)}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {esAdmin && (
        <>
          <h5 className="fw-bold mt-4">Solicitudes de reapertura</h5>

          <div className="table-responsive mb-4">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Empleado</th>
                  <th>Motivo</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {solicitudesPendientes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No hay solicitudes pendientes.
                    </td>
                  </tr>
                ) : (
                  solicitudesPendientes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.fechaSolicitud}</td>
                      <td className="fw-semibold">
                        {solicitud.usuarioNombre}
                      </td>
                      <td>{solicitud.motivo}</td>
                      <td>{solicitud.tipoReapertura}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {solicitud.estado}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              autorizarSolicitudReapertura(solicitud, "Reconteo")
                            }
                          >
                            Autorizar reconteo
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              autorizarSolicitudReapertura(
                                solicitud,
                                "Nuevo turno"
                              )
                            }
                          >
                            Autorizar nuevo turno
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h5 className="fw-bold mt-4">Historial de cierres</h5>

          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Declarado</th>
                  <th>Esperado</th>
                  <th>Faltante</th>
                  <th>Sobrante</th>
                  <th>Transferencias</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {(cierresCaja || []).length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-muted">
                      Todavía no hay cierres registrados.
                    </td>
                  </tr>
                ) : (
                  cierresCaja.map((cierre) => {
                    const diferenciaCierre = Number(cierre.diferencia || 0);
                    const faltanteCierre =
                      diferenciaCierre < 0 ? Math.abs(diferenciaCierre) : 0;
                    const sobranteCierre =
                      diferenciaCierre > 0 ? diferenciaCierre : 0;

                    return (
                      <tr key={cierre.id}>
                        <td>{cierre.fecha}</td>
                        <td>{cierre.usuarioNombre}</td>
                        <td>${formatoPrecio(cierre.efectivoDeclarado)}</td>
                        <td>${formatoPrecio(cierre.totalEsperado)}</td>
                        <td className="text-danger fw-bold">
                          ${formatoPrecio(faltanteCierre)}
                        </td>
                        <td className="text-warning fw-bold">
                          ${formatoPrecio(sobranteCierre)}
                        </td>
                        <td>${formatoPrecio(cierre.totalTransferencias || 0)}</td>
                        <td>{cierre.estado}</td>

                        <td>
                          {cierre.estado === "Cerrado" ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => reabrirCaja(cierre.id)}
                            >
                              Reabrir caja
                            </button>
                          ) : (
                            <span className="text-muted">
                              {cierre.motivoReapertura || "Reabierto"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
