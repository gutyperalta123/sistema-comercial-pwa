export default function MiCuenta({
  usuarioActual,
  passwordData,
  setPasswordData,
  cambiarMiPassword,
}) {
  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Mi cuenta</h4>

      <div className="alert alert-info">
        Usuario actual: <strong>{usuarioActual.nombre}</strong> · Rol:{" "}
        <strong>{usuarioActual.rol}</strong>
      </div>

      <form onSubmit={cambiarMiPassword} className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            value={passwordData.nuevaPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                nuevaPassword: e.target.value,
              })
            }
            placeholder="Nueva contraseña"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Repetir contraseña</label>
          <input
            type="password"
            className="form-control"
            value={passwordData.repetirPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                repetirPassword: e.target.value,
              })
            }
            placeholder="Repetir contraseña"
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary">
            Cambiar contraseña
          </button>
        </div>
      </form>
    </section>
  );
}