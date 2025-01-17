import { useState } from "react";
import useSocket from "../../hooks/useSocket"; // Importa el hook
import clienteAxios from "../../config/axios";
import PropTypes from "prop-types";

import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español

import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ConfirmDialogDelete from "../ui/confirmDialogDelete";
import MenuExport from "../ui/MenuExport";
import { exportDataToExcel } from "../../utils/exportDataToExcel";

const TablaClientes = ({ clientes, setClientes, openModal }) => {
  const [deleteCliente, setDeleteCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsExport, setOptionsExport] = useState(null);

  // Combinar filtros de búsqueda y estado
  const filteredClientes = clientes.filter((cliente) => {
    // Filtro de búsqueda
    return `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno} ${cliente.matricula} ${cliente.telefono}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
  };

  // Definir los encabezados fuera de las funciones
  const headers = [
    "#",
    "Nombre",
    "Apellido Paterno",
    "Apellido Materno",
    "Matrícula",
    "Teléfono",
    "Email",
  ];

  const generateExcelData = (filteredClientes) => {
    return filteredClientes.map((cliente, index) => ({
      "#": index + 1,
      Nombre: cliente.nombre,
      Apellido_Paterno: cliente.apellido_paterno,
      Apellido_Materno: cliente.apellido_materno,
      Matrícula: cliente.matricula,
      Teléfono: cliente.telefono,
      Email: cliente.email,
    }));
  };

  const handleDownload = async () => {
    exportDataToExcel(generateExcelData(filteredClientes), headers, "reportes_clientes", "download")
  };

  const handleSendReport = async () => {
    exportDataToExcel(generateExcelData(filteredClientes), headers, "reportes_clientes", "send")
  };

  const handleNewClient = (nuevoCliente) => {
    setClientes((prevClientes) => {
      // Solo agregar si no está ya en la lista
      if (!prevClientes.some((cliente) => cliente.id === nuevoCliente.id)) {
        // Añadir la propiedad "animating" al nuevo cliente
        return [{ ...nuevoCliente, animating: true }, ...prevClientes];
      }
      return prevClientes;
    });
  };

  // Escuchar el evento "nuevo-cliente" mediante el hook
  useSocket({
    "nuevo-cliente": handleNewClient, // Agregar el nuevo cliente a la lista
  });

  const toggleDelete = (id) => {
    setDeleteCliente(deleteCliente === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await clienteAxios.delete(`/cliente/delete/${id}`);
      console.log(data.msg);
      setClientes(clientes.filter((cliente) => cliente.id !== id)); // Actualiza la lista
    } catch (error) {
      console.log("Error al eliminar cliente:", error);
    }
  };

  return (
    <div className="my-4 p-3 bg-white rounded-lg">
      <div className="p-2 grid md:grid-cols-5 md:gap-5 items-center">
        <div className=" grid grid-cols-3 md:flex   justify-between">
          <div className="col-span-2 p-2  ">
            <h1 className="font-bold text-xl">Todos los clientes</h1>
          </div>

          <div className="flex md:hidden w-full md:w-0 items-center">
            <button className="w-full m-2 bg-black rounded-lg text-white hover:bg-red-900  hover:scale-110 p-2 transition-all duration-300">
              <RiFileExcel2Fill className="m-auto text-2xl" />
            </button>
          </div>
        </div>
        <div className="md:col-span-3">
          <form className="flex">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
            />
            <button
              type="button"
              className=" inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
            >
              <HiSearchCircle className="text-2xl" />
            </button>
          </form>
        </div>
        <div className="hidden md:flex justify-center divide-x-4 h-auto items-center ">
          <button
            onClick={toggleOptionsExport}
            type="button"
            className="scale-hover-10 gap-3 rounded-lg px-3 py-1 bg-black flex text-white justify-center items-center hover:bg-red-600"
          >
            <RiFileExcel2Fill /> Exportar
          </button>
          {/* Recuadro con opciones de exportación */}
          {optionsExport && (
            <MenuExport
              onDownload={handleDownload}
              onSendReport={handleSendReport}
            />
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-300 ">
          <thead className="bg-gray-100 text-sm ">
            <tr className="text-center">
              <th className="px-5 py-2 text-gray-700 uppercase">#</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Foto</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Nombre</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Telefono</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Nacimiento</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Email</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Matricula</th>
              <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center items-center">
            {filteredClientes.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-4 text-center text-gray-600 text-lg font-semibold"
                >
                  No hay datos que mostrar.
                </td>
              </tr>
            ) : (
              filteredClientes.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  className={`hover:bg-gray-100 ${
                    cliente.animating ? "bg-green-300 animate-fadeIn" : ""
                  }`}
                  onAnimationEnd={() => {
                    // Después de que termine la animación, quitamos la propiedad animating
                    setClientes((prevClientes) =>
                      prevClientes.map((cl) =>
                        cl.id === cliente.id ? { ...cl, animating: false } : cl
                      )
                    );
                  }}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 ">
                    <img
                      className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                      src={cliente.img_secure_url}
                      alt="profile"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {cliente.nombre} {cliente.apellido_paterno}{" "}
                    {cliente.apellido_materno}
                  </td>
                  <td
                    className={`px-6 bg-opacity-30 py-4 text-sm font-semibold text-gray-700`}
                  >
                    {cliente.telefono}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  {format(
                        new Date(cliente.nacimiento),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {cliente.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {cliente.matricula}
                  </td>
                  <td className="px-6 py-4 text-sm h-full">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <button
                        className=" text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                        onClick={() => {
                          openModal("editar", cliente.id);
                        }}
                      >
                        <FaUserEdit className="text-3xl" />
                      </button>
                      <button
                        className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                        onClick={() => {
                          toggleDelete(cliente.id);
                        }}
                      >
                        <MdDelete className="text-3xl" />
                      </button>
                      {deleteCliente === cliente.id && (
                        <ConfirmDialogDelete
                          message={`¿Seguro que deseas eliminar a ${cliente.nombre} ${cliente.apellido_paterno}?`}
                          onCancel={() => setDeleteCliente(null)}
                          onConfirm={() => handleDelete(cliente.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TablaClientes.propTypes = {
  openModal: PropTypes.func,
  clientes: PropTypes.array,
  setClientes: PropTypes.func,
  filterType: PropTypes.string,
};

export default TablaClientes;
