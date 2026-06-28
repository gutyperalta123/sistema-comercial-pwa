


import { useAuthSession } from "./hooks/useAuthSession";
import { usePromociones } from "./hooks/usePromociones";
import { useUsuarios } from "./hooks/useUsuarios";
import { useConfiguracion } from "./hooks/useConfiguracion";
import { useProductos } from "./hooks/useProductos";
import { useLogin } from "./hooks/useLogin";
import {
  buscarDatosProductoPorCodigo,
  guardarProductoEnCatalogoGlobal,
} from "./services/productoDatosService";
import { useEffect, useState } from "react";
import "./App.css";
import CierreCaja from "./pages/CierreCaja";
import RetirosInternos from "./pages/RetirosInternos";
import PagosMensuales from "./pages/PagosMensuales";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Caja from "./pages/Caja";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Vencimientos from "./pages/Vencimientos";
import Usuarios from "./pages/Usuarios";
import MiCuenta from "./pages/MiCuenta";
import Configuracion from "./pages/Configuracion";
import Ticket from "./pages/Ticket";
import AjustesStock from "./pages/AjustesStock";
import Promociones from "./pages/Promociones";
import PanelMaestro from "./pages/PanelMaestro";
import { loginSuperAdmin } from "./services/maestroService";
import {
  obtenerPromociones,
  crearPromocion as crearPromocionService,
  cambiarEstadoPromocion as cambiarEstadoPromocionService,
  eliminarPromocion as eliminarPromocionService,
} from "./services/promocionesService";
import {
  obtenerSolicitudesReaperturaCaja,
  crearSolicitudReaperturaCaja,
  marcarSolicitudAutorizada,
} from "./services/solicitudesCajaService";

import {
  obtenerCierresCaja,
  crearCierreCaja,
  reabrirCierreCaja,
} from "./services/cierresCajaService";

import {
  obtenerAperturasCaja,
  crearAperturaCaja,
  cerrarAperturaCaja,
} from "./services/aperturasCajaService";

import {
  obtenerRetirosInternos,
  crearRetiroInterno,
} from "./services/retirosService";

import {
  crearProducto,
  obtenerTodosLosProductos,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
  sumarStockProducto,
} from "./services/productosService";

import { guardarVenta } from "./services/ventasService";

import {
  obtenerPedidos,
  crearPedidoAutomatico,
  recibirProductoDePedido,
} from "./services/pedidosService";

import {
  obtenerUsuarios,
  loginUsuario,
  crearUsuario,
  cambiarPassword,
  cambiarEstadoUsuario,
} from "./services/usuariosService";

import {
  obtenerConfiguracionNegocio,
  guardarConfiguracionNegocio,
} from "./services/configuracionService";


// Servicios eliminados: se dejan como funciones vacías para que la app compile
// sin depender de movimientosService, historialService ni lotesService.
const obtenerHistorialVentas = async () => [];
const obtenerLotes = async () => [];
const obtenerMovimientosStock = async () => [];
const crearMovimientoStock = async () => null;
const crearLoteProducto = async () => null;
const descontarLotesPorVenta = async () => null;
const descontarLotesPorAjuste = async () => null;

export default function App() {
  const [logueado, setLogueado] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: "", password: "" });

  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [montoEfectivo, setMontoEfectivo] = useState("");
  const [montoTransferencia, setMontoTransferencia] = useState("");

  const [pantalla, setPantalla] = useState("dashboard");
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [ventaActual, setVentaActual] = useState([]);
  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [promocionesAplicadas, setPromocionesAplicadas] = useState([]);
  const [descuentoPromociones, setDescuentoPromociones] = useState(0);

  const [historialVentas, setHistorialVentas] = useState([]);
 
  
  const [pedidos, setPedidos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [movimientosStock, setMovimientosStock] = useState([]);
  const [retirosInternos, setRetirosInternos] = useState([]);
  const [cierresCaja, setCierresCaja] = useState([]);
  const [aperturasCaja, setAperturasCaja] = useState([]);
  const [solicitudesCaja, setSolicitudesCaja] = useState([]);
  
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);
  

  

  const [productosRevisados, setProductosRevisados] = useState([]);

  const [codigoRetiro, setCodigoRetiro] = useState("");
  const [retiroActual, setRetiroActual] = useState([]);
  const [tipoRetiro, setTipoRetiro] = useState("Administrador");
  const [estadoPagoRetiro, setEstadoPagoRetiro] = useState("Pagado");
  const [usuarioRetiroId, setUsuarioRetiroId] = useState("");

  const [ultimoCierreResultado, setUltimoCierreResultado] = useState(null);
  const [inicioCajaPorUsuario, setInicioCajaPorUsuario] = useState({});

  const [cierreCaja, setCierreCaja] = useState({
    billete20000: "",
    billete10000: "",
    billete2000: "",
    billete1000: "",
    billete500: "",
    billete200: "",
    billete100: "",
    billete50: "",
    monedas: "",
    transferenciasDeclaradas: "",
    observacion: "",
  });

  const [ajusteStock, setAjusteStock] = useState({
    productoId: "",
    tipo: "Sumar",
    cantidad: "",
    motivo: "",
  });

  
   

  

 

  const esAdmin = usuarioActual?.rol === "Administrador";

  const {
    productos,
    setProductos,
    cargarProductos,
    busquedaProducto,
    setBusquedaProducto,
    productoEditando,
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
  } = useProductos();


  const {
  promociones,
  setPromociones,
  cargarPromociones,
  crearPromocion,
  cambiarEstadoPromocion,
  eliminarPromocion,
  } = usePromociones();


  const {
    configuracion,
    setConfiguracion,
    cargarConfiguracion,
    guardarConfiguracion,
  } = useConfiguracion();


  const {
    usuarios,
    setUsuarios,
    cargarUsuarios,
    nuevoUsuario,
    setNuevoUsuario,
    passwordData,
    setPasswordData,
    guardarUsuario,
    cambiarMiPassword,
    cambiarEstadoEmpleado,
  } = useUsuarios();

  const cambiarMiPasswordUsuarioActual = (e) => {
    return cambiarMiPassword(usuarioActual, e);
  };


  const { iniciarSesionSistema, entrarComoNegocioDesdePanel } = useLogin({
  setUsuarioActual,
  setEsSuperAdmin,
  setLogueado,
  setPantalla,
  asegurarAperturaCajaUsuario,
  setUltimoCierreResultado,
  });

  const { cerrarSesionSistema } = useAuthSession({
    usuarioActual,
    setUsuarioActual,
    setLogueado,
    setEsSuperAdmin,
  });

  useEffect(() => {
    if (logueado && !esSuperAdmin) {
      cargarProductos();
      cargarHistorialVentas();
      cargarPedidos();
      cargarUsuarios();
      cargarConfiguracion();
      cargarLotes();
      cargarMovimientosStock();
      cargarRetirosInternos();
      cargarCierresCaja();
      cargarAperturasCaja();
      cargarSolicitudesCaja();
      cargarPromociones();
    }
  }, [logueado, esSuperAdmin]);

  useEffect(() => {
    if (!logueado || esSuperAdmin) return;

    const pantallasSoloAdmin = [
      "dashboard",
      "caja",
      "productos",
      "ajustes-stock",
      "pedidos",
      "vencimientos",
      "usuarios",
      "pagos-mensuales",
      "configuracion",
      "promociones",
    ];

    if (!esAdmin && pantallasSoloAdmin.includes(pantalla)) {
      setPantalla("venta");
    }
  }, [pantalla, esAdmin, logueado, esSuperAdmin]);

  
  
  
  
  
  
  

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      await iniciarSesionSistema(loginData);
    } catch (error) {
    console.error(error);
    alert(error.message || "Usuario o contraseña incorrectos");
    }
  };

  const cerrarSesion = () => {
    cerrarSesionSistema();
    setLoginData({ usuario: "", password: "" });
    setPantalla("dashboard");
    setVentaActual([]);
    setRetiroActual([]);
    setMetodoPago("Efectivo");
    setMontoEfectivo("");
    setMontoTransferencia("");
    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);
    setUltimoCierreResultado(null);
  };

  

  const cargarHistorialVentas = async () => {
    try {
      const ventasBase = await obtenerHistorialVentas();
      setHistorialVentas(ventasBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar historial de ventas");
    }
  };

  const cargarPedidos = async () => {
    try {
      const pedidosBase = await obtenerPedidos();
      setPedidos(pedidosBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar pedidos");
    }
  };

  
  
  const cargarLotes = async () => {
    try {
      const lotesBase = await obtenerLotes();
      setLotes(lotesBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar lotes");
    }
  };

  const cargarMovimientosStock = async () => {
    try {
      const movimientosBase = await obtenerMovimientosStock();
      setMovimientosStock(movimientosBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar movimientos de stock");
    }
  };

  const cargarRetirosInternos = async () => {
    try {
      const retirosBase = await obtenerRetirosInternos();
      setRetirosInternos(retirosBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar retiros internos");
    }
  };

  const cargarCierresCaja = async () => {
    try {
      const cierresBase = await obtenerCierresCaja();
      setCierresCaja(cierresBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar cierres de caja");
    }
  };

  const cargarAperturasCaja = async () => {
    try {
      const aperturasBase = await obtenerAperturasCaja();
      setAperturasCaja(aperturasBase);
      return aperturasBase;
    } catch (error) {
      console.error(error);
      alert("Error al cargar aperturas de caja");
      return [];
    }
  };
  const asegurarAperturaCajaUsuario = async (usuario) => {
    try {
      const aperturasBase = await obtenerAperturasCaja();
      setAperturasCaja(aperturasBase);

      const aperturasUsuario = aperturasBase.filter(
        (apertura) => apertura.usuarioId === usuario.id
      );

      const aperturaAbierta = aperturasUsuario.find(
        (apertura) => apertura.estado === "Abierta"
      );

      const ahora = new Date();
      const horasLimiteTurno = 5;

      if (aperturaAbierta) {
        const fechaApertura = new Date(aperturaAbierta.fechaAperturaRaw);
        const horasAbierta = (ahora - fechaApertura) / (1000 * 60 * 60);

        if (horasAbierta < horasLimiteTurno) {
          setInicioCajaPorUsuario((prev) => ({
            ...prev,
            [usuario.id]: aperturaAbierta.fechaAperturaRaw,
          }));

          return aperturaAbierta;
        }

        await cerrarAperturaCaja(aperturaAbierta.id);
      }

      const ultimaApertura = aperturasUsuario[0];
      const necesitaNuevaApertura =
        !ultimaApertura ||
        ultimaApertura.estado === "Cerrada" ||
        (ahora - new Date(ultimaApertura.fechaAperturaRaw)) / (1000 * 60 * 60) >=
          horasLimiteTurno;

      if (necesitaNuevaApertura) {
        await crearAperturaCaja({
          usuarioId: usuario.id,
          usuarioNombre: usuario.nombre,
          fondoInicial: 0,
          observacion: "Apertura automática por nuevo turno",
        });
      }

      const aperturasActualizadas = await obtenerAperturasCaja();
      setAperturasCaja(aperturasActualizadas);

      const nuevaApertura = aperturasActualizadas.find(
        (apertura) =>
          apertura.usuarioId === usuario.id && apertura.estado === "Abierta"
      );

      setInicioCajaPorUsuario((prev) => ({
        ...prev,
        [usuario.id]: nuevaApertura?.fechaAperturaRaw || ahora.toISOString(),
      }));

      return nuevaApertura || null;
    } catch (error) {
      console.error(error);
      alert("Error al abrir caja automáticamente: " + error.message);
      return null;
    }
  };

  const cargarSolicitudesCaja = async () => {
    try {
      const solicitudesBase = await obtenerSolicitudesReaperturaCaja();
      setSolicitudesCaja(solicitudesBase);
    } catch (error) {
      console.error(error);
      alert("Error al cargar solicitudes de reapertura");
    }
  };

  

  

  const editarProducto = (producto) => {
    prepararEdicionProducto(producto);
    setPantalla("productos");
  };

  const cambiarEstadoProducto = async (producto) => {
    try {
    await cambiarEstadoProductoBase(producto);
    await cargarLotes();
    } catch (error) {
    console.error(error);
    alert("Error al cambiar estado del producto: " + error.message);
    }
  };

  const cargarStockConLector = async (e) => {
  e.preventDefault();

  const codigoEscaneado = codigoCargaRapida.trim();
  const cantidad = Number(cantidadCargaRapida || 1);

  if (!codigoEscaneado) {
    alert("Escaneá un código de barras");
    return;
  }

  if (!cantidad || cantidad <= 0) {
    alert("Ingresá una cantidad válida");
    return;
  }

  const productoEncontrado = productos.find(
    (producto) =>
      producto.activo && String(producto.codigo).trim() === codigoEscaneado
  );

  if (!productoEncontrado) {
    try {
      const datosProducto = await buscarDatosProductoPorCodigo(codigoEscaneado);

      setNuevoProducto({
        codigo: codigoEscaneado,
        nombre: datosProducto?.nombre || "",
        marca: datosProducto?.marca || "",
        categoria: datosProducto?.categoria || "",
        precioCompra: "",
        precioVenta: "",
        stock: cantidadCargaRapida || "",
        minimo: "",
        proveedor: "",
        vencimiento: vencimientoCargaRapida || "",
      });

      setCodigoCargaRapida("");
      setPantalla("productos");

      if (datosProducto) {
        alert(
          "Producto no estaba cargado. Encontré datos automáticos y los pasé al formulario de Alta de producto. Completá precio, proveedor y guardalo."
        );
      } else {
        alert(
          "Producto no estaba cargado. No encontré datos automáticos. Lo pasé al formulario de Alta de producto para completarlo manualmente."
        );
      }

      return;
    } catch (error) {
      console.error(error);

      setNuevoProducto({
        codigo: codigoEscaneado,
        nombre: "",
        marca: "",
        categoria: "",
        precioCompra: "",
        precioVenta: "",
        stock: cantidadCargaRapida || "",
        minimo: "",
        proveedor: "",
        vencimiento: vencimientoCargaRapida || "",
      });

      setCodigoCargaRapida("");
      setPantalla("productos");

      alert(
        "Producto no estaba cargado. No se pudieron buscar datos automáticos. Lo pasé al formulario de Alta de producto."
      );

      return;
    }
  }

  try {
    const nuevoStock = Number(productoEncontrado.stock || 0) + cantidad;

    await sumarStockProducto(productoEncontrado.id, nuevoStock);

    await crearMovimientoStock({
      productoId: productoEncontrado.id,
      codigo: productoEncontrado.codigo,
      producto: productoEncontrado.nombre,
      tipo: "Ingreso",
      cantidad,
      motivo: "Ingreso por lector",
      usuario: usuarioActual.nombre,
    });

    if (vencimientoCargaRapida) {
      await crearLoteProducto({
        productoId: productoEncontrado.id,
        cantidad,
        vencimiento: vencimientoCargaRapida,
      });

      await cargarLotes();
    }

    setProductoCargaRapida({
      ...productoEncontrado,
      stock: nuevoStock,
    });

    setCodigoCargaRapida("");

    await cargarProductos();
    await cargarMovimientosStock();

    alert(`Se agregaron ${cantidad} unidades de ${productoEncontrado.nombre}`);
  } catch (error) {
    console.error(error);
    alert("Error al sumar stock: " + error.message);
  }
};

  

  const calcularDiasVencimiento = (fecha) => {
    if (!fecha) return null;

    const hoy = new Date();
    const vencimiento = new Date(fecha + "T00:00:00");
    hoy.setHours(0, 0, 0, 0);

    const diferencia = vencimiento - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const productosVencimiento = productosActivos
    .map((producto) => {
      const dias = calcularDiasVencimiento(producto.vencimiento);

      let estado = "Sin fecha";
      let accion = "Sin acción";

      if (dias === null) {
        estado = "Sin fecha";
        accion = "Cargar vencimiento";
      } else if (dias < 0) {
        estado = "Vencido";
        accion = "Retirar / devolver";
      } else if (dias <= 7) {
        estado = "Crítico";
        accion = "Poner adelante";
      } else if (dias <= 30) {
        estado = "Próximo";
        accion = "Ofertar / controlar";
      } else {
        estado = "Correcto";
        accion = "Sin acción urgente";
      }

      return { ...producto, dias, estado, accion };
    })
    .filter((producto) => producto.dias !== null && producto.dias <= 30)
    .sort((a, b) => a.dias - b.dias);

  const subtotalVenta = ventaActual.reduce(
    (total, item) => total + Number(item.precioVenta || 0) * Number(item.cantidad || 0),
    0
  );

  const totalVenta = Math.max(subtotalVenta - descuentoPromociones, 0);

  const gananciaVenta = ventaActual.reduce(
    (total, item) =>
      total + (item.precioVenta - item.precioCompra) * item.cantidad,
    0
  );

  const totalVendidoHoy = historialVentas.reduce(
    (total, venta) => total + venta.total,
    0
  );

  const gananciaHoy = historialVentas.reduce(
    (total, venta) => total + venta.ganancia,
    0
  );

  const ventasPorVendedor = usuarios.map((usuario) => {
    const ventas = historialVentas.filter(
      (venta) => venta.vendedor === usuario.nombre
    );

    return {
      nombre: usuario.nombre,
      rol: usuario.rol,
      cantidadVentas: ventas.length,
      totalVendido: ventas.reduce((total, venta) => total + venta.total, 0),
      ganancia: ventas.reduce((total, venta) => total + venta.ganancia, 0),
    };
  });

  const productosMasVendidos = productosActivos
    .map((producto) => {
      let cantidadVendida = 0;

      historialVentas.forEach((venta) => {
        venta.productos.forEach((item) => {
          if (item.codigo === producto.codigo) {
            cantidadVendida += item.cantidad;
          }
        });
      });

      return { nombre: producto.nombre, cantidadVendida };
    })
    .sort((a, b) => b.cantidadVendida - a.cantidadVendida);

  const cambiarUsuario = async (usuario) => {
    const usuarioSistema = {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      rol: usuario.rol,
      activo: usuario.activo,
      negocio: "Kiosco San Martín",
    };

    setUsuarioActual(usuarioSistema);
    await asegurarAperturaCajaUsuario(usuarioSistema);
    setUltimoCierreResultado(null);
    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);
    setCierreCaja({
      billete20000: "",
      billete10000: "",
      billete2000: "",
      billete1000: "",
      billete500: "",
      billete200: "",
      billete100: "",
      billete50: "",
      monedas: "",
      transferenciasDeclaradas: "",
      observacion: "",
    });

    setPantalla(usuario.rol === "Administrador" ? "dashboard" : "venta");
  };

  

  

  

  const agregarProductoAVenta = (producto) => {
    if (!producto.activo) {
      alert("Este producto está desactivado");
      return;
    }

    if (producto.stock <= 0) {
      alert("Este producto no tiene stock disponible");
      return;
    }

    const itemExistente = ventaActual.find(
      (item) => item.codigo === producto.codigo
    );

    if (itemExistente && itemExistente.cantidad >= producto.stock) {
      alert("No hay más stock disponible para este producto");
      return;
    }

    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);

    if (itemExistente) {
      setVentaActual(
        ventaActual.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setVentaActual([...ventaActual, { ...producto, cantidad: 1 }]);
    }
  };

  const buscarProducto = (e) => {
    e.preventDefault();

    const codigoEscaneado = codigo.trim();

    const producto = productosActivos.find(
      (p) => String(p.codigo).trim() === codigoEscaneado
    );

    if (!producto) {
      alert("Producto no encontrado");
      setCodigo("");
      return;
    }

    agregarProductoAVenta(producto);
    setCodigo("");
  };

  const aumentarCantidad = (codigoProducto) => {
    const producto = productosActivos.find((p) => p.codigo === codigoProducto);
    const item = ventaActual.find((p) => p.codigo === codigoProducto);

    if (!producto || !item) return;

    if (item.cantidad >= producto.stock) {
      alert("No hay más stock disponible");
      return;
    }

    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);

    setVentaActual(
      ventaActual.map((item) =>
        item.codigo === codigoProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (codigoProducto) => {
    const item = ventaActual.find((p) => p.codigo === codigoProducto);

    if (!item) return;

    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);

    if (item.cantidad === 1) {
      setVentaActual(
        ventaActual.filter((item) => item.codigo !== codigoProducto)
      );
      return;
    }

    setVentaActual(
      ventaActual.map((item) =>
        item.codigo === codigoProducto
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const quitarProducto = (codigoProducto) => {
    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);
    setVentaActual(ventaActual.filter((item) => item.codigo !== codigoProducto));
  };

  const aplicarPromociones = () => {
    if (ventaActual.length === 0) {
      alert("No hay productos en la venta");
      return;
    }

    const promosActivas = promociones.filter((promo) => promo.activa);

    let descuentoTotal = 0;
    const aplicadas = [];

    promosActivas.forEach((promo) => {
      const cumplePromo = promo.productos.every((productoPromo) => {
        const itemVenta = ventaActual.find(
          (item) => String(item.codigo) === String(productoPromo.codigo)
        );

        return (
          itemVenta &&
          Number(itemVenta.cantidad || 0) >= Number(productoPromo.cantidad || 1)
        );
      });

      if (!cumplePromo) return;

      const precioNormalPromo = promo.productos.reduce((total, productoPromo) => {
        const itemVenta = ventaActual.find(
          (item) => String(item.codigo) === String(productoPromo.codigo)
        );

        return (
          total +
          Number(itemVenta?.precioVenta || 0) *
            Number(productoPromo.cantidad || 1)
        );
      }, 0);

      const descuento = precioNormalPromo - Number(promo.precioPromocional || 0);

      if (descuento > 0) {
        descuentoTotal += descuento;

        aplicadas.push({
          id: promo.id,
          nombre: promo.nombre,
          descuento,
        });
      }
    });

    if (aplicadas.length === 0) {
      alert("No hay promociones para esta venta");
    }

    setPromocionesAplicadas(aplicadas);
    setDescuentoPromociones(descuentoTotal);
  };

  const cobrarVenta = async () => {
    if (ventaActual.length === 0) {
      alert("No hay productos en la venta");
      return;
    }

    const efectivoFinal =
      metodoPago === "Efectivo"
        ? totalVenta
        : metodoPago === "Transferencia"
        ? 0
        : Number(montoEfectivo || 0);

    const transferenciaFinal =
      metodoPago === "Transferencia"
        ? totalVenta
        : metodoPago === "Efectivo"
        ? 0
        : Number(montoTransferencia || 0);

    if (efectivoFinal + transferenciaFinal !== totalVenta) {
      alert("La suma de efectivo y transferencia debe coincidir con el total.");
      return;
    }

    try {
      const ventaTicket = {
        fecha: new Date().toLocaleString("es-AR"),
        vendedor: usuarioActual.nombre,
        productos: ventaActual,
        subtotal: subtotalVenta,
        descuentoPromociones,
        promocionesAplicadas,
        total: totalVenta,
        ganancia: gananciaVenta,
      };

      await guardarVenta({
        vendedor: usuarioActual.nombre,
        productos: ventaActual,
        total: totalVenta,
        ganancia: gananciaVenta,
        metodoPago,
        montoEfectivo: efectivoFinal,
        montoTransferencia: transferenciaFinal,
      });

      await descontarLotesPorVenta(ventaActual);

      for (const item of ventaActual) {
        await crearMovimientoStock({
          productoId: item.id,
          codigo: item.codigo,
          producto: item.nombre,
          tipo: "Venta",
          cantidad: item.cantidad,
          motivo: "Venta cobrada",
          usuario: usuarioActual.nombre,
        });
      }

      setUltimaVenta(ventaTicket);
      setVentaActual([]);
      setPromocionesAplicadas([]);
      setDescuentoPromociones(0);
      setMetodoPago("Efectivo");
      setMontoEfectivo("");
      setMontoTransferencia("");

      await cargarProductos();
      await cargarHistorialVentas();
      await cargarLotes();
      await cargarMovimientosStock();

      setPantalla("venta");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la venta: " + error.message);
    }
  };

  const vaciarVenta = () => {
    setVentaActual([]);
    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);
    setMetodoPago("Efectivo");
    setMontoEfectivo("");
    setMontoTransferencia("");
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!esAdmin) {
      alert("Solo el administrador puede cargar productos");
      return;
     }

    if (!nuevoProducto.codigo || !nuevoProducto.nombre || !nuevoProducto.precioVenta) {
    alert("Completá código, nombre y precio de venta");
    return;
    }

    try {
    await guardarProductoBase({
      nuevoProducto,
      productoEditando,
    });
     } catch (error) {
    console.error(error);
    alert("Error al guardar producto: " + error.message);
    }
  };

  const limparDespuesProducto = async () => {
    limpiarFormularioProducto();
    await cargarProductos();
  };

  const guardarAjusteStock = async (e) => {
    e.preventDefault();

    const producto = productosActivos.find(
      (item) => item.id === ajusteStock.productoId
    );

    const cantidad = Number(ajusteStock.cantidad || 0);

    if (!producto) {
      alert("Seleccioná un producto");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      alert("Ingresá una cantidad válida");
      return;
    }

    const nuevoStock =
      ajusteStock.tipo === "Sumar"
        ? producto.stock + cantidad
        : producto.stock - cantidad;

    if (nuevoStock < 0) {
      alert("El stock no puede quedar en negativo");
      return;
    }

    try {
      await sumarStockProducto(producto.id, nuevoStock);

      if (ajusteStock.tipo === "Restar") {
        await descontarLotesPorAjuste(producto.id, cantidad);
      }

      await crearMovimientoStock({
        productoId: producto.id,
        codigo: producto.codigo,
        producto: producto.nombre,
        tipo: ajusteStock.tipo === "Sumar" ? "Ajuste +" : "Ajuste -",
        cantidad,
        motivo: ajusteStock.motivo || "Ajuste manual",
        usuario: usuarioActual.nombre,
      });

      setAjusteStock({
        productoId: "",
        tipo: "Sumar",
        cantidad: "",
        motivo: "",
      });

      await cargarProductos();
      await cargarLotes();
      await cargarMovimientosStock();

      alert("Ajuste guardado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al ajustar stock: " + error.message);
    }
  };

  const generarPedidoAutomatico = async () => {
    if (productosReponer.length === 0) {
      alert("No hay productos para reponer");
      return;
    }

    try {
      await crearPedidoAutomatico({
        creadoPor: usuarioActual.nombre,
        productosReponer,
      });

      await cargarPedidos();

      alert("Pedido automático guardado en Supabase");
      setPantalla("pedidos");
    } catch (error) {
      console.error(error);
      alert("Error al generar pedido: " + error.message);
    }
  };

  const recibirProductoPedido = async (pedidoId, codigoProducto) => {
    const cantidadTexto = prompt("¿Cuántas unidades recibiste?");
    const cantidad = Number(cantidadTexto);

    if (!cantidad || cantidad <= 0) {
      alert("Cantidad inválida");
      return;
    }

    try {
      const pedido = pedidos.find((p) => p.id === pedidoId);
      const detalle = pedido?.productos.find((p) => p.codigo === codigoProducto);
      const producto = productosActivos.find((p) => p.codigo === codigoProducto);

      if (!pedido || !detalle || !producto) {
        alert("No se encontró el producto del pedido");
        return;
      }

      const recibidas = await recibirProductoDePedido({
        pedidoId,
        detalleId: detalle.id,
        productoId: producto.id,
        stockActual: producto.stock,
        cantidadRecibida: cantidad,
        faltanActual: detalle.faltan,
      });

      await cargarProductos();
      await cargarPedidos();

      alert(`Se recibieron ${recibidas} unidades`);
    } catch (error) {
      console.error(error);
      alert("Error al recibir mercadería: " + error.message);
    }
  };

  const marcarRevisado = (codigoProducto) => {
    setProductosRevisados([...productosRevisados, codigoProducto]);
  };

  const agregarProductoARetiro = (producto) => {
    if (!producto.activo) {
      alert("Este producto está desactivado");
      return;
    }

    if (producto.stock <= 0) {
      alert("Este producto no tiene stock disponible");
      return;
    }

    const itemExistente = retiroActual.find(
      (item) => item.codigo === producto.codigo
    );

    if (itemExistente && itemExistente.cantidad >= producto.stock) {
      alert("No hay más stock disponible para este producto");
      return;
    }

    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);

    if (itemExistente) {
      setRetiroActual(
        retiroActual.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setRetiroActual([...retiroActual, { ...producto, cantidad: 1 }]);
    }
  };

  const buscarProductoRetiro = (e) => {
    e.preventDefault();

    const codigoEscaneado = codigoRetiro.trim();

    const producto = productosActivos.find(
      (p) => String(p.codigo).trim() === codigoEscaneado
    );

    if (!producto) {
      alert("Producto no encontrado");
      setCodigoRetiro("");
      return;
    }

    agregarProductoARetiro(producto);
    setCodigoRetiro("");
  };

  const aumentarCantidadRetiro = (codigoProducto) => {
    const producto = productosActivos.find((p) => p.codigo === codigoProducto);
    const item = retiroActual.find((p) => p.codigo === codigoProducto);

    if (!producto || !item) return;

    if (item.cantidad >= producto.stock) {
      alert("No hay más stock disponible");
      return;
    }

    setRetiroActual(
      retiroActual.map((item) =>
        item.codigo === codigoProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidadRetiro = (codigoProducto) => {
    const item = retiroActual.find((p) => p.codigo === codigoProducto);

    if (!item) return;

    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);

    if (item.cantidad === 1) {
      setRetiroActual(
        retiroActual.filter((item) => item.codigo !== codigoProducto)
      );
      return;
    }

    setRetiroActual(
      retiroActual.map((item) =>
        item.codigo === codigoProducto
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const quitarProductoRetiro = (codigoProducto) => {
    setRetiroActual(
      retiroActual.filter((item) => item.codigo !== codigoProducto)
    );
  };

  const totalRetiro = retiroActual.reduce(
    (total, item) => total + item.precioVenta * item.cantidad,
    0
  );

  const confirmarRetiroInterno = async () => {
    if (retiroActual.length === 0) {
      alert("No hay productos en el retiro");
      return;
    }

    const usuarioSeleccionado = usuarios.find(
      (usuario) => usuario.id === usuarioRetiroId
    );

    if (!usuarioSeleccionado) {
      alert("Seleccioná la persona del retiro");
      return;
    }

    try {
      await crearRetiroInterno({
        usuarioId: usuarioSeleccionado.id,
        nombreUsuario: usuarioSeleccionado.nombre,
        rolUsuario: usuarioSeleccionado.rol,
        tipoRetiro,
        estadoPago: estadoPagoRetiro,
        total: totalRetiro,
        productos: retiroActual,
        registradoPorId: usuarioActual.id,
        registradoPorNombre: usuarioActual.nombre,
      });

      for (const item of retiroActual) {
        const nuevoStock = item.stock - item.cantidad;

        await sumarStockProducto(item.id, nuevoStock);
        await descontarLotesPorVenta([item]);

        await crearMovimientoStock({
          productoId: item.id,
          codigo: item.codigo,
          producto: item.nombre,
          tipo: "Retiro interno",
          cantidad: item.cantidad,
          motivo: `${tipoRetiro} - ${estadoPagoRetiro}`,
          usuario: `${usuarioSeleccionado.nombre} / Registró: ${usuarioActual.nombre}`,
        });
      }

      setRetiroActual([]);
      setCodigoRetiro("");
      setUsuarioRetiroId("");

      await cargarProductos();
      await cargarLotes();
      await cargarMovimientosStock();
      await cargarRetirosInternos();

      alert("Retiro interno registrado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al registrar retiro interno: " + error.message);
    }
  };

  const calcularEfectivoDeclaradoDesde = (datosCaja) => {
    return (
      Number(datosCaja.billete20000 || 0) * 20000 +
      Number(datosCaja.billete10000 || 0) * 10000 +
      Number(datosCaja.billete2000 || 0) * 2000 +
      Number(datosCaja.billete1000 || 0) * 1000 +
      Number(datosCaja.billete500 || 0) * 500 +
      Number(datosCaja.billete200 || 0) * 200 +
      Number(datosCaja.billete100 || 0) * 100 +
      Number(datosCaja.billete50 || 0) * 50 +
      Number(datosCaja.monedas || 0)
    );
  };

  const guardarCierreCaja = async (e, datosCajaFormulario = null) => {
    if (e?.preventDefault) e.preventDefault();

    const datosCaja = datosCajaFormulario || cierreCaja;
    const efectivoDeclarado = calcularEfectivoDeclaradoDesde(datosCaja);
    const transferenciasDeclaradas = Number(
      datosCaja.transferenciasDeclaradas || 0
    );

    const aperturasActuales = await obtenerAperturasCaja();
    setAperturasCaja(aperturasActuales);

    const aperturaAbiertaUsuario = aperturasActuales.find(
      (apertura) =>
        apertura.usuarioId === usuarioActual.id && apertura.estado === "Abierta"
    );

    const fondoInicialCaja = Number(aperturaAbiertaUsuario?.fondoInicial || 0);

    const cierresUsuario = cierresCaja.filter(
      (cierre) => cierre.usuarioId === usuarioActual.id
    );

    const ultimoCierreUsuario = cierresUsuario[0];
    const inicioSesionCaja =
      aperturaAbiertaUsuario?.fechaAperturaRaw ||
      inicioCajaPorUsuario[usuarioActual.id] ||
      null;

    let fechaInicioCaja = inicioSesionCaja;

    if (ultimoCierreUsuario?.estado === "Cerrado") {
      if (
        !fechaInicioCaja ||
        new Date(ultimoCierreUsuario.fechaRaw) > new Date(fechaInicioCaja)
      ) {
        fechaInicioCaja = ultimoCierreUsuario.fechaRaw;
      }
    }

    if (ultimoCierreUsuario?.estado === "Reabierto por administrador") {
      if (ultimoCierreUsuario.tipoReapertura === "Nuevo turno") {
        fechaInicioCaja = ultimoCierreUsuario.fechaReaperturaRaw;
      }

      if (ultimoCierreUsuario.tipoReapertura === "Reconteo") {
        fechaInicioCaja = ultimoCierreUsuario.fechaInicioCajaRaw || inicioSesionCaja;
      }
    }

    const ventasUsuario = historialVentas.filter((venta) => {
      const esDelUsuario = venta.vendedor === usuarioActual.nombre;

      if (!esDelUsuario) return false;
      if (!fechaInicioCaja) return true;

      return new Date(venta.fechaRaw) > new Date(fechaInicioCaja);
    });

    const retirosPagadosUsuario = retirosInternos.filter(
      (retiro) =>
        retiro.registradoPorId === usuarioActual.id &&
        retiro.estadoPago === "Pagado"
    );

    const totalVentas = ventasUsuario.reduce(
      (total, venta) => total + Number(venta.montoEfectivo || 0),
      0
    );

    const totalTransferencias = ventasUsuario.reduce(
      (total, venta) => total + Number(venta.montoTransferencia || 0),
      0
    );

    const totalRetirosPagados = retirosPagadosUsuario.reduce(
      (total, retiro) => total + Number(retiro.total || 0),
      0
    );

    const totalEsperado = fondoInicialCaja + totalVentas + totalRetirosPagados;
    const diferencia = efectivoDeclarado - totalEsperado;

    try {
      await crearCierreCaja({
        usuarioId: usuarioActual.id,
        usuarioNombre: usuarioActual.nombre,
        efectivoDeclarado,
        transferenciasDeclaradas,
        billetes: datosCaja,
        totalVentas,
        totalTransferencias,
        totalRetirosPagados,
        fondoInicialCaja,
        totalEsperado,
        diferencia,
        observacion: datosCaja.observacion,
        fechaInicioCaja,
      });

      if (aperturaAbiertaUsuario?.id) {
        await cerrarAperturaCaja(aperturaAbiertaUsuario.id);
        await cargarAperturasCaja();
      }

      setUltimoCierreResultado({
        usuarioId: usuarioActual.id,
        efectivoDeclarado,
        transferenciasDeclaradas,
        totalVentas,
        totalTransferencias,
        totalRetirosPagados,
        totalEsperado,
        diferencia,
      });

      setCierreCaja({
        billete20000: "",
        billete10000: "",
        billete2000: "",
        billete1000: "",
        billete500: "",
        billete200: "",
        billete100: "",
        billete50: "",
        monedas: "",
        transferenciasDeclaradas: "",
        observacion: "",
      });

      await cargarCierresCaja();

      alert("Cierre de caja registrado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar cierre de caja: " + error.message);
    }
  };

  const solicitarReaperturaCaja = async (cierreId) => {
    const motivo = prompt("Explicá por qué necesitás reabrir la caja:");

    if (!motivo) {
      alert("Tenés que escribir un motivo");
      return;
    }

    try {
      await crearSolicitudReaperturaCaja({
        cierreId,
        usuarioId: usuarioActual.id,
        usuarioNombre: usuarioActual.nombre,
        motivo,
        tipoReapertura: "Reconteo",
      });

      await cargarSolicitudesCaja();

      alert("Solicitud enviada al administrador");
    } catch (error) {
      console.error(error);
      alert("Error al enviar solicitud: " + error.message);
    }
  };

  const autorizarSolicitudReapertura = async (solicitud, tipoReapertura) => {
    if (!esAdmin) {
      alert("Solo el administrador puede autorizar");
      return;
    }

    try {
      await reabrirCierreCaja({
        cierreId: solicitud.cierreId,
        motivoReapertura: solicitud.motivo,
        tipoReapertura,
        autorizadoPorId: usuarioActual.id,
        autorizadoPorNombre: usuarioActual.nombre,
      });

      await marcarSolicitudAutorizada({
        solicitudId: solicitud.id,
        autorizadoPorId: usuarioActual.id,
        autorizadoPorNombre: usuarioActual.nombre,
      });

      setUltimoCierreResultado(null);
      await cargarCierresCaja();
      await cargarSolicitudesCaja();

      alert(
        tipoReapertura === "Nuevo turno"
          ? "Caja reabierta como nuevo turno"
          : "Caja reabierta para reconteo"
      );
    } catch (error) {
      console.error(error);
      alert("Error al autorizar reapertura: " + error.message);
    }
  };

  const reabrirCaja = async (cierreId) => {
    if (!esAdmin) {
      alert("Solo el administrador puede reabrir cajas");
      return;
    }

    const motivo = prompt("Motivo de reapertura de caja:");

    if (!motivo) {
      alert("Tenés que escribir un motivo");
      return;
    }

    const tipo = confirm(
      "Aceptar = Nuevo turno\nCancelar = Reconteo del mismo turno"
    )
      ? "Nuevo turno"
      : "Reconteo";

    try {
      await reabrirCierreCaja({
        cierreId,
        motivoReapertura: motivo,
        tipoReapertura: tipo,
        autorizadoPorId: usuarioActual.id,
        autorizadoPorNombre: usuarioActual.nombre,
      });

      setUltimoCierreResultado(null);
      await cargarCierresCaja();

      alert(
        tipo === "Nuevo turno"
          ? "Caja reabierta como nuevo turno"
          : "Caja reabierta para reconteo"
      );
    } catch (error) {
      console.error(error);
      alert("Error al reabrir caja: " + error.message);
    }
  };

  if (!logueado) {
    return (
      <Login
        loginData={loginData}
        setLoginData={setLoginData}
        iniciarSesion={iniciarSesion}
      />
    );
  }

  if (esSuperAdmin) {
  return (
    <PanelMaestro
      cerrarSesion={cerrarSesion}
      entrarComoNegocio={entrarComoNegocioDesdePanel}
    />
  );
  }

  return (
    <div className="app-layout">
      {menuMovilAbierto && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuMovilAbierto(false)}
        />
      )}

      <Sidebar
        pantalla={pantalla}
        setPantalla={setPantalla}
        esAdmin={esAdmin}
        menuMovilAbierto={menuMovilAbierto}
        setMenuMovilAbierto={setMenuMovilAbierto}
        cerrarSesion={cerrarSesion}
      />

      <main className="main-content">
        <Topbar
          usuarioActual={usuarioActual}
          esAdmin={esAdmin}
          setPantalla={setPantalla}
          cerrarSesion={cerrarSesion}
          configuracion={configuracion}
          setMenuMovilAbierto={setMenuMovilAbierto}
        />

        {pantalla === "dashboard" && esAdmin && (
          <Dashboard
          esAdmin={esAdmin}
          totalVendidoHoy={totalVendidoHoy}
          gananciaHoy={gananciaHoy}
          productosReponer={productosReponer}
          productosVencimiento={productosVencimiento}
          generarPedidoAutomatico={generarPedidoAutomatico}
          lotes={lotes}
          historialVentas={historialVentas}
          ventasPorVendedor={ventasPorVendedor}
           productosMasVendidos={productosMasVendidos}
          />
        )}

        {pantalla === "cierre-caja" && (
          <CierreCaja
            cierreCaja={cierreCaja}
            setCierreCaja={setCierreCaja}
            guardarCierreCaja={guardarCierreCaja}
            ultimoCierreResultado={ultimoCierreResultado}
            cierresCaja={cierresCaja}
            usuarioActual={usuarioActual}
            esAdmin={esAdmin}
            reabrirCaja={reabrirCaja}
            solicitudesCaja={solicitudesCaja}
            solicitarReaperturaCaja={solicitarReaperturaCaja}
            autorizarSolicitudReapertura={autorizarSolicitudReapertura}
          />
        )}

        {pantalla === "caja" && esAdmin && (
          <Caja
            historialVentas={historialVentas}
            usuarioActual={usuarioActual}
            esAdmin={esAdmin}
            retirosInternos={retirosInternos}
          />
        )}

        {pantalla === "ticket" && (
          <Ticket
            ultimaVenta={ultimaVenta}
            configuracion={configuracion}
            setPantalla={setPantalla}
          />
        )}

        {pantalla === "venta" && (
          <Ventas
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            montoEfectivo={montoEfectivo}
            setMontoEfectivo={setMontoEfectivo}
            montoTransferencia={montoTransferencia}
            setMontoTransferencia={setMontoTransferencia}
            codigo={codigo}
            setCodigo={setCodigo}
            buscarProducto={buscarProducto}
            ventaActual={ventaActual}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            quitarProducto={quitarProducto}
            totalVenta={totalVenta}
            cobrarVenta={cobrarVenta}
            vaciarVenta={vaciarVenta}
            esAdmin={esAdmin}
            gananciaVenta={gananciaVenta}
            promocionesAplicadas={promocionesAplicadas}
            descuentoPromociones={descuentoPromociones}
            aplicarPromociones={aplicarPromociones}
          />
        )}

        {pantalla === "productos" && esAdmin && (
          <Productos
            esAdmin={esAdmin}
            nuevoProducto={nuevoProducto}
            setNuevoProducto={setNuevoProducto}
            guardarProducto={guardarProducto}
            busquedaProducto={busquedaProducto}
            setBusquedaProducto={setBusquedaProducto}
            productosFiltrados={productosFiltrados}
            editarProducto={editarProducto}
            productoEditando={productoEditando}
            limpiarFormularioProducto={limpiarFormularioProducto}
            cambiarEstadoProducto={cambiarEstadoProducto}
            productoCargaRapida={productoCargaRapida}
            codigoCargaRapida={codigoCargaRapida}
            setCodigoCargaRapida={setCodigoCargaRapida}
            cantidadCargaRapida={cantidadCargaRapida}
            setCantidadCargaRapida={setCantidadCargaRapida}
            vencimientoCargaRapida={vencimientoCargaRapida}
            setVencimientoCargaRapida={setVencimientoCargaRapida}
            cargarStockConLector={cargarStockConLector}
          />
        )}

        {pantalla === "promociones" && esAdmin && (
          <Promociones
            promociones={promociones}
            productos={productosActivos}
            crearPromocion={crearPromocion}
            cambiarEstadoPromocion={cambiarEstadoPromocion}
            eliminarPromocion={eliminarPromocion}
          />
        )}

        {pantalla === "ajustes-stock" && esAdmin && (
          <AjustesStock
            productosActivos={productosActivos}
            ajusteStock={ajusteStock}
            setAjusteStock={setAjusteStock}
            guardarAjusteStock={guardarAjusteStock}
          />
        )}

        {pantalla === "pedidos" && esAdmin && (
          <Pedidos
            pedidos={pedidos}
            generarPedidoAutomatico={generarPedidoAutomatico}
            recibirProductoPedido={recibirProductoPedido}
          />
        )}

        {pantalla === "retiros-internos" && (
          <RetirosInternos
            codigoRetiro={codigoRetiro}
            setCodigoRetiro={setCodigoRetiro}
            buscarProductoRetiro={buscarProductoRetiro}
            retiroActual={retiroActual}
            aumentarCantidadRetiro={aumentarCantidadRetiro}
            disminuirCantidadRetiro={disminuirCantidadRetiro}
            quitarProductoRetiro={quitarProductoRetiro}
            totalRetiro={totalRetiro}
            tipoRetiro={tipoRetiro}
            setTipoRetiro={setTipoRetiro}
            estadoPagoRetiro={estadoPagoRetiro}
            setEstadoPagoRetiro={setEstadoPagoRetiro}
            usuarios={usuarios}
            usuarioRetiroId={usuarioRetiroId}
            setUsuarioRetiroId={setUsuarioRetiroId}
            confirmarRetiroInterno={confirmarRetiroInterno}
            retirosInternos={retirosInternos}
          />
        )}

        {pantalla === "pagos-mensuales" && esAdmin && (
          <PagosMensuales usuarios={usuarios} retirosInternos={retirosInternos} />
        )}

        {pantalla === "vencimientos" && esAdmin && <Vencimientos lotes={lotes} />}

        {pantalla === "mi-cuenta" && (
          <MiCuenta
            usuarioActual={usuarioActual}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            cambiarMiPassword={cambiarMiPasswordUsuarioActual}
          />
        )}

        {pantalla === "usuarios" && esAdmin && (
          <Usuarios
            usuarios={usuarios}
            nuevoUsuario={nuevoUsuario}
            setNuevoUsuario={setNuevoUsuario}
            guardarUsuario={guardarUsuario}
            cambiarUsuario={cambiarUsuario}
            cambiarEstadoEmpleado={cambiarEstadoEmpleado}
          />
        )}

        {pantalla === "configuracion" && esAdmin && (
          <Configuracion
            configuracion={configuracion}
            setConfiguracion={setConfiguracion}
            guardarConfiguracion={guardarConfiguracion}
          />
        )}
      </main>
    </div>
  );
}