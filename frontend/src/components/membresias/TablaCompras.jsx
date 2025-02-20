import { FaFilter } from "react-icons/fa";
import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { BsBootstrapReboot } from "react-icons/bs";

import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import PropTypes from "prop-types";
import MenuExport from "../ui/MenuExport";
import Modal from "../Modal";
import Alerta from "../Alerta";

import ModalRenovacion from "./ModalRenovacion";

import { useState } from "react";
import { exportDataToExcel } from "../../utils/exportDataToExcel";

const TablaCompras = ({ tipo, purchaseMembership }) => {
  const [renewalClient, setRenewalClient] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [deleteMembresia, setDeleteMembresia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [optionsExport, setOptionsExport] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [membresiaFiltro, setMembresiaFiltro] = useState("");
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const openModal = (item) => {
    setRenewalClient(item);
    setActiveModal(item.compra_id); // Almacena el ID del elemento seleccionado
  };

  const closeModal = () => {
    setActiveModal(null);
    setRenewalClient(null);
  };

  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
    setFilterOptions(null);
  };

  const toggleFilterOptions = () => {
    setFilterOptions((prev) => !prev);
    setOptionsExport(null);
  };

  const handleMembresiaFiltro = (filtro) => {
    setMembresiaFiltro((prev) => (prev === filtro ? "" : filtro));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  /// Filtrar datos según el tipo seleccionado
  const filtrados = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return purchaseMembership
      .filter((item) => {
        if (tipo === "Activas") return item.estado === "Activa";
        if (tipo === "Proximas a vencer") return item.estado === "Por vencer";
        if (tipo === "Vencen hoy") return item.estado === "Vence hoy";
        if (tipo === "Vencidas") return item.estado === "Vencida";
        return true; // No hay filtro por tipo, incluir todos
      })
      .filter((item) => {
        // Filtro por membresiaFiltro
        if (membresiaFiltro && membresiaFiltro.length > 0) {
          return membresiaFiltro.includes(item.membresia_nombre);
        }
        return true; // No hay filtro de membresía, incluir todos
      })
      .filter((item) =>
        [
          item.cliente_nombre.toLowerCase(),
          item.cliente_apellido_paterno.toLowerCase(),
          item.cliente_apellido_materno.toLowerCase(),
        ].some((campo) => campo.includes(lowerSearchTerm))
      );
  };

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

  const headers = [
    "#",
    "Nombre cliente",
    "Tipo membresia",
    "Fecha de compra",
    "Fecha de expiración",
    "Días restantes",
    "Estado membresia",
  ];

  const generateExcelData = (data) => {
    return data.map((item, index) => ({
      "#": index + 1,
      Nombre_cliente: `${item.cliente_nombre} ${item.cliente_apellido_materno} ${item.cliente_apellido_materno}`,
      Tipo_membresia: item.membresia_nombre,
      Fecha_de_compra: format(
        new Date(item.fecha_compra),
        "dd 'de' MMMM, yyyy",
        { locale: es }
      ),
      Fecha_de_expiracion: format(
        new Date(item.fecha_expiracion),
        "dd 'de' MMMM, yyyy",
        { locale: es }
      ),
      Dias_restantes: item.dias_restantes,
      Estado: item.estado,
    }));
  };

  const handleDownload = async () => {
    if (filtrados().length === 0) {
      return mostrarAlerta("No hay datos para exportar", true);
    }
    exportDataToExcel(
      generateExcelData(filtrados()),
      headers,
      `reporte_membresias_clientes_${tipo || ""}`,
      "download"
    );
    return mostrarAlerta("Reporte descargado", false);
  };
  const handleSendReport = async () => {
    if (filtrados().length === 0) {
      return mostrarAlerta("No hay datos para exportar", true);
    }
    exportDataToExcel(
      generateExcelData(filtrados()),
      headers,
      `reporte_membresias_clientes_${tipo || ""}`,
      "send"
    );
    return mostrarAlerta("Reporte enviado", false);
  };

  const { msg } = alerta;
  return (
    <>
      <div className="my-4 p-1 bg-white rounded-lg">
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
                value={searchTerm}
                onChange={handleSearch}
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
              onClick={toggleFilterOptions}
              className="scale-hover-10 gap-3 rounded-lg px-3 py-1 bg-black flex text-white justify-center items-center hover:bg-red-600"
            >
              <FaFilter />
              Filtro
            </button>
            {filterOptions && (
              <div className="absolute top-56 mt-40 -mr-24  border bg-gray-200  rounded shadow-lg w-48 z-10 flex flex-col divide-y divide-gray-400 text-base">
                {[
                  ...new Set( // Creamos un conjunto unico de nombres SET() o sea que no muestrta duplicados y luego se convierte a arreglo con ...new
                    purchaseMembership.map((item) => item.membresia_nombre)
                  ),
                ].map((nombre, index) => (
                  <button
                    key={index}
                    onClick={() => handleMembresiaFiltro(nombre)}
                    className={`p-2 hover:bg-gray-300 ${
                      membresiaFiltro === nombre ? "bg-gray-300" : ""
                    } text-left`}
                  >
                    {nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className=" relative overflow-x-auto">
          {msg && <Alerta alerta={alerta} />}
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
              {filtrados().length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-3 text-gray-600">
                    No hay datos para mostrar o tienes algun filtro activo
                  </td>
                </tr>
              ) : (
                <>
                  {filtrados().map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 ">
                      <td className="px-3 py-2 text-sm font-semibold text-gray-700">
                        <p>{index + 1}</p> {/* Número de fila */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 ">
                        <img
                          className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                          src={item.cliente_img_secure_url}
                          alt="profile"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm  text-gray-700">
                        <p>{`${item.cliente_nombre} ${item.cliente_apellido_paterno} ${item.cliente_apellido_materno}`}</p>
                      </td>
                      <td className="px-3 py-2 text-sm  text-gray-700">
                        <p>{item.membresia_nombre}</p> {/* Tipo de membresía */}
                      </td>
                      <td className="px-3 py-2 text-sm  text-gray-700">
                        <p>
                          {format(
                            new Date(item.fecha_compra),
                            "dd 'de' MMMM, yyyy",
                            { locale: es }
                          )}
                        </p>{" "}
                        {/* Fecha de compra */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <p>
                          {format(
                            new Date(item.fecha_expiracion),
                            "dd 'de' MMMM, yyyy",
                            { locale: es }
                          )}
                        </p>{" "}
                        {/* Fecha de expiración (ajústala según sea necesario) */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <p>{item.dias_restantes}</p>{" "}
                        {/* Días restantes (ajústalo según sea necesario) */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        <p>{item.estado}</p> {/* Estado */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 h-full">
                        <div className="flex items-center justify-center gap-4 h-full">
                          {/* Botón Renovar */}
                          {(item.estado === "Vencida" ||
                            item.estado === "Vence hoy") && (
                            <button
                              className="text-blue-400 hover:text-blue-700 transition-colors duration-300"
                              onClick={() => openModal(item)} // Abre modal solo para este item
                            >
                              <BsBootstrapReboot className="text-3xl" />
                            </button>
                          )}
                          {/* MODAL RENOVACION */}
                          {activeModal === item.compra_id && ( // Verifica si el modal es para este item
                            <Modal closeModal={closeModal}>
                              <ModalRenovacion
                                closeModal={closeModal}
                                renewalClient={renewalClient}
                              />
                            </Modal>
                          )}

                          <button
                            className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                            onClick={() => {
                              toggleDelete(item.compra_id);
                            }}
                          >
                            <MdDelete className="text-3xl" />
                          </button>

                          {/* Muestra recuadro de confirmacion */}
                          {deleteMembresia === item.compra_id && (
                            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4 right-10">
                              <h1 className="text-base font-semibold text-gray-700 mb-2">
                                ¿Seguro que deseas eliminar la compra de
                                membresia de
                                <span className="font-bold">
                                  {" "}
                                  {item.cliente_nombre}
                                </span>
                                ?
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
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

TablaCompras.propTypes = {
  tipo: PropTypes.string,
  purchaseMembership: PropTypes.arrayOf(
    PropTypes.shape({
      compra_id: PropTypes.number,
      cliente_id: PropTypes.number,
      cliente_nombre: PropTypes.string,
      cliente_apellido_paterno: PropTypes.string,
      cliente_apellido_materno: PropTypes.string,
      cliente_img_secure_url: PropTypes.string,
      membresia_id: PropTypes.number,
      membresia_nombre: PropTypes.string,
      fecha_compra: PropTypes.string,
      fecha_expiracion: PropTypes.string,
      dias_restantes: PropTypes.string,
      estado: PropTypes.string,
    })
  ),
};

export default TablaCompras;
