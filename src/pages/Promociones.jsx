


import { useState } from "react";

export default function Promociones({
  promociones,
  productos,
  crearPromocion,
  cambiarEstadoPromocion,
  eliminarPromocion,
}) {
  const [nombre, setNombre] = useState("");
  const [precioPromocional, setPrecioPromocional] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productosPromo, setProductosPromo] = useState([]);

  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const productosFiltrados = productos.filter((producto) => {
    const texto = busquedaProducto.toLowerCase().trim();

    if (!texto) return false;

    return (
      producto.nombre.toLowerCase().includes(texto) ||
      String(producto.codigo).includes(texto)
    );
  });

  const agregarProducto = (producto) => {
    const existente = productosPromo.find((p) => p.codigo === producto.codigo);

    if (existente) {
      setProductosPromo(
        productosPromo.map((p) =>
          p.codigo === producto.codigo
            ? { ...p, cantidad: Number(p.cantidad || 1) + 1 }
            : p
        )
      );
    } else {
      setProductosPromo([
        ...productosPromo,
        {
          ...producto,
          cantidad: 1,
        },
      ]);
    }

    setBusquedaProducto("");
  };

  const aumentarCantidadPromo = (codigo) => {
    setProductosPromo(
      productosPromo.map((p) =>
        p.codigo === codigo
          ? { ...p, cantidad: Number(p.cantidad || 1) + 1 }
          : p
      )
    );
  };

  const disminuirCantidadPromo = (codigo) => {
    setProductosPromo(
      productosPromo
        .map((p) =>
          p.codigo === codigo
            ? { ...p, cantidad: Number(p.cantidad || 1) - 1 }
            : p
        )
        .filter((p) => Number(p.cantidad || 0) > 0)
    );
  };

  const quitarProductoPromo = (codigo) => {
    setProductosPromo(productosPromo.filter((p) => p.codigo !== codigo));
  };

  const guardar = async () => {
    if (!nombre.trim()) {
      alert("Ingresá un nombre");
      return;
    }

    if (productosPromo.length === 0) {
      alert("Agregá productos");
      return;
    }

    if (!precioPromocional) {
      alert("Ingresá precio promocional");
      return;
    }

    await crearPromocion({
      nombre,
      precioPromocional,
      productos: productosPromo,
    });

    setNombre("");
    setPrecioPromocional("");
    setBusquedaProducto("");
    setProductosPromo([]);
  };

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Promociones</h4>

      <div className="alert alert-info">
        Podés agregar el mismo producto varias veces. Ejemplo: 2 aguas por
        precio promocional.
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-5">
          <input
            className="form-control"
            placeholder="Nombre promoción"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-3">
          <input
            className="form-control"
            type="number"
            placeholder="Precio promoción"
            value={precioPromocional}
            onChange={(e) => setPrecioPromocional(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <input
            className="form-control"
            placeholder="Buscar producto por código o nombre..."
            value={busquedaProducto}
            onChange={(e) => setBusquedaProducto(e.target.value)}
          />
        </div>
      </div>

      {productosFiltrados.length > 0 && (
        <div className="table-responsive mb-3">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Producto encontrado</th>
                <th>Código</th>
                <th>Precio venta</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.slice(0, 8).map((producto) => (
                <tr key={producto.codigo}>
                  <td className="fw-semibold">{producto.nombre}</td>
                  <td>{producto.codigo}</td>
                  <td>${formatoPrecio(producto.precioVenta)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => agregarProducto(producto)}
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {productosPromo.length > 0 && (
        <div className="alert alert-info mb-3">
          <strong>Productos de la promoción:</strong>

          <div className="table-responsive mt-2">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Cantidad requerida</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosPromo.map((producto) => (
                  <tr key={producto.codigo}>
                    <td className="fw-semibold">{producto.nombre}</td>
                    <td>{producto.codigo}</td>
                    <td>
                      <span className="badge bg-primary">
                        {producto.cantidad}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => aumentarCantidadPromo(producto.codigo)}
                      >
                        +
                      </button>

                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => disminuirCantidadPromo(producto.codigo)}
                      >
                        -
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => quitarProductoPromo(producto.codigo)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button className="btn btn-success mb-4" onClick={guardar}>
        Crear promoción
      </button>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Promoción</th>
              <th>Precio</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {promociones.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted">
                  Todavía no hay promociones creadas.
                </td>
              </tr>
            ) : (
              promociones.map((promo) => (
                <tr key={promo.id}>
                  <td className="fw-semibold">{promo.nombre}</td>

                  <td>${formatoPrecio(promo.precioPromocional)}</td>

                  <td>
                    {promo.productos
                      .map((p) => `${p.nombre} x ${p.cantidad || 1}`)
                      .join(", ")}
                  </td>

                  <td>
                    {promo.activa ? (
                      <span className="badge bg-success">Activa</span>
                    ) : (
                      <span className="badge bg-danger">Inactiva</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        cambiarEstadoPromocion(promo.id, !promo.activa)
                      }
                    >
                      Estado
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarPromocion(promo.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}