export default function DashboardMaestro({ negocios }) {
  const totalNegocios = negocios.length;
  const activos = negocios.filter((n) => n.estado === "Activo").length;
  const suspendidos = negocios.filter((n) => n.estado === "Suspendido").length;

  const ventasTotales = negocios.reduce(
    (total, n) => total + Number(n.total_vendido || 0),
    0
  );

  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <section className="row g-3 mb-4">
      <div className="col-12 col-md-3">
        <div className="panel p-3">
          <span className="text-muted">Negocios</span>
          <h2 className="fw-bold">{totalNegocios}</h2>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="panel p-3">
          <span className="text-muted">Activos</span>
          <h2 className="fw-bold text-success">{activos}</h2>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="panel p-3">
          <span className="text-muted">Suspendidos</span>
          <h2 className="fw-bold text-danger">{suspendidos}</h2>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="panel p-3">
          <span className="text-muted">Total vendido</span>
          <h2 className="fw-bold">${formatoPrecio(ventasTotales)}</h2>
        </div>
      </div>
    </section>
  );
}