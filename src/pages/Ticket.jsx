export default function Ticket({ ultimaVenta, configuracion, setPantalla }) {
  if (!ultimaVenta) {
    return (
      <section className="panel mt-4">
        <p>No hay ticket para mostrar.</p>
      </section>
    );
  }

  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const imprimir = () => {
    window.print();
  };

  return (
    <section className="panel mt-4">
      <div className="panel-header">
        <h4 className="fw-bold mb-0">Ticket de venta</h4>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPantalla("venta")}
          >
            Nueva venta
          </button>

          <button className="btn btn-primary" onClick={imprimir}>
            Imprimir ticket
          </button>
        </div>
      </div>

      <div className="ticket-box">
        <div className="text-center mb-3">
          <h5 className="fw-bold mb-1">
            {configuracion?.nombre || "Sistema Comercial"}
          </h5>
          <div>{configuracion?.direccion || ""}</div>
          <div>{configuracion?.telefono || ""}</div>
          <div>{configuracion?.ciudad || ""}</div>
        </div>

        <hr />

        <p className="mb-1">
          <strong>Fecha:</strong> {ultimaVenta.fecha}
        </p>
        <p className="mb-1">
          <strong>Vendedor:</strong> {ultimaVenta.vendedor}
        </p>

        <hr />

        {ultimaVenta.productos.map((p) => (
          <div className="ticket-line" key={p.codigo}>
            <span>
              {p.nombre} x {p.cantidad}
            </span>
            <strong>${formatoPrecio(p.precioVenta * p.cantidad)}</strong>
          </div>
        ))}

        <hr />

        <div className="ticket-total">
          <span>Total</span>
          <strong>${formatoPrecio(ultimaVenta.total)}</strong>
        </div>

        <p className="text-center mt-3 mb-0">Gracias por su compra</p>
      </div>
    </section>
  );
}