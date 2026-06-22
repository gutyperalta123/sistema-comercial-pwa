import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

export async function obtenerPromociones() {
  const { data: promociones, error: promocionesError } = await supabase
    .from("promociones")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("creado_en", { ascending: false });

  if (promocionesError) throw promocionesError;

  if (!promociones || promociones.length === 0) {
    return [];
  }

  const ids = promociones.map((promo) => promo.id);

  const { data: productos, error: productosError } = await supabase
    .from("promociones_productos")
    .select("*")
    .in("promocion_id", ids);

  if (productosError) throw productosError;

  return promociones.map((promo) => ({
    id: promo.id,
    nombre: promo.nombre,
    precioPromocional: Number(promo.precio_promocional || 0),
    activa: promo.activa,
    productos: (productos || [])
      .filter((item) => item.promocion_id === promo.id)
      .map((item) => ({
        id: item.producto_id,
        codigo: item.codigo,
        nombre: item.nombre,
        cantidad: Number(item.cantidad || 1),
      })),
  }));
}

export async function crearPromocion({ nombre, precioPromocional, productos }) {
  const { data: promoCreada, error: promoError } = await supabase
    .from("promociones")
    .insert({
      negocio_id: NEGOCIO_ID,
      nombre,
      precio_promocional: Number(precioPromocional || 0),
      activa: true,
    })
    .select()
    .single();

  if (promoError) throw promoError;

  const detalles = productos.map((producto) => ({
    promocion_id: promoCreada.id,
    producto_id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    cantidad: Number(producto.cantidad || 1),
  }));

  const { error: detalleError } = await supabase
    .from("promociones_productos")
    .insert(detalles);

  if (detalleError) throw detalleError;

  return promoCreada;
}

export async function cambiarEstadoPromocion(id, activa) {
  const { error } = await supabase
    .from("promociones")
    .update({ activa })
    .eq("id", id);

  if (error) throw error;
}

export async function eliminarPromocion(id) {
  const { error: detalleError } = await supabase
    .from("promociones_productos")
    .delete()
    .eq("promocion_id", id);

  if (detalleError) throw detalleError;

  const { error: promoError } = await supabase
    .from("promociones")
    .delete()
    .eq("id", id);

  if (promoError) throw promoError;
}