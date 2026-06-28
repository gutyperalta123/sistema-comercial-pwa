import { useState } from "react";
import {
  obtenerUsuarios,
  crearUsuario,
  cambiarPassword,
  cambiarEstadoUsuario,
} from "../services/usuariosService";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    usuario: "",
    rol: "Empleado",
  });

  const [passwordData, setPasswordData] = useState({
    nuevaPassword: "",
    repetirPassword: "",
  });

  const cargarUsuarios = async () => {
    const usuariosBase = await obtenerUsuarios();
    setUsuarios(usuariosBase);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!nuevoUsuario.nombre || !nuevoUsuario.usuario) {
      alert("Completá nombre y usuario");
      return;
    }

    await crearUsuario({ ...nuevoUsuario, password: "1234" });

    setNuevoUsuario({
      nombre: "",
      usuario: "",
      rol: "Empleado",
    });

    await cargarUsuarios();

    alert("Usuario creado correctamente. Contraseña inicial: 1234");
  };

  const cambiarMiPassword = async (usuarioActual, e) => {
    e.preventDefault();

    if (!passwordData.nuevaPassword || !passwordData.repetirPassword) {
      alert("Completá ambos campos");
      return;
    }

    if (passwordData.nuevaPassword !== passwordData.repetirPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await cambiarPassword(usuarioActual.id, passwordData.nuevaPassword);

    setPasswordData({
      nuevaPassword: "",
      repetirPassword: "",
    });

    alert("Contraseña cambiada correctamente");
  };

  const cambiarEstadoEmpleado = async (usuarioId, activo) => {
    await cambiarEstadoUsuario(usuarioId, activo);
    await cargarUsuarios();

    alert(
      activo
        ? "Usuario activado correctamente"
        : "Usuario desactivado correctamente"
    );
  };

  return {
    usuarios,
    setUsuarios,
    cargarUsuarios,

    nuevoUsuario,
    setNuevoUsuario,

    passwordData,
    setPasswordData,

    guardarUsuario,
    cambiarMiPassword,
    cambiarEstadoEmpleado,
  };
}