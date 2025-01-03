import { MdDelete } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { HiSearchCircle } from "react-icons/hi";
import { BsEyeFill } from "react-icons/bs";

import MenuExport from "../ui/MenuExport";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import InformeVentaMembresia from "./InformeVentaMembresia";

const MembresiasVentas = () => {
  const [optionsExport, setOptionsExport] = useState(null);
  const [deleteVenta, setDeleteVenta] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModalVenta = (id) => {
    setActiveModal(id);
  };
  const closeModal = () => setActiveModal(null);
  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
  };
  const handleDownload = async () => {
    console.log("Descargando.....");
  };
  const handleSendReport = async () => {
    console.log("Enviando.....");
  };
  const toggleDelete = (id) => {
    setDeleteVenta(id);
  };
  const cancelDelete = () => {
    setDeleteVenta(null); // Cancelar la eliminación
  };

  const confirmDelete = () => {
    // Aquí puedes agregar la lógica para eliminar el cliente
    console.log(`Venta con id ${deleteVenta} eliminado.`);
    setDeleteVenta(null); // Reiniciar el estado
  };

  const datosSimulados = [
    {
      id: 1,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "Juan Pérez",
      telefono: "123-456-7890",
      precio: 499.99,
      tipoMembresia: "Premium",
      fechaCompra: "2023-11-01T10:00:00Z",
    },
    {
      id: 2,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "María García",
      telefono: "987-654-3210",
      precio: 299.99,
      tipoMembresia: "Básica",
      fechaCompra: "2023-10-15T14:30:00Z",
    },
    {
      id: 3,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "Carlos López",
      telefono: "555-123-4567",
      precio: 399.99,
      tipoMembresia: "Estándar",
      fechaCompra: "2023-09-20T09:15:00Z",
    },
    {
      id: 4,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "Ana Martínez",
      telefono: "444-555-6666",
      precio: 599.99,
      tipoMembresia: "VIP",
      fechaCompra: "2023-08-25T16:45:00Z",
    },
    {
      id: 5,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "Pedro Sánchez",
      telefono: "111-222-3333",
      precio: 199.99,
      tipoMembresia: "Básica",
      fechaCompra: "2023-07-30T12:00:00Z",
    },
    {
      id: 6,
      fotoCliente: "https://via.placeholder.com/150",
      nombreCliente: "Laura Herrera",
      telefono: "666-777-8888",
      precio: 699.99,
      tipoMembresia: "VIP",
      fechaCompra: "2023-06-18T08:30:00Z",
    },
  ];
  return (
    <>
      <main>
        <h1 className="text-2xl font-semibold">Membresias</h1>
        <div className="my-4 p-3 bg-white rounded-lg">
          <div className="p-2 grid md:grid-cols-5 gap-2 md:gap-5">
            <div className=" grid grid-cols-3 items-center md:flex  justify-between">
              <div className="col-span-2 gap-2 ">
                <h1 className="font-bold text-xl">Total de ventas</h1>
                <p>300</p>
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
                  placeholder="Buscar tipo membresia..."
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
                    Número de telefono
                  </th>

                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Tipo Membresia
                  </th>

                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Fecha de compra
                  </th>
                  <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>
                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
                {datosSimulados.map((venta, index) => (
                  <tr key={venta.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <img
                        src={venta.fotoCliente}
                        alt="Foto cliente"
                        className="w-10 h-10 rounded-full ring-2 ring-red-800 m-auto"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {venta.nombreCliente}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {venta.telefono}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {venta.tipoMembresia}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(
                        new Date(venta.fechaCompra),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${venta.precio.toFixed(2)}
                    </td>
                    <td className="px-6 flex gap-3 py-4 text-sm text-gray-700">
                      <button
                        className="text-cyan-500 hover:text-cyan-700 transition-colors duration-300"
                        onClick={() => openModalVenta(venta.id)}
                      >
                        <BsEyeFill className="text-3xl scale-hover" />
                      </button>
                      {activeModal === venta.id && (
                        <InformeVentaMembresia closeModal={closeModal} />
                      )}
                      <button
                        className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                        onClick={() => toggleDelete(venta.id)}
                      >
                        <MdDelete className="text-3xl scale-hover" />
                      </button>
                      {/* Muestra recuadro de confirmacion */}
                      {deleteVenta === venta.id && (
                        <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4   right-10">
                          <h1 className="text-lg font-semibold text-gray-700 mb-2">
                            ¿Seguro que deseas eliminar la venta de <br />
                            <span className="font-bold">
                              {venta.nombreCliente}
                            </span>
                            ?
                          </h1>
                          <div className="flex justify-between">
                            <button
                              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                              onClick={cancelDelete}
                            >
                              Cancelar
                            </button>
                            <button
                              className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
                              onClick={confirmDelete}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default MembresiasVentas;
