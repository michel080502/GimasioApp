import { IoMdCloseCircle } from "react-icons/io";

import { useState } from "react";
import Costumers from "./Costumers";
import Memberships from "./Memberships";

const PointSellMembership = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [membresiaSelect, setMembresiaSelect] = useState(null);
  const [saleMade, setSaleMade] = useState(null);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const seleccionarMembresia = (membership) => {
    setMembresiaSelect(membership);
  };

  const handleSale = () => {
    // Aqui ira la logica para realiza la venta
    setSaleMade(1);
  };
  const activarVenta = clienteSeleccionado && membresiaSelect;

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
  const membresias = [
    {
      id: 1,
      nombre: "Mensual Básica",
      beneficios: ["Acceso al gimnasio", "Clases grupales"],
      duracion_dias: 30,
      precio: 500.0,
      disponible: true,
    },
    {
      id: 2,
      nombre: "Mensual Premium",
      beneficios: ["Acceso total", "Entrenador personal"],
      duracion_dias: 30,
      precio: 800.0,
      disponible: true,
    },
    {
      id: 3,
      nombre: "Anual Básica",
      beneficios: ["Acceso al gimnasio", "Clases grupales"],
      duracion_dias: 365,
      precio: 5000.0,
      disponible: false,
    },
    {
      id: 4,
      nombre: "Anual Premium",
      beneficios: ["Acceso total", "Entrenador personal"],
      duracion_dias: 365,
      precio: 8000.0,
      disponible: true,
    },
  ];
  return (
    <>
      {!saleMade ? (
        <div className="grid grid-cols-8 divide-x-2 ">
          <main className="col-span-5 pr-3">
            {!clienteSeleccionado && (
              <Costumers
                clientes={clientes}
                seleccionarCliente={seleccionarCliente}
              />
            )}
            {!membresiaSelect && clienteSeleccionado && (
              <Memberships
                membresias={membresias}
                seleccionarMembresia={seleccionarMembresia}
                formatoPrecio={formatoPrecio}
              />
            )}
            {activarVenta && (
              <div className="flex m-auto items-center w-80 h-full">
                <p className="text-lg font-normal ">
                  <span className="text-green-800 font-bold text-2xl">¡¡</span>{" "}
                  La venta está lista para realizarse, revisa los datos de la
                  derecha y presiona realizar venta si todo es correcto{" "}
                  <span className="text-green-800 font-bold text-2xl">!!</span>
                </p>
              </div>
            )}
          </main>
          <aside className="col-span-3 pl-3 grid gap-3">
            <h2>Detalles de la venta</h2>
            <div className="grid gap-1">
              <div className="flex">
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
                  <button
                    className="m-auto "
                    onClick={() => {
                      setClienteSeleccionado(null);
                    }}
                  >
                    <IoMdCloseCircle className="text-xl text-red-500" />
                  </button>
                )}
              </div>

              <div className="flex justify-between">
                <p className="text-base font-medium">Nombre:</p>
                {clienteSeleccionado ? (
                  <p className="text-base font-normal">
                    {clienteSeleccionado.nombre}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona cliente</p>
                )}
              </div>

              <div className="flex justify-between">
                <p className="text-base font-medium">Telefono:</p>
                {clienteSeleccionado ? (
                  <p className="text-base font-normal">
                    {clienteSeleccionado.telefono}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona cliente</p>
                )}
              </div>
              <div className="flex justify-between">
                <p className="text-base font-medium">Email:</p>
                {clienteSeleccionado ? (
                  <p className="text-base font-normal">
                    {clienteSeleccionado.email}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona cliente</p>
                )}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center">
                <h3
                  className={`flex-1 flex justify-between text-lg p-2  border-b-2 ${
                    membresiaSelect
                      ? "border-green-600 text-green-700"
                      : "border-gray-600 text-gray-700"
                  } `}
                >
                  <span
                    className={`rounded-full px-[10px] ring ${
                      membresiaSelect ? "ring-green-400" : "ring-gray-400"
                    }  `}
                  >
                    2
                  </span>
                  Membresia
                </h3>
                {membresiaSelect && (
                  <button
                    className="m-auto "
                    onClick={() => {
                      setMembresiaSelect(null);
                    }}
                  >
                    <IoMdCloseCircle className="text-xl text-red-500" />
                  </button>
                )}
              </div>

              <div className="flex justify-between">
                <p className="text-base font-medium">Tipo:</p>
                {membresiaSelect ? (
                  <p className="text-base font-normal">
                    {membresiaSelect.nombre}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona membresia</p>
                )}
              </div>

              <div className="flex justify-between">
                <p className="text-base font-medium">Duración en días:</p>
                {membresiaSelect ? (
                  <p className="text-base font-normal">
                    {membresiaSelect.duracion_dias}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona membresia</p>
                )}
              </div>

              <div className="flex justify-between">
                <p className="text-base font-medium">Precio:</p>
                {membresiaSelect ? (
                  <p className="text-base font-normal">
                    {formatoPrecio.format(membresiaSelect.precio)}
                  </p>
                ) : (
                  <p className="text-base font-normal">Selecciona membresia</p>
                )}
              </div>
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
      ) : (
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
            <p className="text-lg">Fecha vencimiento:</p>
            <p className="text-base font-normal">consulta correcta</p>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-lg">Total:</p>
            <p className="text-base font-normal">consulta correcta</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PointSellMembership;
