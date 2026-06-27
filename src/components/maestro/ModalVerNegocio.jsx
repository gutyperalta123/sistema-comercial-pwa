export default function ModalVerNegocio({
  abierto,
  detalle,
  cargando,
  onCerrar,
}) {
  if (!abierto) return null;

  const negocio = detalle?.negocio;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 3000 }}
    >
      <div
        className="bg-white rounded shadow p-3 w-100 overflow-auto"
        style={{ maxWidth: "760px", maxHeight: "90vh" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-0">Datos del negocio</h4>
            <small className="text-muted">
              Información administrativa del cliente
            </small>
          </div>

          <button className="btn btn-outline-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>

        {cargando ? (
          <p className="text-muted">Cargando datos...</p>
        ) : !negocio ? (
          <p className="text-muted">No se encontró información del negocio.</p>
        ) : (
          <section className="panel p-3">
            <h5 className="fw-bold mb-3">Información principal</h5>

            <p className="mb-2">
              <strong>Nombre del negocio:</strong> {negocio.nombre || "-"}
            </p>

            <p className="mb-2">
              <strong>Dueño:</strong> {negocio.nombre_dueno || "-"}
            </p>

            <p className="mb-2">
              <strong>Teléfono / WhatsApp:</strong>{" "}
              {negocio.telefono_dueno || "-"}
            </p>

            <p className="mb-2">
              <strong>Email:</strong> {negocio.email_dueno || "-"}
            </p>

            <p className="mb-2">
              <strong>Estado:</strong>{" "}
              <span
                className={
                  negocio.estado === "Activo"
                    ? "badge bg-success"
                    : "badge bg-danger"
                }
              >
                {negocio.estado || "Sin estado"}
              </span>
            </p>

            <p className="mb-2">
              <strong>Plan:</strong> {negocio.plan || "-"}
            </p>

            <p className="mb-2">
              <strong>Fecha de vencimiento:</strong>{" "}
              {negocio.fecha_vencimiento || "-"}
            </p>

            <p className="mb-0">
              <strong>Mensaje de bloqueo:</strong>{" "}
              {negocio.mensaje_bloqueo || "-"}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}