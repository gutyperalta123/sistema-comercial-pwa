import Usuarios from "./Usuarios";

export default function UsuariosPage({
  usuarios,
  nuevoUsuario,
  setNuevoUsuario,
  guardarUsuario,
  cambiarUsuario,
  cambiarEstadoEmpleado,
}) {
  return (
    <Usuarios
      usuarios={usuarios}
      nuevoUsuario={nuevoUsuario}
      setNuevoUsuario={setNuevoUsuario}
      guardarUsuario={guardarUsuario}
      cambiarUsuario={cambiarUsuario}
      cambiarEstadoEmpleado={cambiarEstadoEmpleado}
    />
  );
}