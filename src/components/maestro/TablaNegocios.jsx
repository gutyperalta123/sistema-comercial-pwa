export default function TablaNegocios({
  negocios,
  cargando,
  onCrearNegocio,
  onEditarNegocio,
  onVerNegocio,
  onCambiarEstadoNegocio,
  guardando,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Negocios registrados</h3>

          <button className="btn btn-primary" onClick={onCrearNegocio}>
            Crear negocio
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Negocio</th>
                <th>Dueño</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Plan</th>
                <th>Vence</th>
                <th>Total vendido</th>
                <th style={{ width: 300 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    Cargando...
                  </td>
                </tr>
              ) : negocios.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    No hay negocios registrados.
                  </td>
                </tr>
              ) : (
                negocios.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <strong>{n.nombre}</strong>
                    </td>
                    <td>{n.nombre_dueno || "-"}</td>
                    <td>{n.telefono_dueno || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          n.estado === "Activo" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {n.estado}
                      </span>
                    </td>
                    <td>{n.plan || "-"}</td>
                    <td>{n.fecha_vencimiento || "-"}</td>
                    <td>
                      ${Number(n.total_vendido || 0).toLocaleString("es-AR")}
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => onVerNegocio(n)}
                          disabled={guardando}
                        >
                          Ver
                        </button>

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => onEditarNegocio(n)}
                          disabled={guardando}
                        >
                          Editar
                        </button>

                        <button
                          className={
                            n.estado === "Activo"
                              ? "btn btn-danger btn-sm"
                              : "btn btn-success btn-sm"
                          }
                          onClick={() => onCambiarEstadoNegocio(n)}
                          disabled={guardando}
                        >
                          {n.estado === "Activo" ? "Suspender" : "Reactivar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}