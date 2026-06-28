import { supabase } from "./supabaseClient";

export async function loginSuperAdmin(usuario, password) {
  const { data, error } = await supabase
    .from("super_admins")
    .select("*")
    .eq("usuario", usuario)
    .eq("password", password)
    .eq("activo", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Super admin inválido");

  return {
    id: data.id,
    nombre: data.nombre,
    usuario: data.usuario,
    rol: "SuperAdmin",
  };
}

export async function obtenerNegociosMaestro() {
  const { data, error } = await supabase
    .from("maestro_negocios_resumen")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function crearNegocioConAdministrador(datos) {
  const { data, error } = await supabase.rpc("crear_negocio_maestro", {
    p_nombre_negocio: datos.nombreNegocio,
    p_nombre_dueno: datos.nombreDueno || "",
    p_telefono_dueno: datos.telefonoDueno || "",
    p_email_dueno: datos.emailDueno || "",
    p_plan: datos.plan || "Mensual",
    p_fecha_vencimiento: datos.fechaVencimiento || null,
    p_nombre_administrador: datos.nombreAdministrador || "Dueño del negocio",
    p_usuario_administrador: datos.usuarioAdministrador,
    p_password_administrador: datos.passwordAdministrador,
  });

  if (error) throw error;

  return data;
}

export async function cambiarEstadoNegocio(negocioId, estado) {
  const { error } = await supabase.rpc("cambiar_estado_negocio_maestro", {
    p_negocio_id: negocioId,
    p_estado: estado,
  });

  if (error) throw error;
}


export async function actualizarNegocioMaestro(negocioId, datos) {
  const { error } = await supabase
    .from("negocios")
    .update({
      nombre: datos.nombre,
      nombre_dueno: datos.nombre_dueno || "",
      telefono_dueno: datos.telefono_dueno || "",
      email_dueno: datos.email_dueno || "",
      estado: datos.estado || "Activo",
      plan: datos.plan || "Mensual",
      fecha_vencimiento: datos.fecha_vencimiento || null,
      mensaje_bloqueo:
        datos.mensaje_bloqueo ||
        "Tu suscripción está vencida. Comunicate con el administrador.",
    })
    .eq("id", negocioId);

  if (error) throw error;
}

export async function suspenderNegocioMaestro(negocioId) {
  return cambiarEstadoNegocio(negocioId, "Suspendido");
}

export async function reactivarNegocioMaestro(negocioId) {
  return cambiarEstadoNegocio(negocioId, "Activo");
}


export async function obtenerDetalleNegocioMaestro(negocioId) {
  const { data: negocio, error: errorNegocio } = await supabase
    .from("maestro_negocios_resumen")
    .select("*")
    .eq("id", negocioId)
    .single();

  if (errorNegocio) throw errorNegocio;

  const { data: usuarios, error: errorUsuarios } = await supabase
    .from("usuarios_app")
    .select("id, nombre, usuario, password, rol, activo, creado_en")
    .eq("negocio_id", negocioId)
    .order("creado_en", { ascending: false });

  if (errorUsuarios) throw errorUsuarios;

  const { data: productos, error: errorProductos } = await supabase
    .from("productos")
    .select("id, codigo, nombre, marca, categoria, precio_venta, stock, minimo, activo")
    .eq("negocio_id", negocioId)
    .order("creado_en", { ascending: false })
    .limit(10);

  if (errorProductos) throw errorProductos;

  const { data: ventas, error: errorVentas } = await supabase
    .from("ventas")
    .select("id, vendedor, total, ganancia, metodo_pago, creado_en")
    .eq("negocio_id", negocioId)
    .order("creado_en", { ascending: false })
    .limit(10);

  if (errorVentas) throw errorVentas;

  return {
    negocio,
    usuarios: usuarios || [],
    productos: productos || [],
    ventas: ventas || [],
  };
}



export async function obtenerAdministradorDeNegocio(negocioId) {
  const { data, error } = await supabase
    .from("usuarios_app")
    .select("id, negocio_id, nombre, usuario, rol, activo")
    .eq("negocio_id", negocioId)
    .eq("rol", "Administrador")
    .eq("activo", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Este negocio no tiene administrador activo");

  return {
    id: data.id,
    negocioId: data.negocio_id,
    nombre: data.nombre,
    usuario: data.usuario,
    rol: data.rol,
    activo: data.activo,
  };
}




export async function obtenerCatalogoGlobalMaestro() {
  const { data, error } = await supabase
    .from("catalogo_global_productos")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;

  return data || [];
}


export async function importarCatalogoGlobalMaestro(productos) {
  if (!productos || productos.length === 0) {
    return;
  }

  const productosLimpios = productos
    .map((p) => ({
      codigo: String(p.codigo || "").trim(),
      nombre: String(p.nombre || "").trim(),
      marca: String(p.marca || "").trim(),
      categoria: String(p.categoria || "").trim(),
      presentacion: String(p.presentacion || "").trim(),
    }))
    .filter((p) => p.codigo && p.nombre);

  if (productosLimpios.length === 0) {
    throw new Error("El archivo no tiene productos válidos");
  }

  const { error } = await supabase
    .from("catalogo_global_productos")
    .upsert(productosLimpios, {
      onConflict: "codigo",
    });

  if (error) throw error;
}