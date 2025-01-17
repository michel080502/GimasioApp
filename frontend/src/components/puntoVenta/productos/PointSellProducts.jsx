import { IoMdCloseCircle } from "react-icons/io";

import { useState, useEffect } from "react";
import Costumers from "../membership/Costumers";
import Products from "./Products";

const PointSellProducts = () => {
  const [externalName, setExternalName] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productsSelect, setProductsSelect] = useState([]);
  const [saleMade, setSaleMade] = useState(null);
  const [totalVenta, setTotalVenta] = useState(0); // Variable para el total de la venta
  // Calcular el total de la venta cada vez que productsSelect cambia
  useEffect(() => {
    const nuevoTotalVenta = productsSelect.reduce(
      (acc, product) => acc + product.subtotal,
      0
    );
    setTotalVenta(nuevoTotalVenta);
  }, [productsSelect]); // calcula las ventas cada que el estado del productoSelect cambia

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleNameExternal = (e) => {
    setExternalName(e.target.value);
  };

  const handleExternalClient = (e) => {
    e.preventDefault();
    setClienteSeleccionado(externalName);
  };

  const deleteClientSelect = () => {
    setClienteSeleccionado(null);
    setExternalName("");
  };

  const seleccionarProductos = (product) => {
    setProductsSelect((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                cantidad: p.cantidad + 1,
                subtotal: (p.cantidad + 1) * p.total,
              }
            : p
        );
      } else {
        return [...prev, { ...product, cantidad: 1, subtotal: product.total }];
      }
    });
  };

  const actualizarCantidadProducto = (id, cantidad) => {
    setProductsSelect(
      (prev) =>
        prev
          .map((p) =>
            p.id === id
              ? {
                  ...p,
                  cantidad: Math.max(0, cantidad), // Retorna el valor más alto entre los argumentos proporcionados. no permite que la cantidad sea menor a 0
                  subtotal: Math.max(0, cantidad) * p.total,
                }
              : p
          )
          .filter((p) => p.cantidad > 0) // Filtra productos con cantidad mayor a 0
    );
  };

  // const removerProducto = (id) => {
  //   setProductsSelect((prev) => prev.filter((p) => p.id !== id));
  // };

  const handleSale = () => {
    if (productsSelect.length > 0 && clienteSeleccionado) {
      console.log("Venta realizada con los siguientes datos:");
      console.log("Cliente:", clienteSeleccionado);
      console.log("Productos:", productsSelect);
      console.log("Total", totalVenta);
      setSaleMade(1);
      // setProductsSelect([]); // Limpiar productos seleccionados
      // setClienteSeleccionado(null); // Limpiar cliente seleccionado
    } else {
      console.error("Debe seleccionar al menos un cliente y productos.");
    }
  };
  const activarVenta = clienteSeleccionado && productsSelect.length > 0;

  const formatoPrecio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const clientes = [
    {
      id: 1,
      nombre: "Javier Fernandez Lopez",
      telefono: "1234567890",
      email: "javier.fernandez@example.com",
    },
    {
      id: 2,
      nombre: "Maria Gonzalez Perez",
      telefono: "0987654321",
      email: "maria.gonzalez@example.com",
    },
    {
      id: 3,
      nombre: "Carlos Martinez Ruiz",
      telefono: "1122334455",
      email: "carlos.martinez@example.com",
    },
    {
      id: 4,
      nombre: "Ana Lopez Garcia",
      telefono: "6677889900",
      email: "ana.lopez@example.com",
    },
    {
      id: 5,
      nombre: "Luis Ramirez Soto",
      telefono: "5544332211",
      email: "luis.ramirez@example.com",
    },
  ];
  const productos = [
    {
      id: 1,
      nombre: "Proteína Whey Chocolate",
      marca: "Optimum Nutrition",
      categoria: "Accesorios",
      stock: 50,
      precio: 850.0,
      descuento: 10.0,
      total: 765.0,
      img_public_id: "/assets/proteina.jpg",
      img_secure_url: "/assets/proteina.jpg",
      disponible: true,
      fecha_creacion: new Date().toISOString(),
    },
    {
      id: 2,
      nombre: "BCCAs",
      marca: "Dymatize",
      categoria: "Aminoacidos",
      stock: 30,
      precio: 950.0,
      descuento: 5.0,
      total: 902.5,
      img_public_id: "/assets/proteina.jpg",
      img_secure_url: "/assets/proteina.jpg",
      disponible: true,
      fecha_creacion: new Date().toISOString(),
    },
    {
      id: 3,
      nombre: "Aislado de Proteína Neutra",
      marca: "BodyTech",
      categoria: "Proteina",
      stock: 20,
      precio: 1200.0,
      descuento: 15.0,
      total: 1020.0,
      img_public_id: "/assets/proteina.jpg",
      img_secure_url: "/assets/proteina.jpg",
      disponible: true,
      fecha_creacion: new Date().toISOString(),
    },
    {
      id: 4,
      nombre: "Proteína Vegana Chocolate",
      marca: "Vega",
      categoria: "Proteina",
      stock: 25,
      precio: 750.0,
      descuento: 0.0,
      total: 750.0,
      img_public_id: "/assets/proteina.jpg",
      img_secure_url: "/assets/proteina.jpg",
      disponible: true,
      fecha_creacion: new Date().toISOString(),
    },
    {
      id: 5,
      nombre: "Proteína Caseína Nocturna",
      marca: "MuscleTech",
      categoria: "Proteina",
      stock: 10,
      precio: 1400.0,
      descuento: 20.0,
      total: 1120.0,
      img_public_id: "/assets/proteina.jpg",
      img_secure_url: "/assets/proteina.jpg",
      disponible: true,
      fecha_creacion: new Date().toISOString(),
    },
  ];
  if (!saleMade) {
    return (
      <div className="grid grid-cols-8 divide-x-2">
        <main className="col-span-5 pr-3">
          {!clienteSeleccionado ? (
            <Costumers
              clientes={clientes}
              seleccionarCliente={seleccionarCliente}
            />
          ) : (
            <Products
              formatoPrecio={formatoPrecio}
              productos={productos}
              seleccionarProductos={seleccionarProductos}
            />
          )}
        </main>
        <aside className="col-span-3 pl-3 grid gap-3">
          <h2>Resumen de la venta</h2>
          <div className="grid gap-1">
            <div className="flex items-center">
              <h3
                className={`flex-1 flex justify-between text-lg p-2  border-b-2 ${
                  clienteSeleccionado
                    ? "border-green-600 text-green-700"
                    : "border-gray-600 text-gray-700"
                } `}
              >
                <span
                  className={`rounded-full px-[10px] ring ${
                    clienteSeleccionado ? "ring-green-400" : "ring-gray-400"
                  }  `}
                >
                  1
                </span>
                Cliente
              </h3>
              {clienteSeleccionado && (
                <button className="m-auto " onClick={deleteClientSelect}>
                  <IoMdCloseCircle className="text-xl text-red-500" />
                </button>
              )}
            </div>

            {!clienteSeleccionado ? (
              <div className="grid gap-2 m-auto max-w-80">
                <p className=" text-sm font-medium">
                  Si no es un cliente registrado ingresa su nombre en este
                  formulario o ve a registrarlo al apartado de clientes
                </p>
                <form onSubmit={handleExternalClient} className="grid gap-2">
                  <label className="text-sm text-gray-700">
                    Nombre del cliente externo:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={externalName}
                    onChange={handleNameExternal}
                    className="border text-sm font-normal focus-within: rounded-lg p-1"
                  />
                  <button
                    type="submit"
                    className="text-sm  bg-black m-auto text-white rounded-md p-2 "
                  >
                    Seleccionar
                  </button>
                </form>
              </div>
            ) : (
              <>
                {!externalName ? (
                  <>
                    <div className="flex justify-between">
                      <p className="text-base font-medium">Nombre:</p>

                      <p className="text-base font-normal">
                        {clienteSeleccionado.nombre}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-base font-medium">Telefono:</p>

                      <p className="text-base font-normal">
                        {clienteSeleccionado.telefono}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base font-medium">Email:</p>

                      <p className="text-base font-normal">
                        {clienteSeleccionado.email}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <p className="text-base font-medium">
                      Nombre del cliente externo:
                    </p>

                    <p className="text-base font-normal">
                      {clienteSeleccionado}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="grid gap-1">
            <div className="flex items-center">
              <h3
                className={`flex-1 flex justify-between text-lg p-2  border-b-2 ${
                  productsSelect.length > 0
                    ? "border-green-600 text-green-700"
                    : "border-gray-600 text-gray-700"
                }`}
              >
                <span
                  className={`rounded-full px-[10px] ring ${
                    productsSelect.length > 0
                      ? "ring-green-400"
                      : "ring-gray-400"
                  }`}
                >
                  2
                </span>
                Productos
              </h3>
              {productsSelect.length > 0 && (
                <button
                  className="m-auto "
                  onClick={() => {
                    setProductsSelect([]);
                  }}
                >
                  <IoMdCloseCircle className="text-xl text-red-500" />
                </button>
              )}
            </div>
            {productsSelect.length > 0 ? (
              <div className="p-1 overflow-x-auto max-h-64">
                <table className="min-w-full border border-gray-300 rounded-lg  shadow-md">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        #
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Producto
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Precio/cu
                      </th>

                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Cantidad
                      </th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsSelect.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm text-gray-900 border-b">
                          {index + 1}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900 border-b">
                          {item.nombre}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900 border-b">
                          {formatoPrecio.format(item.total)}
                        </td>
                        <td className="px-3 py-4 text-sm text-center text-gray-900 border-b  ">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="font-bold text-xl text-gray-300 hover:text-red-700 transform duration-200"
                              onClick={() =>
                                actualizarCantidadProducto(
                                  item.id,
                                  item.cantidad - 1
                                )
                              }
                            >
                              -
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              className="font-bold text-xl text-gray-300 hover:text-green-700 transform duration-200"
                              onClick={() =>
                                actualizarCantidadProducto(
                                  item.id,
                                  item.cantidad + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900 border-b">
                          {formatoPrecio.format(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan="4"
                        className="px-3 py-3 text-right text-sm font-medium text-gray-700"
                      >
                        Total
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        {formatoPrecio.format(totalVenta)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p>No hay productos seleccionados.</p>
            )}
          </div>
          <button
            disabled={!activarVenta}
            onClick={() => handleSale()}
            className={`bg-gray-700 text-white p-2 rounded-lg text-base m-auto ${
              activarVenta ? "hover:bg-black transform duration-150 " : ""
            } `}
          >
            Realizar venta
          </button>
        </aside>
      </div>
    );
  } else {
    return (
      <div className="grid gap-2 p-2">
        <h2>¡¡Compra realizada correctamente!!</h2>
        <p className="text-sm font-normal">
          Informa al cliente el resultado de su compra y presiona en la X para
          salir
        </p>
        <div className="flex items-center justify-between ">
          <p className="text-lg">Cliente:</p>
          <p className="text-base font-normal">Aqui mostaremos los datos</p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-lg">Fecha compra:</p>
          <p className="text-base font-normal">que obtenemos de una </p>
        </div>
        <div className="flex items-center justify-between ">
          <p className="text-lg">Total de la compra:</p>
          <p className="text-base font-normal">consulta correcta</p>
        </div>
      </div>
    );
  }
};

export default PointSellProducts;
