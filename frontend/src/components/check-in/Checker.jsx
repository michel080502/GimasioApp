import { BsArrowLeftCircleFill } from "react-icons/bs";

import Alerta from "../Alerta";
import Clients from "./Clients";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import ViewRenovacion from "../membresias/ModalRenovacion";

const Checker = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [externalVisit, setExternalVisit] = useState(null);
  const [isScaled, setIsScaled] = useState(false);
  const [renovar, setRenovar] = useState(null);
  const [clienteExterno, setClienteExterno] = useState("");
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const initSellVisitEx = () => {
    setExternalVisit((prev) => !prev);
  };
  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const handleSellVisit = (e) => {
    e.preventDefault();

    if (clienteExterno.trim() === "") {
      mostrarAlerta("No se pudo realizar la compra, falta el cliente", true);
    } else {
      mostrarAlerta("Venta realizada con exito, permite acceso", false);
    }
    setClienteExterno("");
    return;
  };

  const sellVisitClient = (id) => {
    if (id) {
      mostrarAlerta(
        "Venta realizada correctamente, permita acceso con visita",
        false
      );
      return;
    }
  };

  const closeModal = () => {
    setRenovar(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScaled((prev) => !prev); // cambia estado cada 5 seg
    }, 500);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  const { msg } = alerta;
  const clientes = [
    {
      id: 1,
      nombre: "Oliver Hernandez Sykes",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-123-4567",
      estado_membresia: "activa",
      fecha_compra_membresia: "2025-01-01",
      fecha_expiracion_membresia: "2025-12-31",
    },
    {
      id: 2,
      nombre: "Sophia Gonzalez Martinez",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-234-5678",
      estado_membresia: "vencida",
      fecha_compra_membresia: "2023-01-01",
      fecha_expiracion_membresia: "2023-12-31",
    },
    {
      id: 3,
      nombre: "Liam Smith Taylor",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-345-6789",
      estado_membresia: "7 días",
      fecha_compra_membresia: "2024-12-25",
      fecha_expiracion_membresia: "2025-01-08",
    },
    {
      id: 4,
      nombre: "Emma Johnson Brown",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-456-7890",
      estado_membresia: "vence hoy",
      fecha_compra_membresia: "2024-12-01",
      fecha_expiracion_membresia: "2025-01-12", // Fecha de hoy
    },
    {
      id: 5,
      nombre: "Noah Garcia Lopez",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-567-8901",
      estado_membresia: "activa",
      fecha_compra_membresia: "2025-01-01",
      fecha_expiracion_membresia: "2025-12-31",
    },
    {
      id: 6,
      nombre: "Ava Davis Williams",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-678-9012",
      estado_membresia: "vencida",
      fecha_compra_membresia: "2023-06-01",
      fecha_expiracion_membresia: "2024-05-31",
    },
    {
      id: 8,
      nombre: "Ethan Martinez Rodriguez",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-789-0123",
      estado_membresia: "7 días",
      fecha_compra_membresia: "2024-12-26",
      fecha_expiracion_membresia: "2025-01-02",
    },
    {
      id: 9,
      nombre: "Mia Hernandez Ramirez",
      img_secure_url: "https://via.placeholder.com/40",
      telefono: "555-890-1234",
      estado_membresia: "vence hoy",
      fecha_compra_membresia: "2024-12-01",
      fecha_expiracion_membresia: "2025-01-12", // Fecha de hoy
    },
  ];

  if (!renovar) {
    return (
      <div className="grid grid-cols-5 divide-x-2">
        <main className="col-span-3">
          {msg && <Alerta alerta={alerta} />}
          {externalVisit ? (
            <div className="p-2 grid gap-2 justify-center">
              <button
                className=" text-blue-800 hover:text-blue-900 transform duration-150"
                onClick={initSellVisitEx}
              >
                <BsArrowLeftCircleFill />
              </button>

              <p className="text-lg">Venta de visita a cliente externo</p>
              <p className="text-base font-normal">
                Ingresa el nombre del visitante
              </p>
              <form className="grid gap-2" onSubmit={handleSellVisit}>
                <label htmlFor="" className="text-base text-gray-600">
                  Nombre completo:
                </label>
                <input
                  type="text"
                  value={clienteExterno}
                  onChange={(e) => {
                    setClienteExterno(e.target.value);
                  }}
                  className="text-base p-1 border rounded-lg"
                  placeholder="Ingresa el nombre del cliente"
                />
                <button
                  type="submit"
                  className="bg-gray-700 text-xs text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                >
                  Realizar venta
                </button>
              </form>
              <p></p>
            </div>
          ) : (
            <Clients
              clientes={clientes}
              seleccionarCliente={seleccionarCliente}
            />
          )}
        </main>
        <aside className="col-span-2 border p-2 grid">
          {clienteSeleccionado ? (
            <div className="p-2 flex flex-col gap-4">
              <h3 className="text-lg">Informe de acceso del cliente</h3>
              <img
                className={`w-24 h-24 p mx-auto rounded-lg shadow-md ring 
                  ${
                    clienteSeleccionado.estado_membresia === "activa"
                      ? "ring-green-700 shadow-green-700"
                      : clienteSeleccionado.estado_membresia === "vencida"
                      ? "ring-red-700 shadow-red-700"
                      : clienteSeleccionado.estado_membresia === "7 días"
                      ? "ring-yellow-600 shadow-yellow-600"
                      : "ring-orange-600 shadow-orange-600"
                  }`}
                src="https://preview.redd.it/ryomen-sukuna-the-disgraced-one-killer-concept-if-you-have-v0-wejlwgmte6vd1.jpg?width=1080&crop=smart&auto=webp&s=0c808230a5770e41e5af48bfdcfc33437e215da3"
                alt={clienteSeleccionado.nombre}
              />
              <div className="relative border rounded-md shadow-md p-2">
                <p className="absolute top-[-13px] left-[2px] text-lg font-semibold bg-white px-2">
                  Cliente
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Nombre:</p>
                    <p className="text-base font-normal">
                      {clienteSeleccionado.nombre}
                    </p>
                  </div>
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Telefono:</p>
                    <p className="text-base font-normal">
                      {clienteSeleccionado.telefono}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative border rounded-md shadow-md p-2">
                <p className="absolute top-[-13px] left-[2px] text-lg font-semibold bg-white px-2">
                  Membresia
                </p>
                <div className="grid grid-cols-2">
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Fecha compra:</p>
                    <p className="text-base font-normal">
                      {format(
                        new Date(clienteSeleccionado.fecha_compra_membresia),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </p>
                  </div>
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Fecha expiración:</p>
                    <p className="text-base font-normal">
                      {format(
                        new Date(
                          clienteSeleccionado.fecha_expiracion_membresia
                        ),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </p>
                  </div>
                  <div className="p-1 flex items-center justify-center gap-4 col-span-2">
                    <p className="text-sm text-gray-700">Estado:</p>
                    <p
                      className={`text-base font-bold uppercase drop-shadow-lg
                        ${
                          clienteSeleccionado.estado_membresia === "activa"
                            ? "text-green-700 shadow-green-700"
                            : clienteSeleccionado.estado_membresia === "vencida"
                            ? "text-red-700 shadow-red-700"
                            : clienteSeleccionado.estado_membresia === "7 días"
                            ? "text-yellow-600 shadow-yellow-600"
                            : "text-orange-600 shadow-orange-600"
                        }`}
                    >
                      {`${clienteSeleccionado.estado_membresia}${
                        clienteSeleccionado.estado_membresia === "7 días"
                          ? " para vencer"
                          : clienteSeleccionado.estado_membresia === "vence hoy"
                          ? ", renueva ahora"
                          : ""
                      }`}
                    </p>
                  </div>
                </div>
              </div>
              {clienteSeleccionado.estado_membresia === "activa" ||
              clienteSeleccionado.estado_membresia === "7 días" ? (
                <div className="m-auto">
                  <button className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto">
                    Ingresar asistencia
                  </button>
                </div>
              ) : (
                <div className="m-auto flex gap-3">
                  <button
                    className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                    onClick={() => setRenovar(true)}
                  >
                    Renovar membresia
                  </button>
                  <button
                    className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                    onClick={() => {
                      sellVisitClient(clienteSeleccionado.id);
                    }}
                  >
                    Comprar visita
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="m-auto grid gap-2 h-20 justify-center text-center">
              <p
                className={`transform duration-500 text-blue-600 ${
                  isScaled ? "scale-125 " : "scale-100"
                }`}
              >
                ¡Aviso!
              </p>
              <p className="text-sm font-medium">
                Si el cliente no está registrado y quiere comprar una visita, de
                click abajo
              </p>
              <button
                className="text-xs bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto"
                onClick={initSellVisitEx}
              >
                Comprar visita
              </button>
            </div>
          )}
        </aside>
      </div>
    );
  } else {
    return <ViewRenovacion closeModal={closeModal} />;
  }
};

export default Checker;
