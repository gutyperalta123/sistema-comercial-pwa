export async function buscarDatosProductoPorCodigo(codigo) {
  const codigoLimpio = String(codigo || "").trim();
  if (!codigoLimpio) return null;

  const resultados = [
    await buscarEnOpenFoodFacts(codigoLimpio),
    await buscarEnUpcItemDb(codigoLimpio),
    await buscarEnBarcodeMonster(codigoLimpio),
  ].filter(Boolean);

  if (resultados.length === 0) return null;

  return unirResultados(codigoLimpio, resultados);
}

async function buscarEnOpenFoodFacts(codigo) {
  const urls = [
    `https://world.openfoodfacts.org/api/v2/product/${codigo}.json`,
    `https://es.openfoodfacts.org/api/v2/product/${codigo}.json`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (data?.status !== 1 || !data.product) continue;

      const p = data.product;

      return limpiarProducto({
        codigo,
        nombre:
          p.product_name_es ||
          p.product_name ||
          p.generic_name_es ||
          p.generic_name ||
          "",
        marca: p.brands || p.brand_owner || "",
        categoria:
          p.categories ||
          p.categories_tags?.[0]?.replace("en:", "").replace(/-/g, " ") ||
          "",
        descripcion: p.quantity || p.packaging || p.labels || "",
      });
    } catch {
      continue;
    }
  }

  return null;
}

async function buscarEnUpcItemDb(codigo) {
  try {
    const res = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${codigo}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const item = data?.items?.[0];

    if (!item) return null;

    return limpiarProducto({
      codigo,
      nombre: item.title || "",
      marca: item.brand || "",
      categoria: item.category || "",
      descripcion: item.description || item.size || "",
    });
  } catch {
    return null;
  }
}

async function buscarEnBarcodeMonster(codigo) {
  try {
    const res = await fetch(`https://barcode.monster/api/${codigo}`);

    if (!res.ok) return null;

    const data = await res.json();

    return limpiarProducto({
      codigo,
      nombre: data.description || data.title || "",
      marca: data.company || data.brand || "",
      categoria: data.category || "",
      descripcion: data.size || data.quantity || "",
    });
  } catch {
    return null;
  }
}

function unirResultados(codigo, resultados) {
  const producto = {
    codigo,
    nombre: "",
    marca: "",
    categoria: "",
    descripcion: "",
  };

  for (const r of resultados) {
    producto.nombre = producto.nombre || r.nombre;
    producto.marca = producto.marca || r.marca;
    producto.categoria = producto.categoria || r.categoria;
    producto.descripcion = producto.descripcion || r.descripcion;
  }

  if (!producto.nombre && !producto.marca && !producto.categoria) {
    return null;
  }

  let nombreFinal = producto.nombre;

  if (producto.descripcion && !nombreFinal.includes(producto.descripcion)) {
    nombreFinal = `${nombreFinal} ${producto.descripcion}`.trim();
  }

  return {
    codigo,
    nombre: limpiarTexto(nombreFinal),
    marca: limpiarTexto(producto.marca),
    categoria: limpiarTexto(producto.categoria),
  };
}

function limpiarProducto(producto) {
  return {
    codigo: producto.codigo,
    nombre: limpiarTexto(producto.nombre),
    marca: limpiarTexto(producto.marca),
    categoria: limpiarTexto(producto.categoria),
    descripcion: limpiarTexto(producto.descripcion),
  };
}

function limpiarTexto(texto) {
  return String(texto || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}