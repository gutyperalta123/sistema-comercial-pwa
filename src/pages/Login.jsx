export default function Login({
  loginData,
  setLoginData,
  iniciarSesion,
}) {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="fw-bold mb-2">Sistema Comercial</h2>
        <p className="text-muted mb-4">
          Ingresá con tu usuario y contraseña
        </p>

        <form onSubmit={iniciarSesion}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              className="form-control form-control-lg"
              value={loginData.usuario}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  usuario: e.target.value,
                })
              }
              placeholder="Ej: admin"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              placeholder="Ej: 1234"
            />
          </div>

          <button className="btn btn-primary btn-lg w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}