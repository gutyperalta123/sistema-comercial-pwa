

export default function Caja({
  historialVentas,
  usuarioActual,
  esAdmin,
  retirosInternos,
}) {
  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const ventasDelUsuario = esAdmin
    ? historialVentas
    : historialVentas.filter(
        (venta) => venta.vendedor === usuarioActual.nombre
      );

  const ventasEfectivo = ventasDelUsuario.reduce(
    (total, venta) => total + Number(venta.montoEfectivo || 0),
    0
  );

  const ventasTransferencia = ventasDelUsuario.reduce(
    (total, venta) => total + Number(venta.montoTransferencia || 0),
    0
  );

  const ventasMixtas = ventasDelUsuario.filter(
    (venta) => venta.metodoPago === "Mixto"
  );

  const totalVentas = ventasDelUsuario.reduce(
    (total, venta) => total + Number(venta.total || 0),
    0
  );

  const retirosPagados = retirosInternos.filter(
    (retiro) => retiro.estadoPago === "Pagado"
  );

  const retirosPendientes = retirosInternos.filter(
    (retiro) => retiro.estadoPago === "Pendiente"
  );

  const retirosDescuentoSueldo = retirosInternos.filter(
    (retiro) => retiro.estadoPago === "Descontar sueldo"
  );

  const totalRetirosPagados = retirosPagados.reduce(
    (total, retiro) => total + Number(retiro.total || 0),
    0
  );

  const totalPendiente = retirosPendientes.reduce(
    (total, retiro) => total + Number(retiro.total || 0),
    0
  );

  const totalDescuentoSueldo = retirosDescuentoSueldo.reduce(
    (total, retiro) => total + Number(retiro.total || 0),
    0
  );

  const efectivoEsperadoCaja = ventasEfectivo + totalRetirosPagados;
  const totalGeneral = totalVentas + totalRetirosPagados;

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Caja del día</h4>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="alert alert-success">
            <strong>Ventas en efectivo</strong>
            <h3>${formatoPrecio(ventasEfectivo)}</h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="alert alert-primary">
            <strong>Ventas por transferencia</strong>
            <h3>${formatoPrecio(ventasTransferencia)}</h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="alert alert-warning">
            <strong>Ventas mixtas</strong>
            <h3>{ventasMixtas.length}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="alert alert-info">
            <strong>Retiros pagados</strong>
            <h3>${formatoPrecio(totalRetirosPagados)}</h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="alert alert-dark">
            <strong>Efectivo esperado en caja</strong>
            <h3>${formatoPrecio(efectivoEsperadoCaja)}</h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="alert alert-secondary">
            <strong>Total general vendido</strong>
            <h3>${formatoPrecio(totalGeneral)}</h3>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="alert alert-warning">
            <strong>Pendiente dueño/admin</strong>
            <h4>${formatoPrecio(totalPendiente)}</h4>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="alert alert-danger">
            <strong>Descontar sueldo</strong>
            <h4>${formatoPrecio(totalDescuentoSueldo)}</h4>
          </div>
        </div>
      </div>
    </section>
  );
}