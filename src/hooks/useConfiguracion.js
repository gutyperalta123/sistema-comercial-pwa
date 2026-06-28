import { useState } from "react";
import {
  obtenerConfiguracionNegocio,
  guardarConfiguracionNegocio,
} from "../services/configuracionService";

export function useConfiguracion() {
  const [configuracion, setConfiguracion] = useState(null);

  const cargarConfiguracion = async () => {
    const data = await obtenerConfiguracionNegocio();
    setConfiguracion(data);
  };

  const guardarConfiguracion = async (e) => {
    e.preventDefault();

    await guardarConfiguracionNegocio(configuracion);
    alert("Configuración guardada correctamente");
  };

  return {
    configuracion,
    setConfiguracion,
    cargarConfiguracion,
    guardarConfiguracion,
  };
}