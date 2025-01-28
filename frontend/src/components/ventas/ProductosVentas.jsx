import { MdDelete } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { HiSearchCircle } from "react-icons/hi";
import { BsEyeFill } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

import MenuExport from "../ui/MenuExport";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import InformeVentaProducto from "./InformeVentaProducto";
import clienteAxios from "../../config/axios";
import Alerta from "../Alerta";

const ProductosVentas = () => {
  const [salesProduct, setSalesProduct] = useState([]);
  const [optionsExport, setOptionsExport] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deleteVenta, setDeleteVenta] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [alerta, setAlerta] = useState({ msg: "", error: false });

  const mostrarAlerta = (msg, error) => {
    setAlerta({ msg, error });
    setTimeout(() => {
      setAlerta({ msg: "", error: false });
    }, 4000);
  };
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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterOptions = () => {
    setFilterOptions((prev) => !prev);
    setOptionsExport(null);
  };
  const handleMembresiaFiltro = (filtro) => {
    setDateFilter((prev) => (prev === filtro ? 0 : filtro));
  };

  const filtroData = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return salesProduct.filter((item) => {
      // Filtro por fecha
      if (dateFilter && dateFilter > 0) {
        const mesCompra = new Date(item.fecha_venta).getMonth() + 1;
        if (mesCompra !== dateFilter) return false;
      }

      // Filtro por búsqueda de texto
      const campos = [
        item.cliente.nombre.toLowerCase(),
        item.cliente.apellido_paterno
          ? item.cliente.apellido_paterno.toLowerCase()
          : "",
        item.cliente.apellido_materno
          ? item.cliente.apellido_materno.toLowerCase()
          : "",
        item.cliente.telefono || "",
      ];

      // Filtro para el array de detalles_productos
      const detallesFiltro = item.detalles_productos
        .map((detalle) => detalle.nombre_producto.toLowerCase()) // Extraemos los nombres de productos en minúsculas
        .join(" "); // Unimos los nombres de productos en una cadena de texto, separados por espacio

      // Verificamos si algún campo contiene el término de búsqueda
      return (
        campos.some((campo) => campo.includes(lowerSearchTerm)) ||
        detallesFiltro.includes(lowerSearchTerm)
      );
    });
  };

  const toggleDelete = (id) => {
    setDeleteVenta(id);
  };
  const cancelDelete = () => {
    setDeleteVenta(null); // Cancelar la eliminación
  };

  const dataDeleted = (id) => {
    setSalesProduct((prev) => prev.filter((sale) => sale.venta_id !== id));
  };

  const confirmDelete = async () => {
    try {
      const { data } = await clienteAxios.delete(
        `/compra/producto/${deleteVenta}`
      );
      dataDeleted(deleteVenta);
      mostrarAlerta(data.msg, false);
      setDeleteVenta(null); // Reiniciar el estado
    } catch (error) {
      mostrarAlerta(error.response.data.msg, true);
    }
  };

  useEffect(() => {
    const getSales = async () => {
      try {
        const { data } = await clienteAxios.get("/compra/ventas-productos");
        setSalesProduct(data);
      } catch (error) {
        console.log(error);
        setSalesProduct([]);
      }
    };
    getSales();
  }, []);
  const { msg } = alerta;
  return (
    <>
      <main>
        <h1 className="text-2xl font-semibold">Productos</h1>
        <div className="my-4 p-3 bg-white rounded-lg">
          <div className="p-2 grid md:grid-cols-5 gap-2 md:gap-5">
            <div className=" grid grid-cols-3 items-center md:flex  justify-between">
              <div className="col-span-2 gap-2 ">
                <h1 className="font-bold text-xl">Total de ventas</h1>
                <p>{salesProduct.length}</p>
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
                  placeholder="Buscar con (nombre cliente, producto )..."
                  value={searchTerm || ""}
                  onChange={handleSearch}
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
                    ...salesProduct
                      .map((item) => {
                        const fecha = new Date(item.fecha_venta);
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
                          dateFilter === numero ? "bg-gray-300" : ""
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
                    Nombre cliente
                  </th>

                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Productos
                  </th>

                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Fecha de compra
                  </th>
                  <th className="px-5 py-2 text-gray-700 uppercase">Total</th>
                  <th className="px-5 py-2 text-gray-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 font-medium text-center items-center">
                {filtroData().map((venta, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className=" text-sm text-gray-700">{index + 1}</td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {`${venta.cliente.nombre} ${
                        venta.cliente.apellido_paterno || ""
                      } ${venta.cliente.apellido_materno || ""}`}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      <ul className="">
                        {venta.detalles_productos.map((producto, i) => (
                          <li key={i}>{producto.nombre_producto}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(
                        new Date(venta.fecha_venta),
                        "dd 'de' MMMM, yyyy",
                        { locale: es }
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${venta.total}
                    </td>
                    <td className="px-6  gap-3 py-4 text-sm text-gray-700">
                      <div className="m-auto flex ites-center justify-center gap-3">
                        <button
                          className="text-cyan-500 hover:text-cyan-700 transition-colors duration-300"
                          onClick={() => openModalVenta(venta.venta_id)}
                        >
                          <BsEyeFill className="text-3xl scale-hover" />
                        </button>
                        {activeModal === venta.venta_id && (
                          <InformeVentaProducto
                            closeModal={closeModal}
                            venta={venta}
                          />
                        )}
                        {new Date(venta.fecha_venta).toDateString() ===
                          new Date().toDateString() && (
                          <button
                            className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                            onClick={() => toggleDelete(venta.venta_id)}
                          >
                            <MdDelete className="text-3xl scale-hover" />
                          </button>
                        )}
                      </div>

                      {/* Muestra recuadro de confirmacion */}
                      {deleteVenta === venta.venta_id && (
                        <div className="absolute  mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4   right-10">
                          <h1 className="text-lg font-semibold text-gray-700 mb-2">
                            ¿Seguro que deseas eliminar la venta de <br />
                            <span className="font-bold">
                              {venta.cliente.nombre}
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

export default ProductosVentas;
