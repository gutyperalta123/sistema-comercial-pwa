import { useState } from "react";
import {
  obtenerPromociones,
  crearPromocion as crearPromocionService,
  cambiarEstadoPromocion as cambiarEstadoPromocionService,
  eliminarPromocion as eliminarPromocionService,
} from "../services/promocionesService";

export function usePromociones() {
  const [promociones, setPromociones] = useState([]);

  const cargarPromociones = async () => {
    const promocionesBase = await obtenerPromociones();
    setPromociones(promocionesBase);
  };

  const crearPromocion = async (promo) => {
    await crearPromocionService(promo);
    await cargarPromociones();
    alert("Promoción creada correctamente");
  };

  const cambiarEstadoPromocion = async (id, activa) => {
    await cambiarEstadoPromocionService(id, activa);
    await cargarPromociones();
  };

  const eliminarPromocion = async (id) => {
    const confirmar = confirm("¿Eliminar esta promoción?");

    if (!confirmar) return;

    await eliminarPromocionService(id);
    await cargarPromociones();
  };

  return {
    promociones,
    setPromociones,
    cargarPromociones,
    crearPromocion,
    cambiarEstadoPromocion,
    eliminarPromocion,
  };
}