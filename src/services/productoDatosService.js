import { supabase } from "./supabaseClient";

export async function buscarDatosProductoPorCodigo(codigo) {
  const codigoLimpio = String(codigo || "").trim();

  if (!codigoLimpio) {
    return null;
  }

  const productoGlobal = await buscarEnCatalogoGlobal(codigoLimpio);

  if (productoGlobal) {
    return productoGlobal;
  }

  const productoInternet = await buscarEnOpenFoodFacts(codigoLimpio);

  if (productoInternet) {
    return productoInternet;
  }

  return null;
}

async function buscarEnCatalogoGlobal(codigo) {
  const { data, error } = await supabase
    .from("catalogo_global_productos")
    .select("codigo, nombre, marca, categoria, presentacion")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) {
    console.error("Error buscando en catálogo global:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    codigo: limpiarTextoProducto(data.codigo),
    nombre: limpiarTextoProducto(data.nombre),
    marca: limpiarTextoProducto(data.marca),
    categoria: limpiarTextoProducto(data.categoria),
    presentacion: limpiarTextoProducto(data.presentacion),
    origen: "catalogo_global",
  };
}

async function buscarEnOpenFoodFacts(codigo) {
  try {
    const respuesta = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${codigo}.json`
    );

    if (!respuesta.ok) {
      return null;
    }

    const data = await respuesta.json();

    if (!data || data.status !== 1 || !data.product) {
      return null;
    }

    const producto = data.product;

    const nombre =
      producto.product_name_es ||
      producto.product_name ||
      producto.generic_name_es ||
      producto.generic_name ||
      "";

    const marca = producto.brands || producto.brand_owner || "";

    const categoria =
      producto.categories_tags?.[0]
        ?.replace("en:", "")
        ?.replace(/-/g, " ") ||
      producto.categories ||
      "";

    const presentacion =
      producto.quantity ||
      producto.product_quantity_unit ||
      producto.serving_size ||
      "";

    if (!nombre && !marca && !categoria) {
      return null;
    }

    return {
      codigo,
      nombre: limpiarTextoProducto(nombre),
      marca: limpiarTextoProducto(marca),
      categoria: limpiarTextoProducto(categoria),
      presentacion: limpiarTextoProducto(presentacion),
      origen: "open_food_facts",
    };
  } catch (error) {
    console.error("Error buscando datos del producto:", error);
    return null;
  }
}

function limpiarTextoProducto(texto) {
  return String(texto || "")
    .replace(/\s+/g, " ")
    .trim();
}


export async function guardarProductoEnCatalogoGlobal(producto) {
  const codigo = String(producto.codigo || "").trim();
  const nombre = String(producto.nombre || "").trim();

  if (!codigo || !nombre) return;

  const { error } = await supabase
    .from("catalogo_global_productos")
    .upsert(
      {
        codigo,
        nombre,
        marca: String(producto.marca || "").trim(),
        categoria: String(producto.categoria || "").trim(),
        presentacion: String(producto.presentacion || "").trim(),
      },
      {
        onConflict: "codigo",
      }
    );

  if (error) throw error;
}