import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerConfiguracionNegocio() {
  const { data, error } = await supabase
    .from("configuracion_negocio")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function guardarConfiguracionNegocio(configuracion) {
  const { error } = await supabase
    .from("configuracion_negocio")
    .update({
      nombre: configuracion.nombre,
      direccion: configuracion.direccion,
      telefono: configuracion.telefono,
      cuit: configuracion.cuit,
      ciudad: configuracion.ciudad,
    })
    .eq("id", configuracion.id);

  if (error) {
    throw error;
  }
}