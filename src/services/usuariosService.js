import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerUsuarios() {
  const { data, error } = await supabase
    .from("usuarios_app")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("nombre");

  if (error) {
    throw error;
  }

  return data;
}

export async function loginUsuario(usuario, password) {
  const { data, error } = await supabase
    .from("usuarios_app")
    .select("*")
    .eq("usuario", usuario)
    .eq("password", password)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function crearUsuario(nuevoUsuario) {
  const { error } = await supabase.from("usuarios_app").insert({
    negocio_id: NEGOCIO_ID,
    nombre: nuevoUsuario.nombre,
    usuario: nuevoUsuario.usuario,
    password: nuevoUsuario.password,
    rol: nuevoUsuario.rol,
    activo: true,
  });

  if (error) {
    throw error;
  }
}

export async function cambiarPassword(usuarioId, nuevaPassword) {
  const { error } = await supabase
    .from("usuarios_app")
    .update({
      password: nuevaPassword,
    })
    .eq("id", usuarioId);

  if (error) {
    throw error;
  }
}

export async function cambiarEstadoUsuario(usuarioId, activo) {
  const { error } = await supabase
    .from("usuarios_app")
    .update({
      activo,
    })
    .eq("id", usuarioId);

  if (error) {
    throw error;
  }
}