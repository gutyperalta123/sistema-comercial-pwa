import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerSolicitudesReaperturaCaja() {
  const { data, error } = await supabase
    .from("solicitudes_reapertura_caja")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("fecha_solicitud", { ascending: false });

  if (error) throw error;

  return data.map((solicitud) => ({
    id: solicitud.id,
    cierreId: solicitud.cierre_id,
    usuarioId: solicitud.usuario_id,
    usuarioNombre: solicitud.usuario_nombre,
    motivo: solicitud.motivo,
    tipoReapertura: solicitud.tipo_reapertura || "Reconteo",
    estado: solicitud.estado || "Pendiente",
    autorizadoPorId: solicitud.autorizado_por_id,
    autorizadoPorNombre: solicitud.autorizado_por_nombre || "",
    fechaSolicitud: new Date(solicitud.fecha_solicitud).toLocaleString("es-AR"),
    fechaRespuesta: solicitud.fecha_respuesta
      ? new Date(solicitud.fecha_respuesta).toLocaleString("es-AR")
      : "",
  }));
}

export async function crearSolicitudReaperturaCaja({
  cierreId,
  usuarioId,
  usuarioNombre,
  motivo,
  tipoReapertura,
}) {
  const { error } = await supabase.from("solicitudes_reapertura_caja").insert({
  negocio_id: NEGOCIO_ID,
  cierre_id: cierreId,
  usuario_id: usuarioId,
  usuario_nombre: usuarioNombre,
  motivo,
  tipo_reapertura: tipoReapertura || "Reconteo",
  estado: "Pendiente",
});

  if (error) throw error;
}

export async function marcarSolicitudAutorizada({
  solicitudId,
  autorizadoPorId,
  autorizadoPorNombre,
}) {
  const { error } = await supabase
    .from("solicitudes_reapertura_caja")
    .update({
      estado: "Autorizada",
      autorizado_por_id: autorizadoPorId,
      autorizado_por_nombre: autorizadoPorNombre,
      fecha_respuesta: new Date().toISOString(),
    })
    .eq("id", solicitudId);

  if (error) throw error;
}