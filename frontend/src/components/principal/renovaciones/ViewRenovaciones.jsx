import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { BsBootstrapReboot } from "react-icons/bs";

import { useState } from "react";
import MenuExport from "../../ui/MenuExport";
import ModalRenovacion from "../../membresias/ModalRenovacion";

const ViewRenovaciones = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [optionsExport, setOptionsExport] = useState(null);

  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
  };

  const handleDownload = async () => {
    console.log("Descargando.....");
  };
  const handleSendReport = async () => {
    console.log("Enviando.....");
  };

  const openModal = (id) => {
    setActiveModal(id); // Almacena el ID del elemento seleccionado
  };

  const closeModal = () => setActiveModal(null);
  return (
    <div className="px-4 grid gap-2">
      <h1 className="text-2xl font-bold">Membresias que vencen hoy</h1>
      <p>
        Hoy dejan de tener acceso los siguientes clientes, pidele que renueve
      </p>

      <div className="bg-white p-2 rounded-lg shadow-lg">
        <div className="p-2 grid md:grid-cols-5 gap-2 md:gap-5">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <div className="col-span-2 gap-2">
              <h1 className=" font-bold text-xl">Vencieron hoy</h1>
              <p>
                <span>30</span> membresias
              </p>
            </div>

            <div className="flex md:hidden w-full md:w-0 items-center">
              <button className="w-full m-2 bg-black rounded-lg text-white hover:bg-red-900  hover:scale-110 p-2 transition-all duration-300">
                <RiFileExcel2Fill className="m-auto text-2xl" />
              </button>
            </div>
          </div>

          <div className=" md:col-span-3 my-auto">
            <form className="flex">
              <input
                type="text"
                placeholder="Buscar usuario..."
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
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-xs ">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Foto cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Nombre cliente
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Telefono</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Tipo membresia
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Fecha de compra
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Acciones rapidas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
              <tr key={1} className="hover:bg-gray-100 ">
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>1</p>
                </td>

                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm  text-gray-700">
                  <button
                    className="text-blue-400 hover:text-blue-700 transition-colors duration-300"
                    onClick={() => openModal(1)}
                  >
                    <BsBootstrapReboot className="text-3xl" />
                  </button>
                  {/* MODAL RENOVACION */}
                  {activeModal === 1 && ( // Verifica si el modal es para este item
                    <ModalRenovacion closeModal={closeModal} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewRenovaciones;
