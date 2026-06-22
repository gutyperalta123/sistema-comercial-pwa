import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerRetirosInternos() {
  const { data, error } = await supabase
    .from("retiros_internos")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("fecha", { ascending: false });

  if (error) throw error;

  return data.map((retiro) => ({
    id: retiro.id,
    usuarioId: retiro.usuario_id,
    nombreUsuario: retiro.nombre_usuario,
    rolUsuario: retiro.rol_usuario,
    tipoRetiro: retiro.tipo_retiro,
    estadoPago: retiro.estado_pago,
    total: Number(retiro.total || 0),
    productos: retiro.productos || [],
    registradoPorId: retiro.registrado_por_id,
    registradoPorNombre: retiro.registrado_por_nombre || "",
    fecha: new Date(retiro.fecha).toLocaleString("es-AR"),
  }));
}

export async function crearRetiroInterno({
  usuarioId,
  nombreUsuario,
  rolUsuario,
  tipoRetiro,
  estadoPago,
  total,
  productos,
  registradoPorId,
  registradoPorNombre,
}) {
  const { error } = await supabase.from("retiros_internos").insert({
    negocio_id: NEGOCIO_ID,
    usuario_id: usuarioId,
    nombre_usuario: nombreUsuario,
    rol_usuario: rolUsuario,
    tipo_retiro: tipoRetiro,
    estado_pago: estadoPago,
    total: Number(total || 0),
    productos,
    registrado_por_id: registradoPorId,
    registrado_por_nombre: registradoPorNombre,
  });

  if (error) throw error;
}