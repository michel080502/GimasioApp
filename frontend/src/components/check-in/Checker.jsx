import { BsArrowLeftCircleFill } from "react-icons/bs";

import Alerta from "../Alerta";
import Clients from "./Clients";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import clienteAxios from "../../config/axios";
import ModalRenovacion from "../membresias/ModalRenovacion";
const Checker = () => {
  const [clientes, setClientes] = useState([]);
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
  useEffect(() => {
    const getClients = async () => {
      try {
        const { data } = await clienteAxios.get("/membresia/clientes");
        setClientes(data);
      } catch (error) {
        console.log("Error al obtener la membresia", error);
        setClientes([]);
      }
    };
    getClients();
  }, []);
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
                    clienteSeleccionado.estado_membresia === "Activa"
                      ? "ring-green-700 shadow-green-700"
                      : clienteSeleccionado.estado_membresia === "Vencida"
                      ? "ring-red-700 shadow-red-700"
                      : clienteSeleccionado.estado_membresia === "Por vencer"
                      ? "ring-yellow-600 shadow-yellow-600"
                      : "ring-orange-600 shadow-orange-600"
                  }`}
                src={clienteSeleccionado.cliente_img_secure_url}
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
                      {`${clienteSeleccionado.cliente_nombre} ${clienteSeleccionado.cliente_apellido_paterno} ${clienteSeleccionado.cliente_apellido_materno}`}
                    </p>
                  </div>
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Telefono:</p>
                    <p className="text-base font-normal">
                      {clienteSeleccionado.cliente_telefono}
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
                        new Date(clienteSeleccionado.fecha_compra),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </p>
                  </div>
                  <div className="p-1">
                    <p className="text-sm text-gray-700">Fecha expiración:</p>
                    <p className="text-base font-normal">
                      {format(
                        new Date(clienteSeleccionado.fecha_expiracion),
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
                          clienteSeleccionado.estado === "Activa"
                            ? "text-green-700 shadow-green-700"
                            : clienteSeleccionado.estado === "Vencida"
                            ? "text-red-700 shadow-red-700"
                            : clienteSeleccionado.estado === "Por vencer"
                            ? "text-yellow-600 shadow-yellow-600"
                            : "text-orange-600 shadow-orange-600"
                        }`}
                    >
                      {`${clienteSeleccionado.estado}`}
                    </p>
                  </div>
                </div>
              </div>
              {clienteSeleccionado.estado === "Activa" ||
              clienteSeleccionado.estado === "Por vencer" ? (
                <div className="m-auto">
                  <button className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto">
                    Ingresar asistencia
                  </button>
                </div>
              ) : (
                <div className="m-auto flex gap-3">
                  <button
                    className="bg-gray-700 text-sm text-white py-1 px-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                    onClick={() => setRenovar(clienteSeleccionado)}
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
    return (
 
        <ModalRenovacion
          closeModal={closeModal}
          renewalClient={clienteSeleccionado}
        />
    
    );
  }
};

export default Checker;
