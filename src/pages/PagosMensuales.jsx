export default function PagosMensuales({ usuarios, retirosInternos }) {
  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const empleados = usuarios.filter((usuario) => usuario.rol === "Empleado");

  const resumenEmpleados = empleados.map((empleado) => {
    const retirosEmpleado = retirosInternos.filter(
      (retiro) =>
        retiro.usuarioId === empleado.id &&
        retiro.estadoPago === "Descontar sueldo"
    );

    const totalDescuento = retirosEmpleado.reduce(
      (total, retiro) => total + retiro.total,
      0
    );

    return {
      ...empleado,
      retiros: retirosEmpleado,
      totalDescuento,
    };
  });

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Pagos mensuales</h4>

      <div className="alert alert-info">
        Acá se resumen los retiros de empleados marcados como{" "}
        <strong>Descontar sueldo</strong>.
      </div>

      <div className="row g-4">
        {resumenEmpleados.map((empleado) => (
          <div className="col-12 col-xl-6" key={empleado.id}>
            <div className="panel p-3 border">
              <h5 className="fw-bold mb-2">{empleado.nombre}</h5>

              <div className="alert alert-danger py-2">
                <strong>Total a descontar:</strong> $
                {formatoPrecio(empleado.totalDescuento)}
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Productos</th>
                    </tr>
                  </thead>

                  <tbody>
                    {empleado.retiros.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-muted">
                          Sin descuentos registrados.
                        </td>
                      </tr>
                    ) : (
                      empleado.retiros.map((retiro) => (
                        <tr key={retiro.id}>
                          <td>{retiro.fecha}</td>
                          <td>${formatoPrecio(retiro.total)}</td>
                          <td>
                            {retiro.productos.map((p, index) => (
                              <div key={`${retiro.id}-${index}`}>
                                {p.nombre} x {p.cantidad}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {resumenEmpleados.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning">
              Todavía no hay empleados cargados.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}