import { MdDelete } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { HiSearchCircle } from "react-icons/hi";
import { BsEyeFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

import MenuExport from "../ui/MenuExport";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import InformeVentaMembresia from "./InformeVentaMembresia";
import clienteAxios from "../../config/axios";
import Alerta from "../Alerta";
import { exportDataToExcel } from "../../utils/exportDataToExcel";

const MembresiasVentas = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseMembership, setPurchaseMembership] = useState([]);
  const [purchaseSelected, setPurchaseSelected] = useState(null);
  const [optionsExport, setOptionsExport] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [deleteVenta, setDeleteVenta] = useState(false);
  const [membresiaFiltro, setMembresiaFiltro] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };

  const openModalVenta = (purchase) => {
    setActiveModal(purchase.compra_id), setPurchaseSelected(purchase);
  };
  const closeModal = () => setActiveModal(null);

  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
    setFilterOptions(null);
  };
  const toggleFilterOptions = () => {
    setFilterOptions((prev) => !prev);
    setOptionsExport(null);
  };
  const handleMembresiaFiltro = (filtro) => {
    setMembresiaFiltro((prev) => (prev === filtro ? 0 : filtro));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filtroData = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return purchaseMembership
      .filter((item) => {
        // Filtro por membresiaFiltro
        if (membresiaFiltro && membresiaFiltro > 0) {
          const mesCompra = new Date(item.fecha_compra).getMonth() + 1;
          return mesCompra === membresiaFiltro;
        }
        return true; // No hay filtro de membresía, incluir todos
      })
      .filter((item) =>
        [
          item.cliente_nombre.toLowerCase(),
          item.cliente_apellido_paterno.toLowerCase(),
          item.cliente_apellido_materno.toLowerCase(),
          item.cliente_telefono,
          item.membresia_nombre.toLowerCase(),
        ].some((campo) => campo.includes(lowerSearchTerm))
      );
  };

  const headers = [
    "#",
    "Nombre cliente",
    "Numero telefono",
    "Tipo membresia",
    "Fecha de compra",
    "Hora compra",
    "Fecha expiracion",
    "Precio",
  ];

  const generateExcelData = (data) => {
    return data.map((item, index) => ({
      "#": index + 1,
      Nombre_cliente: `${item.cliente_nombre} ${item.cliente_apellido_materno} ${item.cliente_apellido_materno}`,
      Numero_cliente: item.cliente_telefono,
      Tipo_membresia: item.membresia_nombre,
      Fecha_de_compra: format(
        new Date(item.fecha_compra),
        "dd 'de' MMMM, yyyy",
        { locale: es }
      ),
      Hora_compra: format(new Date(item.fecha_compra), "hh:mm a", {
        locale: es,
      }),
      Fecha_expiracion: format(
        new Date(item.fecha_expiracion),
        "dd 'de' MMMM, yyyy",
        { locale: es }
      ),
      Precio: item.membresia_precio,
    }));
  };

  const handleDownload = async () => {
    if (filtroData().length === 0) {
      return mostrarAlerta("No hay datos para exportar", true);
    }
    exportDataToExcel(
      generateExcelData(filtroData()),
      headers,
      `reporte_ventas_membresia${membresiaFiltro || ""}`,
      "download"
    );
    return mostrarAlerta("Reporte descargado", false);
  };
  const handleSendReport = async () => {
    if (filtroData().length === 0) {
      return mostrarAlerta("No hay datos para exportar", true);
    }
    exportDataToExcel(
      generateExcelData(filtroData()),
      headers,
      `reporte_ventas_membresia${membresiaFiltro || ""}`,
      "send"
    );
    return mostrarAlerta("Reporte enviado", false);
  };
  const toggleDelete = (id) => {
    setDeleteVenta(id);
  };
  const cancelDelete = () => {
    setDeleteVenta(null); // Cancelar la eliminación
  };

  const dataDeleted = (id) => {
    setPurchaseMembership((prev) =>
      prev.filter((sale) => sale.compra_id !== id)
    );
  };

  const confirmDelete = async () => {
    try {
      const { data } = await clienteAxios.delete(
        `/compra/membresia/${deleteVenta}`
      );
      dataDeleted(deleteVenta);
      mostrarAlerta(data.msg, false);
      setDeleteVenta(null);
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
    // Reiniciar el estado
  };

  useEffect(() => {
    const getPurchase = async () => {
      try {
        const { data } = await clienteAxios.get("/compra/ventas-membresias");
        setPurchaseMembership(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPurchase();
    setLoading(false);
  }, []);

  const { msg } = alerta;
  if (loading) return <h1>Cargandoo....</h1>;
  return (
    <>
      <main>
        <h1 className="text-2xl font-semibold">Membresias</h1>
        <div className="my-4 p-3 bg-white rounded-lg">
          <div className="p-2 grid md:grid-cols-5 gap-2 md:gap-5">
            <div className=" grid grid-cols-3 items-center md:flex  justify-between">
              <div className="col-span-2 gap-2 ">
                <h1 className="font-bold text-xl">Total de ventas</h1>
                <p>{purchaseMembership.length}</p>
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
                  value={searchTerm || ""}
                  onChange={handleSearch}
                  placeholder="Buscar cliente (nombre, telefono) o tipo membresia..."
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
            <div className="hidden md:flex justify-center divide-x-4 gap-2 h-auto items-center ">
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
                <div className="absolute mt-16 -mr-24 border bg-gray-200 rounded shadow-lg w-48 z-10 flex flex-col divide-y divide-gray-400 text-base">
                  {[
                    ...purchaseMembership
                      .map((item) => {
                        const fecha = new Date(item.fecha_compra);
                        return {
                          nombre: fecha.toLocaleString("es", { month: "long" }),
                          numero: fecha.getMonth() + 1,
                        };
                      })
                      .reduce((acc, current) => {
                        const exists = acc.find(
                          (item) =>
                            item.numero === current.numero &&
                            item.nombre === current.nombre
                        );
                        if (!exists) acc.push(current);
                        return acc;
                      }, []),
                  ]
                    .sort((a, b) => a.numero - b.numero)
                    .map(({ nombre, numero }, index) => (
                      <button
                        key={index}
                        onClick={() => handleMembresiaFiltro(numero)}
                        className={`p-2 hover:bg-gray-300 ${
                          membresiaFiltro === numero ? "bg-gray-300" : ""
                        } text-left capitalize`}
                      >
                        {nombre}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative overflow-x-auto">
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
                {filtroData().length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-3 text-gray-600">
                      No hay datos para mostrar o tienes algun filtro activo
                    </td>
                  </tr>
                ) : (
                  filtroData().map((venta, index) => (
                    <tr key={venta.compra_id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <img
                          src={venta.cliente_img_secure_url}
                          alt="Foto cliente"
                          className="w-10 h-10 rounded-full ring-2 ring-red-800 m-auto"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {`${venta.cliente_nombre} ${venta.cliente_apellido_paterno} ${venta.cliente_apellido_materno}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {venta.cliente_telefono}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {venta.membresia_nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {format(
                          new Date(venta.fecha_compra),
                          "dd 'de' MMMM, yyyy",
                          { locale: es }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        ${venta.membresia_precio}
                      </td>
                      <td className="px-6 flex justify-center gap-3 py-4 text-sm text-gray-700">
                        <button
                          className="text-cyan-500 hover:text-cyan-700 transition-colors duration-300"
                          onClick={() => openModalVenta(venta)}
                        >
                          <BsEyeFill className="text-3xl scale-hover" />
                        </button>
                        {activeModal === venta.compra_id && (
                          <InformeVentaMembresia
                            closeModal={closeModal}
                            purchaseSelected={purchaseSelected}
                          />
                        )}
                        {new Date(venta.fecha_compra).toDateString() ===
                          new Date().toDateString() && (
                          <button
                            className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                            onClick={() => toggleDelete(venta.compra_id)}
                          >
                            <MdDelete className="text-3xl scale-hover" />
                          </button>
                        )}

                        {/* Muestra recuadro de confirmacion */}
                        {deleteVenta === venta.compra_id && (
                          <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-2 right-10">
                            <h1 className="text-base font-semibold text-gray-700 mb-2">
                              ¿Seguro que deseas eliminar la venta de <br />
                              <span className="font-bold">
                                {venta.cliente_nombre}
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
                  ))
                )}
                {}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default MembresiasVentas;
