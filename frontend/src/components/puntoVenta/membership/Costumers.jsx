import { HiSearchCircle } from "react-icons/hi";

import PropTypes from "prop-types";
import { useState } from "react";

const Costumers = ({ clientes, seleccionarCliente }) => {
  const [busqueda, setBusqueda] = useState("");

  // FIltrar clientes segun el termino de busqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    [cliente.cliente_nombre, cliente.cliete_telefono, cliente.cliente_email].some((campo) =>
      campo.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const manejarCambio = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <>
      <h2 className="flex justify-between text-lg p-2 text-gray-600 ">
        <span className="rounded-full px-[9px] ring ring-gray-400 ">1</span>
        Selecciona cliente
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
            <button
              type="submit"
              className="inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
            >
              <HiSearchCircle className="text-2xl" />
            </button>
          </form>
          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
            {clientesFiltrados.map((item, index) => (
              <article
                key={index}
                className="border rounded-lg hover:border-gray-700 p-3 grid gap-2"
              >
                <div className="rounded-full w-6 h-6 text-center border border-gray-700 ">
                  <p className="text-sm">{index + 1}</p>
                </div>
                <img
                  className="w-24 h-24 p m-auto rounded-lg shadow-lg"
                  src={item.cliente_img_secure_url}
                  alt=""
                />
                <div className="text-sm">
                  <p>Nombre:</p>
                  <p className="font-normal">{`${item.cliente_nombre} ${item.cliente_apellido_paterno} ${item.cliente_apellido_materno}`}</p>
                </div>
                <div className="text-sm">
                  <p>Telefono:</p>
                  <p className="font-normal">{item.cliente_telefono}</p>
                </div>
                <button
                  className="bg-gray-700 text-sm text-white p-2 rounded-lg hover:bg-black transform duration-200 m-auto"
                  onClick={() => {
                    seleccionarCliente(item);
                  }}
                >
                  Seleccionar
                </button>
              </article>
            ))}
            {clientesFiltrados.length == 0 && (
              <p className="col-span-4 text-center text-gray-500">
                No se encontraron resultados o ya tiene membresia activa {":)"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Costumers.propTypes = {
  clientes: PropTypes.arrayOf(
    PropTypes.shape({
      cliente_id: PropTypes.number.isRequired,
      cliente_nombre: PropTypes.string.isRequired,
      cliente_apellido_paterno: PropTypes.string,
      cliente_apellido_materno: PropTypes.string,
      cliente_telefono: PropTypes.string.isRequired,
      cliente_email: PropTypes.string.isRequired,
      cliente_img_secure_url: PropTypes.string,
    })
  ),
  seleccionarCliente: PropTypes.func,
};

export default Costumers;
