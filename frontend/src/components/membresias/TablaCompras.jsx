import { FaFilter } from "react-icons/fa";
import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { BsBootstrapReboot } from "react-icons/bs";

import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import PropTypes from "prop-types";
import MenuExport from "../ui/MenuExport";
import ModalRenovacion from "./ModalRenovacion";

import { useState } from "react";
const TablaCompras = ({ tipo }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [deleteMembresia, setDeleteMembresia] = useState(null);

  const [optionsExport, setOptionsExport] = useState(null);
  const handleDownload = async () => {
    console.log("Descargando.....");
  };
  const handleSendReport = async () => {
    console.log("Enviando.....");
  };
  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
  };
  const openModal = (id) => {
    setActiveModal(id); // Almacena el ID del elemento seleccionado
  };

  const closeModal = () => setActiveModal(null);
  const datos = [
    {
      id: 1,
      nombre: "Juan Perez Rojas",
      membresia: "Básica",
      estado: "activa",
      fechaCompra: "2023-11-01",
      fechaExpiracion: "2024-01-01",
      diasRestantes: 30,
    },
    {
      id: 2,
      nombre: "Ana Gomez Cervantes",
      membresia: "Premium",
      estado: "por vencer",
      fechaCompra: "2023-10-15",
      fechaExpiracion: "2023-12-28",
      diasRestantes: 10,
    },
    {
      id: 3,
      nombre: "Luis Uribe Barona",
      membresia: "Semanal",
      estado: "vence hoy",
      fechaCompra: "2023-12-08",
      fechaExpiracion: "2023-12-15",
      diasRestantes: 0,
    },
    {
      id: 4,
      nombre: "Juan Picapiedra",
      membresia: "Estudiante-Pro",
      estado: "vencida",
      fechaCompra: "2023-10-01",
      fechaExpiracion: "2023-12-01",
      diasRestantes: -15,
    },
    {
      id: 5,
      nombre: "Maria Lopez Garcia",
      membresia: "Avanzada",
      estado: "activa",
      fechaCompra: "2023-09-10",
      fechaExpiracion: "2024-03-10",
      diasRestantes: 75,
    },
    {
      id: 6,
      nombre: "Carlos Martinez Fernandez",
      membresia: "Básica",
      estado: "por vencer",
      fechaCompra: "2023-09-20",
      fechaExpiracion: "2023-12-30",
      diasRestantes: 5,
    },
    {
      id: 7,
      nombre: "Paula Ramirez Ortiz",
      membresia: "Premium",
      estado: "vence hoy",
      fechaCompra: "2023-12-01",
      fechaExpiracion: "2023-12-15",
      diasRestantes: 0,
    },
    {
      id: 8,
      nombre: "Fernando García Muñoz",
      membresia: "Semanal",
      estado: "vencida",
      fechaCompra: "2023-11-15",
      fechaExpiracion: "2023-12-01",
      diasRestantes: -20,
    },
  ];

  // Filtrar datos según el tipo seleccionado
  const filtrados = datos.filter((item) => {
    if (tipo === "Activas") return item.estado === "activa";
    if (tipo === "Proximas a vencer") return item.estado === "por vencer";
    if (tipo === "Vencen hoy") return item.estado === "vence hoy";
    if (tipo === "Vencidas") return item.estado === "vencida";
    return true;
  });

  const toggleDelete = (id) => {
    setDeleteMembresia(id); // Guardar el ID del cliente a eliminar
  };

  const cancelDelete = () => {
    setDeleteMembresia(null); // Cancelar la eliminación
  };

  const confirmDelete = () => {
    // Aquí puedes agregar la lógica para eliminar el cliente
    console.log(`Cliente con ID ${deleteMembresia} eliminado.`);
    setDeleteMembresia(null); // Reiniciar el estado
  };
  return (
    <>
      <div className="my-4 p-3 bg-white rounded-lg">
        <div className="p-2 grid md:grid-cols-4  md:gap-5">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <div className="col-span-2 p-2">
              <h1 className="  font-bold text-xl">{tipo}</h1>
            </div>

            <div className="flex md:hidden w-full md:w-0 items-center">
              <button className="w-full p-1 hover:bg-slate-900 hover:bg-opacity-25 hover:scale-125 transition-all duration-300">
                <RiFileExcel2Fill className="m-auto text-2xl " />
              </button>
              <button className="w-full p-1 hover:bg-slate-900 hover:bg-opacity-25 hover:scale-125 transition-all duration-300">
                <FaFilter className="m-auto text-2xl" />
              </button>
            </div>
          </div>

          <div className=" md:col-span-2 my-auto">
            <form className="flex">
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
              />
              <button
                type="submit"
                className=" inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
              >
                <HiSearchCircle className="text-2xl" />
              </button>
            </form>
          </div>
          <div className="hidden md:flex gap-4 justify-center h-auto items-center ">
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
            <button
              type="button"
              className="scale-hover-10 gap-3 rounded-lg px-3 py-1 bg-black flex text-white justify-center items-center hover:bg-red-600"
            >
              <FaFilter />
              Filtro
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300 ">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Foto cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Tipo membresia
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Fecha de compra
                </th>

                <th className="px-5 py-2 text-gray-700 uppercase">
                  Fecha de expiración
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Días restantes
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Estado</th>

                <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center font-semibold items-center">
              {filtrados.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100 ">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    <p>{index + 1}</p> {/* Número de fila */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 ">
                    <img
                      className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                      src={"/assets/proteina.jpg"}
                      alt="profile"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>{item.nombre}</p> {/* Nombre del cliente */}
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>{item.membresia}</p> {/* Tipo de membresía */}
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <p>
                      {format(
                        new Date(item.fechaCompra),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </p>{" "}
                    {/* Fecha de compra */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>
                      {format(
                        new Date(item.fechaExpiracion),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </p>{" "}
                    {/* Fecha de expiración (ajústala según sea necesario) */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{item.diasRestantes}</p>{" "}
                    {/* Días restantes (ajústalo según sea necesario) */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{item.estado}</p> {/* Estado */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 h-full">
                    <div className="flex items-center justify-center gap-4 h-full">
                      {/* Botón Renovar */}
                      {(item.estado === "vencida" ||
                        item.estado === "vence hoy") && (
                        <button
                          className="text-blue-400 hover:text-blue-700 transition-colors duration-300"
                          onClick={() => openModal(item.id)} // Abre modal solo para este item
                        >
                          <BsBootstrapReboot className="text-3xl" />
                        </button>
                      )}
                      {/* MODAL RENOVACION */}
                      {activeModal === item.id && ( // Verifica si el modal es para este item
                        <ModalRenovacion closeModal={closeModal} />
                      )}

                      <button
                        className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                        onClick={() => {
                          toggleDelete(item.id);
                        }}
                      >
                        <MdDelete className="text-3xl" />
                      </button>

                      {/* Muestra recuadro de confirmacion */}
                      {deleteMembresia === item.id && (
                        <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4 right-10">
                          <h1 className="text-base font-semibold text-gray-700 mb-2">
                            ¿Seguro que deseas eliminar la compra de membresia
                            de <br />
                            <span className="font-bold">{item.nombre}</span>?
                          </h1>
                          <div className="flex justify-between">
                            <button
                              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                              onClick={cancelDelete} // Cancelar eliminación
                            >
                              Cancelar
                            </button>
                            <button
                              className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
                              onClick={confirmDelete} // Confirmar eliminación
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

TablaCompras.propTypes = {
  tipo: PropTypes.string,
};

export default TablaCompras;
