import { FaFilter, FaUserEdit } from "react-icons/fa";
import { HiSearchCircle } from "react-icons/hi";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import MenuExport from "../ui/MenuExport";
import PropTypes from "prop-types";
import { useState } from "react";
import ConfirmDialogDelete from "../ui/confirmDialogDelete";
import ToggleSwitch from "../ui/ToggleSwitch";

const TablaProductos = ({ openModal, dataType }) => {
  // Datos simulados de productos
  const productos = [
    {
      id: 1,
      nombre: "Proteina whey de chocolate",
      marca: "Dragon Pharma",
      categoria: "Proteina",
      stock: 35,
      precio: 1200.0,
      descuento: 200.0,
      total: 1000.0,
      img_secure_url: "/assets/proteina.jpg",
    },
    {
      id: 2,
      nombre: "BCAA",
      marca: "MuscleTech",
      categoria: "Aminoácidos",
      stock: 15,
      precio: 900.0,
      descuento: 100.0,
      total: 800.0,
      img_secure_url: "/assets/proteina.jpg",
    },
    {
      id: 3,
      nombre: "Creatina",
      marca: "Optimum Nutrition",
      categoria: "Suplementos",
      stock: 8,
      precio: 600.0,
      descuento: 50.0,
      total: 550.0,
      img_secure_url: "/assets/proteina.jpg",
    },
    {
      id: 4,
      nombre: "Glutamina",
      marca: "Bodybuilding",
      categoria: "Aminoácidos",
      stock: 5,
      precio: 500.0,
      descuento: 0.0,
      total: 500.0,
      img_secure_url: "/assets/proteina.jpg",
    },
    {
      id: 5,
      nombre: "Pre-workout",
      marca: "Cellucor",
      categoria: "Suplementos",
      stock: 25,
      precio: 1100.0,
      descuento: 150.0,
      total: 950.0,
      img_secure_url: "/assets/proteina.jpg",
    },
  ];

  // Filtrar productos según el tipo de stock (dataType)
  const filterProducts = () => {
    if (dataType === "suficiente") {
      return productos.filter((producto) => producto.stock > 20);
    }
    if (dataType === "medio") {
      return productos.filter(
        (producto) => producto.stock <= 20 && producto.stock >= 10
      );
    }
    if (dataType === "bajo") {
      return productos.filter((producto) => producto.stock < 10);
    }
    return productos; // Si dataType está vacío, muestra todos los productos
  };

  const [deleteProducto, setDeleteProducto] = useState(null);
  const [optionsExport, setOptionsExport] = useState(null);

  const handleDownload = async () => {
    console.log("Descargando.....");
  };

  const handleSendReport = async () => {
    console.log("Enviando.....");
  };
  const handleAvaliable = (newValue) => {
    /* AQUI CREAMOS LA FUNCION PARA ENVIAR EL NUEVO ESTADO DE DISPONIBILIDAD DEBEMOS RECIBIR EL ID DE LA MEMBRESIA Y EL ESTADO PARA MANDAR LOS CAMBIOS A LA BASE abajo hay un ejemplo de como hacer esa actualizacion del dato, aun falta recibir id en esta funcion recuerda*/
    // const updatedData = data.map((membership) =>
    //     membership.id === id
    //       ? { ...membership, disponible: newValue }
    //       : membership
    //   );
    console.log(newValue);
  };

  const toggleOptionsExport = () => {
    setOptionsExport((prev) => !prev);
  };

  const toggleDelete = (id) => {
    setDeleteProducto(deleteProducto === id ? null : id);
  };

  const handleDelete =  (id) => {
    console.log("Eliminando producto....", id)
  };

  return (
    <>
      <div className="my-4 p-3 bg-white rounded-lg">
        <div className="p-2 grid md:grid-cols-4 md:gap-5">
          <div className="grid grid-cols-3 md:flex justify-between">
            <div className="col-span-2">
              <h1 className="p-1 font-bold text-xl">Productos totales</h1>
              {dataType !== "" && (
                <>
                  <p
                    className={`pl-2 pb-1 font-semibold ${
                      dataType === "suficiente"
                        ? "text-green-500"
                        : dataType === "medio"
                        ? "text-orange-600"
                        : "text-red-800"
                    }`}
                  >
                    Stock {dataType}
                  </p>

                  {dataType === "medio" && (
                    <p className="pl-2 pb-1 text-xs font-semibold">
                      ¡Actualiza stock antes de que pasen a bajo stock!
                    </p>
                  )}
                  {dataType === "bajo" && (
                    <p className="pl-2 pb-1 text-xs  font-semibold">
                      ¡Actualiza stock antes de que se acaben!
                    </p>
                  )}
                </>
              )}
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
              className="scale-hover-10 gap-3 rounded-lg px-3 py-1 bg-black flex text-white justify-center items-center hover:bg-red-600"
            >
              <FaFilter /> Filtro
            </button>
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
                <th className="px-5 py-2 text-gray-700 uppercase">Disponible</th>
                <th className="px-5 py-2 text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center items-center">
              {filterProducts().map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {producto.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <img
                      className="w-16 rounded-full ring-2 ring-red-800 m-auto"
                      src={producto.img_secure_url}
                      alt={producto.nombre}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {producto.marca}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                    {producto.categoria}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {producto.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${producto.precio}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${producto.descuento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${producto.total}
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-700">
                    <ToggleSwitch avaliable={true} 
                    onToggle={(newValue) =>{
                      handleAvaliable(newValue)
                    }} />
                  </td>
                  <td className="px-6 py-4 text-sm h-full">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <button
                        className=" text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                        onClick={() => {
                          openModal("editar", producto.id);
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
                          onCancel={() =>{ setDeleteProducto(null)}}
                          onConfirm={() => handleDelete(producto.id)}
                        />
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

TablaProductos.propTypes = {
  openModal: PropTypes.func.isRequired,
  dataType: PropTypes.string,
};

export default TablaProductos;
