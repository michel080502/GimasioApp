import { HiSearchCircle } from "react-icons/hi";

import PropTypes from "prop-types";
import { useState } from "react";

const Clients = ({ clientes, seleccionarCliente }) => {
  const [busqueda, setBusqueda] = useState("");

  // FIltrar clientes segun el termino de busqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    [cliente.cliente_nombre, cliente.cliente_telefono].some((campo) =>
      campo.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const manejarCambio = (e) => {
    setBusqueda(e.target.value);
  };
  return (
    <>
      <h2 className="flex justify-between text-lg p-2 text-gray-600 ">
        Selecciona cliente para revisar estado de su membresia y dar acceso
      </h2>
      <div className=" border  rounded-lg ">
        <div className=" my-auto grid gap-2 p-2">
          <form className="flex " onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={manejarCambio}
              className="w-full text-sm p-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
            />
            <button className="inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300">
              <HiSearchCircle className="text-2xl" />
            </button>
          </form>
          <div className="grid grid-cols-4 gap-2 max-h-80 min-h-80 overflow-y-auto">
            {clientesFiltrados.map((item, index) => (
              <article
                key={index}
                className="border rounded-lg hover:border-gray-700 p-3 grid gap-2"
              >
                <div className="flex justify-between">
                  <p className="text-xs text-gray-600">{index + 1}</p>
                  <p
                    className={`text-sm 
                    ${
                      item.estado === "Activa"
                        ? "text-green-700"
                        : item.estado === "Vencida"
                        ? "text-red-700"
                        : item.estado === "Por vencer"
                        ? "text-yellow-600"
                        : "text-orange-600"
                    }`}
                  >
                    {item.estado}
                  </p>
                </div>

                <img
                  className={`w-24 h-24 p m-auto rounded-lg shadow-md ring 
                    ${
                      item.estado === "Activa"
                        ? "ring-green-700 shadow-green-700"
                        : item.estado === "Vencida"
                        ? "ring-red-700 shadow-red-700"
                        : item.estado === "Por vencer"
                        ? "ring-yellow-600 shadow-yellow-600"
                        : "ring-orange-600 shadow-orange-600"
                    }`}
                  src={item.cliente_img_secure_url}
                  alt={item.nombre}
                />
                <div className="text-sm ">
                  <p className="text-gray-600">Nombre:</p>
                  <p className="font-normal">{`${item.cliente_nombre} ${item.cliente_apellido_paterno} ${item.cliente_apellido_materno}`}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Telefono:</p>
                  <p className="font-normal">{item.cliente_telefono}</p>
                </div>
                <button
                  className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-black transform duration-300 m-auto"
                  onClick={() => {
                    seleccionarCliente(item);
                  }}
                >
                  Dar acceso
                </button>
              </article>
            ))}
            {clientesFiltrados.length == 0 && (
              <p className="col-span-4 text-center text-gray-500 m-auto">
                No se encontraron resultados o ya tiene membresia activa {":)"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Clients.propTypes = {
  clientes: PropTypes.arrayOf(
    PropTypes.shape({
      cliente_id: PropTypes.number.isRequired,
      cliente_nombre: PropTypes.string.isRequired,
      cliente_apellido_paterno: PropTypes.string,
      cliente_apellido_materno: PropTypes.string,
      cliente_img_secure_url: PropTypes.string,
      estado: PropTypes.string.isRequired,
      cliente_telefono: PropTypes.string.isRequired,
    })
  ),
  seleccionarCliente: PropTypes.func,
};

export default Clients;
