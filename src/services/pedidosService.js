import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerPedidos() {
  const { data: pedidos, error: pedidosError } = await supabase
    .from("pedidos")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("creado_en", { ascending: false });

  if (pedidosError) {
    throw pedidosError;
  }

  const { data: detalles, error: detallesError } = await supabase
    .from("detalle_pedidos")
    .select("*");

  if (detallesError) {
    throw detallesError;
  }

  return pedidos.map((pedido) => ({
    id: pedido.id,
    fecha: new Date(pedido.creado_en).toLocaleString("es-AR"),
    estado: pedido.estado,
    creadoPor: pedido.creado_por,
    productos: detalles
      .filter((detalle) => detalle.pedido_id === pedido.id)
      .map((detalle) => ({
        id: detalle.id,
        productoId: detalle.producto_id,
        codigo: detalle.codigo,
        nombre: detalle.nombre,
        proveedor: detalle.proveedor,
        pedido: Number(detalle.pedido || 0),
        recibido: Number(detalle.recibido || 0),
        faltan: Number(detalle.faltan || 0),
      })),
  }));
}

export async function crearPedidoAutomatico({ creadoPor, productosReponer }) {
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      negocio_id: NEGOCIO_ID,
      estado: "Pendiente",
      creado_por: creadoPor,
    })
    .select()
    .single();

  if (pedidoError) {
    throw pedidoError;
  }

  const detalles = productosReponer.map((producto) => {
    const cantidadPedir = producto.minimo * 2 - producto.stock;

    return {
      pedido_id: pedido.id,
      producto_id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      proveedor: producto.proveedor,
      pedido: cantidadPedir,
      recibido: 0,
      faltan: cantidadPedir,
    };
  });

  const { error: detalleError } = await supabase
    .from("detalle_pedidos")
    .insert(detalles);

  if (detalleError) {
    throw detalleError;
  }

  return pedido;
}

export async function recibirProductoDePedido({
  pedidoId,
  detalleId,
  productoId,
  stockActual,
  cantidadRecibida,
  faltanActual,
}) {
  let cantidadAceptada = cantidadRecibida;

  if (cantidadRecibida > faltanActual) {
    cantidadAceptada = faltanActual;
  }

  const nuevoFaltan = faltanActual - cantidadAceptada;

  const { error: detalleError } = await supabase
    .from("detalle_pedidos")
    .update({
      recibido: cantidadAceptada,
      faltan: nuevoFaltan,
    })
    .eq("id", detalleId);

  if (detalleError) {
    throw detalleError;
  }

  const { error: stockError } = await supabase
    .from("productos")
    .update({
      stock: stockActual + cantidadAceptada,
    })
    .eq("id", productoId);

  if (stockError) {
    throw stockError;
  }

  const { data: detallesPedido, error: detallesError } = await supabase
    .from("detalle_pedidos")
    .select("*")
    .eq("pedido_id", pedidoId);

  if (detallesError) {
    throw detallesError;
  }

  const todosCompletos = detallesPedido.every((item) => item.faltan === 0);
  const algunoRecibido = detallesPedido.some((item) => item.recibido > 0);

  const estado = todosCompletos
    ? "Recibido completo"
    : algunoRecibido
    ? "Recibido parcial"
    : "Pendiente";

  const { error: pedidoError } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", pedidoId);

  if (pedidoError) {
    throw pedidoError;
  }

  return cantidadAceptada;
}