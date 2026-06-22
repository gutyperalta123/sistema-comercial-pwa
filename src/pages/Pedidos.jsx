export default function Pedidos({
  pedidos,
  generarPedidoAutomatico,
  recibirProductoPedido,
}) {
  return (
    <section className="panel mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Pedidos a proveedores</h4>
          <p className="text-muted mb-0">
            Control de pedidos, recepción parcial y mercadería pendiente.
          </p>
        </div>

        <button className="btn btn-primary" onClick={generarPedidoAutomatico}>
          Generar pedido automático
        </button>
      </div>

      {pedidos.length === 0 ? (
        <div className="alert alert-info">
          Todavía no hay pedidos generados.
        </div>
      ) : (
        pedidos.map((pedido) => (
          <div className="panel mb-4" key={pedido.id}>
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h5>Pedido #{pedido.id}</h5>
                <small className="text-muted">
                  {pedido.fecha} · Creado por {pedido.creadoPor}
                </small>
              </div>

              <span
                className={
                  pedido.estado === "Recibido completo"
                    ? "badge bg-success"
                    : pedido.estado === "Recibido parcial"
                    ? "badge bg-warning text-dark"
                    : "badge bg-primary"
                }
              >
                {pedido.estado}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Proveedor</th>
                    <th>Pedido</th>
                    <th>Recibido</th>
                    <th>Faltan</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {pedido.productos.map((item) => (
                    <tr key={item.codigo}>
                      <td className="fw-semibold">{item.nombre}</td>
                      <td>{item.proveedor}</td>
                      <td>{item.pedido}</td>
                      <td>{item.recibido}</td>
                      <td>
                        {item.faltan > 0 ? (
                          <span className="badge bg-danger">
                            {item.faltan}
                          </span>
                        ) : (
                          <span className="badge bg-success">0</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={item.faltan === 0}
                          onClick={() =>
                            recibirProductoPedido(pedido.id, item.codigo)
                          }
                        >
                          Recibir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </section>
  );
}