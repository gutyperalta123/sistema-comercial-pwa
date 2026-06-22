export default function Configuracion({
  configuracion,
  setConfiguracion,
  guardarConfiguracion,
}) {
  if (!configuracion) {
    return (
      <section className="panel mt-4">
        <p>Cargando configuración...</p>
      </section>
    );
  }

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Configuración del negocio</h4>

      <form onSubmit={guardarConfiguracion} className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Nombre del negocio</label>
          <input
            className="form-control"
            value={configuracion.nombre || ""}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                nombre: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Ciudad</label>
          <input
            className="form-control"
            value={configuracion.ciudad || ""}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                ciudad: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Dirección</label>
          <input
            className="form-control"
            value={configuracion.direccion || ""}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                direccion: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            className="form-control"
            value={configuracion.telefono || ""}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                telefono: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">CUIT / DNI opcional</label>
          <input
            className="form-control"
            value={configuracion.cuit || ""}
            onChange={(e) =>
              setConfiguracion({
                ...configuracion,
                cuit: e.target.value,
              })
            }
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary">
            Guardar configuración
          </button>
        </div>
      </form>
    </section>
  );
}