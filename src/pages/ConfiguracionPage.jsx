import Configuracion from "./Configuracion";

export default function ConfiguracionPage({
  configuracion,
  setConfiguracion,
  guardarConfiguracion,
}) {
  return (
    <Configuracion
      configuracion={configuracion}
      setConfiguracion={setConfiguracion}
      guardarConfiguracion={guardarConfiguracion}
    />
  );
}