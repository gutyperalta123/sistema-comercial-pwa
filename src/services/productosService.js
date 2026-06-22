import { supabase } from "./supabaseClient";

const NEGOCIO_ID = "9c6430fd-c816-4870-b92e-7432b51cf400";

function normalizarPrecio(valor) {
  if (valor === null || valor === undefined || valor === "") return 0;

  const texto = String(valor).replace(/\./g, "").replace(",", ".");
  return Number(texto || 0);
}

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (error) throw error;

  return data.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca || "",
    categoria: p.categoria || "",
    precioCompra: Number(p.precio_compra || 0),
    precioVenta: Number(p.precio_venta || 0),
    stock: Number(p.stock || 0),
    minimo: Number(p.minimo || 0),
    proveedor: p.proveedor || "",
    vencimiento: p.vencimiento || "",
    activo: p.activo,
  }));
}

export async function obtenerTodosLosProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("negocio_id", NEGOCIO_ID)
    .order("creado_en", { ascending: false });

  if (error) throw error;

  return data.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca || "",
    categoria: p.categoria || "",
    precioCompra: Number(p.precio_compra || 0),
    precioVenta: Number(p.precio_venta || 0),
    stock: Number(p.stock || 0),
    minimo: Number(p.minimo || 0),
    proveedor: p.proveedor || "",
    vencimiento: p.vencimiento || "",
    activo: p.activo,
  }));
}

export async function crearProducto(nuevoProducto) {
  const codigoLimpio = String(nuevoProducto.codigo || "").trim();

  const productoData = {
    negocio_id: NEGOCIO_ID,
    codigo: codigoLimpio,
    nombre: nuevoProducto.nombre,
    marca: nuevoProducto.marca,
    categoria: nuevoProducto.categoria,
    precio_compra: normalizarPrecio(nuevoProducto.precioCompra),
    precio_venta: normalizarPrecio(nuevoProducto.precioVenta),
    stock: Number(nuevoProducto.stock || 0),
    minimo: Number(nuevoProducto.minimo || 0),
    proveedor: nuevoProducto.proveedor,
    vencimiento: nuevoProducto.vencimiento || null,
    activo: true,
  };

  const { data: existente, error: buscarError } = await supabase
    .from("productos")
    .select("id")
    .eq("negocio_id", NEGOCIO_ID)
    .eq("codigo", codigoLimpio)
    .maybeSingle();

  if (buscarError) throw buscarError;

  if (existente) {
    const { error } = await supabase
      .from("productos")
      .update(productoData)
      .eq("id", existente.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("productos").insert(productoData);

  if (error) throw error;
}

export async function actualizarProducto(producto) {
  const { error } = await supabase
    .from("productos")
    .update({
      codigo: String(producto.codigo || "").trim(),
      nombre: producto.nombre,
      marca: producto.marca,
      categoria: producto.categoria,
      precio_compra: normalizarPrecio(producto.precioCompra),
      precio_venta: normalizarPrecio(producto.precioVenta),
      stock: Number(producto.stock || 0),
      minimo: Number(producto.minimo || 0),
      proveedor: producto.proveedor,
      vencimiento: producto.vencimiento || null,
      activo: true,
    })
    .eq("id", producto.id);

  if (error) throw error;
}

export async function desactivarProducto(productoId) {
  const { error } = await supabase
    .from("productos")
    .update({ activo: false })
    .eq("id", productoId);

  if (error) throw error;
}

export async function activarProducto(productoId) {
  const { error } = await supabase
    .from("productos")
    .update({ activo: true })
    .eq("id", productoId);

  if (error) throw error;
}

export async function sumarStockProducto(productoId, nuevoStock) {
  const { error } = await supabase
    .from("productos")
    .update({ stock: nuevoStock })
    .eq("id", productoId);

  if (error) throw error;
}