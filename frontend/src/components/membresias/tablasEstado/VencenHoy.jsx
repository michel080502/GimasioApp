import { FaFilter } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { BsPersonFillUp } from "react-icons/bs";
import { useState } from "react";
const VencenHoy = () => {
  const [deleteMembresia, setDeleteMembresia] = useState(false);
  const [updateMembership, setUpdateMembership] = useState(false);

  const toggleUpdate = () => setUpdateMembership(true);
  const toggleDelete = () => {
    setDeleteMembresia(true);
  };
  return (
    <>
      <div className="my-4 p-3 bg-white rounded-lg">
        <div className="p-2 grid md:grid-cols-4  md:gap-5">
          <div className=" grid grid-cols-3 items-center md:flex  justify-between">
            <div className="col-span-2 p-2">
              <h1 className=" font-bold text-xl">Vencen hoy</h1>
              <p className="text">Activa de nuevo hoy</p>
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
          <div className="hidden md:flex h-auto items-center text-lg">
            <button className="scale-hover-10 w-full gap-2 px-3 border-r-2 border-gray-900 flex  justify-center items-center hover:bg-zinc-600 hover:bg-opacity-20">
              <RiFileExcel2Fill /> Exportar
            </button>
            <button className="scale-hover-10 w-full gap-2 px-3 flex  justify-center items-center hover:bg-zinc-600 hover:bg-opacity-20">
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
              <tr key={1} className="hover:bg-gray-100 ">
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  <p>1</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 ">
                  <img
                    className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                    src={"/assets/proteina.jpg"}
                    alt="profile"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  <p>Hector Hernandez Rivera</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  <p>Basica</p>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  <p>20 de Marzo</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <p>20 de Abril</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <p>30</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <p>Hoy vence</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 h-full">
                  <div className="flex items-center justify-center gap-4 h-full">
                    <button
                      className="scale-hover text-indigo-500 hover:text-indigo-800 "
                      onClick={() => toggleUpdate()}
                    >
                      <BsPersonFillUp className="text-3xl" />
                    </button>
                    <button
                      className="scale-hover text-rose-500 hover:text-rose-700 "
                      onClick={() => {
                        toggleDelete();
                      }}
                    >
                      <MdDelete className="text-3xl" />
                    </button>
                    {/* Muestra recuadro para elegir renovacion */}
                    {updateMembership && (
                      <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg  z-10 p-4 top  right-10">
                        <button
                          className="absolute top-0 right-0 text-red-700 p-2 "
                          onClick={() => setUpdateMembership(false)}
                        >
                          <IoMdCloseCircle className="text-3xl" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-700 pt-6 mb-2">
                          ¿Que opcion deseas ejecutar para <br />
                          <span className="font-bold">usuario nombre</span>?
                        </h3>

                        <div className="flex justify-between gap-2">
                          <button
                            className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-800"
                            onClick={() => setDeleteMembresia(false)}
                          >
                            Actualizar ahora
                          </button>
                          <button
                            className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-800"
                            onClick={() => {
                              //   handleDelete();
                              //   setDeleteCliente(null);
                            }}
                          >
                            Elegir otra opcion
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Muestra recuadro de confirmacion eliminación */}
                    {deleteMembresia && (
                      <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4   right-10">
                        <h1 className="text-lg font-semibold text-gray-700 mb-2">
                          ¿Seguro que deseas eliminar a <br />
                          <span className="font-bold"></span>?
                        </h1>
                        <div className="flex justify-between">
                          <button
                            className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                            onClick={() => setDeleteMembresia(false)}
                          >
                            Cancelar
                          </button>
                          <button
                            className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
                            onClick={() => {
                              //   handleDelete();
                              //   setDeleteCliente(null);
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VencenHoy;
