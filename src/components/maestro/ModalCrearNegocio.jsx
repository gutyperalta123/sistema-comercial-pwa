import { useState } from "react";

export default function ModalCrearNegocio({
  abierto,
  onCerrar,
  onGuardar,
  guardando,
}) {
  const [form, setForm] = useState({
    nombreNegocio: "",
    nombreDueno: "",
    telefonoDueno: "",
    emailDueno: "",
    plan: "Mensual",
    fechaVencimiento: "",
    nombreAdministrador: "Dueño del negocio",
    usuarioAdministrador: "",
    passwordAdministrador: "1234",
  });

  if (!abierto) return null;

  const cambiar = (campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!form.nombreNegocio || !form.usuarioAdministrador || !form.passwordAdministrador) {
      alert("Completá nombre del negocio, usuario y contraseña del administrador");
      return;
    }

    await onGuardar(form);

    setForm({
      nombreNegocio: "",
      nombreDueno: "",
      telefonoDueno: "",
      emailDueno: "",
      plan: "Mensual",
      fechaVencimiento: "",
      nombreAdministrador: "Dueño del negocio",
      usuarioAdministrador: "",
      passwordAdministrador: "1234",
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 3000 }}
    >
      <div className="bg-white rounded shadow p-3 w-100" style={{ maxWidth: "760px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Crear negocio</h4>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={guardar} className="row g-2">
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Nombre del negocio"
              value={form.nombreNegocio}
              onChange={(e) => cambiar("nombreNegocio", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Nombre del dueño"
              value={form.nombreDueno}
              onChange={(e) => cambiar("nombreDueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Teléfono / WhatsApp"
              value={form.telefonoDueno}
              onChange={(e) => cambiar("telefonoDueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Email del dueño"
              value={form.emailDueno}
              onChange={(e) => cambiar("emailDueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <select
              className="form-control"
              value={form.plan}
              onChange={(e) => cambiar("plan", e.target.value)}
            >
              <option value="Mensual">Mensual</option>
              <option value="Prueba">Prueba</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              type="date"
              value={form.fechaVencimiento}
              onChange={(e) => cambiar("fechaVencimiento", e.target.value)}
            />
          </div>

          <div className="col-12">
            <hr />
            <h5 className="fw-bold">Administrador del negocio</h5>
          </div>

          <div className="col-12 col-md-4">
            <input
              className="form-control"
              placeholder="Nombre administrador"
              value={form.nombreAdministrador}
              onChange={(e) => cambiar("nombreAdministrador", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              className="form-control"
              placeholder="Usuario administrador"
              value={form.usuarioAdministrador}
              onChange={(e) => cambiar("usuarioAdministrador", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              className="form-control"
              placeholder="Contraseña inicial"
              value={form.passwordAdministrador}
              onChange={(e) => cambiar("passwordAdministrador", e.target.value)}
            />
          </div>

          <div className="col-12 mt-3">
            <button className="btn btn-primary w-100" disabled={guardando}>
              {guardando ? "Guardando..." : "Crear negocio y administrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}