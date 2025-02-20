import { IoMdCloseCircle } from "react-icons/io";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import { useEffect, useState } from "react";
import Costumers from "./Costumers";
import Memberships from "./Memberships";
import clienteAxios from "../../../config/axios";

const PointSellMembership = () => {
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [membresiaSelect, setMembresiaSelect] = useState(null);
  const [saleMade, setSaleMade] = useState(false);
  const [saleResult, setSaleResult] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const seleccionarMembresia = (membership) => {
    setMembresiaSelect(membership);
  };

  const handleSale = async () => {
    try {
      const { data } = await clienteAxios.post("/compra/membresia", {
        id_cliente: clienteSeleccionado.cliente_id,
        id_membresia: membresiaSelect.id,
      });
      setAlerta({ msg: data.msg, error: false });
      setSaleResult(data.compra);
      setSaleMade(true);
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
    }
    // Aqui ira la logica para realiza la venta
  };
  const activarVenta = clienteSeleccionado && membresiaSelect;

  const formatoPrecio = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    const getClients = async () => {
      try {
        const { data } = await clienteAxios.get("/cliente/no-activos");
        setClientes(data);
      } catch (error) {
        console.log("error al obtener clientes", error);
        setClientes([]);
      }
      setLoading(false);
    };
    const getMemberships = async () => {
      try {
        const { data } = await clienteAxios.get("/membresia/");
        setMembresias(data);
      } catch (error) {
        console.error("No se pudieron obtener las membresias", error);
      }
    };
    getClients();
    getMemberships();
  }, []);

  if (loading) return <p>Cargando....</p>;
  return (
    <>
      {!saleMade ? (
        <div className="grid grid-cols-6 divide-x-2 ">
          <main className="col-span-4 pr-3 ">
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
              <div className="grid items-center justify-center m-auto text-center h-64 mt-20">
                <img className="w-40" src="/assets/carrito-listo.jpg" alt="" />
                <p className="text-sm">Venta lista para realizarse</p>
                <button
                  disabled={!activarVenta}
                  onClick={() => handleSale()}
                  className={`bg-gray-700 text-white px-2 py-1 rounded-lg text-sm m-auto ${
                    activarVenta ? "hover:bg-black transform duration-150" : ""
                  }`}
                >
                  Realizar venta
                </button>
              </div>
            )}
          </main>
          <aside className="col-span-2 pl-3 grid gap-3 w-80">
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
                    className={`rounded-full px-[10px]  ring ${
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
              {!clienteSeleccionado ? (
                <div className="h-40 text-base flex font-bold">
                  <p className="m-auto text-center">Selecciona cliente....</p>
                </div>
              ) : (
                <>
                  <img
                    className="w-20 m-auto rounded-md shadow-lg "
                    src={clienteSeleccionado.cliente_img_secure_url}
                    alt={clienteSeleccionado.cliente_nombre}
                  />
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Nombre:</p>

                    <p className="text-base font-normal">
                      {`${clienteSeleccionado.cliente_nombre} ${clienteSeleccionado.cliente_apellido_paterno} ${clienteSeleccionado.cliente_apellido_materno}`}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-base font-medium">Telefono:</p>

                    <p className="text-base font-normal">
                      {clienteSeleccionado.cliente_telefono}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Email:</p>

                    <p className="text-base font-normal">
                      {clienteSeleccionado.cliente_email}
                    </p>
                  </div>
                </>
              )}
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
              {!membresiaSelect ? (
                <div className="h-40 text-base flex font-bold">
                  <p className="m-auto text-center">Selecciona membresia....</p>
                </div>
              ) : (
                <div className="h-40 grid overflow-x-auto">
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Tipo:</p>
                    <p className="text-base font-normal">
                      {membresiaSelect.nombre}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-base font-medium">Beneficios:</p>
                    <ul>
                      {membresiaSelect.beneficios.map((item, index) => (
                        <li
                          className="list-disc text-sm font-normal"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-base font-medium">Duración en días:</p>
                    <p className="text-base font-normal">
                      {membresiaSelect.duracion_dias}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-base font-medium">Precio:</p>
                    <p className="text-base font-normal">
                      {formatoPrecio.format(membresiaSelect.precio)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <div
          className={`grid gap-2 p-2 rounded-lg bg-opacity-10 shadow-md ${
            alerta.error
              ? "bg-red-900   shadow-red-500"
              : " bg-green-900   shadow-green-500 "
          }`}
        >
          <h2
            className={`text-center ${
              alerta.error
                ? "text-red-800 underline decoration-red-500"
                : "text-green-800 underline decoration-green-500"
            }`}
          >
            {alerta.msg}
          </h2>
          <p className="text-sm font-normal">
            Informa al cliente el resultado de su compra y presiona en la X para
            salir
          </p>
          <div className="flex items-center justify-between ">
            <p className="text-sm text-gray-600">Cliente:</p>
            <p className="text-base font-semibold">{`${clienteSeleccionado.cliente_nombre} ${clienteSeleccionado.cliente_apellido_paterno} ${clienteSeleccionado.cliente_apellido_materno}`}</p>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-sm text-gray-600">Tipo de membresia:</p>
            <p className="text-base font-semibold">{membresiaSelect.nombre}</p>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-sm text-gray-600">Fecha compra:</p>
            <p className="text-base font-semibold">
              {format(new Date(saleResult.fecha_compra), "dd 'de' MMMM, yyyy", {
                locale: es,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-sm text-gray-600">Fecha vencimiento:</p>
            <p className="text-base font-semibold">
              {format(
                new Date(saleResult.fecha_expiracion),
                "dd 'de' MMMM, yyyy",
                {
                  locale: es,
                }
              )}
            </p>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-sm text-gray-600">Total:</p>
            <p className="text-base font-semibold">
              {formatoPrecio.format(membresiaSelect.precio)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PointSellMembership;
