import { useEffect, useState } from "react";

export default function ModalEditarNegocio({
  abierto,
  negocio,
  onCerrar,
  onGuardar,
  guardando,
}) {
  const [form, setForm] = useState({
    nombre: "",
    nombre_dueno: "",
    telefono_dueno: "",
    email_dueno: "",
    estado: "Activo",
    plan: "Mensual",
    fecha_vencimiento: "",
    mensaje_bloqueo: "",
  });

  useEffect(() => {
    if (!negocio) return;

    setForm({
      nombre: negocio.nombre || "",
      nombre_dueno: negocio.nombre_dueno || "",
      telefono_dueno: negocio.telefono_dueno || "",
      email_dueno: negocio.email_dueno || "",
      estado: negocio.estado || "Activo",
      plan: negocio.plan || "Mensual",
      fecha_vencimiento: negocio.fecha_vencimiento || "",
      mensaje_bloqueo:
        negocio.mensaje_bloqueo ||
        "Tu suscripción está vencida. Comunicate con el administrador.",
    });
  }, [negocio]);

  if (!abierto || !negocio) return null;

  const cambiar = (campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      alert("Completá el nombre del negocio");
      return;
    }

    await onGuardar(negocio.id, form);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 3000 }}
    >
      <div className="bg-white rounded shadow p-3 w-100" style={{ maxWidth: "760px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Editar negocio</h4>

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
              value={form.nombre}
              onChange={(e) => cambiar("nombre", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Nombre del dueño"
              value={form.nombre_dueno}
              onChange={(e) => cambiar("nombre_dueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Teléfono / WhatsApp"
              value={form.telefono_dueno}
              onChange={(e) => cambiar("telefono_dueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Email del dueño"
              value={form.email_dueno}
              onChange={(e) => cambiar("email_dueno", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-control"
              value={form.estado}
              onChange={(e) => cambiar("estado", e.target.value)}
            >
              <option value="Activo">Activo</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
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

          <div className="col-12 col-md-4">
            <input
              className="form-control"
              type="date"
              value={form.fecha_vencimiento || ""}
              onChange={(e) => cambiar("fecha_vencimiento", e.target.value)}
            />
          </div>

          <div className="col-12">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Mensaje de bloqueo o aviso"
              value={form.mensaje_bloqueo}
              onChange={(e) => cambiar("mensaje_bloqueo", e.target.value)}
            />
          </div>

          <div className="col-12 mt-3">
            <button className="btn btn-primary w-100" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}