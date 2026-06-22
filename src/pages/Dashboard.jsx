



import StatCard from "../components/StatCard";

export default function Dashboard({
  esAdmin,
  totalVendidoHoy,
  gananciaHoy,
  productosReponer,
  generarPedidoAutomatico,
  lotes,
  historialVentas = [],
  ventasPorVendedor = [],
  productosMasVendidos = [],
}) {
  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const calcularDias = (fecha) => {
    if (!fecha) return null;

    const hoy = new Date();
    const vencimiento = new Date(fecha + "T00:00:00");
    hoy.setHours(0, 0, 0, 0);

    return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  };

  const ventasEfectivo = historialVentas.reduce(
    (total, venta) => total + Number(venta.montoEfectivo || 0),
    0
  );

  const ventasTransferencia = historialVentas.reduce(
    (total, venta) => total + Number(venta.montoTransferencia || 0),
    0
  );

  const cantidadVentas = historialVentas.length;

  const mejorVendedor = [...ventasPorVendedor].sort(
    (a, b) => b.totalVendido - a.totalVendido
  )[0];

  const productoTop = productosMasVendidos.find(
    (producto) => producto.cantidadVendida > 0
  );

  const lotesPorVencer = [...lotes]
    .filter((lote) => lote.vencimiento)
    .map((lote) => ({
      ...lote,
      dias: calcularDias(lote.vencimiento),
    }))
    .filter((lote) => lote.dias <= 30)
    .sort((a, b) => a.dias - b.dias);

  return (
    <>
      <section className="row g-3 mt-2">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="green"
            titulo="Ventas totales"
            valor={`$${formatoPrecio(totalVendidoHoy)}`}
          />
        </div>

        {esAdmin && (
          <div className="col-12 col-md-6 col-xl-3">
            <StatCard
              color="blue"
              titulo="Ganancia"
              valor={`$${formatoPrecio(gananciaHoy)}`}
            />
          </div>
        )}

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="orange"
            titulo="Cantidad de ventas"
            valor={cantidadVentas}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="red"
            titulo="Stock bajo"
            valor={productosReponer.length}
          />
        </div>
      </section>

      <section className="row g-3 mt-2">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="green"
            titulo="Efectivo vendido"
            valor={`$${formatoPrecio(ventasEfectivo)}`}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="blue"
            titulo="Transferencias"
            valor={`$${formatoPrecio(ventasTransferencia)}`}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="orange"
            titulo="Vencimientos"
            valor={lotesPorVencer.length}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            color="green"
            titulo="Producto más vendido"
            valor={productoTop ? productoTop.nombre : "Sin ventas"}
          />
        </div>
      </section>

      <section className="row g-4 mt-3">
        <div className="col-12 col-xl-6">
          <div className="panel">
            <div className="panel-header">
              <h5>Productos a reponer</h5>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={generarPedidoAutomatico}
              >
                Generar pedido
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th>Proveedor</th>
                  </tr>
                </thead>

                <tbody>
                  {productosReponer.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-muted">
                        No hay productos con stock bajo.
                      </td>
                    </tr>
                  ) : (
                    productosReponer.slice(0, 8).map((item) => (
                      <tr key={item.codigo}>
                        <td className="fw-semibold">{item.nombre}</td>
                        <td>
                          <span className="badge bg-danger">{item.stock}</span>
                        </td>
                        <td>{item.minimo}</td>
                        <td>{item.proveedor}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="panel">
            <h5>Ventas por empleado</h5>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Ventas</th>
                    <th>Total vendido</th>
                    <th>Ganancia</th>
                  </tr>
                </thead>

                <tbody>
                  {ventasPorVendedor.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-muted">
                        No hay ventas por empleado.
                      </td>
                    </tr>
                  ) : (
                    ventasPorVendedor.map((vendedor) => (
                      <tr key={vendedor.nombre}>
                        <td className="fw-semibold">{vendedor.nombre}</td>
                        <td>{vendedor.cantidadVentas}</td>
                        <td>${formatoPrecio(vendedor.totalVendido)}</td>
                        <td className="text-success fw-bold">
                          ${formatoPrecio(vendedor.ganancia)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {mejorVendedor && (
              <div className="alert alert-success py-2 mt-3">
                Mejor vendedor: <strong>{mejorVendedor.nombre}</strong> con $
                {formatoPrecio(mejorVendedor.totalVendido)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="row g-4 mt-3">
        <div className="col-12 col-xl-6">
          <div className="panel">
            <h5>Productos más vendidos</h5>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>

                <tbody>
                  {productosMasVendidos.filter((p) => p.cantidadVendida > 0)
                    .length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-muted">
                        Todavía no hay productos vendidos.
                      </td>
                    </tr>
                  ) : (
                    productosMasVendidos
                      .filter((producto) => producto.cantidadVendida > 0)
                      .slice(0, 8)
                      .map((producto) => (
                        <tr key={producto.nombre}>
                          <td className="fw-semibold">{producto.nombre}</td>
                          <td>
                            <span className="badge bg-primary">
                              {producto.cantidadVendida}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="panel">
            <h5>Productos próximos a vencer</h5>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Vence</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {lotesPorVencer.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-muted">
                        No hay lotes próximos a vencer.
                      </td>
                    </tr>
                  ) : (
                    lotesPorVencer.slice(0, 8).map((lote) => {
                      let estado = "Próximo";
                      let clase = "badge bg-warning text-dark";

                      if (lote.dias < 0) {
                        estado = "Vencido";
                        clase = "badge bg-danger";
                      } else if (lote.dias <= 7) {
                        estado = "Crítico";
                        clase = "badge bg-danger";
                      }

                      return (
                        <tr key={lote.id}>
                          <td className="fw-semibold">{lote.producto}</td>
                          <td>{lote.cantidad}</td>
                          <td>{lote.vencimiento}</td>
                          <td>
                            <span className={clase}>{estado}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}