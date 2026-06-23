


export async function buscarDatosProductoPorCodigo(codigo) {
  const codigoLimpio = String(codigo || "").trim();

  if (!codigoLimpio) return null;

  const urls = [
    `https://world.openfoodfacts.org/api/v2/product/${codigoLimpio}.json`,
    `https://es.openfoodfacts.org/api/v2/product/${codigoLimpio}.json`,
  ];

  for (const url of urls) {
    try {
      const respuesta = await fetch(url);

      if (!respuesta.ok) continue;

      const data = await respuesta.json();

      if (!data || data.status !== 1 || !data.product) continue;

      const producto = data.product;

      const nombreBase =
        producto.product_name_es ||
        producto.product_name ||
        producto.generic_name_es ||
        producto.generic_name ||
        "";

      const cantidad =
        producto.quantity ||
        producto.product_quantity ||
        "";

      const marca =
        producto.brands ||
        producto.brand_owner ||
        "";

      const categoria =
        producto.categories_hierarchy?.[0]?.replace("en:", "").replace(/-/g, " ") ||
        producto.categories_tags?.[0]?.replace("en:", "").replace(/-/g, " ") ||
        producto.categories ||
        "";

      const caracteristicas = [
        producto.packaging,
        producto.labels,
        producto.stores,
      ]
        .filter(Boolean)
        .join(" · ");

      const nombreFinal = limpiarTextoProducto(
        `${nombreBase}${cantidad ? " " + cantidad : ""}`
      );

      if (!nombreFinal && !marca && !categoria) continue;

      return {
        codigo: codigoLimpio,
        nombre: nombreFinal,
        marca: limpiarTextoProducto(marca),
        categoria: limpiarTextoProducto(categoria || caracteristicas),
      };
    } catch (error) {
      console.error("Error buscando datos del producto:", error);
    }
  }

  return null;
}

function limpiarTextoProducto(texto) {
  return String(texto || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}