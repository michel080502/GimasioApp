import { FaFilter, FaUserEdit } from "react-icons/fa";
import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import MenuExport from "../ui/MenuExport";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import ConfirmDialogDelete from "../ui/confirmDialogDelete";
import ToggleSwitch from "../ui/ToggleSwitch";
import clienteAxios from "../../config/axios";
import { exportDataToExcel } from "../../utils/exportDataToExcel";

const TablaProductos = ({
  productos,
  categorias,
  openModal,
  dataType,
  formatoPrecio,
  actualizarDisponibleProductos,
  actualizarProductos,
}) => {
  const [optionsExport, setOptionsExport] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [deleteProducto, setDeleteProducto] = useState(null);

  // Activacion de botones exportacion y filtro
  const toggleOptionsExport = () => {
    setFilterOptions(null);
    setOptionsExport((prev) => !prev);
  };

  const toggleFilterOptions = () => {
    setOptionsExport(null);
    setFilterOptions((prev) => !prev);
  };

  // Definir los encabezados fuera de las funciones
  const headers = [
    "#",
    "Nombre",
    "Marca",
    "Categoria",
    "Stock",
    "Disponible",
    "Precio inicial",
    "Descuento",
    "Precio final"
  ];

  const generateExcelData = (productos) => {
    return productos.map((producto, index) => ({
      "#": index + 1,
      Nombre: producto.nombre,
      Marca: producto.marca,
      Categoria: producto.categoria,
      Stock: producto.stock,
      Disponible: producto.disponible,
      Precio_inicial: producto.precio,
      descuento: producto.descuento,
      Precio_final: producto.total,
    }));
  };

  const handleDownload = async () => {
    exportDataToExcel(generateExcelData(productos), headers, "reportes_clientes", "download")
  };

  const handleSendReport = async () => {
    exportDataToExcel(generateExcelData(productos), headers, "reportes_clientes", "send")
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoriaFiltro = (filtro) => {
    setCategoriaFiltro((prev) => (filtro === prev ? !prev : filtro));
  };

  // Filtrado de productos
  const filterProducts = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return productos.filter((producto) => {
      const matchesSearch = producto.nombre
        .toLowerCase()
        .includes(lowerSearchTerm);
      const matchesType =
        (dataType === "suficiente" && producto.nivel_stock === "Suficiente") ||
        (dataType === "medio" && producto.nivel_stock === "Medio") ||
        (dataType === "bajo" && producto.nivel_stock === "Bajo") ||
        dataType === "";
      const matchesCategory = categoriaFiltro
        ? producto.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
        : true;
      return matchesSearch && matchesType && matchesCategory;
    });
  };

  // Actualizar disponibilidad de producto
  const handleAvaliable = async (id, newValue) => {
    try {
      const { data } = await clienteAxios.put(
        `/producto/actualizar-disponible/${id}`,
        {
          disponible: newValue,
        }
      );
      // Actualizar el estado localmente sin recargar
      actualizarDisponibleProductos(id, newValue);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar producto
  const toggleDelete = (id) => {
    setDeleteProducto(deleteProducto === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await clienteAxios.delete(`/producto/delete/${id}`);
      actualizarProductos(id);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Agregar un useEffect para manejar cambios en categoriaFiltro
  useEffect(() => {
    filterProducts();
  }, [categoriaFiltro, searchTerm, dataType]);

  return (
    <>
      <div className="my-3 p-2 bg-white rounded-lg">
        <div className="p-2 grid md:grid-cols-4 md:gap-5">
          <div className="grid grid-cols-3 md:flex justify-between">
            <div className="col-span-2">
              <h1
                className={` font-bold text-lg ${
                  dataType === "suficiente"
                    ? "text-green-500"
                    : dataType === "medio"
                    ? "text-orange-600"
                    : dataType === "bajo"
                    ? "text-red-800"
                    : ""
                }`}
              >
                {dataType === ""
                  ? "Todos los productos"
                  : `Productos con stock ${dataType}`}
              </h1>
              <p className="-mt-2 font-semibold text-sm ">
                {dataType === ""
                  ? ""
                  : dataType === "suficiente"
                  ? "Rango: + 20 u."
                  : dataType === "medio"
                  ? "Rango: 10 - 19 u."
                  : "Rango: 1 - 9 u"}
              </p>
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

          <div className="md:col-span-2 my-auto">
            <form className="flex ">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-800"
              />
              <button
                type="submit"
                className="inset-y-0 right-0 flex -ml-5 items-center px-4 text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-300"
              >
                <HiSearchCircle className="text-2xl" />
              </button>
            </form>
          </div>

          <div className="hidden md:flex gap-4 justify-center h-auto items-center">
            <button
              onClick={toggleOptionsExport}
              type="button"
              className="scale-hover-10 gap-3 rounded-lg px-3 py-1 bg-black flex text-white justify-center items-center hover:bg-red-600"
            >
              <RiFileExcel2Fill /> Exportar
            </button>
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
              <FaFilter /> Filtro
            </button>
            {filterOptions && (
              <div className="absolute top-56 mt-40 -mr-24  border bg-gray-200  rounded shadow-lg w-48 z-10 flex flex-col divide-y divide-gray-400 text-base">
                {categorias.map((categoria, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoriaFiltro(categoria.nombre)}
                    className={`p-2 hover:bg-gray-300 ${
                      categoriaFiltro === categoria.nombre ? "bg-gray-300" : ""
                    } text-left`}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
            <thead className="bg-gray-100 text-sm">
              <tr className="text-center">
                <th className="px-5 py-2 text-gray-700 uppercase">#</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Foto</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Nombre</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Marca</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Categoria</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Stock</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Precio</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Descuento</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Total</th>
                <th className="px-5 py-2 text-gray-700 uppercase">
                  Disponible
                </th>
                <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center font-semibold items-center">
              {filterProducts().length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-gray-600 text-lg font-semibold"
                  >
                    No hay datos que mostrar, elimine filtro y vuelva a
                    intentarlo.
                  </td>
                </tr>
              ) : (
                filterProducts().map((producto, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      <img
                        className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                        src={producto.img_secure_url}
                        alt={producto.nombre}
                      />
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {producto.nombre}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {producto.marca}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      {producto.categoria}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {producto.stock}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {formatoPrecio.format(producto.precio)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {formatoPrecio.format(producto.descuento)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {formatoPrecio.format(producto.total)}
                    </td>
                    <td className="px-3 py-3 text-sm  text-gray-700">
                      <ToggleSwitch
                        avaliable={
                          producto.disponible === true ||
                          producto.disponible === "true"
                        }
                        onToggle={(newValue) =>
                          handleAvaliable(producto.id, newValue)
                        }
                      />
                    </td>
                    <td className="px-3 py-3 text-sm h-full">
                      <div className="flex items-center justify-center gap-4 h-full">
                        <button
                          className=" text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                          onClick={() => {
                            openModal("editar", producto);
                          }}
                        >
                          <FaUserEdit className="text-3xl" />
                        </button>
                        <button
                          className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
                          onClick={() => {
                            toggleDelete(producto.id);
                          }}
                        >
                          <MdDelete className="text-3xl" />
                        </button>
                        {deleteProducto === producto.id && (
                          <ConfirmDialogDelete
                            message={`¿Seguro que deseas elminar el producto ${producto.nombre}`}
                            onCancel={() => {
                              setDeleteProducto(null);
                            }}
                            onConfirm={() => handleDelete(producto.id)}
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
    </>
  );
};

TablaProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      marca: PropTypes.string,
      categoria: PropTypes.string,
      stock: PropTypes.number,
      precio: PropTypes.number,
      descuento: PropTypes.number,
      total: PropTypes.number,
      img_public_id: PropTypes.string,
      img_secure_url: PropTypes.string,
      disponible: PropTypes.bool,
      nivel_stock: PropTypes.string,
    })
  ),
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string,
    })
  ),
  openModal: PropTypes.func.isRequired,
  dataType: PropTypes.string,
  formatoPrecio: PropTypes.instanceOf(Intl.NumberFormat),
  actualizarDisponibleProductos: PropTypes.func,
  actualizarProductos: PropTypes.func,
};

export default TablaProductos;
