export default function AjustesStock({
  productosActivos,
  ajusteStock,
  setAjusteStock,
  guardarAjusteStock,
}) {
  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Ajuste manual de stock</h4>

      <form onSubmit={guardarAjusteStock} className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={ajusteStock.productoId}
            onChange={(e) =>
              setAjusteStock({
                ...ajusteStock,
                productoId: e.target.value,
              })
            }
          >
            <option value="">Seleccionar producto</option>
            {productosActivos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - Stock: {producto.stock}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-2">
          <select
            className="form-select"
            value={ajusteStock.tipo}
            onChange={(e) =>
              setAjusteStock({
                ...ajusteStock,
                tipo: e.target.value,
              })
            }
          >
            <option value="Sumar">Sumar</option>
            <option value="Restar">Restar</option>
          </select>
        </div>

        <div className="col-12 col-md-2">
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="Cantidad"
            value={ajusteStock.cantidad}
            onChange={(e) =>
              setAjusteStock({
                ...ajusteStock,
                cantidad: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={ajusteStock.motivo}
            onChange={(e) =>
              setAjusteStock({
                ...ajusteStock,
                motivo: e.target.value,
              })
            }
          >
            <option value="">Motivo</option>
<option value="Vencido">Vencido</option>
<option value="Roto / dañado">Roto / dañado</option>
<option value="Faltante">Faltante</option>
<option value="Error de carga">Error de carga</option>
<option value="Otro ajuste">Otro ajuste</option>
          </select>
        </div>

        <div className="col-12 col-md-1">
          <button className="btn btn-primary w-100">OK</button>
        </div>
      </form>

      <div className="alert alert-warning">
        Usá esta pantalla cuando el stock real del negocio no coincida con el
        sistema. Para evitar errores, el motivo se elige con opciones fijas.
      </div>
    </section>
  );
}