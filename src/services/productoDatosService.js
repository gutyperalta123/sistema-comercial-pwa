export async function buscarDatosProductoPorCodigo(codigo) {
  const codigoLimpio = String(codigo || "").trim();

  if (!codigoLimpio) {
    return null;
  }

  try {
    const respuesta = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${codigoLimpio}.json`
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

    const marca =
      producto.brands ||
      producto.brand_owner ||
      "";

    const categoria =
      producto.categories_tags?.[0]
        ?.replace("en:", "")
        ?.replace(/-/g, " ") ||
      producto.categories ||
      "";

    if (!nombre && !marca && !categoria) {
      return null;
    }

    return {
      codigo: codigoLimpio,
      nombre: limpiarTextoProducto(nombre),
      marca: limpiarTextoProducto(marca),
      categoria: limpiarTextoProducto(categoria),
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