export default function Usuarios({
  usuarios,
  nuevoUsuario,
  setNuevoUsuario,
  guardarUsuario,
  cambiarUsuario,
  cambiarEstadoEmpleado,
}) {
  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Usuarios y empleados</h4>

      <form onSubmit={guardarUsuario} className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <input
            className="form-control"
            placeholder="Nombre del empleado"
            value={nuevoUsuario.nombre}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
            }
          />
        </div>

        <div className="col-12 col-md-4">
          <input
            className="form-control"
            placeholder="Usuario"
            value={nuevoUsuario.usuario}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value })
            }
          />
        </div>

        <div className="col-12 col-md-2">
          <select
            className="form-select"
            value={nuevoUsuario.rol}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
            }
          >
            <option>Empleado</option>
            <option>Administrador</option>
          </select>
        </div>

        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100">Crear usuario</button>
        </div>
      </form>

      <div className="alert alert-info">
        Los usuarios creados pueden iniciar sesión. La contraseña inicial es{" "}
        <strong>1234</strong>.
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Probar vista</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="fw-semibold">{usuario.nombre}</td>
                <td>{usuario.usuario}</td>
                <td>
                  <span
                    className={
                      usuario.rol === "Administrador"
                        ? "badge bg-primary"
                        : "badge bg-secondary"
                    }
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      usuario.activo ? "badge bg-success" : "badge bg-danger"
                    }
                  >
                    {usuario.activo ? "Activo" : "Bloqueado"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => cambiarUsuario(usuario)}
                    disabled={!usuario.activo}
                  >
                    Entrar como este usuario
                  </button>
                </td>
                <td>
                  {usuario.usuario === "admin" ? (
                    <span className="text-muted">Dueño principal</span>
                  ) : (
                    <button
                      className={
                        usuario.activo
                          ? "btn btn-sm btn-outline-danger"
                          : "btn btn-sm btn-outline-success"
                      }
                      onClick={() =>
                        cambiarEstadoEmpleado(usuario.id, !usuario.activo)
                      }
                    >
                      {usuario.activo ? "Desactivar" : "Activar"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}