import { useEffect, useState } from "react";
import {
  obtenerNegociosMaestro,
  crearNegocioConAdministrador,
  actualizarNegocioMaestro,
  obtenerDetalleNegocioMaestro,
  suspenderNegocioMaestro,
  reactivarNegocioMaestro,
} from "../services/maestroService";
import DashboardMaestro from "../components/maestro/DashboardMaestro";
import TablaNegocios from "../components/maestro/TablaNegocios";
import ModalCrearNegocio from "../components/maestro/ModalCrearNegocio";
import ModalEditarNegocio from "../components/maestro/ModalEditarNegocio";
import ModalVerNegocio from "../components/maestro/ModalVerNegocio";

export default function PanelMaestro({ cerrarSesion }) {
  const [negocios, setNegocios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [negocioEditando, setNegocioEditando] = useState(null);
  const [detalleNegocio, setDetalleNegocio] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargarNegocios = async () => {
    try {
      setCargando(true);
      const data = await obtenerNegociosMaestro();
      setNegocios(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar negocios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNegocios();
  }, []);

  const guardarNuevoNegocio = async (datos) => {
    try {
      setGuardando(true);
      await crearNegocioConAdministrador(datos);
      await cargarNegocios();
      setModalCrearAbierto(false);
      alert("Negocio creado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear negocio: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const abrirEditarNegocio = (negocio) => {
    setNegocioEditando(negocio);
    setModalEditarAbierto(true);
  };

  const guardarEdicionNegocio = async (negocioId, datos) => {
    try {
      setGuardando(true);
      await actualizarNegocioMaestro(negocioId, datos);
      await cargarNegocios();
      setModalEditarAbierto(false);
      setNegocioEditando(null);
      alert("Negocio actualizado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar negocio: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const abrirVerNegocio = async (negocio) => {
    try {
      setDetalleNegocio(null);
      setModalVerAbierto(true);
      setCargandoDetalle(true);

      const detalle = await obtenerDetalleNegocioMaestro(negocio.id);
      setDetalleNegocio(detalle);
    } catch (error) {
      console.error(error);
      alert("Error al cargar detalle del negocio: " + error.message);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cambiarEstadoRapido = async (negocio) => {
    const estaActivo = negocio.estado === "Activo";

    const confirmar = confirm(
      estaActivo
        ? `¿Querés suspender "${negocio.nombre}"? El cliente no debería poder usar el sistema.`
        : `¿Querés reactivar "${negocio.nombre}"?`
    );

    if (!confirmar) return;

    try {
      setGuardando(true);

      if (estaActivo) {
        await suspenderNegocioMaestro(negocio.id);
        alert("Negocio suspendido correctamente");
      } else {
        await reactivarNegocioMaestro(negocio.id);
        alert("Negocio reactivado correctamente");
      }

      await cargarNegocios();
    } catch (error) {
      console.error(error);
      alert("Error al cambiar estado del negocio: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="main-content">
      <div className="topbar mb-3">
        <div>
          <h3 className="fw-bold mb-0">Panel Maestro</h3>
          <small className="text-muted">Administración general del sistema</small>
        </div>

        <button className="btn btn-outline-danger" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      <DashboardMaestro negocios={negocios} />

      <TablaNegocios
        negocios={negocios}
        cargando={cargando}
        onCrearNegocio={() => setModalCrearAbierto(true)}
        onEditarNegocio={abrirEditarNegocio}
        onVerNegocio={abrirVerNegocio}
        onCambiarEstadoNegocio={cambiarEstadoRapido}
        guardando={guardando}
      />

      <ModalCrearNegocio
        abierto={modalCrearAbierto}
        onCerrar={() => setModalCrearAbierto(false)}
        onGuardar={guardarNuevoNegocio}
        guardando={guardando}
      />

      <ModalEditarNegocio
        abierto={modalEditarAbierto}
        negocio={negocioEditando}
        onCerrar={() => {
          setModalEditarAbierto(false);
          setNegocioEditando(null);
        }}
        onGuardar={guardarEdicionNegocio}
        guardando={guardando}
      />

      <ModalVerNegocio
        abierto={modalVerAbierto}
        detalle={detalleNegocio}
        cargando={cargandoDetalle}
        onCerrar={() => {
          setModalVerAbierto(false);
          setDetalleNegocio(null);
        }}
      />
    </main>
  );
}