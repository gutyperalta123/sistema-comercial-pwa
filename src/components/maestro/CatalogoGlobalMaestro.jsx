import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  obtenerCatalogoGlobalMaestro,
  importarCatalogoGlobalMaestro,
} from "../../services/maestroService";

export default function CatalogoGlobalMaestro() {
  const inputArchivoRef = useRef(null);
  const [procesando, setProcesando] = useState(false);

  const columnas = ["codigo", "nombre", "marca", "categoria", "presentacion"];

  const normalizarTexto = (valor) => {
    return String(valor || "").trim();
  };

  const normalizarClave = (clave) => {
    return String(clave || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
  };

  const mapearProducto = (fila) => {
    const producto = {};

    Object.keys(fila || {}).forEach((claveOriginal) => {
      const clave = normalizarClave(claveOriginal);
      producto[clave] = fila[claveOriginal];
    });

    return {
      codigo:
        normalizarTexto(producto.codigo) ||
        normalizarTexto(producto.codigo_de_barras) ||
        normalizarTexto(producto.codigobarras) ||
        normalizarTexto(producto.ean) ||
        normalizarTexto(producto.gtin),
      nombre:
        normalizarTexto(producto.nombre) ||
        normalizarTexto(producto.producto) ||
        normalizarTexto(producto.descripcion) ||
        normalizarTexto(producto.descripcion_producto),
      marca: normalizarTexto(producto.marca),
      categoria:
        normalizarTexto(producto.categoria) ||
        normalizarTexto(producto.rubro) ||
        normalizarTexto(producto.tipo),
      presentacion:
        normalizarTexto(producto.presentacion) ||
        normalizarTexto(producto.peso) ||
        normalizarTexto(producto.contenido) ||
        normalizarTexto(producto.contenido_neto),
    };
  };

  const exportarCSV = async () => {
    try {
      setProcesando(true);

      const productos = await obtenerCatalogoGlobalMaestro();

      if (productos.length === 0) {
        alert("No hay productos en el catálogo global");
        return;
      }

      const filas = productos.map((producto) =>
        columnas
          .map((campo) => {
            const valor = producto[campo] ?? "";
            return `"${String(valor).replaceAll('"', '""')}"`;
          })
          .join(",")
      );

      const csv = [columnas.join(","), ...filas].join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = "catalogo_global_productos.csv";
      enlace.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error al exportar CSV: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const exportarExcel = async () => {
    try {
      setProcesando(true);

      const productos = await obtenerCatalogoGlobalMaestro();

      if (productos.length === 0) {
        alert("No hay productos en el catálogo global");
        return;
      }

      const datos = productos.map((p) => ({
        codigo: p.codigo || "",
        nombre: p.nombre || "",
        marca: p.marca || "",
        categoria: p.categoria || "",
        presentacion: p.presentacion || "",
      }));

      const hoja = XLSX.utils.json_to_sheet(datos);
      const libro = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(libro, hoja, "Catalogo Global");
      XLSX.writeFile(libro, "catalogo_global_productos.xlsx");
    } catch (error) {
      console.error(error);
      alert("Error al exportar Excel: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const leerCSV = (texto) => {
    const lineas = texto
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter(Boolean);

    if (lineas.length < 2) {
      throw new Error("El archivo CSV está vacío o no tiene productos");
    }

    const separarLinea = (linea) => {
      const valores = [];
      let actual = "";
      let dentroComillas = false;

      for (let i = 0; i < linea.length; i++) {
        const caracter = linea[i];
        const siguiente = linea[i + 1];

        if (caracter === '"' && siguiente === '"') {
          actual += '"';
          i++;
        } else if (caracter === '"') {
          dentroComillas = !dentroComillas;
        } else if (caracter === "," && !dentroComillas) {
          valores.push(actual.trim());
          actual = "";
        } else {
          actual += caracter;
        }
      }

      valores.push(actual.trim());
      return valores;
    };

    const encabezados = separarLinea(lineas[0]).map((h) => h.trim());

    return lineas.slice(1).map((linea) => {
      const valores = separarLinea(linea);
      const fila = {};

      encabezados.forEach((encabezado, index) => {
        fila[encabezado] = valores[index] || "";
      });

      return mapearProducto(fila);
    });
  };

  const leerExcel = async (archivo) => {
    const buffer = await archivo.arrayBuffer();
    const libro = XLSX.read(buffer, { type: "array" });
    const primeraHoja = libro.SheetNames[0];

    if (!primeraHoja) {
      throw new Error("El archivo Excel no tiene hojas");
    }

    const hoja = libro.Sheets[primeraHoja];

    const filas = XLSX.utils.sheet_to_json(hoja, {
      defval: "",
    });

    if (!filas || filas.length === 0) {
      throw new Error("El archivo Excel está vacío");
    }

    return filas.map(mapearProducto);
  };

  const importarArchivo = async (evento) => {
    const archivo = evento.target.files?.[0];

    if (!archivo) return;

    try {
      setProcesando(true);

      const nombre = archivo.name.toLowerCase();
      let productos = [];

      if (nombre.endsWith(".csv")) {
        const texto = await archivo.text();
        productos = leerCSV(texto);
      } else if (nombre.endsWith(".xlsx") || nombre.endsWith(".xls")) {
        productos = await leerExcel(archivo);
      } else {
        throw new Error("Formato no permitido. Usá CSV, XLSX o XLS.");
      }

      productos = productos.filter((p) => p.codigo && p.nombre);

      if (productos.length === 0) {
        throw new Error("No se encontraron productos válidos");
      }

      await importarCatalogoGlobalMaestro(productos);

      alert(`Catálogo importado correctamente. Productos procesados: ${productos.length}`);
    } catch (error) {
      console.error(error);
      alert("Error al importar archivo: " + error.message);
    } finally {
      setProcesando(false);
      evento.target.value = "";
    }
  };

  return (
    <section className="card shadow-sm mt-4">
      <div className="card-body">
        <h3 className="fw-bold mb-2">Catálogo Global</h3>

        <p className="text-muted mb-3">
          Productos base compartidos entre todos los negocios.
        </p>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-success"
            onClick={exportarCSV}
            disabled={procesando}
          >
            {procesando ? "Procesando..." : "Exportar CSV"}
          </button>

          <button
            className="btn btn-success"
            onClick={exportarExcel}
            disabled={procesando}
          >
            Exportar Excel
          </button>

          <button
            className="btn btn-primary"
            onClick={() => inputArchivoRef.current?.click()}
            disabled={procesando}
          >
            Importar archivo
          </button>

          <input
            ref={inputArchivoRef}
            type="file"
            accept=".csv,.xlsx,.xls,text/csv"
            className="d-none"
            onChange={importarArchivo}
          />
        </div>

        <small className="text-muted d-block mt-3">
          Podés importar archivos CSV, XLSX o XLS. Columnas recomendadas:
          codigo, nombre, marca, categoria, presentacion.
        </small>
      </div>
    </section>
  );
}