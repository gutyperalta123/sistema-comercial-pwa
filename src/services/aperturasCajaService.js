import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerAperturasCaja() {
  const { data, error } = await supabase
    .from("aperturas_caja")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("fecha_apertura", { ascending: false });

  if (error) throw error;

  return data.map((apertura) => ({
    id: apertura.id,
    usuarioId: apertura.usuario_id,
    usuarioNombre: apertura.usuario_nombre,
    fondoInicial: Number(apertura.fondo_inicial || 0),
    fechaAperturaRaw: apertura.fecha_apertura,
    fechaApertura: new Date(apertura.fecha_apertura).toLocaleString("es-AR"),
    fechaCierreRaw: apertura.fecha_cierre || null,
    fechaCierre: apertura.fecha_cierre
      ? new Date(apertura.fecha_cierre).toLocaleString("es-AR")
      : "",
    estado: apertura.estado || "Abierta",
    observacion: apertura.observacion || "",
  }));
}

export async function crearAperturaCaja({
  usuarioId,
  usuarioNombre,
  fondoInicial = 0,
  observacion = "",
}) {
  const { error } = await supabase.from("aperturas_caja").insert({
    negocio_id: NEGOCIO_ID,
    usuario_id: usuarioId,
    usuario_nombre: usuarioNombre,
    fondo_inicial: Number(fondoInicial || 0),
    estado: "Abierta",
    observacion,
  });

  if (error) throw error;
}

export async function cerrarAperturaCaja(aperturaId) {
  const { error } = await supabase
    .from("aperturas_caja")
    .update({
      estado: "Cerrada",
      fecha_cierre: new Date().toISOString(),
    })
    .eq("id", aperturaId);

  if (error) throw error;
}