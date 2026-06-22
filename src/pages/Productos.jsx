


import { useEffect, useRef, useState } from "react";

export default function Productos({
  esAdmin,
  nuevoProducto,
  setNuevoProducto,
  guardarProducto,
  busquedaProducto,
  setBusquedaProducto,
  productosFiltrados,
  editarProducto,
  productoEditando,
  limpiarFormularioProducto,
  cambiarEstadoProducto,
  productoCargaRapida,
  codigoCargaRapida,
  setCodigoCargaRapida,
  cantidadCargaRapida,
  setCantidadCargaRapida,
  vencimientoCargaRapida,
  setVencimientoCargaRapida,
  cargarStockConLector,
}) {
  const [scannerAbierto, setScannerAbierto] = useState(false);
  const [scannerDestino, setScannerDestino] = useState(null);
  const [scannerMensaje, setScannerMensaje] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scannerActivoRef = useRef(false);

  const detenerScanner = () => {
    scannerActivoRef.current = false;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const aplicarCodigoEscaneado = (codigoDetectado) => {
    const codigoLimpio = String(codigoDetectado || "").trim();

    if (!codigoLimpio) return;

    if (scannerDestino === "producto") {
      setNuevoProducto({
        ...nuevoProducto,
        codigo: codigoLimpio,
      });
    }

    if (scannerDestino === "stock") {
      setCodigoCargaRapida(codigoLimpio);
    }

    detenerScanner();
    setScannerAbierto(false);
    setScannerDestino(null);
    setScannerMensaje(`Código escaneado: ${codigoLimpio}`);
  };

  const abrirScanner = (destino) => {
    setScannerDestino(destino);
    setScannerMensaje("");
    setScannerAbierto(true);
  };

  useEffect(() => {
    if (!scannerAbierto) return;

    let cancelado = false;

    const iniciarScanner = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setScannerMensaje(
            "Este celular o navegador no permite usar la cámara desde la web. Probá con Chrome y la app abierta con HTTPS."
          );
          return;
        }

        if (!("BarcodeDetector" in window)) {
          setScannerMensaje(
            "Tu navegador no tiene lector de código de barras incorporado. Probá con Chrome actualizado en Android."
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        if (cancelado) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const formatos = [
          "ean_13",
          "ean_8",
          "upc_a",
          "upc_e",
          "code_128",
          "code_39",
          "itf",
        ];

        const detector = new window.BarcodeDetector({ formats: formatos });
        scannerActivoRef.current = true;
        setScannerMensaje("Apuntá la cámara al código de barras.");

        const detectar = async () => {
          if (!scannerActivoRef.current || !videoRef.current) return;

          try {
            const codigos = await detector.detect(videoRef.current);

            if (codigos.length > 0) {
              aplicarCodigoEscaneado(codigos[0].rawValue);
              return;
            }
          } catch (error) {
            console.error(error);
          }

          requestAnimationFrame(detectar);
        };

        detectar();
      } catch (error) {
        console.error(error);
        setScannerMensaje(
          "No se pudo abrir la cámara. Revisá permisos del navegador y que la página esté en HTTPS."
        );
      }
    };

    iniciarScanner();

    return () => {
      cancelado = true;
      detenerScanner();
    };
  }, [scannerAbierto, scannerDestino]);

  const cerrarScanner = () => {
    detenerScanner();
    setScannerAbierto(false);
    setScannerDestino(null);
  };

  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <section className="panel mt-4">
      <h4 className="fw-bold mb-3">Productos y stock</h4>

      {esAdmin && (
        <>
          <div className="panel mb-4 p-3 border border-success">
            <h5 className="fw-bold mb-2">Ingreso de stock</h5>

            <div className="alert alert-info py-2">
              Escaneá un producto ya cargado. El sistema suma stock y guarda el
              lote con vencimiento.
            </div>

            {productoCargaRapida && (
              <div className="alert alert-success py-2 mb-2">
                Último ingresado: <strong>{productoCargaRapida.nombre}</strong>{" "}
                · Stock actual: <strong>{productoCargaRapida.stock}</strong>
              </div>
            )}

            <form onSubmit={cargarStockConLector} className="row g-2">
              <div className="col-12 col-md-4">
                <div className="input-group input-group-lg">
                  <input
                    className="form-control"
                    placeholder="Código de barras"
                    value={codigoCargaRapida}
                    onChange={(e) => setCodigoCargaRapida(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => abrirScanner("stock")}
                    title="Escanear con cámara del celular"
                  >
                    📷
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-2">
                <input
                  className="form-control form-control-lg"
                  placeholder="Cantidad"
                  type="number"
                  min="1"
                  value={cantidadCargaRapida}
                  onChange={(e) => setCantidadCargaRapida(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control form-control-lg"
                  type="date"
                  value={vencimientoCargaRapida}
                  onChange={(e) => setVencimientoCargaRapida(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <button className="btn btn-success btn-lg w-100">
                  Ingresar stock
                </button>
              </div>
            </form>
          </div>

          <div className="panel mb-4 p-3 border">
            <h5 className="fw-bold mb-2">
              {productoEditando
                ? "Editar producto"
                : "Alta de producto nuevo"}
            </h5>

            <div className="alert alert-warning py-2">
              Esta parte solo debe usarla el administrador. Acá se cargan o se
              cambian precios y datos del producto.
            </div>

            <form onSubmit={guardarProducto} className="row g-2">
              <div className="col-12 col-md-3">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Código de barras"
                    value={nuevoProducto.codigo}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        codigo: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => abrirScanner("producto")}
                    title="Escanear con cámara del celular"
                  >
                    📷
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Nombre del producto"
                  value={nuevoProducto.nombre}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Marca"
                  value={nuevoProducto.marca}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      marca: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Categoría"
                  value={nuevoProducto.categoria}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      categoria: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Precio compra: 1.500"
                  inputMode="decimal"
                  value={nuevoProducto.precioCompra}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      precioCompra: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Precio venta: 2.500"
                  inputMode="decimal"
                  value={nuevoProducto.precioVenta}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      precioVenta: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Stock inicial"
                  type="number"
                  value={nuevoProducto.stock}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      stock: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Stock mínimo"
                  type="number"
                  value={nuevoProducto.minimo}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      minimo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  placeholder="Proveedor"
                  value={nuevoProducto.proveedor}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      proveedor: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <input
                  className="form-control"
                  type="date"
                  value={nuevoProducto.vencimiento}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      vencimiento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-3">
                <button className="btn btn-primary w-100">
                  {productoEditando
                    ? "Actualizar producto"
                    : "Guardar producto"}
                </button>
              </div>

              {productoEditando && (
                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={limpiarFormularioProducto}
                  >
                    Cancelar edición
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      )}

      <div className="panel p-3">
        <h5 className="fw-bold mb-2">Listado de productos</h5>

        <input
          className="form-control mb-2"
          placeholder="Buscar producto por nombre o código..."
          value={busquedaProducto}
          onChange={(e) => setBusquedaProducto(e.target.value)}
        />

        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                {esAdmin && <th>Compra</th>}
                <th>Venta</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Proveedor</th>
                <th>Estado</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => (
                <tr
                  key={producto.id || producto.codigo}
                  className={!producto.activo ? "table-secondary" : ""}
                >
                  <td>{producto.codigo}</td>
                  <td className="fw-semibold">{producto.nombre}</td>

                  {esAdmin && <td>${formatoPrecio(producto.precioCompra)}</td>}

                  <td>${formatoPrecio(producto.precioVenta)}</td>

                  <td>
                    <span
                      className={
                        producto.stock <= producto.minimo
                          ? "badge bg-danger"
                          : "badge bg-success"
                      }
                    >
                      {producto.stock}
                    </span>
                  </td>

                  <td>{producto.minimo}</td>
                  <td>{producto.proveedor}</td>

                  <td>
                    <span
                      className={
                        producto.activo
                          ? "badge bg-success"
                          : "badge bg-secondary"
                      }
                    >
                      {producto.activo ? "Activo" : "Desactivado"}
                    </span>
                  </td>

                  {esAdmin && (
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editarProducto(producto)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className={
                            producto.activo
                              ? "btn btn-sm btn-outline-warning"
                              : "btn btn-sm btn-outline-success"
                          }
                          onClick={() => cambiarEstadoProducto(producto)}
                        >
                          {producto.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={esAdmin ? "9" : "7"} className="text-muted">
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {scannerAbierto && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 2000 }}
        >
          <div className="bg-white rounded shadow p-3 w-100" style={{ maxWidth: "520px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0">Escanear código de barras</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={cerrarScanner}
              >
                Cerrar
              </button>
            </div>

            <div className="alert alert-info py-2 mb-2">
              {scannerMensaje || "Preparando cámara..."}
            </div>

            <video
              ref={videoRef}
              className="w-100 rounded border bg-dark"
              style={{ maxHeight: "360px", objectFit: "cover" }}
              playsInline
              muted
            />

            <div className="text-muted small mt-2">
              Funciona mejor desde el celular, con buena luz y apuntando al código completo.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}