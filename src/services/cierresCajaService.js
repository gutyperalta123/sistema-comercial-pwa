import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerCierresCaja() {
  const { data, error } = await supabase
    .from("cierres_caja")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("fecha", { ascending: false });

  if (error) throw error;

  return data.map((cierre) => ({
    id: cierre.id,
    usuarioId: cierre.usuario_id,
    usuarioNombre: cierre.usuario_nombre,

    efectivoDeclarado: Number(cierre.efectivo_declarado || 0),
    transferenciasDeclaradas: Number(cierre.transferencias_declaradas || 0),

    totalVentas: Number(cierre.total_ventas || 0),
    totalTransferencias: Number(cierre.total_transferencias || 0),
    totalRetirosPagados: Number(cierre.total_retiros_pagados || 0),
    totalEsperado: Number(cierre.total_esperado || 0),
    diferencia: Number(cierre.diferencia || 0),

    estado: cierre.estado || "Cerrado",
    observacion: cierre.observacion || "",
    motivoReapertura: cierre.motivo_reapertura || "",
    tipoReapertura: cierre.tipo_reapertura || "",
    autorizadoPorNombre: cierre.autorizado_por_nombre || "",

    fechaRaw: cierre.fecha,
    fecha: new Date(cierre.fecha).toLocaleString("es-AR"),

    fechaInicioCajaRaw: cierre.fecha_inicio_caja || null,

    fechaReaperturaRaw: cierre.fecha_reapertura || null,
    fechaReapertura: cierre.fecha_reapertura
      ? new Date(cierre.fecha_reapertura).toLocaleString("es-AR")
      : "",
  }));
}

export async function crearCierreCaja({
  usuarioId,
  usuarioNombre,
  efectivoDeclarado,
  transferenciasDeclaradas,
  billetes,
  totalVentas,
  totalTransferencias,
  totalRetirosPagados,
  totalEsperado,
  diferencia,
  observacion,
  fechaInicioCaja,
}) {
  const { error } = await supabase.from("cierres_caja").insert({
    negocio_id: NEGOCIO_ID,
    usuario_id: usuarioId,
    usuario_nombre: usuarioNombre,

    efectivo_declarado: Number(efectivoDeclarado || 0),
    transferencias_declaradas: Number(transferenciasDeclaradas || 0),

    billete_20000: Number(billetes.billete20000 || 0),
    billete_10000: Number(billetes.billete10000 || 0),
    billete_2000: Number(billetes.billete2000 || 0),
    billete_1000: Number(billetes.billete1000 || 0),
    billete_500: Number(billetes.billete500 || 0),
    billete_200: Number(billetes.billete200 || 0),
    billete_100: Number(billetes.billete100 || 0),
    billete_50: Number(billetes.billete50 || 0),
    monedas: Number(billetes.monedas || 0),

    total_ventas: Number(totalVentas || 0),
    total_transferencias: Number(totalTransferencias || 0),
    total_retiros_pagados: Number(totalRetirosPagados || 0),
    total_esperado: Number(totalEsperado || 0),
    diferencia: Number(diferencia || 0),

    fecha_inicio_caja: fechaInicioCaja || null,

    estado: "Cerrado",
    observacion: observacion || "",
  });

  if (error) throw error;
}

export async function reabrirCierreCaja({
  cierreId,
  motivoReapertura,
  tipoReapertura,
  autorizadoPorId,
  autorizadoPorNombre,
}) {
  const { error } = await supabase
    .from("cierres_caja")
    .update({
      estado: "Reabierto por administrador",
      motivo_reapertura: motivoReapertura,
      tipo_reapertura: tipoReapertura,
      autorizado_por_id: autorizadoPorId,
      autorizado_por_nombre: autorizadoPorNombre,
      fecha_reapertura: new Date().toISOString(),
    })
    .eq("id", cierreId);

  if (error) throw error;
}