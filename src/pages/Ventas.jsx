import { useEffect, useRef } from "react";

export default function Ventas({
  codigo,
  setCodigo,
  buscarProducto,
  ventaActual,
  aumentarCantidad,
  disminuirCantidad,
  quitarProducto,
  totalVenta,
  cobrarVenta,
  vaciarVenta,
  esAdmin,
  gananciaVenta,
  metodoPago,
  setMetodoPago,
  montoEfectivo,
  setMontoEfectivo,
  montoTransferencia,
  setMontoTransferencia,
  promocionesAplicadas = [],
  descuentoPromociones = 0,
  aplicarPromociones,
}) {
  const inputCodigoRef = useRef(null);

  useEffect(() => {
    inputCodigoRef.current?.focus();
  }, [ventaActual]);

  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const efectivoNumero =
    metodoPago === "Efectivo"
      ? totalVenta
      : metodoPago === "Transferencia"
      ? 0
      : Number(montoEfectivo || 0);

  const transferenciaNumero =
    metodoPago === "Transferencia"
      ? totalVenta
      : metodoPago === "Efectivo"
      ? 0
      : Number(montoTransferencia || 0);

  const sumaPago = efectivoNumero + transferenciaNumero;
  const faltaPagar = totalVenta - sumaPago;

  return (
    <section
      className="panel mt-4"
      onClick={() => inputCodigoRef.current?.focus()}
    >
      <h4 className="fw-bold mb-3">Nueva venta</h4>

      <form onSubmit={buscarProducto} className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <input
            ref={inputCodigoRef}
            className="form-control form-control-lg"
            placeholder="Escaneá código de barras..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            autoFocus
          />
        </div>

        <div className="col-12 col-md-4">
          <button className="btn btn-success btn-lg w-100">Agregar</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventaActual.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted">
                  Todavía no hay productos en la venta.
                </td>
              </tr>
            ) : (
              ventaActual.map((item) => (
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
                        onClick={() => aumentarCantidad(item.codigo)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => disminuirCantidad(item.codigo)}
                      >
                        -
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => quitarProducto(item.codigo)}
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

      {ventaActual.length > 0 && (
        <div className="panel p-3 border mt-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h5 className="fw-bold mb-1">Promociones</h5>
              <small className="text-muted">
                Aplicá promociones después de escanear los productos.
              </small>
            </div>

            <button
              type="button"
              className="btn btn-warning"
              onClick={(e) => {
                e.stopPropagation();
                aplicarPromociones();
              }}
            >
              Aplicar promociones
            </button>
          </div>

          {promocionesAplicadas.length > 0 && (
            <div className="alert alert-success mt-3 mb-0">
              <strong>Promociones aplicadas:</strong>

              <div className="mt-2">
                {promocionesAplicadas.map((promo, index) => (
                  <div key={`${promo.id}-${index}`}>
                    {promo.nombre} · Descuento: $
                    {formatoPrecio(promo.descuento)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {descuentoPromociones > 0 && (
            <div className="alert alert-warning mt-3 mb-0">
              Descuento total por promociones:{" "}
              <strong>${formatoPrecio(descuentoPromociones)}</strong>
            </div>
          )}
        </div>
      )}

      <div className="venta-total">
        <span>Total de la compra</span>
        <strong>${formatoPrecio(totalVenta)}</strong>
      </div>

      <div className="panel p-3 border mt-3">
        <h5 className="fw-bold mb-3">Método de pago</h5>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-4">
            <button
              type="button"
              className={
                metodoPago === "Efectivo"
                  ? "btn btn-success w-100"
                  : "btn btn-outline-success w-100"
              }
              onClick={(e) => {
                e.stopPropagation();
                setMetodoPago("Efectivo");
                setMontoEfectivo("");
                setMontoTransferencia("");
              }}
            >
              Efectivo
            </button>
          </div>

          <div className="col-12 col-md-4">
            <button
              type="button"
              className={
                metodoPago === "Transferencia"
                  ? "btn btn-primary w-100"
                  : "btn btn-outline-primary w-100"
              }
              onClick={(e) => {
                e.stopPropagation();
                setMetodoPago("Transferencia");
                setMontoEfectivo("");
                setMontoTransferencia("");
              }}
            >
              Transferencia
            </button>
          </div>

          <div className="col-12 col-md-4">
            <button
              type="button"
              className={
                metodoPago === "Mixto"
                  ? "btn btn-warning w-100"
                  : "btn btn-outline-warning w-100"
              }
              onClick={(e) => {
                e.stopPropagation();
                setMetodoPago("Mixto");
                setMontoEfectivo("");
                setMontoTransferencia("");
              }}
            >
              Mixto
            </button>
          </div>
        </div>

        {metodoPago === "Mixto" && (
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <input
                className="form-control"
                type="number"
                min="0"
                placeholder="Monto en efectivo"
                value={montoEfectivo}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setMontoEfectivo(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <input
                className="form-control"
                type="number"
                min="0"
                placeholder="Monto por transferencia"
                value={montoTransferencia}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setMontoTransferencia(e.target.value)}
              />
            </div>

            <div className="col-12">
              <div
                className={
                  faltaPagar === 0
                    ? "alert alert-success py-2 mb-0"
                    : "alert alert-warning py-2 mb-0"
                }
              >
                Total: ${formatoPrecio(totalVenta)} · Cargado: $
                {formatoPrecio(sumaPago)} ·{" "}
                {faltaPagar === 0
                  ? "Pago completo"
                  : `Falta: $${formatoPrecio(faltaPagar)}`}
              </div>
            </div>
          </div>
        )}

        {metodoPago !== "Mixto" && (
          <div className="alert alert-light border mb-0">
            Se cobrará todo por <strong>{metodoPago}</strong>: $
            {formatoPrecio(totalVenta)}
          </div>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button className="btn btn-primary btn-lg" onClick={cobrarVenta}>
          Cobrar venta
        </button>

        <button
          className="btn btn-outline-danger btn-lg"
          type="button"
          onClick={vaciarVenta}
        >
          Vaciar venta
        </button>
      </div>

      {esAdmin && (
        <p className="text-muted mt-3 mb-0">
          Ganancia estimada: <strong>${formatoPrecio(gananciaVenta)}</strong>
        </p>
      )}
    </section>
  );
}