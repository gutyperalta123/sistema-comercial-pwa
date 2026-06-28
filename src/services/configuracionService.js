import { supabase } from "./supabaseClient";

function obtenerNegocioId() {
  const usuarioGuardado = localStorage.getItem("usuarioActual");

  if (!usuarioGuardado) {
    throw new Error("No hay usuario logueado");
  }

  const usuario = JSON.parse(usuarioGuardado);
  const negocioId = usuario.negocio_id || usuario.negocioId;

  if (!negocioId) {
    throw new Error("El usuario no tiene negocio asignado");
  }

  return negocioId;
}

export async function obtenerConfiguracionNegocio() {
  const negocioId = obtenerNegocioId();

  const { data, error } = await supabase
    .from("configuracion_negocio")
    .select("*")
    .eq("negocio_id", negocioId)
    .maybeSingle();

  if (error) throw error;

  if (data) return data;

  const { data: negocio, error: errorNegocio } = await supabase
    .from("negocios")
    .select("nombre, telefono_dueno")
    .eq("id", negocioId)
    .maybeSingle();

  if (errorNegocio) throw errorNegocio;

  const configuracionInicial = {
    negocio_id: negocioId,
    nombre: negocio?.nombre || "Negocio",
    direccion: "",
    telefono: negocio?.telefono_dueno || "",
    cuit: "",
    ciudad: "",
  };

  const { data: nuevaConfig, error: errorCrear } = await supabase
    .from("configuracion_negocio")
    .insert(configuracionInicial)
    .select("*")
    .single();

  if (errorCrear) throw errorCrear;

  return nuevaConfig;
}

export async function guardarConfiguracionNegocio(configuracion) {
  const negocioId = obtenerNegocioId();

  const { error } = await supabase
    .from("configuracion_negocio")
    .update({
      nombre: configuracion.nombre,
      direccion: configuracion.direccion,
      telefono: configuracion.telefono,
      cuit: configuracion.cuit,
      ciudad: configuracion.ciudad,
    })
    .eq("id", configuracion.id)
    .eq("negocio_id", negocioId);

  if (error) throw error;
}