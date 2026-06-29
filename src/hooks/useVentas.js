import { useState } from "react";
import { guardarVenta } from "../services/ventasService";

export function useVentas() {
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [montoEfectivo, setMontoEfectivo] = useState("");
  const [montoTransferencia, setMontoTransferencia] = useState("");
  const [codigo, setCodigo] = useState("");
  const [ventaActual, setVentaActual] = useState([]);
  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [promocionesAplicadas, setPromocionesAplicadas] = useState([]);
  const [descuentoPromociones, setDescuentoPromociones] = useState(0);

  const vaciarVenta = () => {
    setVentaActual([]);
    setPromocionesAplicadas([]);
    setDescuentoPromociones(0);
    setMetodoPago("Efectivo");
    setMontoEfectivo("");
    setMontoTransferencia("");
  };

  return {
    metodoPago,
    setMetodoPago,
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    codigo,
    setCodigo,
    ventaActual,
    setVentaActual,
    ultimaVenta,
    setUltimaVenta,
    promocionesAplicadas,
    setPromocionesAplicadas,
    descuentoPromociones,
    setDescuentoPromociones,
    guardarVenta,
    vaciarVenta,
  };
}