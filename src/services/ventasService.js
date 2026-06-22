import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function guardarVenta({
  vendedor,
  productos,
  total,
  ganancia,
  metodoPago,
  montoEfectivo,
  montoTransferencia,
}) {
  const { data: ventaCreada, error: ventaError } = await supabase
    .from("ventas")
    .insert({
      negocio_id: NEGOCIO_ID,
      vendedor,
      total: Number(total || 0),
      ganancia: Number(ganancia || 0),
      metodo_pago: metodoPago || "Efectivo",
      monto_efectivo: Number(montoEfectivo || 0),
      monto_transferencia: Number(montoTransferencia || 0),
    })
    .select()
    .single();

  if (ventaError) throw ventaError;

  const detalles = productos.map((producto) => ({
    venta_id: ventaCreada.id,
    producto_id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    cantidad: Number(producto.cantidad || 0),
    precio_venta: Number(producto.precioVenta || 0),
    precio_compra: Number(producto.precioCompra || 0),
    subtotal: Number(producto.precioVenta || 0) * Number(producto.cantidad || 0),
  }));

  const { error: detalleError } = await supabase
    .from("detalle_ventas")
    .insert(detalles);

  if (detalleError) throw detalleError;

  return ventaCreada;
}