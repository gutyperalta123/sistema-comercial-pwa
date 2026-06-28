import { useState } from "react";
import {
  crearProducto,
  obtenerTodosLosProductos,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
  sumarStockProducto,
} from "../services/productosService";
import { guardarProductoEnCatalogoGlobal } from "../services/productoDatosService";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoCargaRapida, setProductoCargaRapida] = useState(null);
  const [codigoCargaRapida, setCodigoCargaRapida] = useState("");
  const [cantidadCargaRapida, setCantidadCargaRapida] = useState("1");
  const [vencimientoCargaRapida, setVencimientoCargaRapida] = useState("");

  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: "",
    nombre: "",
    marca: "",
    categoria: "",
    presentacion: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    minimo: "",
    proveedor: "",
    vencimiento: "",
  });

  const cargarProductos = async () => {
    const productosBase = await obtenerTodosLosProductos();
    setProductos(productosBase);
  };

  const limpiarFormularioProducto = () => {
    setProductoEditando(null);

    setNuevoProducto({
      codigo: "",
      nombre: "",
      marca: "",
      categoria: "",
      presentacion: "",
      precioCompra: "",
      precioVenta: "",
      stock: "",
      minimo: "",
      proveedor: "",
      vencimiento: "",
    });
  };

  const prepararEdicionProducto = (producto) => {
    setProductoEditando(producto);

    setNuevoProducto({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      marca: producto.marca,
      categoria: producto.categoria,
      presentacion: producto.presentacion || "",
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
      minimo: producto.minimo,
      proveedor: producto.proveedor,
      vencimiento: producto.vencimiento,
    });
  };

  const guardarProductoBase = async ({ nuevoProducto, productoEditando }) => {
    if (productoEditando) {
      await actualizarProducto(nuevoProducto);
      alert("Producto actualizado correctamente");
    } else {
      await crearProducto(nuevoProducto);
      await guardarProductoEnCatalogoGlobal(nuevoProducto);
      alert("Producto guardado correctamente");
    }

    limpiarFormularioProducto();
    await cargarProductos();
  };

  const cambiarEstadoProductoBase = async (producto) => {
    const activar = !producto.activo;

    const confirmar = confirm(
      activar
        ? `¿Querés volver a activar "${producto.nombre}"?`
        : `¿Querés desactivar "${producto.nombre}"? No se borra el historial.`
    );

    if (!confirmar) return;

    if (activar) {
      await activarProducto(producto.id);
      alert("Producto activado correctamente");
    } else {
      await desactivarProducto(producto.id);
      alert("Producto desactivado correctamente");
    }

    await cargarProductos();
  };

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
      String(producto.codigo).includes(busquedaProducto)
  );

  const productosActivos = productos.filter((producto) => producto.activo);

  const productosReponer = productosActivos.filter(
    (producto) => producto.stock <= producto.minimo
  );

  const sumarStock = async (productoId, nuevoStock) => {
    await sumarStockProducto(productoId, nuevoStock);
    await cargarProductos();
  };

  return {
    productos,
    setProductos,
    cargarProductos,

    busquedaProducto,
    setBusquedaProducto,

    productoEditando,
    setProductoEditando,

    productoCargaRapida,
    setProductoCargaRapida,

    codigoCargaRapida,
    setCodigoCargaRapida,

    cantidadCargaRapida,
    setCantidadCargaRapida,

    vencimientoCargaRapida,
    setVencimientoCargaRapida,

    nuevoProducto,
    setNuevoProducto,

    limpiarFormularioProducto,
    prepararEdicionProducto,
    guardarProductoBase,
    cambiarEstadoProductoBase,

    productosFiltrados,
    productosActivos,
    productosReponer,

    sumarStock,
  };
}