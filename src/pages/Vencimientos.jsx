export default function Vencimientos({ lotes }) {
  const calcularDias = (fecha) => {
    if (!fecha) return null;

    const hoy = new Date();
    const vencimiento = new Date(fecha + "T00:00:00");
    hoy.setHours(0, 0, 0, 0);

    return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  };

  const lotesOrdenados = [...lotes]
    .filter((lote) => lote.vencimiento)
    .map((lote) => ({
      ...lote,
      dias: calcularDias(lote.vencimiento),
    }))
    .sort((a, b) => a.dias - b.dias);

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Productos por vencer</h4>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Vencimiento</th>
              <th>Días restantes</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {lotesOrdenados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-muted">
                  No hay lotes con vencimiento cargado.
                </td>
              </tr>
            ) : (
              lotesOrdenados.map((lote) => {
                let estado = "Correcto";
                let clase = "badge bg-success";

                if (lote.dias < 0) {
                  estado = "Vencido";
                  clase = "badge bg-danger";
                } else if (lote.dias <= 7) {
                  estado = "Crítico";
                  clase = "badge bg-danger";
                } else if (lote.dias <= 30) {
                  estado = "Próximo";
                  clase = "badge bg-warning text-dark";
                }

                return (
                  <tr key={lote.id}>
                    <td className="fw-semibold">{lote.producto}</td>
                    <td>{lote.codigo}</td>
                    <td>{lote.cantidad}</td>
                    <td>{lote.vencimiento}</td>
                    <td>{lote.dias}</td>
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
    </section>
  );
}